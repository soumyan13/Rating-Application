import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/schema";
import { useUserStore } from "../store/useStore";
import { useNavigate, Link } from "react-router-dom";
import LottieLogin from "../components/lottieAnimations/LottieLogin";

const Login = () => {
  const { login } = useUserStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, data.role);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen pt-10 flex items-center justify-baseline bg-gray-100">
      <div className="hidden md:flex w-1/2 h-full items-center justify-center">
        <LottieLogin />
      </div>

      <div className="w-full md:w-1/2 max-w-lg bg-white p-10 rounded-xl  shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="role" className="text-gray-700 font-medium">
              Role
            </label>
            <select
              {...register("role")}
              id="role"
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            <p className="text-red-500 text-sm">{errors.role?.message}</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
