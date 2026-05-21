import React from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Navigate } from "react-router-dom";

const Register = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const ageRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("users", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        age: Number(ageRef.current.value),
      });
      alert("User created with successfully");
      navigate("/login");
    } catch (err) {
      alert("Ops, algo deu errado 🙁", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-600">
        Cadastro
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          ref={nameRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Nome"
          type="text"
        />
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
        <input
          ref={ageRef}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Idade"
          type="number"
        />
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">
          Cadastrar-se
        </button>
      </form>

      <Link
        to="/login"
        className="text-blue-700 hover:underline text-center mt-4 block"
      >
        Já tem uma conta? Faça login
      </Link>
    </div>
  );
};

export default Register;
