import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:8000/api/login',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const res = await response.json();

      if (res.status === 400) {
        toast.error("Invalid Data");
      } else {
        toast.success("User Registered Successfully");
        if (res.token) {
          localStorage.setItem("user:token", res.token);
          localStorage.setItem("user:detail", JSON.stringify(res.user));
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="bg-[#f3f5ff] flex justify-center items-center h-screen">
      <div className="bg-white w-1/3 p-10 shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="pb-10">
          <div className="text-4xl font-extrabold ">
            Welcome Back
          </div>
          <div className="text-xl text-center font-light">
            Sign in to explore
          </div>
        </div>
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button
              label="Sign in"
              className="mt-2"
              type="submit"
            />
          </form>
        </div>
        <div className="mt-2 text-neutral-600">
          Don't have an account? 
          <span
            onClick={() =>
              navigate('/sign-up')
            }
            className="text-[#1476ff] cursor-pointer"
          >
            Sign up
          </span>
        </div>
      </div>
    </main>
  );
};

export default Login;
