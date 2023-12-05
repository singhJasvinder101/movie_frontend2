import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';

const apiUrl = import.meta.env.VITE_API_URI;

const checkCookieToken = async () => {
    try {
        const { data } = await axios.get(`${apiUrl}/api/get-token`, {
            withCredentials: true
        });
        if (data.token) {
            return data.token;
        }
    } catch (error) {
        console.log(error);
    }
};

const ProtectedRouteComponent = ({ setIsToken }) => {
    const [isAuth, setIsAuth] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const token = await checkCookieToken();
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!userInfo || !token) {
                navigate('/login');
            } else {
                setIsAuth(userInfo);
                setIsToken(true)
                dispatch(setRedxUserState(userInfo));
            }
        };

        fetchData();
    }, [dispatch, navigate]);

    if (isAuth === null) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
};

export default ProtectedRouteComponent;
