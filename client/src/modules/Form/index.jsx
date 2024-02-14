import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Form = ({ isSignedIn }) => {
  // const baseURL = process.env.VITE_BASE_URL;

  const [data, setData] = useState({
    ...(!isSignedIn && {
      fullName: "",
    }),
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/${isSignedIn ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const res = await response.json();

      if(!isSignedIn){
        if(res.status !== 400){
          localStorage.setItem("user:token", res.token);
          localStorage.setItem("user:detail", JSON.stringify(res.user));
          navigate("/");
        }
      }

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
            Welcome {isSignedIn && "Back"}
          </div>
          <div className="text-xl text-center font-light">
            {isSignedIn ? "Sign in to explore" : "Sign up to get started"}
          </div>
        </div>
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignedIn && (
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
              />
            )}
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
              label={isSignedIn ? "Sign in" : "Sign up"}
              className="mt-2"
              type="submit"
            />
          </form>
        </div>
        <div className="mt-2 text-neutral-600">
          {isSignedIn ? "Didn't have an account" : "Already have an account?"}{" "}
          <span
            onClick={() =>
              navigate(`/users/${isSignedIn ? "sign-up" : "sign-in"}`)
            }
            className="text-[#1476ff] cursor-pointer"
          >
            {isSignedIn ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </main>
  );
};

export default Form;
