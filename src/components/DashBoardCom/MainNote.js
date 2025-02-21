import React, { useEffect } from "react";
import { FaHandPointRight } from "react-icons/fa";
import axios from "axios";
import { SERVER_URL } from "../../global";

const MainNote = ({ notes, setNotes }) => {
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/note/getNote`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err));
  }, [setNotes]);

  return (
    <>
      <div className="scroller">
        <div className="content-note scroller-inner">
          <div className="scroller-con">
            <div className="dots">
              <p id="one"></p>
              <p id="two"></p>
              <p id="three"></p>
            </div>
           
            Some of your recently added Notes
            <br />
            <br />
            <FaHandPointRight size={30} style={{ marginLeft: "50%" }} />
          </div>
          {notes.map((eachNote) => (
            <textarea
              value={eachNote.noteText} 
              id="dash-note-con"
              key={eachNote.id}
              readOnly
            ></textarea>
          ))}
        </div>
        {/* <button className="dash-goto-bt">+</button> */}
      </div>
    </>
  );
};

export default MainNote;
