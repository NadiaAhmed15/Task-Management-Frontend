import React, { useEffect } from "react";
import { FaHandPointDown } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { SERVER_URL } from "../../global";

const MainTodo = ({ todo, setTodo }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, please login first.");
      // You might want to redirect to login or show an error message here.
      return;
    }

    axios
      .get(`${SERVER_URL}/todo/getTodo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching todos:", err.response || err);
      });
  }, [setTodo]);

  return (
    <div className="dash-todo-con">
      <div className="todo-scroll">
        <div className="content-todo scroller-inner">
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <br />
            <br />
            <span id="scroller-con-col">
              "DREAMS don't work unless YOU do."
            </span>
            <br />
            <br />
          </div>
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <br />
            <br />
            <span id="scroller-con-col">
              " LIFE IS MORE THAN ONE BIG TO DO LIST."
            </span>
          </div>
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <br />
            <br />
            <span id="scroller-con-col">
              "Don't be afraid to do something big"
            </span>
          </div>
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <br />
            <br />
            <span id="scroller-con-col">
              "The most effective way to do is to do it."
            </span>
          </div>
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            <br />
            <br />
            <span id="scroller-con-col">"STOP THINKING START DOING."</span>
            <br />
            <br />
          </div>
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
            Some of your readonly Todo's...
            <br />
            <br />
            <FaHandPointDown size={30} style={{ marginLeft: "45%" }} />
          </div>
        </div>
      </div>
      <ul id="lists">
        {todo.length === 0 && <h3 id="no-todo">No Remainders</h3>}
        {todo.map((item) => (
          <li key={item.todoId}>
            <label htmlFor="" className="item-name">
              <input type="checkbox" checked={item.status} readOnly />
              {item.title}
            </label>
            <button id="del-bt">
              <AiFillDelete size={20} color="#FF6969" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainTodo;
