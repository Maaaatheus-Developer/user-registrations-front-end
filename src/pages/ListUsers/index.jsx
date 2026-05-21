import React from "react";
import api from "../../services/api";
import { useEffect, useState } from "react";

const ListOfUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const user = data.users;
        setAllUsers(user);
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 border border-gray-300 rounded-md shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Lista de Usuários
      </h2>
      <ul className="space-y-3">
        {allUsers.length > 0 &&
          allUsers.map((user) => (
            <li
              key={user.id}
              className="bg-gray-100 p-4 rounded-md border-2 border-black items-start"
            >
              <p className="font-semibold">
                Nome: <span className="font-normal">{user.name}</span>
              </p>
              <p className="font-semibold">
                Idade: <span className="font-normal">{user.age}</span>
              </p>
              <p className="font-semibold">
                Email: <span className="font-normal">{user.email}</span>
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ListOfUsers;
