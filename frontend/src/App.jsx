import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";

function App() {
  <AuthProvider>
    return <RouterProvider router={router} />;
  </AuthProvider>;
}

export default App;
