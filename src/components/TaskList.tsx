import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FilterStatus, IUser, Task } from "../types";
import { OneTask } from "./OneTask";
import { SearchPanel } from "./SearchPanel";
import { SortPanel } from "./SortPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addTask, toggleTask, removeTask, setTasks } from "../redux/tasksSlice";
import { LoadFromAPIPanel } from "./LoadFromAPIPanel";
import { setUsers } from "../redux/usersSlice";

const TaskListWrapper = styled.div`
  width: 620px;
  margin: 60px auto;
  padding: 24px;

  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AddTaskRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 12px;

  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const AddButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;

  background: #4f46e5;
  color: white;
  font-weight: 500;
  cursor: pointer;

  transition: background 0.2s;

  &:hover {
    background: #4338ca;
  }
`;

export const TaskList: React.FC = () => {
  //const [tasks, setTasks] = useState<Task[]>([]);
  const tasks = useSelector((state: RootState) => state.tasks.value);
  const dispatch = useDispatch();
  const [taskText, setTaskText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.ALL
  );

  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  const controllerRef = useRef<AbortController | null>(null);

  const users = useSelector((state: RootState) => state.users.value);

  const addTaskHandler = (text: string) => {
    if (!text.trim()) return;

    const newTask: Task = {
      userId: selectedUserId,
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      title: text,
      completed: false,
    };

    //setTasks([...tasks, newTask]);
    dispatch(addTask(newTask));
    setTaskText("");
  };

  async function getDataFromAPI<T>(
    url: string,
    signal: AbortSignal,
    params?: Record<string, string | number>
  ): Promise<T[]> {
    const fullUrl = new URL(url);

    if (params) {
      fullUrl.search = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, value.toString()])
        )
      ).toString();
    }

    try {
      const response = await fetch(fullUrl, { signal });
      if (!response.ok) {
        console.warn(`HTTP ошибка: ${response.status} ${response.statusText}`);
        return [];
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn("Запрос отменен");
      } else {
        console.warn(`Сетевая ошибка: ${error.message}`);
      }
      return []; // возвращаем пустой массив при сетевой ошибке
    }
  }

  const getTasks = async () => {
    //добавлен для того, чтобы отменить запрос для предыдущего пользователя,
    // если быстро выбран другой пользователь
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const url = "https://jsonplaceholder.typicode.com/todos/";
    const userId = selectedUserId;
    getDataFromAPI<Task>(url, controllerRef.current.signal, { userId }).then(
      (data) => {
        console.log(data);
        if (data.length > 0) {
          dispatch(setTasks(data));
        }
      }
    );
  };

  const toggleTaskHandler = (id: number) => {
    // setTasks(
    //   tasks.map((task) =>
    //     task.id === id ? { ...task, completed: !task.completed } : task
    //   )
    // );

    dispatch(toggleTask(id));
  };

  const removeTaskHandler = (id: number) => {
    //setTasks(tasks.filter((task) => task.id !== id));
    dispatch(removeTask(id));
  };

  const getUsers = async (signal: AbortSignal) => {
    const url = "https://jsonplaceholder.typicode.com/users";
    getDataFromAPI<IUser>(url, signal).then((data) => {
      if (data.length > 0) {
        //const mappedUsers = data.map((el) => ({ id: el.id, name: el.name }));
        dispatch(setUsers(data));
        console.log(data);
      }
    });
  };

  useEffect(() => {
    let controller = new AbortController();
    getUsers(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    );
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return filteredTasks.filter((task) => {
      switch (filterStatus) {
        case FilterStatus.ACTIVE:
          return !task.completed;
        case FilterStatus.COMPLETED:
          return task.completed;
        default:
          return true;
      }
    });
  }, [filteredTasks, filterStatus]);

  return (
    <TaskListWrapper>
      <h1>To-Do List</h1>
      <LoadFromAPIPanel
        users={users}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        getTasks={getTasks}
      />
      <SortPanel
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      ></SortPanel>
      <SearchPanel
        searchText={searchText}
        setSearchText={setSearchText}
      ></SearchPanel>
      <AddTaskRow>
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTaskHandler(taskText)}
        />
        <AddButton onClick={() => addTaskHandler(taskText)}>Add Task</AddButton>
      </AddTaskRow>
      {visibleTasks.map((task) => (
        <OneTask
          key={task.id}
          task={task}
          toggleTask={toggleTaskHandler}
          removeTask={removeTaskHandler}
        />
      ))}
    </TaskListWrapper>
  );
};
