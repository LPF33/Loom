import React, {useEffect, useRef} from "react";
import WhiteboardCanvas from "./WhiteboardCanvas";
import "./Whiteboard.css";


export default function Whiteboard(props){

    const {room} = props;
    const WhiteboardRef = useRef(); 

    useEffect(()=> {
        const canvas = WhiteboardRef.current;
        WhiteboardCanvas(canvas,room);
    });

    return(
        <div id="Whiteboard">
            <div id="WhiteboardDiv">
                <canvas ref={WhiteboardRef} id="WhiteboardCanvas"></canvas>
            </div>            
            <div id="tools">
                <button type="button" id="pencil" className="tool">Pencil</button>
                <button type="button" id="rectangle" className="tool">Rectangle</button>
                <button type="button" id="circle" className="tool">Circle</button>
                <button type="button" id="rubber" className="tool">Rubber</button>
                <button type="button" id="clear" className="tool">Clear</button>
                <div>
                    <button type="button" className="color" id="yellow"></button>
                    <button type="button" className="color" id="blue"></button>
                    <button type="button" className="color" id="red"></button>
                    <button type="button" className="color" id="green"></button>
                    <button type="button" className="color" id="white"></button>
                    <button type="button" className="color" id="black"></button>
                </div>              
            </div>
        </div>        
    );
    

}
