// import React, { useEffect, useState } from 'react'
// import axios from 'axios';
// import { Outlet, useNavigate } from 'react-router-dom';
// import LoginPage from '../pages/LoginPage';
// import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
// import { useDispatch } from 'react-redux';
// const apiUrl = import.meta.env.VITE_API_URI;

// const defaultToken = localStorage.getItem('userInfo')
// const ProtectedRouteComponent = ({ admin, isAuthenticated }) => {
//     const [isAuth, setIsAuth] = useState(defaultToken)
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(true);
//     const dispatch = useDispatch()

//     useEffect(() => {
//         const check_token = async () => {
//             try {
//                 const { data } = await axios.get(`${apiUrl}/api/get-token`, {
//                     withCredentials: true
//                 })
//                 if (data.token) {
//                     setIsAuth(data.token)
//                     dispatch(setRedxUserState(data.user))
//                 } else {
//                     setIsAuth(false)
//                 }
//             } catch (error) {
//                 console.log(error)
//                 setIsAuth(false)
//             } finally {
//                 setLoading(false);
//             }
//         }

//         setTimeout(() => {
//             check_token()
//         }, 1000);
//     }, [isAuth])

//     if (loading) {
//         return null;
//     }

//     if (isAuth === undefined) return <LoginPage />;
//     if (isAuth) {
//         return <Outlet />;
//     }
//     return navigate('/');

//     // const checkCookieToken = async () => {
//     //     try {
//     //         const { data } = await axios.get(`${apiUrl}/api/get-token`, {
//     //             withCredentials: true
//     //         })
//     //         console.log(data)
//     //         if (data.token) {
//     //             return data.token;
//     //         }
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         const token = await checkCookieToken();
//     //         const userInfo = JSON.parse(localStorage.getItem("userInfo"));

//     //         if (!userInfo || !token) {
//     //             navigate('/login');
//     //         } else {
//     //             setIsAuth(userInfo);
//     //             return <Outlet />
//     //         }
//     //     };

//     //     fetchData();
//     // }, [])

// }

// export default ProtectedRouteComponent
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

const ProtectedRouteComponent = () => {
    const [isAuth, setIsAuth] = useState(null); // Changed to null for initial state
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
