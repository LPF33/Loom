import React, {useEffect, useRef} from "react";
import {socket} from "./sockets.js";

export default function Video(props){

    const {room} = props;
    const mediaConstraints = {audio:true, video: {width: 350, height: 200}};

    const videoElem = useRef();
    const videoElem2 = useRef();

    let localPeerConnection = new RTCPeerConnection();
    let stream;  

    const getVideo = async() => {
        stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);        
        videoElem2.current.srcObject = stream; 
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

    //const remoteStream = new MediaStream();    

    localPeerConnection.addEventListener('track', async (e) => {console.log("es kommen daten", e);
        if (e.streams && e.streams[0]) {
            videoElem.current.srcObject = e.streams[0];
        } else {
            let inboundStream = new MediaStream(e.track);
            videoElem.current.srcObject = inboundStream;
        }
    }); 

    useEffect(() => {
        getVideo();        
    },[]);
    

    return(
        <div>
            <button type="button" onClick={makeCall}>Connect</button>
            <video ref={videoElem} autoPlay></video>
            <video ref={videoElem2} autoPlay></video>
        </div>
    );
}