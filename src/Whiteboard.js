import React, {useEffect, useRef, useState} from "react";
import WhiteboardCanvas from "./WhiteboardCanvas";
import "./Whiteboard.css";


export default function Whiteboard(props){

    const {room} = props;
    const WhiteboardRef = useRef(); 
    const [explain, setExplain] = useState(false);
    const [explainB, setExplainB] = useState(false);
    
    const [moreColor, setmoreColor] = useState(false);
    const [rgb, setRGB] = useState({red:122,green:122,blue:122});
    let colorvalue= `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    
    useEffect(()=> {
        const canvas = WhiteboardRef.current;
        WhiteboardCanvas(canvas,room);
    },[]);

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
                <button onMouseOver={()=> setExplainB(true)} onMouseLeave={()=> setExplainB(false)} type="button" id="background" className="tool">Background</button>
                <input onMouseOver={()=> setExplain(true)} onMouseLeave={()=> setExplain(false)} type="number" min="100" max="1500" step="50" className="canvasInput" id="inputWidth" placeholder="Width"/>
                <input onMouseOver={()=> setExplain(true)} onMouseLeave={()=> setExplain(false)} type="number" min="100" max="1000" step="50" className="canvasInput" id="inputHeight" placeholder="Height"/>
                {explain && <div className="explainSizeCanvas">Caution: Set the size before painting!</div>}   
                {explainB && <div className="explainSizeCanvas">Caution: Set the backgroundcolor before painting!</div>}        
                <a id="download" className="tool">Download</a>
                <div>
                    <button type="button" className="color" id="yellow"></button>
                    <button type="button" className="color" id="blue"></button>
                    <button type="button" className="color" id="red"></button>
                    <button type="button" className="color" id="green"></button>
                    <button type="button" className="color" id="white"></button>
                    <button type="button" className="color" id="black"></button>
                    <button onClick={()=> {
                        if(moreColor){
                            setmoreColor(false);
                        }else{
                            setmoreColor(true);
                        }
                    }} type="button" className="color" id="setColor"></button>
                    {moreColor && 
                    <div id="setOtherColor" className="flex">
                        <div>
                            <input value={rgb.red} onChange={e=>{let ho={...rgb}; ho.red=e.target.value; setRGB(ho);}} id="rgbred" type="range" min="0" max="255" step="1"/>
                            <div className="flex">Red:<div id="valueRed"></div>{rgb.red}</div>
                            <input value={rgb.green} onChange={e=>{let ho={...rgb}; ho.green=e.target.value; setRGB(ho);}} id="rgbgreen" type="range" min="0" max="255" step="1"/>
                            <div className="flex">Green:<div id="valueGreen"></div>{rgb.green}</div>
                            <input value={rgb.blue} onChange={e=>{let ho={...rgb}; ho.blue=e.target.value; setRGB(ho);}} id="rgbblue" type="range" min="0" max="255" step="1"/>
                            <div className="flex">Blue:<div  id="valueBlue"></div>{rgb.blue}</div>
                        </div>
                        <div>
                            <div style={{backgroundColor:colorvalue}} id="colorOutput"></div>
                        </div>
                    </div>
                    }
                </div>              
            </div>
        </div>        
    );
    

}
