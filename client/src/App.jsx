import { Navigate, Route, Routes, redirect } from "react-router-dom";
import Dashboard from "./modules/Dashboard";
import Home from "./modules/Home";
import Login from "./modules/Login";
import Register from "./modules/Register";

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to={"/sign-in"} />;
  } else if (
    isLoggedIn &&
    ["/sign-in", "/sign-up"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sign-in"
        element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <ProtectedRoute>
            <Register/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
