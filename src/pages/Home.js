// import function usestate form react module
import React, {useState} from 'react';
// importing V4 as the name uuidv4 name
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import {useNavigate} from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const [roomId , setRoomId] = useState('');
    const [username , setUserName] = useState('');
    const createNewRoom= (e) => {

    //we have to stop the redirecting to home page, which is defalut
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created new Room')
    };

    const joinRoom = () => {
      if(!roomId ||!username){
        toast.error('Room ID is and Username is required');
        return;
      }

      // Redirect by using useNavigate
      // beCare With `DANGER`
      navigate(`/editor/${roomId}` , {
        state:{
        username,

          },
          });
  };
  const handleInputEnter = (e) => {
    if(e.code === 'Enter')
    {
      joinRoom();
    }
  }


  return (
    <div className = "homePageWrapper" >
      <div className = "formWrapper" >
          <img className = "homePageLogo" src = "/code-sync-01.png" alt = "code-sync-logo" / >
          <h4 className = "mainLabel" > Paste invitation Room ID </h4>
          <div className = "inputGroup">

          {/* For the Room ID inputBox --> */}
          <input type ="text"
                 className="inputBox"
                 onChange={(e) => setRoomId(e.target.value)}
                 placeholder = " Room ID"
                 value = {roomId}
                 onKeyUp={handleInputEnter}
                 />

          {/* For the Name inputBox --> */}
          <input type ="text"
                 className="inputBox"
                 onChange={(e) => setUserName(e.target.value)}
                 value = {username}
                 placeholder = " User Name"
                 onKeyUp={handleInputEnter} />
          <button className = "btn joinBtn" onClick ={joinRoom} > Join </button>
          <span className = "createInfo">
            If you don't have any invite then create &nbsp;
            <a onClick={createNewRoom} href = "#" className= "createNewBtn">New Room</a>
          </span>


      </div>



    </div>
      <footer>
      <h4>Let's Code!❤️</h4>
      </footer>

    </div>
  );

};
export default Home;
