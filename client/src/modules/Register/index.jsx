import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
  };

  return (
    <main className="bg-[#f3f5ff] flex justify-center items-center h-screen">
      <div className="bg-white w-1/3 p-10 shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="pb-10">
          <div className="text-4xl font-extrabold ">Welcome</div>
          <div className="text-xl text-center font-light">
            Sign up to get started
          </div>
        </div>
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Full Name"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
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
            <Button label="Sign up" className="mt-2" type="submit"/>
          </form>
        </div>
        <div className="mt-2 text-neutral-600">
          Already have an account?
          <span
            onClick={() => navigate("/sign-in")}
            className="text-[#1476ff] cursor-pointer"
          >
            Sign in
          </span>
        </div>
      </div>
    </main>
  );
};

export default Register;
