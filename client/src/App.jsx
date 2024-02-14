import { Navigate, Route, Routes, redirect } from "react-router-dom";
import Dashboard from "./modules/Dashboard";
import Form from "./modules/Form";

const ProtectedRoute = ({ children, auth=false }) => {
  // const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  // if (!isLoggedIn && auth) {
  //   return <Navigate to={"/users/sign-in"} />;
  // } else if (
  //   isLoggedIn &&
  //   ["/users/sign-in", "/users/sign-up"].includes(window.location.pathname)
  // ) {
  //   return <Navigate to={"/"} />;
  // }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/sign-in"
        element={
          <ProtectedRoute>
            <Form isSignedIn={true} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/sign-up"
        element={
          <ProtectedRoute>
            <Form isSignedIn={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
