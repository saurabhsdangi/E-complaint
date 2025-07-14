import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // ✅ import initialized auth
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, password, confirmPassword } = formData;
    // const auth = getAuth();

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Check username uniqueness first
      await axios.post("http://localhost:5000/auth/check-username", {
        username,
      });

      // Step 1: Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Step 2: Send verification email
      await sendEmailVerification(user);
      localStorage.setItem("pendingUsername", username);
      localStorage.setItem("pendingPassword", password);

      // Step 3: Sign out immediately and wait for user to confirm
      auth.signOut();
      setMessage(
        "Verification email sent! Please verify your email and then log in."
      );
      setFormData({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });

      // ❌ Do NOT save to backend or navigate — wait for user to verify first
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "Signup failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-indigo-700 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4 text-center">
          🇮🇳 Your Voice, Our Future
        </h1>
        <p className="text-lg text-center max-w-md">
          Join the Complaint & Improvement Portal to raise issues, share ideas,
          and help shape a better India. 💡📣
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center items-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Create an Account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
              {message}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Choose a unique username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Create a strong password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Re-enter password"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm text-gray-600">
              Show password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer underline"
            >
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
