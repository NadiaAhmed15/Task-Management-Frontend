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
      console.log("Sending Token:", token);

      if (!token) {
        toast.error("User not logged in");
        return;
      }

      try {
        const res = await axios.get(`${SERVER_URL}/todo/getTodo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Todos:", res.data);
        setTodo(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
        toast.error(err.response?.data?.error || "Failed to fetch todos");
      }
    };

    fetchTodos();
  }, [setTodo, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return toast.error("Please type something");

    const newTodoItem = { todoId: crypto.randomUUID(), title: newItem, status: false };

    const token = localStorage.getItem("token");
    if (!token) return toast.error("User not logged in");

    try {
      await axios.post(`${SERVER_URL}/todo/postTodo`, newTodoItem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodo([...todo, newTodoItem]);
      toast.success("Added Successfully");
      setNewItem("");
    } catch (err) {
      console.error("Error adding todo:", err);
      toast.error("Failed to add todo");
    }
  };

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
    </div>
  );
};

export default Todo;
