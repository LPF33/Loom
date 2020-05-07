import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";

export default function AllVideos(props){

    const {room} = props;

    const videoElement = useRef();
    const videoElement2 = useRef();

    const hideVideos = useSelector(state => state.hideVideos);
    const [classVideo, setClassVideo] = useState("");

    const audio = useSelector(state => state.audio);
    const myVideo = useSelector(state => state.video);

    //const stunServer = {'iceServers' : [{'urls' : 'stun:stun.l.google.com:19302'}]};

    let localPeerConnection = new RTCPeerConnection();
    let stream;  

    const getVideo = async() => {
        stream = await navigator.mediaDevices.getUserMedia({audio: true, video: {width: 350, height: 200}});        
        videoElement.current.srcObject = stream;         
        if(!audio){
            stream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = false; socket.emit("audio/video", {audio:"mute"});}
            });
        } else{
            stream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = true;socket.emit("audio/video", {audio:"unmute"});} 
            });
        }
        if(!myVideo){
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;socket.emit("audio/video", {video:"mute"});}
            });
        } else{
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;socket.emit("audio/video", {video:"unmute"});} 
            });
        }
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

    localPeerConnection.addEventListener('connectionstatechange', () => {
        if (localPeerConnection.connectionState === 'connected') {
            console.log("connected");
        }
    });
    

    let remoteStream;

    socket.on("audio/video", data => {
        if(data.audio === "mute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = false;}
            });
        } else if(data.audio === "unmute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = true;}
            });
        } else if(data.video === "mute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;}
            });
        } else if(data.video === "unmute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;}
            });
        }
    });

    localPeerConnection.addEventListener('track', async (e) => {
        if (e.streams && e.streams[0]) {
            remoteStream = e.streams[0];
            videoElement2.current.srcObject = e.streams[0];
        } else {
            remoteStream = new MediaStream(e.track);
            videoElement2.current.srcObject = remoteStream;
        }
    }); 

    socket.on("p2p", () => {console.log("p2p");
        makeCall();
    });

    useEffect(() => {
        if(!hideVideos){
            setClassVideo("hideVideos");
        } else {
            setClassVideo("");
        }
    },[hideVideos]);

    useEffect(() => {
        getVideo();
    },[audio]);

    useEffect(() => {
        getVideo();
    },[myVideo]);

    useEffect(() => {
        setTimeout(makeCall,3000);
    },[]);
    

    return(
        <div id="usersVideo">
            <div className={classVideo}>
                <video id="chatMyVideo" ref={videoElement} autoPlay></video>
                <video className="userVideos" ref={videoElement2} autoPlay></video>
            </div>
        </div>
    );
}