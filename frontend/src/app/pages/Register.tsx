import { useState } from "react";
import { registerUser } from "../../services/authService";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      alert(
        "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Create Account 🚀
        </h1>

        <p className="text-center text-slate-500 mb-6">
          Join MoneyMate and
          start tracking your
          finances
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-slate-300 p-3 rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 p-3 rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full border border-slate-300 p-3 rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password:
                    e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Already have an
          account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}