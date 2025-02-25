import React, { useState, useEffect, useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import "./styles/todo.css";
import { SERVER_URL } from "../global";

const Todo = ({ toast, todo, setTodo }) => {
  const [newItem, setNewItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  axios.defaults.withCredentials = true;

  const filteredItems = useMemo(() => {
    return todo.filter((eachItem) =>
      eachItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todo, searchQuery]);

  useEffect(() => {
    Aos.init({ duration: 1000 });

    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User not logged in");
        return;
      }

      try {
        const res = await axios.get(`${SERVER_URL}/todo/getTodo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodo(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);

        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          toast.error(err.response?.data?.error || "Failed to fetch todos");
        }
      }
    };

    fetchTodos();
  }, [setTodo, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newItem.trim() === "") {
      toast.error("Please type something");
      return;
    }

    const newTodoItem = {
      todoId: crypto.randomUUID(),
      title: newItem,
      status: false,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/todo/postTodo`, newTodoItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodo((current) => [...current, newTodoItem]);
      toast.success("Added Successfully");
      setNewItem("");
    } catch (err) {
      console.error("Error adding todo:", err);
      toast.error(err.response?.data?.error || "Failed to add todo");

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  function tickTodo(todoId, status) {
    setTodo((current) =>
      current.map((todo) =>
        todo.todoId === todoId ? { ...todo, status } : todo
      )
    );

    const token = localStorage.getItem("token");
    axios
      .patch(
        `${SERVER_URL}/todo/updateTodo/${todoId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err) => console.error("Error updating todo:", err));
  }

  function deleteTodo(todoId) {
    const token = localStorage.getItem("token");
    axios
      .delete(`${SERVER_URL}/todo/deleteTodo/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => console.error("Error deleting todo:", err));

    setTodo((current) => current.filter((todo) => todo.todoId !== todoId));
  }

  return (
    <div className="main-form" data-aos="zoom-in">
      <div className="search-bar">
        <h1>Todo's</h1>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
          placeholder="Search"
        />
        <button id="search-bt">
          <BiSearchAlt2 size={22} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="form-row">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
          className="todo-ip"
          placeholder="New Reminder"
        />
        <button id="add-todo">ADD </button>
      </form>
      <div className="item-list" data-aos="zoom-out">
        <ul>
          {todo.length === 0 && <h3 id="no-todo">No Reminders</h3>}
          {filteredItems.map((todo) => (
            <li key={todo.todoId}>
              <label className="item-name">
                <input
                  type="checkbox"
                  checked={todo.status}
                  onChange={(e) => tickTodo(todo.todoId, e.target.checked)}
                />
                {todo.title}
              </label>
              <button id="del-bt" onClick={() => deleteTodo(todo.todoId)}>
                <AiFillDelete size={20} color="#FF6969" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
