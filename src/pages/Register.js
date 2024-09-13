import React, { useState } from 'react';
import "../App.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Register() {
    let navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState("");  // State for error messages

    const initialValues = {
        username: "",
        password: "",
    };
    
    const onSubmit = (data) => {
        axios.post("https://react-practice-a75bfd5abb62.herokuapp.com/auth", data)
        .then(() => {
            console.log("data");
            navigate("/login"); // Redirect to login page after successful registration
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error); // Set the error message from the backend
            } else {
                setErrorMessage("An error occurred. Please try again."); // Generic error message
            }
        });
    };  
    
    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    return (
        <div className="createPostPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegister"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegister"
                        name="password"
                        type="password"
                        placeholder="password"
                    />

                    <button type="submit"> Register</button>
                    
                    {/* Display the error message if it exists */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </Form>
            </Formik>
        </div>
    );
}

export default Register;
