import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";

export default function AllVideos(props){

    const {room} = props;

    const videoElement = useRef();
    const videoElement2 = useRef();

    const hideVideos = useSelector(state => state.hideVideos);
    const [classVideo, setClassVideo] = useState("");
    const [enlarge, setEnlarge] = useState(["",""]);

    const audio = useSelector(state => state.audio);
    const myVideo = useSelector(state => state.video);

    const stunServer = {'iceServers' : [{'urls' : 'stun:stun.l.google.com:19302'}]};

    let localPeerConnection = new RTCPeerConnection(stunServer);
    let stream;  

    const getVideo = async() => {
        stream = await navigator.mediaDevices.getUserMedia({audio: true, video: {width: 700, height: 400}});        
        videoElement.current.srcObject = stream;         
        if(!audio){
            stream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = false; socket.emit("audio/video", {room, audio:"unmute"});}
            });
        } else{
            stream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = true;socket.emit("audio/video", {room,audio:"mute"});} 
            });
        }
        if(!myVideo){
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;socket.emit("audio/video", {room,video:"unmute"});}
            });
        } else{
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;socket.emit("audio/video", {room,video:"mute"});} 
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
    let remoteStream  = null;

    localPeerConnection.addEventListener('track', async (e) => {        
        
        if (e.streams && e.streams[0]) {
            remoteStream = e.streams[0];
            if(remoteStream){
                videoElement2.current.srcObject = remoteStream;
            }            
        } else {
            remoteStream = new MediaStream(e.track);
            if(remoteStream){
                videoElement2.current.srcObject = remoteStream;
            }
        }       
    }); 

    socket.on("audio/video", data => {
        if(remoteStream && data.audio === "unmute"){ 
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = false;}
            });
        } else if(remoteStream && data.audio === "mute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'audio'){e.enabled = true;}
            });
        } else if(remoteStream && data.video === "unmute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;}
            });
        } else if(remoteStream && data.video === "mute"){
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;}
            });
        }
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
        setTimeout(makeCall,4000);
    },[]);
    

    return(
        <div id="usersVideo">
            <div className={classVideo}>
                <video onClick={() => {if(enlarge[0]){setEnlarge(["",""]);}else{setEnlarge(["enlarge",""]);}}} id="chatMyVideo" className={`userVideos ${enlarge[0]}`} ref={videoElement} autoPlay></video>
                <video onClick={() => {if(enlarge[1]){setEnlarge(["",""]);}else{setEnlarge(["","enlarge"]);}}} className={`userVideos ${enlarge[1]}`} ref={videoElement2} autoPlay></video>
            </div>
        </div>
    );
}