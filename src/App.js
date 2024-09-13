import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './pages/Home'; 
import CreatePost from './pages/CreatePost'; 
import Post from './pages/Post'; 
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import { AuthContext } from './helpers/AuthContext';
import {useState, useEffect} from "react";
import axios from 'axios';

function App() {
  const [AuthState, setAuthState] = useState({
      username:"", 
      id: 0, 
      status:false
  });

  // so that when you close the webpage, if token still there can still access
  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {headers: {
        accessToken: localStorage.getItem("accessToken"), },
      })
        .then((response) => {
          if(response.data.error){
            setAuthState({...AuthState, status : false});
          }
          else{
            setAuthState({
              username: response.data.username,
              id: 0 ,
              status: true
            });
          }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{AuthState, setAuthState}}>
        <Router>
          <div className="navbar">
            {!AuthState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ): (
              <>
                <Link to="/createpost">Create a post</Link>
                <Link to="/">Home Page</Link>
                <button onClick={logout}> Logout </button>
              </>
            )}

            <h1> {AuthState.username} </h1>
            
          </div>
          <Routes>
            <Route path="/" element={< Home />} /> 
            <Route path="/createpost" element={< CreatePost />} /> 
            <Route path="/post/:id" element={< Post />} /> 
            <Route path="/login" element={< Login />} /> 
            <Route path="/register" element={< Register />} /> 
            <Route path="/ChangePassword" element={< ChangePassword />} /> 
            <Route path="/profile/:id" element={< Profile />} /> 
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;


