import { createBrowserRouter } from "react-router-dom";

import { Home, ProjectDetail, Projects,Admin,
  AdminProjectEdit,
  AdminProjects, AdminLogin, ProtectedRoute, AdminProfile} from "../pages";
import {RouterLayout} from "../components";


export const router = createBrowserRouter([
  {
    element: <RouterLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/projects", element: <Projects /> },
      { path: "/projects/:slug", element: <ProjectDetail /> },

      { path: "/admin/login", element: <AdminLogin /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin", element: <Admin /> },
          { path: "/admin/projects", element: <AdminProjects /> },
          {
            path: "/admin/profile",
            element: <AdminProfile />,
          },
          {
            path: "/admin/projects/new",
            element: <AdminProjectEdit />,
          },
          {
            path: "/admin/projects/:id",
            element: <AdminProjectEdit />,
          },
        ],
      },
    ],
  },
]);