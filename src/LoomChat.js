import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import "./LoomChat.css";
import loomPaintCanvas from "./loomPaintCanvas";
import {socket} from "./sockets.js";
import axios from "./axios.js";

function Chat(){

    const [messageDraft, setMessageDraft] = useState("");
    const elemRef = useRef();    

    let messages = useSelector((state) => state.allMessages || []); 

    useEffect(() => {
        if(messages.length>1){
            elemRef.current.scrollTop = 100000;
        }        
    },[messages]);

    function handleClick(){
        socket.emit("chatMessage", messageDraft);
        setMessageDraft("");
    }

    return(
        <div id="LoomChat">
            <div className="chatOutput" ref={elemRef}>
                {messages && 
                    messages.map((message,index) => 
                        <div className="message" key={index}>{message.data}</div>
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

    const serverUrl = "http://localhost:8080";
    const mainUrl = "http://localhost:3000";

    const [room, setRoom] = useState("");
    const [canvasVisible,setCanvasVisible] = useState(false);
    const [chatVisible,setChatVisible] = useState(false);
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
            console.log(user);
            setUser(user.data);
        })(); 
    },[props.match]);

    return(
        <div>
            <div id="chat-middle">
                {chatVisible && <Chat />}
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
                <button className="chatButton" type="button">Video</button>
                <button className="chatButton" type="button" onClick={()=> {
                    if(canvasVisible){
                        setCanvasVisible(false);
                    }else {
                        setCanvasVisible(true);
                    }
                }}>Whiteboard</button>
            </div>
        </div>
    );
}