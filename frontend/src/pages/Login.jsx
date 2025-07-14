import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      // 🔐 Check if this is the first login after verification
      const pendingUsername = localStorage.getItem("pendingUsername");
      const pendingPassword = localStorage.getItem("pendingPassword");

      let finalUsername = "";

      if (pendingUsername && pendingPassword) {
        try {
          await axios.post("http://localhost:5000/auth/signup", {
            email: user.email,
            username: pendingUsername,
            password: pendingPassword,
          });
          finalUsername = pendingUsername;

          localStorage.removeItem("pendingUsername");
          localStorage.removeItem("pendingPassword");
        } catch (syncErr) {
          if (syncErr.response?.data?.error !== "Email already in use") {
            console.error(syncErr);
          }
        }
      } else {
        // 🧠 Existing user – fetch username from backend
        const res = await axios.post("http://localhost:5000/auth/get-username", {
          email: user.email,
        });
        finalUsername = res.data.username;
      }

      localStorage.setItem("user", JSON.stringify({ email: user.email, username: finalUsername }));
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-indigo-700 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4 text-center">🇮🇳 Welcome Back!</h1>
        <p className="text-lg text-center max-w-md">
          Log in to the Complaint & Improvement Portal to make your voice heard and help shape a better India. 💡📣
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center items-center px-6 py-12">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Log In</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4 text-right">
            <span
              className="text-sm text-indigo-600 cursor-pointer underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-indigo-600 cursor-pointer underline">
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
