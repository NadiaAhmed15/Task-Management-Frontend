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

  // Add Authorization Headers to All Requests
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // Filtered todos based on search query
  const filteredItems = useMemo(() => {
    return todo.filter((eachItem) =>
      eachItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todo, searchQuery]);

  useEffect(() => {
    Aos.init({ duration: 1000 });

    // Fetch Todos with Authorization
    axios
      .get(`${SERVER_URL}/todo/getTodo`, authHeader)
      .then((res) => {
        console.log("Fetched Todos:", res.data);
        setTodo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
        toast.error("Failed to fetch todos");
      });
  }, [setTodo]);

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

    try {
      // Send POST request and wait for confirmation before updating state
      const res = await axios.post(
        `${SERVER_URL}/todo/postTodo`,
        newTodoItem,
        authHeader
      );
      console.log("Todo added:", res.data);

      // Update UI after successful backend update
      setTodo((current) => [...current, newTodoItem]);

      toast.success("Added Successfully");
      setNewItem("");
    } catch (err) {
      console.error("Error adding todo:", err);
      toast.error("Failed to add todo");
    }
  };

  const tickTodo = async (todoId, status) => {
    try {
      // Optimistically update the UI
      setTodo((current) =>
        current.map((todo) =>
          todo.todoId === todoId ? { ...todo, status } : todo
        )
      );

      // Send PATCH request to backend
      await axios.patch(
        `${SERVER_URL}/todo/updateTodo/${todoId}`,
        { status },
        authHeader
      );
      console.log(`Todo ${todoId} updated to ${status}`);
    } catch (err) {
      console.error("Error updating todo:", err);
      toast.error("Failed to update todo");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${SERVER_URL}/todo/deleteTodo/${todoId}`, authHeader);

      // Remove deleted item from state
      setTodo((current) => current.filter((todo) => todo.todoId !== todoId));

      toast.success("Deleted Successfully");
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast.error("Failed to delete todo");
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
        <button id="add-todo">ADD</button>
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
