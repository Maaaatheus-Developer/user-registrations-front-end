import React from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      const data = response.data;
      const token = data.token;
      localStorage.setItem("token", token);
      alert("User logged Successfully.");
      // navigate("/list-of-user");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Senha ou email incorretos 🙁");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">
        Login
      </h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          ref={emailRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Email"
          type="email"
        />
        <input
          ref={passwordRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Senha"
          type="password"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">
          Login
        </button>
      </form>

      <Link
        to="/home"
        className="text-blue-700 hover:underline text-center mt-4 block"
      >
        Não tem uma conta? Cadastre-se
      </Link>
    </div>
  );
};

export default Login;
