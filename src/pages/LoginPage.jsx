import React, { useEffect } from 'react';
import './LoginPage.css'
import { Alert, Form, Image, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URI;

const userLoginApiRequest = async (email, password, donotlogout) => {
    const { data } = await axios.post(`${apiUrl}/api/users/login`,
        { email, password, donotlogout }, {
        withCredentials: true,
    })
    localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    return data
}

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
});

const LoginPage = () => {
    const dispatch = useDispatch();
    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoginUserResponseState({ loading: true });
        try {
            const res = await userLoginApiRequest(data.email, data.password);
            setLoginUserResponseState({ success: res.success, loading: false, error: "" });
            if (res.success) {
                dispatch(setRedxUserState(res.userLoggedIn));
                navigate('/home', { replace: true });
            }
        } catch (err) {
            setLoginUserResponseState({
                error: err.response.data.message ? err.response.data.message : err.response.data,
                loading: false,
            });
        }
    };

    const loginByGoogle = () => {
        window.open(`${apiUrl}/auth/google/callback`, "_self");
    };

    return (
        <div className='form_container mainPage my-5'>
            <Form className='login-form' noValidate onSubmit={handleSubmit(onSubmit)} >
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
                                {...register('email')}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
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
                                {...register('password')}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                {loginUserResponseState && (
                    <Alert className='mt-3' show={loginUserResponseState.error === "wrong credentials"} variant="danger">
                        Wrong Credentials
                    </Alert>
                )}
                <button title="Sign In" type="submit" className="button ">
                    <span>Log In</span>
                </button>
            </Form >
            <span className='input_label text-center'>don't you have an account let's <Link to="/register">sign up</Link></span>
            <p className="note">Terms of use & Conditions</p>
        </div >
    );
};

export default LoginPage;
