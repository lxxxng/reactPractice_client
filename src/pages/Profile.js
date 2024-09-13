import React, {useEffect, useState, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import "../App.css";
import { AuthContext } from '../helpers/AuthContext'; 

function Profile() {

    let {id} = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [listOfPosts, setlistOfPosts] = useState([]);
    const { AuthState } = useContext(AuthContext); 

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`)
        .then((response) => {
            setUsername(response.data.username);
        });

        axios.get(`http://localhost:3001/posts/byuserId/${id}`)
        .then((response) => {
            setlistOfPosts(response.data);
        });

    }, []);

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1> Username: {username} </h1>
                {AuthState.username === username && (
                    <button onClick={() => navigate("/ChangePassword")}> 
                        Change password 
                    </button>
                )}
                </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) => {
                    return (
                    <div 
                        className="post" 
                        key={key}  // Add a unique key for each post
                    >
                        <div className="title"> {value.title} </div>
                        <div className="body" onClick={() => { navigate(`/post/${value.id}`); }}> 
                        {value.postText} 
                        </div>
                        <div className="footer"> {value.username} 
                            <label style={{paddingLeft:100}}>{value.Likes.length}</label>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile