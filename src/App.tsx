import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { TaskList } from "./components/TaskList";
import { Route, Routes } from "react-router-dom";
import { NavigationPanel } from "./components/NavigationPanel";
import { PostList } from "./components/PostList";
import { InfoOfUserPanel } from "./components/InfoOfUserPanel";

function App() {
  return (
    <div className="App">
      <NavigationPanel />
      <Routes>
        <Route path="/todo-react-typescript-redux" element={<TaskList />} />
        <Route
          path="/todo-react-typescript-redux/posts"
          element={<PostList />}
        />
        <Route
          path="/todo-react-typescript-redux/infoOfUser/:id"
          element={<InfoOfUserPanel />}
        />
      </Routes>
    </div>
  );
}

export default App;
