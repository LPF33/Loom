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
        const constraints = {audio: true, video: {width: 700, height: 400}};
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints); 
        if ("srcObject" in videoElement.current) {
            videoElement.current.srcObject = stream;  
        } else {
            videoElement.current.src = window.URL.createObjectURL(stream);
        }   

        if(!myVideo){console.log("unmute");
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;socket.emit("audio/video", {room,video:"unmute"});}
            });
        } else if(myVideo){console.log("mute");
            stream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;socket.emit("audio/video", {room,video:"mute"});} 
            });
        }
        stream.getTracks().forEach(track => { 
            localPeerConnection.addTrack(track, stream);
        });
    };

    const makeCall = async(socketId) => {   
        const desc = await localPeerConnection.createOffer();
        await localPeerConnection.setLocalDescription(desc);
        socket.emit('video', {socketId,desc});
    };
    
    socket.on("video", async (data) => { console.log(data);
        if (data.desc && data.desc.type === "answer") {
            const desc = new RTCSessionDescription(data.desc);
            await localPeerConnection.setRemoteDescription(desc); 
        }
        if (data.desc && data.desc.type === "offer") {
            await localPeerConnection.setRemoteDescription(data.desc); 
            const desc = await localPeerConnection.createAnswer();
            await localPeerConnection.setLocalDescription(desc);            
            socket.emit('video', {socketId: data.socketId, desc});
        }
        if (data.candidate) {
            try {
                await localPeerConnection.addIceCandidate(data.candidate['new-ice-candidate']);
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });

    localPeerConnection.addEventListener('icecandidate', event => {console.log("event", event);
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

    localPeerConnection.addEventListener('track', async (e) => {     console.log(e);   
        
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
            remoteStream.getTracks().forEach(e => {console.log("audio unmute");
                if (e.kind === 'audio'){e.enabled = false;}
            });
        } else if(remoteStream && data.audio === "mute"){
            remoteStream.getTracks().forEach(e => {console.log("audio mute");
                if (e.kind === 'audio'){e.enabled = true;}
            });
        } else if(remoteStream && data.video === "unmute"){console.log("video unmute");
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = false;}
            });
        } else if(remoteStream && data.video === "mute"){console.log("video unmute");
            remoteStream.getTracks().forEach(e => {
                if (e.kind === 'video'){e.enabled = true;}
            });
        }
    });

    socket.on("startP2P", socketId => {
        setTimeout(() => makeCall(socketId),3000);   
    });

    useEffect(() => {
        if(!hideVideos){
            setClassVideo("hideVideos");
        } else {
            setClassVideo("");
        }
    },[hideVideos]);

    useEffect(() => {
        if(audio){
            socket.emit("audio/video", {room,audio:"mute"});
        } else {
            socket.emit("audio/video", {room, audio:"unmute"});
        }
    },[audio]);

    useEffect(() => {
        getVideo();
    },[myVideo]);    

    return(
        <div id="usersVideo">
            <div className={classVideo}>
                <video onClick={() => {if(enlarge[0]){setEnlarge(["",""]);}else{setEnlarge(["enlarge",""]);}}} id="chatMyVideo" muted={true} className={`userVideos ${enlarge[0]}`} ref={videoElement} autoPlay></video>
                <video onClick={() => {if(enlarge[1]){setEnlarge(["",""]);}else{setEnlarge(["","enlarge"]);}}} className={`userVideos ${enlarge[1]}`} ref={videoElement2} autoPlay></video>
            </div>
        </div>
    );
}