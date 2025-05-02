import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../validation/schema";
import { useUserStore } from "../store/useStore";
import { Link } from "react-router-dom";
import LottieSignup from "../components/lottieAnimations/LottieSignup";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup } = useUserStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-blue-200 via-white to-purple-200 flex items-center justify-center p-4">
      <div className="flex flex-col mt-20 md:flex-row w-full   items-center  ">
        <div className="hidden md:block  h-full  ">
          <LottieSignup />
        </div>

        <div className="w-full md:w-[600px] bg-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1"
              >
                Name
              </label>
              <input
                {...register("name")}
                id="name"
                placeholder="John Doe"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-medium mb-1"
              >
                Address
              </label>
              <input
                {...register("address")}
                id="address"
                placeholder="123 Main St"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.address?.message}
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
