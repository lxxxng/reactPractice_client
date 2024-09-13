import React, { useState } from 'react';
import axios from 'axios';

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changePassword = () => {
        axios.put("https://react-practice-a75bfd5abb62.herokuapp.com/auth/changepassword",
            {oldPassword: oldPassword, newPassword: newPassword},
            { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then((response) =>{
            if(response.data.error){
                alert(response.data.error);
            }
        });
    }

  return (
    <div>
        <h1>change password</h1>
        <input type="text" placeholder="old password..." 
            onChange={(event) => {
                setOldPassword(event.target.value);
            }}
        />
        <input type="text" placeholder="new password..." 
            onChange={(event) => {
                setNewPassword(event.target.value);
            }}  
        />
        <button onClick={changePassword}> Save changes </button>
    </div>
  )
}

export default ChangePassword