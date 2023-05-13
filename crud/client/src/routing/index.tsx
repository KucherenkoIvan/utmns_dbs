import { Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { ProjectView } from "../pages/ProjectView";

export const AppRouter = () => (
  <Routes>
    <Route path="/project/:projectId" Component={ProjectView} />
    <Route Component={MainPage} path="/" />
  </Routes>
);
