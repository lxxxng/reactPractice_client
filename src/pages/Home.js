import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import "../App.css"
import { useNavigate, Link } from 'react-router-dom';  // useNavigate instead of useHistory
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { AuthState } = useContext(AuthContext);
  let navigate = useNavigate();  

  useEffect(() => {

    if(!localStorage.getItem("accessToken")){
      navigate("/login");
    } 
    else
    {
      axios.get(
        "http://localhost:3001/posts", 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      ).then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId;
        }));
      });
    }
  }, []);

  const likeAPost = (PostId) => {
    axios.post(
      "http://localhost:3001/likes", 
      { PostId: PostId }, 
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === PostId) {
          if (response.data.liked) {
            return { ...post, Likes: [...post.Likes, 0], isLikedByCurrentUser: true };
          } else {
            const likesArray = post.Likes;
            likesArray.pop();
            return { ...post, Likes: likesArray, isLikedByCurrentUser: false };
          }
        } else {
          return post;
        }
      }));

      if(likedPosts.includes(PostId))
      {
        setLikedPosts(
          likedPosts.filter((id) => {
          return id != PostId;
        }));
      }
      else
      {
        setLikedPosts([...likedPosts, PostId]);
      }
    });
  };
  
  return (
    <div>
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
            <div className="footer"> 
              <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              <ThumbUpIcon 
                onClick={() => { likeAPost(value.id); } }
                style={{
                  color: likedPosts.includes(value.id) ? "blue" : "gray" 
                }}
              />
              {likedPosts.includes(value.id) ? "Unlike" : "Like"}  


              
              <label>{value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
