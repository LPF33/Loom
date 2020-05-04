import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import "./LoomChat.css";
import loomPaintCanvas from "./loomPaintCanvas";
import {socket} from "./sockets.js";
import axios from "./axios.js";

function AllVideos(){

    const videos = useSelector(state => state.UserVideo);  

    return(
        <div>
            {videos && Object.entries(videos).map(([key, value]) => 
                <img key={key} src={value}/>
            )}
        </div>
    );
}

function Video(props){

    const {room} = props;
    const [mute,setMute] = useState(true);

    const videoElem = useRef();
    const canvasVideo = useRef();
    const getVideo = async() => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: mute, video: {width: 350, height: 200}});        
        videoElem.current.srcObject = stream;
        videoElem.current.onloadedmetadata = function() {
            videoElem.current.play();
        };
        /* Sendung the media data
        const media = new MediaRecorder(stream);
        media.ondataavailable = e => {
            socket.emit("showVideo", {data:e.data, room});
        };
        media.start(1000);*/
        
        const canvas = canvasVideo.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 350;
        canvas.height = 200;
        ctx.width = canvas.width;
        ctx.height = canvas.height;
        setInterval(()=>{
            let video = videoElem.current;
            ctx.drawImage(video,0,0,ctx.width, ctx.height);
            socket.emit("showVideo", {room, data:canvas.toDataURL("image")});
        }, 100);   
    }; 

    useEffect(()=> {
        getVideo();
    },[mute]);  

    return(
        <div id="chatMyVideo">
            <video ref={videoElem}></video>
            <button onClick={()=> {
                if(mute){
                    setMute(false);
                }else{
                    setMute(true);
                }
            }}
            >Mute</button>
            <canvas id="canvasVideo" ref={canvasVideo}></canvas>
        </div>
    );
}

function Chat(props){

    const {firstname,lastname} = props.user;
    const {room} = props;

    const [messageDraft, setMessageDraft] = useState("");
    const elemRef = useRef();    

    let messages = useSelector((state) => state.allMessages || []); 

    useEffect(() => {
        if(messages.length>1){
            elemRef.current.scrollTop = 100000;
        }        
    },[messages]);

    function handleClick(){
        socket.emit("chatMessage", {room, message:{messageDraft,firstname,lastname}});
        setMessageDraft("");
    }

    return(
        <div id="LoomChat">
            <div className="chatOutput" ref={elemRef}>
                {messages && 
                    messages.map((message,index) => 
                        <div className="message" key={index} >
                            <div className="message1">{message.data.firstname} {message.data.lastname}</div>
                            <div className="message2">{message.data.messageDraft}</div>    
                        </div>
                    )}  
            </div>        
            <div className="chatInput">
                <input type="text" 
                    value={messageDraft} 
                    placeholder="Type a message"
                    onChange={e => setMessageDraft(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === "Enter"){
                            handleClick();
                        }
                    }}
                />
                <button onClick={handleClick} className="sendButton">Send</button>
            </div>
        </div>
    );
}

export default function LoomChat(props){

    const serverUrl = "http://127.0.0.1:8080";

    const [room, setRoom] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [status, setStatus] = useState(1);
    const [error, setError] = useState("");
    const [canvasVisible,setCanvasVisible] = useState(false);
    const [chatVisible,setChatVisible] = useState(false);
    const [videoVisible,setVideoVisible] = useState(false);
    const [allVideosVisible,setallVideosVisible] = useState(false);
    const [user, setUser] = useState("");
    const canvasChatRef = useRef(); 

    useEffect(()=> {
        const canvas = canvasChatRef.current;
        loomPaintCanvas(canvas);
    });

    useEffect(()=> {
        const param = props.match.params.roomnumber;
        setRoom(param);        
        (async() => {
            const user = await axios.get(`${serverUrl}/getChatUser`);
            setUser(user.data.user);           
        })();         
    },[props.match]);

    useEffect(() => {
        socket.emit("useronline", room);
    },[user]);

    const sendUserData = () => {
        (async() => {
            const check = await axios.post(`${serverUrl}/startLoomChat`, {firstname,lastname,room});
            if(check.data.success){
                const user = await axios.get(`${serverUrl}/getChatUser`);
                setUser(user.data.user);
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
                {allVideosVisible && <AllVideos show={allVideosVisible}/>}
                <div id="chat-middle">
                    {chatVisible && <Chat user={user} room={room}/>}
                    {canvasVisible && <canvas ref={canvasChatRef} id="loomPaintCanvas"></canvas>}                
                </div>            
                <div id="menu" className="flex">                
                    <h1>LOOM Chat</h1>
                    <button className="chatButton" type="button"onClick={()=> {
                        if(chatVisible){
                            setChatVisible(false);
                        }else {
                            setChatVisible(true);
                        }
                    }}>Chat</button>
                    <button className="chatButton" type="button" onClick={()=> {
                        if(videoVisible){
                            setVideoVisible(false);
                        }else {
                            setVideoVisible(true);
                        }
                    }}>MyCam</button>
                    <button className="chatButton" type="button" onClick={()=> {
                        if(allVideosVisible){
                            setallVideosVisible(false);
                        }else {
                            setallVideosVisible(true);
                        }
                    }}>Videos</button>
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