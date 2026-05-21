import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";
import Trashcan from "../../assets/trashcan-icon-red-small.png";
import Pencil from "../../assets/pencil.png";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const inputName = useRef(null);
  const inputAge = useRef(null);
  const inputEmail = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [userID, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  //Buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const user = data.users;
      setUsers(user);
    } catch (error) {
      console.error("Erro", error);
    }
  };

  //Deletar usuários
  const deleteUsers = async (id) => {
    try {
      await api.delete(`users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`User successfully deleted.`);
    } catch (error) {
      console.error(error);
    }
    fetchUsers();
  };

  //Criar usuários
  const createUsers = async () => {
    // Validar campos vazios
    const name = inputName.current?.value.trim() ?? "";
    const age = inputAge.current?.value.trim() ?? "";
    const email = inputEmail.current?.value.trim() ?? "";
    const password = passwordRef.current?.value.trim() ?? "";

    // Validações específicas
    if (name === "") {
      window.alert("Por favor, preencha o campo Nome!");
      return;
    }
    if (age === "") {
      window.alert("Por favor, preencha o campo Idade!");
      return;
    }
    if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 150) {
      window.alert("A idade deve ser um número válido entre 1 e 150!");
      return;
    }
    if (email === "") {
      window.alert("Por favor, preencha o campo Email!");
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      window.alert("Por favor, insira um email válido!");
      return;
    }
    if (password === "") {
      window.alert("Por favor, preencha o campo Senha!");
      return;
    }
    if (password.length < 6) {
      window.alert("A senha deve ter no mínimo 6 caracteres!");
      return;
    }

    try {
      await api.post("/users", {
        name,
        age: Number(age),
        email,
        password,
      });
      alert("User created with successfully");
      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";
      passwordRef.current.value = "";
      navigate("/login");
    } catch (error) {
      console.error("Ops, algo deu errado 😕" + error);
    }
    fetchUsers();
  };

  //Buscar usuário específico selecionado
  const searchUser = async (id) => {
    try {
      const res = await api.get(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.data;
      inputName.current.value = data.name;
      inputAge.current.value = data.age;
      inputEmail.current.value = data.email;
      setUserId(data.id);
    } catch (error) {
      console.error(error);
    }
  };

  //Lidar com a mudança de estado do formulário
  const changeFromData = (id) => {
    setShowEditForm(true);
    inputName.current.focus();
    searchUser(id);
  };

  // Atualizar usuários
  const updateUsers = async (e) => {
    const id = userID;
    try {
      await api.put(
        `/users/${id}`,
        {
          name: inputName.current.value,
          age: Number(inputAge.current.value),
          email: inputEmail.current.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      inputAge.current.value = "";
      inputName.current.value = "";
      inputEmail.current.value = "";
      e.preventDefault();
      setShowEditForm(false);
      alert("User updated Successfully! ");
    } catch (error) {
      console.error(error);
    }
    fetchUsers();
  };

  useEffect(() => {
    const controller = new AbortController();
    const loadUsers = async () => {
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal, //Sinal enviado para a requisição
        });
        const user = response.data.users;
        setUsers(user);
      } catch (error) {
        console.error("Erro" + error);
      }
    };
    loadUsers();
    return () => {
      controller.abort(); // Isso cancela TODAS as operações ligadas ao signal
    };
  }, [token]);

  return (
    <div className={styles.container}>
      {!showEditForm ? (
        <form className={styles.formHome}>
          <h1 className={styles.h1Home}>Cadastro de Usuários</h1>
          <input placeholder="Nome" name="name" type="text" ref={inputName} />
          <input placeholder="Idade" name="age" type="number" ref={inputAge} />
          <input
            placeholder="Email"
            name="email"
            type="email"
            ref={inputEmail}
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            ref={passwordRef}
          />
          <button type="button" onClick={createUsers}>
            Cadastrar
          </button>
        </form>
      ) : (
        <form className={styles.formHome}>
          <h1 className={styles.h1Home}>Atualizar Usuário</h1>
          <input placeholder="Nome" name="name" type="text" ref={inputName} />
          <input placeholder="Idade" name="age" type="number" ref={inputAge} />
          <input
            placeholder="Email"
            name="email"
            type="email"
            ref={inputEmail}
          />
          <button type="button" onClick={updateUsers}>
            Atualizar
          </button>
        </form>
      )}

      {users.map((user) => (
        <div key={user.id} className={styles.card}>
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <div className={styles.buttons}>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trashcan} width={35} alt="Excluir" />
            </button>
            <button onClick={() => changeFromData(user.id)}>
              <img src={Pencil} width={30} alt="Editar" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
