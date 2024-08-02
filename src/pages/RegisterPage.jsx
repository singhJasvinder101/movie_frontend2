import React, { useState } from 'react';
import './RegisterPage.css';
import { Alert, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const apiUrl = import.meta.env.VITE_API_URI;

const userRegisterApiRequest = async (name, lastname, email, password) => {
    const { data } = await axios.post(`${apiUrl}/api/users/register`,
        { name, lastname, email, password },
        { withCredentials: true }
    );
    localStorage.setItem('userInfo', JSON.stringify(data.userCreated));
    return data;
};

const schema = yup.object().shape({
    name: yup.string().required('First name is required').min(4, 'Password must be at least 8 characters'),
    lastname: yup.string().required('Last name is required').min(4, 'Password must be at least 8 characters'),
    email: yup.string().email('Please enter a valid email address').required('Email is required'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
});

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: '',
        error: '',
        loading: false,
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoginUserResponseState({ loading: true });
        try {
            const res = await userRegisterApiRequest(data.name, data.lastname, data.email, data.password);
            setLoginUserResponseState({ success: res.success, loading: false, error: '' });
            if (res.success) {
                dispatch(setRedxUserState(res.userCreated));
                navigate('/home');
            }
        } catch (err) {
            setLoginUserResponseState({
                error: err.response?.data || 'An error occurred',
                loading: false,
            });
        }
    };

    return (
        <div className='form_container mainPage my-2'>
            <Form className='register-form' noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="title_container">
                    <p className="title text-light">Create an Account</p>
                    <span className="subtitle">
                        Get started with our app, just fill in your information to sign up.
                    </span>
                </div>
                <div className="top-container d-flex mt-4">
                    <div className="input_container">
                        <label className="input_label" htmlFor="name_field">First Name</label>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="First name"
                                    type="text"
                                    className="input_field user-name"
                                    {...register('name')}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className="input_container">
                        <label className="input_label" htmlFor="lastname_field">Last Name</label>
                        <Form.Group className="mb-3" controlId="formBasicLastname">
                            <InputGroup hasValidation>
                                <Form.Control
                                    placeholder="Last name"
                                    type="text"
                                    className="input_field user-lastname"
                                    {...register('lastname')}
                                    isInvalid={!!errors.lastname}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastname?.message}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </div>
                </div>
                <div className="input_container">
                    <label className="input_label" htmlFor="email_field">Email</label>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup hasValidation>
                            <Form.Control
                                placeholder="name@mail.com"
                                type="text"
                                className="input_field"
                                {...register('email')}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                <div className="input_container">
                    <label className="input_label" htmlFor="password_field">Password</label>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <InputGroup hasValidation>
                            <Form.Control
                                placeholder="Password"
                                type="password"
                                className="input_field"
                                {...register('password')}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </div>
                {loginUserResponseState.error && (
                    <Alert className='mt-3' variant="danger">
                        {loginUserResponseState.error}
                    </Alert>
                )}
                <button title="Sign Up" type="submit" className="button">
                    <span>Sign Up</span>
                </button>
            </Form>
            <span className='input_label text-center'>
                Already have an account? <Link to="/login">Log in</Link>
            </span>
            <p className="note">Terms of use & Conditions</p>
        </div>
    );
};

export default RegisterPage;
