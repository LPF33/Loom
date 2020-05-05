import React, {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";

export default function Video(props){

    const {room} = props;
    const videoVisible = useSelector(state => state.videoVisible);

    const videoElem = useRef();
    const canvasVideo = useRef();
    const getVideo = async() => {
        const stream = await navigator.mediaDevices.getUserMedia({video: {width: 350, height: 200}});        
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
        const drawImage = () => {
            let video = videoElem.current;  
            if(video){
                ctx.drawImage(video,0,0,ctx.width, ctx.height);
                socket.emit("showVideo", {room, data:canvas.toDataURL("image/webp")});  
                setTimeout(drawImage,100);
            } else{
                socket.emit("noVideo", room);
            }  
        };
        drawImage(); 
    }; 

    useEffect(() => { 
        if(videoVisible){
            getVideo();
        } 
    },[videoVisible]);

    return(
        <div id="chatMyVideo">
            <video ref={videoElem}></video>
            <canvas id="canvasVideo" ref={canvasVideo}></canvas>
        </div>
    );
}