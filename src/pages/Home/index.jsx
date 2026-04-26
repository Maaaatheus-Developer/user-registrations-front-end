import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import Trashcan from "../../assets/trashcan-icon-red-small.png";
import Pencil from "../../assets/pencil.png";
import api from "../../services/api";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const inputName = useRef(null);
  const inputAge = useRef(null);
  const inputEmail = useRef(null);
  const [userID, setUserId] = useState(null);

  //Buscar usuários
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      const data = response.data;
      setUsers(data);
    } catch (error) {
      console.error("Erro", error);
    }
  };

  //Deletar usuários
  const deleteUsers = async (id) => {
    try {
      await api.delete(`users/${id}`);
      alert(`User successfully deleted.`);
    } catch (error) {
      console.error(error);
    }
    fetchUsers();
  };

  //Criar usuários
  const createUsers = async () => {
    try {
      await api.post("/users", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });
      alert("User created with successfully");
    } catch (error) {
      console.log("Ops, algo deu errado 😕" + error);
    }
    fetchUsers();
    inputName.current.value = "";
    inputAge.current.value = "";
    inputEmail.current.value = "";
  };

  //Buscar usuário específico selecionado
  const searchUser = async (id) => {
    try {
      const res = await api.get(`/users/${id}`);
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
    console.log(id);
    try {
      await api.put(`/users/${id}`, {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });
      e.preventDefault();
      inputAge.current.value = "";
      inputName.current.value = "";
      inputEmail.current.value = "";
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
          signal: controller.signal, //Sinal enviado para a requisição
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erro" + error);
      }
    };
    loadUsers();
    return () => {
      controller.abort(); // Isso cancela TODAS as operações ligadas ao signal
    };
  }, []);

  return (
    <div className="container">
      {!showEditForm ? (
        <form>
          <h1>Cadastro de Usuários</h1>
          <input placeholder="Nome" name="name" type="text" ref={inputName} />
          <input placeholder="Idade" name="age" type="number" ref={inputAge} />
          <input
            placeholder="Email"
            name="email"
            type="email"
            ref={inputEmail}
          />
          <button type="button" onClick={createUsers}>
            Cadastrar
          </button>
        </form>
      ) : (
        <form>
          <h1>Atualizar Usuário</h1>
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
        <div key={user.id} className="card">
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
          <div className="buttons">
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
