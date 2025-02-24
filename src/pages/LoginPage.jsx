import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from '../components/assets/navy-icon.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9_]/g, '');
      setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        const response = await axios.post("http://localhost:5000/api/users/login", form);
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("profilePicture", response.data.user.profile_picture);
        toast.success("Login berhasil!");
      } else {
        // Register
        await axios.post("http://localhost:5000/api/users/register", form);
        toast.success("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
        return;
      }
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  // Update the handleLogin function
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/api/users/login", form);
    localStorage.setItem("userToken", response.data.token);
    localStorage.setItem("username", response.data.user.username);
    localStorage.setItem("displayName", response.data.user.display_name); // Add this line
    localStorage.setItem("profilePicture", response.data.user.profile_picture);
    toast.success("Login berhasil!");
    navigate("/");
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error(`Account banned: ${error.response.data.reason}`);
    } else {
      toast.error(error.response?.data?.message || "Login gagal");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-snavy to-navyDark">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-16 w-28 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-navyDark">
            {isLogin ? "Login" : "Daftar"} Akun
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Masuk ke akun Anda"
              : "Buat akun baru untuk mulai berbelanja"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
  type="text"
  name="username"
  value={form.username}
  onChange={handleInputChange}
  onKeyDown={(e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }}
  pattern="^[a-zA-Z0-9_]+$"
  title="Username hanya boleh mengandung huruf, angka, dan underscore"
  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-snavy focus:border-transparent"
  required
/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-snavy focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-snavy text-white font-bold py-3 rounded-lg hover:bg-navyDark transition-colors duration-300"
          >
            {isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-snavy hover:text-navyDark transition-colors duration-300"
          >
            {isLogin
              ? "Belum punya akun? Daftar"
              : "Sudah punya akun? Masuk"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/admin-login"
            className="text-gray-600 hover:text-navyDark transition-colors duration-300 text-sm"
          >
            Login sebagai Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;