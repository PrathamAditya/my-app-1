import React  , {useState , useRef , useEffect} from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/editor';
import {initSocket} from '../socket';
import {useLocation , useNavigate ,Navigate, useParams} from 'react-router-dom';


const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const location= useLocation();
  // we just want specific part of this by destructure
  const {roomId}  = useParams();
  const reactNavigator = useNavigate();
  useEffect(() => {


      const init = async () =>{
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error' , (err) => handleErrors(err));
        socketRef.current.on('connect_failed', (err) => handleErrors(err));

        function handleErrors(e) {
          console.log('socket error' , e);
          toast.error('Socket connection failed .try again later.');
          reactNavigator('/');
        }

        socketRef.current.emit(ACTIONS.JOIN,{
          roomId,
          username:location.state?.username,
        });

        //Listeing for joined event
        socketRef.current.on(ACTIONS.JOINED,
          ({ clients,username, socketId}) => {
            //this logic just to exclude my self from the notifing cuz i am in the list too
                  if(username!== location.state?.username)
                  {
                      toast.success(`${username} joined the room.`)
                      console.log(`${username} joined`);
                  }
                  setClients(clients);
          });

          //Listeing for disconnected

          socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{
            toast.success(`${username} left the room`);
            setClients((prev) => {
                return prev.filter(
                  client => client.socketId !== socketId
                );
            });
          });
      };

      init();
      //to stop the memory lek
      //timestamp - 2:49:00
      return () =>{
        if(socketRef.current){
          socketRef.current.disconnect();
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
        }

      }

  },[]);

  async function copyRoomId(){

    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID has been copied.');
    }
    catch(err){
        toast.error('Could not room ID.');
        console.error(err);
    }
  }
   function leaveRoom(){
      reactNavigator('/');
}


  if (!location.state){
    return   <Navigate to ="/" />;
  }

  return (
     <div className="mainWrap">
        {/* first left side div  */}
          <div className = "aside">
             {/*we are going to wrap this in one more this to set button and photos at their place*/}
            <div className = "asideInner">
              <div className = "logo">
              <img  className = "logoImage" src = "/code-sync.png"  alt = "logo" />

              </div>
                <h3> Connected </h3>
                <div className = "clientList">
                  {/* mapping the client */}
                  {clients.map((client) =>(
                    <Client
                      key = {client.socketId}
                      username = {client.username}
                      />
                    ))}
                </div>

            </div>
            <button className = "btn copyBtn" onClick = {copyRoomId}>Copy Room ID</button>
            <button className = "btn leaveBtn" onClick = {leaveRoom}>Leave</button>

          </div>


          {/* second text div section*/}
          <div className =  "editorWrap">
           <Editor socketRef=  {socketRef} roomId = {roomId} />



          </div>

    </div>
  )
}
export default EditorPage
