import React, { useEffect } from 'react';
import './LoginPage.css'
import { Alert, Form, Image, InputGroup } from 'react-bootstrap';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
const apiUrl = import.meta.env.VITE_API_URI;

const userLoginApiRequest = async (email, password, donotlogout) => {
    const { data } = await axios.post(`${apiUrl}/api/users/login`,
        { email, password, donotlogout }, {
        withCredentials: true,
    })
    localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    return data
}

const LoginPage = () => {
    const dispatch = useDispatch()
    const [validated, setValidated] = useState(false);
    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target.elements
        const email = form.email.value
        const password = form.password.value

        if (e.currentTarget.checkValidity() === true && email && password) {
            setLoginUserResponseState({ loading: true })
            userLoginApiRequest(email, password)
                .then(res => {
                    setLoginUserResponseState({
                        success: res.success, loading: false, error: ""
                    })
                    // console.log(res)
                    if (res.success) {
                        dispatch(setRedxUserState(res.userLoggedIn))
                        navigate('/home', { replace: true })
                    }
                })
                .catch((err) => {
                    // console.log(err)
                    // console.log(err.response.data.message ? err.response.data.message : err.response.data)
                    setLoginUserResponseState({
                        error: err.response.data.message ? err.response.data.message : err.response.data
                    })
                })
            setValidated(true);
        }
    }


    const loginByGoogle = () => {
        window.open(`${apiUrl}/auth/google/callback`, "_self")
    }


    return (
        <div className='form_container my-5'>
            <Form className='login-form' noValidate validated={validated} onSubmit={handleSubmit} >
                <div className="title_container">
                    <p className="title text-light text-center">Login to your Account</p>
                    <span className="subtitle">
                        Get started with our app, just create an account and enjoy the experience.
                    </span>
                </div>
                <br />
                <div className="input_container">
                    <label className="input_label" htmlFor="email_field">
                        Email
                    </label>
                    <i className="ri-mail-add-line email-icon "></i>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup hasValidation>
                            <Form.Control
                                placeholder="name@mail.com"
                                title="Enter email"
                                name="email"
                                type="text"
                                className="input_field"
                                required />
                            <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                <div className="input_container">
                    <label className="input_label" htmlFor="password_field">
                        Password
                    </label>
                    <i className="ri-lock-password-line password-icon"></i>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <InputGroup hasValidation>
                            <Form.Control
                                placeholder="Password"
                                title="Enter password"
                                name="password"
                                type="password"
                                className="input_field"
                                required />
                            <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                {loginUserResponseState && (
                    <Alert className='mt-3' show={loginUserResponseState.error === "wrong credentials"} variant="danger">
                        Wrong Credentials
                    </Alert>
                )}
                <button title="Sign In" type="submit" className="sign-in_btn">
                    <span>Log In</span>
                </button>
            </Form >
            <span className='input_label text-center'>don't you have an account let's <Link to="/register">sign up</Link></span>
            {/* <div className="separator">
                <hr className="line" />
                <span>Or</span>
                <hr className="line" />
            </div>
            <span title="Sign In" type="submit" className="sign-in_ggl">
                <Image className='google-img' src="https://global-uploads.webflow.com/64009fedce03bf07c4d0898b/643fe82fc68a4c4c7f061498_Google__G__Logo.svg.png" fluid />
                <button className='google-button' onClick={loginByGoogle}>Sign In with Google</button>
            </span> */}
            <p className="note">Terms of use & Conditions</p>
        </div >
    )
};


export default LoginPage;
