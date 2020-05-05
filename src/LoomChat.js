import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import "./LoomChat.css";
import {socket} from "./sockets.js";
import axios from "./axios.js";
import {stopMyVideo, oldChatMessages} from "./action.js";
import Whiteboard from "./Whiteboard.js";
import Chat from "./ChatApp";
import Video from "./MyVideo";
import AllVideos from "./AllUserVideos";

export default function LoomChat(props){

    const serverUrl = "http://127.0.0.1:8080";
    const dispatch = useDispatch();

    const [room, setRoom] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [status, setStatus] = useState(1);
    const [error, setError] = useState("");
    const [canvasVisible,setCanvasVisible] = useState(false);
    const [chatVisible,setChatVisible] = useState(false);
    const [videoVisible,setVideoVisible] = useState(false);
    const [allVideosVisible,setallVideosVisible] = useState(true);
    const [user, setUser] = useState("");

    useEffect(()=> {
        const param = props.match.params.roomnumber;
        setRoom(param);        
        (async() => {
            const user = await axios.get(`${serverUrl}/getChatUser/${param}`);
            setUser(user.data.user); 
            dispatch(oldChatMessages(user.data.data));
        })();         
    },[props.match]);

    useEffect(() => {
        socket.emit("useronline", room);
    },[user]);

    useEffect(() => {
        dispatch(stopMyVideo(videoVisible));
    },[videoVisible]);

    const sendUserData = () => {
        (async() => {
            const check = await axios.post(`${serverUrl}/startLoomChat`, {firstname,lastname,room});
            if(check.data.success){
                const user = await axios.get(`${serverUrl}/getChatUser/${room}`);
                setUser(user.data.user);
                dispatch(oldChatMessages(user.data.data));
            } else {
                setStatus(2);
                setError(check.data.error);
            }                       
        })(); 
    };

    return(
        <div>
            {!user && 
            <div>
                <div id="header">LOOM</div> 
                <div id="noChatUser" className="flexColumn">
                    <h1>Welcome to LOOM</h1>
                    {status===1 &&
                        <div className="flexColumn">
                            <input type="text" id="firstname" name="firstname" placeholder="Your firstname" value={firstname} onChange={e => setFirstName(e.target.value)}/> 
                            <input type="text" id="lastname" name="lastname" placeholder="Your lastname" value={lastname} onChange={e => setLastName(e.target.value)}/>  
                            <input type="submit" value="Join" onClick={sendUserData}></input>
                        </div>
                    }
                    {status===2 &&
                        <div className="flexColumn">
                            <h2>A problem occured</h2>
                            <div className="mailErrorChat">{error}</div>
                            <button type="button" onClick={() => setStatus(1)} className="welcomeButton2">Go back</button>
                        </div>
                    }                    
                </div>                
            </div>
            }
            {user &&
            <div>
                {videoVisible && <Video room={room}/>}
                {allVideosVisible && <AllVideos />}

                {chatVisible && <Chat user={user} room={room}/>}

                {canvasVisible && <Whiteboard room={room}/>}   

                <div id="menu" className="flex">                
                    <h1>LOOM Chat</h1>
                    <button className="chatButton" type="button"onClick={()=> {
                        if(chatVisible){
                            setChatVisible(false);
                        }else {
                            setChatVisible(true);
                        }
                    }}>Chat</button>
                    {videoVisible && <button className="chatButtonred" type="button" onClick={()=> setVideoVisible(false)}>MyCam - OFF</button>}
                    {!videoVisible && <button className="chatButton" type="button" onClick={()=> setVideoVisible(true)}>MyCam - ON</button>}
                    {allVideosVisible && <button className="chatButton" type="button" onClick={()=> setallVideosVisible(false)}>Hide Videos</button>}
                    {!allVideosVisible && <button className="chatButtonred" type="button" onClick={()=> setallVideosVisible(true)}>Show Videos</button>}
                    <button className="chatButton" type="button" onClick={()=> {
                        if(canvasVisible){
                            setCanvasVisible(false);
                        }else {
                            setCanvasVisible(true);
                        }
                    }}>Whiteboard</button>
                    <h2>Hello, {user.firstname}!</h2>
                </div>
            </div>
            }
        </div>
    );
}