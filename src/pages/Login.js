import React, {useState, useContext} from 'react';
import axios from 'axios';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'; 

function Login() {
  let navigate = useNavigate(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext); 

  const login = () => {
    const data = {username:username, password:password};
    axios.post("https://react-practice-a75bfd5abb62.herokuapp.com/auth/login", data).then((response) =>
    {
      if(response.data.error) {
        alert("response.data.error");
      }
      else{
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
            username: response.data.username, 
            id:response.data.id, 
            status:true});
        navigate("/");
      }

    });
  }

  return (
    <div>
      <input 
        type="text" 
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <input 
        type="password" 
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Login </button>
    </div>
  )
}

export default Login