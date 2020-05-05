import React from "react";
import {useSelector} from "react-redux";

export default function ShowUsers(){

    const users = useSelector(state => state.UserOnline || "");

    return(        
        <div id="showUsersOnline">
            {users &&
                users.map(user => 
                    <div key={user.id} className="flex showUsersOnline">
                        {user.firstname} {user.lastname} <div id="point"></div>
                    </div>
                )
            } 
        </div>  
    );
}