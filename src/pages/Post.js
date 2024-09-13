import '../App.css';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'; 
import { useNavigate } from 'react-router-dom';

function Post() {
    let { id } = useParams();
    let navigate = useNavigate(); 
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { AuthState } = useContext(AuthContext); 

    useEffect(() => {
        axios.get(`https://react-practice-a75bfd5abb62.herokuapp.com/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`https://react-practice-a75bfd5abb62.herokuapp.com/comments/${id}`).then((response) => {
            setComments(response.data);
        });

    }, []);

    const addComment = () => {
        axios.post("https://react-practice-a75bfd5abb62.herokuapp.com/comments", 
            {
                commentBody: newComment, 
                PostId: id
            },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            })
            .then((res) => {
                if(res.data.error)
                {
                    alert(res.data.error);
                }
                else{
                    const commentToAdd = {commentBody: newComment, username: res.data.username};
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
                
        })
    }

    const deleteComment = (id) => {
        axios.delete(`https://react-practice-a75bfd5abb62.herokuapp.com/comments/${id}`, {
                headers: {accessToken: localStorage.getItem('accessToken')},
            }).then(() => {
                setComments(comments.filter((value) => {
                    return  value.id != id;
                }));
            });

    };

    const deletePost = (id) => {
        axios.delete(
            `https://react-practice-a75bfd5abb62.herokuapp.com/posts/${id}`, 
            {headers: {accessToken: localStorage.getItem('accessToken')}},
        ).then(() => 
        {
            navigate("/");
        });
    }

    const editPost = (option) => {
        if (option === "title"){
            let newTitle = prompt("enter new title");
            axios.put(
                "https://react-practice-a75bfd5abb62.herokuapp.com/posts/title", 

                // id comes from params
                {newTitle: newTitle, id:id},  
                {headers: {accessToken: localStorage.getItem("accessToken")}}
            );

            // refresh on change
            setPostObject({...postObject, title: newTitle});
        }else{
            let newPostText = prompt("enter new body");
            axios.put(
                "https://react-practice-a75bfd5abb62.herokuapp.com/posts/postText", 

                // id comes from params
                {newPostText: newPostText, id:id},
                {headers: {accessToken: localStorage.getItem("accessToken")}}
            );

            // refresh on change
            setPostObject({...postObject, postText: newPostText});
        }
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="title" onClick={() => {
                    if(AuthState.username === postObject.username){
                        editPost("title");  
                    }
                }}>
                    {postObject.title}
                </div>
                <div className="body"  onClick={() => {
                    if(AuthState.username === postObject.username){
                         editPost("body");
                    }
                }}>
                    {postObject.postText}
                </div>
                <div className="footer">{postObject.username}
                    {AuthState.username === postObject.username && 
                    (<button onClick={() => {deletePost(postObject.id)}}>Delete Post</button>)}
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input type="text" placeholder="comment..."  
                        onChange={(event) => {setNewComment(event.target.value)}}
                        value={newComment}
                    />
                    <button onClick={addComment}> Add comment </button>
                </div>
                <div className="listOfComments"></div>
                {comments.map((comment) => {
                    return (
                        <div>
                            <div className="comment">{comment.commentBody}</div>
                            <label> username: {comment.username} </label>
                            {AuthState.username === comment.username && (
                                <div>
                                    <button onClick={ () => {
                                        deleteComment(comment.id);
                                    }}>
                                        Delete</button>
                                </div>
                                )}
                        </div>
                    )
                })}
            </div>
        </div>
  );
}

export default Post 