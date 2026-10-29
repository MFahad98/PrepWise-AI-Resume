import { RouterProvider } from "react-router-dom";
import router from "./auth.routes.jsx";
import {AuthProvider} from "./Features/auth/services/auth.content.jsx";
import { InterviewProvider } from "./Features/ai/interview.context.jsx";
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
      <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;