import React, {useState} from "react";
import {useSelector} from "react-redux";
import {socket} from "./sockets.js";
import axios from "./axios";
import {Link} from "react-router-dom";

export default function ShowUsers(props){

    const {userId} = props;
    const serverUrl = process.env.PORT ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:8080";

    const users = useSelector(state => state.UserOnline || "");
    const [explain, setExplain] = useState(false);

    const logout = async() => {        
        await axios.post(`${serverUrl}/chatlogout`);
        socket.emit("leaveChat"); 
    };

    return(        
        <div id="showUsersOnline">
            {users &&
                users.map(user => 
                    <div key={user.id} className="flex showUsersOnline">
                        {user.firstname} {user.lastname} <div id="point"></div>
                        {user.id === userId &&
                        <div>
                            <Link to="/"  onClick={logout} >
                                <div id="logout" onMouseOver={()=> setExplain(true)} onMouseLeave={()=> setExplain(false)}></div> 
                            </Link> 
                            {explain && <div id="logoutExplain">Leave LOOMchat</div>}
                        </div>}
                    </div>
                )
            } 
        </div>  
    );
}