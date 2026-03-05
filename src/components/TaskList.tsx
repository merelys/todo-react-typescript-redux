import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { FilterStatus, IUser, Task } from "../types";
import { OneTask } from "./OneTask";
import { SearchPanel } from "./SearchPanel";
import { SortPanel } from "./SortPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addTask,
  toggleTask,
  removeTask,
  setTasks,
  deleteTasks,
} from "../redux/tasksSlice";
import { StatisticsPanel } from "./StatisticsPanel";
import { useSearchParams } from "react-router-dom";
import { setSelectedUserId } from "../redux/uiSlice";
import { getDataFromAPI } from "../utils/api";

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

  //const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const selectedUserId = useSelector(
    (state: RootState) => state.ui.selectedUserId
  );

  const controllerRef = useRef<AbortController | null>(null);

  const users = useSelector((state: RootState) => state.users.value);

  const [searchParams, setSearchParams] = useSearchParams();

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

  const toggleTaskHandler = (id: number) => {
    dispatch(toggleTask(id));
  };

  const removeTaskHandler = (id: number) => {
    dispatch(removeTask(id));
  };

  const getTasks = async () => {
    if (!selectedUserId) return;

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

  useEffect(() => {
    let controller = new AbortController();

    const userIdParam = searchParams.get("userId");
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    if (userIdParam) {
      dispatch(setSelectedUserId(Number(userIdParam)));
    }

    if (statusParam) {
      setFilterStatus(statusParam as FilterStatus);
    }

    if (searchParam) {
      setSearchText(searchParam);
    }

    getTasks();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      dispatch(deleteTasks());
      return;
    }

    const params: Record<string, string> = {};

    if (selectedUserId) {
      params.userId = selectedUserId.toString();
      console.log(`вызов getTasks  ${params.userId} `);
      getTasks();
    }

    if (filterStatus) {
      params.status = filterStatus;
    }

    if (searchText.trim()) {
      params.search = searchText;
    }

    setSearchParams(params);
  }, [selectedUserId, filterStatus, searchText]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    );
  }, [tasks, searchText]);

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

      <StatisticsPanel></StatisticsPanel>
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
