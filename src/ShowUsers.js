import React, {useState} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";
import axios from "./axios";

export default function ShowUsers(props){

    const {userId} = props;
    //const serverUrl = 'https://loomchat.herokuapp.com' ;
    const serverUrl = "http://127.0.0.1:8080";

    const users = useSelector(state => state.UserOnline || "");
    const [explain, setExplain] = useState(false);

    const logout = async() => {        
        const leave = await axios.post(`${serverUrl}/chatlogout`);
        socket.emit("leaveChat"); 
        if(leave.data.success){ 
            window.location.replace("/");
        }        
    };

    return(        
        <div id="showUsersOnline">
            {users &&
                users.map(user => 
                    <div key={user.id} className="flex showUsersOnline">
                        {user.firstname} {user.lastname} <div id="point"></div>
                        {user.id === userId &&
                        <div>
                            <div id="logout" onClick={logout} onMouseOver={()=> setExplain(true)} onMouseLeave={()=> setExplain(false)}></div> 
                            {explain && <div id="logoutExplain">Leave LOOMchat</div>}
                        </div>}
                    </div>
                )
            } 
        </div>  
    );
}