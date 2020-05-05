import React from "react";
import {useSelector} from "react-redux";

export default function AllVideos(){

    const videos = useSelector(state => state.UserVideo );  

    return(
        <div id="usersVideo">
            {videos && Object.entries(videos).map(([key, value]) => 
                <img className="usersVideo" key={key} src={value} alt="videochat"/>
            )}
        </div>
    );
}