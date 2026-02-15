import React, { useState } from "react";
import styled from "styled-components";
import { FilterStatus, Task, TaskFromAPI } from "../types";
import { OneTask } from "./OneTask";
import { SearchPanel } from "./SearchPanel";
import { SortPanel } from "./SortPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addTask, toggleTask, removeTask, setTasks } from "../redux/tasksSlice";
import { LoadFromAPIPanel } from "./LoadFromAPIPanel";

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

  const [userId, setUserId] = useState<number>(0);

  const addTaskHandler = (text: string) => {
    if (!text.trim()) return;

    const newTask: Task = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      text: text,
      completed: false,
    };

    //setTasks([...tasks, newTask]);
    dispatch(addTask(newTask));
    setTaskText("");
  };

  async function getDataFromAPI(userId: number): Promise<TaskFromAPI[]> {
    const url = new URL("https://jsonplaceholder.typicode.com/todos/");
    url.search = new URLSearchParams({ userId: userId.toString() }).toString();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`HTTP ошибка: ${response.status} ${response.statusText}`);
        return [];
      }

      return await response.json();
    } catch (error: any) {
      console.warn(`Сетевая ошибка: ${error.message}`);
      return []; // возвращаем пустой массив при сетевой ошибке
    }
  }

  const getData = (): void => {
    getDataFromAPI(userId).then((data) => {
      console.log(data);
      if (data.length > 0) {
        const mappedTasks = data.map((el) => ({
          id: el.id,
          text: el.title,
          completed: el.completed,
        }));
        dispatch(setTasks(mappedTasks));
      }
    });
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

  const filteredTasks = tasks.filter((task) =>
    task.text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
  );

  const visibleTasks = filteredTasks.filter((task) => {
    switch (filterStatus) {
      case FilterStatus.ACTIVE:
        return !task.completed;
      case FilterStatus.COMPLETED:
        return task.completed;
      default:
        return true;
    }
  });

  return (
    <TaskListWrapper>
      <h1>To-Do List</h1>
      <LoadFromAPIPanel
        userId={userId}
        setUserId={setUserId}
        getData={getData}
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
