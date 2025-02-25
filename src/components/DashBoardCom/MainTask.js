import React, { useEffect } from "react";
import { FaHandPointRight } from "react-icons/fa";
import axios from "axios";
import { SERVER_URL } from "../../global";

const MainTask = ({ tasks, setTasks }) => {
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/task/getTask`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  }, [setTasks]);

  return (
    <div className="scroller">
      <div className="content-task scroller-inner">
        <div className="scroller-con">
          <div className="dots">
            <p id="one"></p>
            <p id="two"></p>
            <p id="three"></p>
          </div>
          Some of your upcoming Tasks (readonly)...
          <br />
          <br />
          <FaHandPointRight size={30} style={{ marginLeft: "50%" }} />
        </div>
        {tasks.map((eachTask) => (
          <div id="dash-task-con" key={eachTask.id}>
            <h4>Task Name : {eachTask.task.taskName}</h4>
            <h4>Priority : {eachTask.task.priority}</h4>
            <h4>Deadline : {eachTask.task.deadline}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainTask;
