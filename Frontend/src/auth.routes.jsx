import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { Protected } from "./Features/auth/components/Protected";
import Login from "./Features/auth/pages/Login";
import Register from "./Features/auth/pages/Register";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Dashboard from "./Features/ai/pages/Dashboard";
import Analysis from "./Features/ai/pages/Analysis";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Landing /> },
      {
        path: "/dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "/interview/:interviewId",
        element: (
          <Protected>
            <Analysis />
          </Protected>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
