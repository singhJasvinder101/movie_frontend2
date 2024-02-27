import React, { useEffect } from 'react';
import './LoginPage.css'
import { Alert, Form, Image, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
const apiUrl = import.meta.env.VITE_API_URI;
const userRegisterApiRequest = async (name, lastname, email, password) => {
    const { data } = await axios.post(`${apiUrl}/api/users/register`,
        { name, lastname, email, password }, {
        withCredentials: true,
    })
    localStorage.setItem("userInfo", JSON.stringify(data.userCreated))
    return data
}

const RegisterPage = () => {
    const [validated, setValidated] = useState(false);
    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target.elements
        const name = form.name.value
        const lastname = form.lastname.value
        const email = form.email.value
        const password = form.password.value

        if (e.currentTarget.checkValidity() === true && name && lastname && email && password) {
            setLoginUserResponseState({ loading: true })
            userRegisterApiRequest(name, lastname, email, password)
                .then(res => {
                    setLoginUserResponseState({
                        success: res.success, loading: false, error: ""
                    })
                    // console.log(res)
                    if (res.success) {
                        dispatch(setRedxUserState(res.userCreated))
                        window.location.assign('/home')
                    }
                })
                .catch((err) => {
                    console.log(err)
                    // console.log(err.response.data.message ? err.response.data.message : err.response.data)
                    setLoginUserResponseState({
                        error: err.response.data.message ? err.response.data.message : err.response.data
                    })
                })
        }
        setValidated(true);
    }

    const loginByGoogle = () => {
        window.open(`${apiUrl}/auth/google/callback`, "_self")
    }


    return (
        <div className='form_container mainPage my-2'>
            <Form className='register-form' noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="title_container">
                    <p className="title text-light">Create an Account</p>
                    <span className="subtitle">
                        Get started with our app, just fill in your information to sign up.
                    </span>
                </div>
                <div className="top-container d-flex mt-4">
                    <div className="input_container">
                        <label className="input_label" htmlFor="name_field">
                            First Name
                        </label>
                        <Form.Group className="mb-3" controlId="formBasicname">
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="First name"
                                    title="Input first name"
                                    name="name"
                                    type="text"
                                    className="input_field user-name"
                                    required
                                    autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid name
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className="input_container">
                        <label className="input_label" htmlFor="lastname_field">
                            Last Name
                        </label>

                        <Form.Group className="mb-3" controlId="formBasiclastname">
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="Last name"
                                    title="Input last name"
                                    name="lastname"
                                    type="text"
                                    className="input_field user-lastname"
                                    required
                                    autoComplete="off"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a valid lastname
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </div>
                </div>
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
                                autoComplete="off"
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
                                minLength="8"
                                required
                                autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                                Password must be at least 8 characters long
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                {loginUserResponseState && (
                    <Alert className='mt-3' show={loginUserResponseState.error === "user already exists"} variant="danger">
                        User Already Exists
                    </Alert>
                )}
                <button title="Sign Up" type="submit" className="button">
                    <span>Sign Up</span>
                </button>
            </Form>
            <span className='input_label text-center'>
                Already have an account? <Link to="/login">Log in</Link>
            </span>
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
        </div>
    );
};

export default RegisterPage;