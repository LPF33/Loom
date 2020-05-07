import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";

export default function AllVideos(props){

    const {room} = props;

    const videoElement = useRef();
    const videoElement2 = useRef();

    const audio = useSelector(state => state.audio);
    const myVideo = useSelector(state => state.video);
    const mediaConstraints = {audio: audio, video: myVideo};

    let localPeerConnection = new RTCPeerConnection();
    let stream;  

    const getVideo = async() => {
        stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);        
        videoElement.current.srcObject = stream; 
        stream.getTracks().forEach(track => {
            localPeerConnection.addTrack(track, stream);
        }); 
    };

    const makeCall = async() => {   
        const desc = await localPeerConnection.createOffer();
        await localPeerConnection.setLocalDescription(desc);
        socket.emit('video', {room,desc});
    };
    
    socket.on("video", async (data) => {
        if (data && data.type === "answer") {
            const desc = new RTCSessionDescription(data);
            await localPeerConnection.setRemoteDescription(desc); 
        }
        if (data && data.type === "offer") {
            await localPeerConnection.setRemoteDescription(data); 
            const desc = await localPeerConnection.createAnswer();
            await localPeerConnection.setLocalDescription(desc);            
            socket.emit('video', {room, desc});
        }
        if (data.candidate) {console.log("addIceCandidate",data.candidate);
            try {
                await localPeerConnection.addIceCandidate(data.candidate['new-ice-candidate']);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });

    localPeerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            socket.emit('new-ice-candidate', {room, candidate:{'new-ice-candidate':event.candidate}});
        }
    });

    localPeerConnection.addEventListener('connectionstatechange', event => {
        if (localPeerConnection.connectionState === 'connected') {
            console.log("connected");
        }
    });
    

    localPeerConnection.addEventListener('track', async (e) => {console.log("es kommen daten", e);
        if (e.streams && e.streams[0]) {
            videoElement2.current.srcObject = e.streams[0];
        } else {
            let inboundStream = new MediaStream(e.track);
            videoElement2.current.srcObject = inboundStream;
        }
    }); 

    useEffect(() => {
        getVideo();
    },[mediaConstraints]);

    return(
        <div id="usersVideo">
            <button type="button" onClick={makeCall}>Connect</button>
            <video id="chatMyVideo" ref={videoElement} autoPlay></video>
            <video ref={videoElement2} autoPlay></video>
        </div>
    );
}