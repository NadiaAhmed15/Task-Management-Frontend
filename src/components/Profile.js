import React, { useEffect, useState } from "react";
import DarkMode from "./DarkMode/Darkmode";
import Notification from "./Notification/Notification";
import { IoMdNotifications } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import TypeWriter from "typewriter-effect";
import Calendar from "./Calendar/Calendar";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";
import { SERVER_URL } from "../global";

const Profile = ({ tasks }) => {
  const [quote, setQuote] = useState();
  const [author, setAuthor] = useState();
  const [user, setUser] = useState();
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [dialog, setDialog] = useState({
    isLoading: false,
  });

  axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   return;
  //   Aos.init({ duration: 1200 });
  //   fetch("http://api.quotable.io/random")
  //     .then((res) => res.json())
  //     .then((quotes) => {
  //       setQuote(quotes.content);
  //       setAuthor(quotes.author);
  //     });
  //   axios
  //     .get(`${SERVER_URL}/getUser`)
  //     .then((res) => {
  //       // console.log(res.data);
  //       setUser(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/task/getTask`)
      .then((res) => {
        let temp = res.data.filter(
          (obj) =>
            obj.done === false &&
            obj.task.deadline === new Date().toISOString().split("T")[0]
        );
        setUpcomingTasks(temp);
      })
      .catch((err) => console.log(err));
  }, [tasks]);

  const reloadQuote = () => {
    fetch("http://api.quotable.io/random")
      .then((res) => res.json())
      .then((quotes) => {
        setQuote(quotes.content);
        setAuthor(quotes.author);
      });
  };

  function openNotifi() {
    setDialog({ isLoading: true });
  }
  function closeNotifi() {
    setDialog({ isLoading: false });
  }
  return (
    <React.Fragment>
      <div className="profile" data-aos="fade-left">
        <div className="profile-div">
          <DarkMode />
          <button
            className={`${upcomingTasks.length ? " bell" : ""}`}
            onClick={openNotifi}
          >
            <span id="noti-count">{upcomingTasks.length}</span>
            <span>
              <IoMdNotifications size={25} color="#3081D0" />
            </span>
          </button>
          <img
            title={user && `${user.userName}`}
            id="prof-img"
            src={user && `${user.picUrl}`}
            alt=""
          />
        </div>
        {dialog.isLoading && (
          <Notification
            closeNotifi={closeNotifi}
            upcomingTasks={upcomingTasks}
          />
        )}
        <Calendar />
        {/* <div className="quote-div" data-aos="zoom-in">
          <h3>
            <TypeWriter
              options={{
                autoStart: true,
                loop: true,
                delay: 100,
                strings: [`" ${quote} "`],
              }}
            />
          </h3>
          <hr />
          <div className="quote-footer">
            <h4 id="auth-name"> - {author}</h4>
            <button onClick={reloadQuote}>
              <TfiReload color="orangered" size={18} />
            </button>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default Profile;
