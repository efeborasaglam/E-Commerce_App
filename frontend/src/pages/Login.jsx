import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-2xl text-zinc-600 text-sm shadow-xl">
        <p className="text-3xl font-extrabold uppercase italic text-neutral-900">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "create an account" : "login"} to start
          shopping
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p className="font-medium">Full Name</p>
            <input
              type="text"
              className="border border-zinc-300 rounded-lg w-full p-2.5 mt-1 focus:outline-none focus:border-[#8DB600]"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="font-medium">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-zinc-300 rounded-lg w-full p-2.5 mt-1 focus:outline-none focus:border-[#8DB600]"
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p className="font-medium">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-zinc-300 rounded-lg w-full p-2.5 mt-1 focus:outline-none focus:border-[#8DB600]"
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-neutral-950 py-3 text-sm font-bold uppercase tracking-wide text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black transition-all duration-300"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              className="text-[#8DB600] font-semibold underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              className="text-[#8DB600] font-semibold underline cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};
export default Login;
