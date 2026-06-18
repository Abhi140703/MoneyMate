import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { LogOut } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login", { replace: true });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await loginUser(formData);

      localStorage.setItem("user", JSON.stringify(data));

      login(data.token);

      navigate("/");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-center text-slate-500 mb-6">
          Login to continue managing your finances
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-slate-700 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 p-3 rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter your password"
              className="w-full border border-slate-300 p-3 rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
