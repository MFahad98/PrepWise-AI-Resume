import { createBrowserRouter } from "react-router-dom";
import Login from "./Features/auth/pages/Login";
import Register from "./Features/auth/pages/Register"; 
import { Protected } from "./Features/auth/components/Protected";
import Analysis from "./Features/ai/pages/Analysis";
import Home from "./Features/ai/pages/Home";
 

const router = createBrowserRouter([
 {
    path: "/",
    element: <Protected><Home /></Protected>,
 },
  {
    path: "/interview/:interviewId",
    element: <Protected><Analysis  /></Protected>,
 },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
export default router;