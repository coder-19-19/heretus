import PropTypes from 'prop-types';
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import {layoutTypes} from "./constants/layout";
import {authProtectedRoutes, publicRoutes} from "./routes";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Authmiddleware from "./routes/route";
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import "./assets/scss/theme.scss";
import "flatpickr/dist/themes/material_blue.css";
import './index.scss'
import Auth from "./api/auth";
import LocalStorageManager from "./helpers/localStorageManager";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);


const getLayout = (layoutType) => {
    let Layout = VerticalLayout;
    switch (layoutType) {
        case layoutTypes.VERTICAL:
            Layout = VerticalLayout;
            break;
        case layoutTypes.HORIZONTAL:
            Layout = HorizontalLayout;
            break;
        default:
            break;
    }
    return Layout;
};

const App = () => {

    const {layoutType} = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
    }));

    const Layout = getLayout(layoutType);

    const auth = async () => {
        const {data} = await Auth.auth()
        LocalStorageManager.set('user', data?.user)
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            auth()
        }
    }, []);

    return (
        <React.Fragment>
            <ToastContainer autoClose={1000} hideProgressBar={true}/>
            <Routes>
                {publicRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <NonAuthLayout>
                                {route.component}
                            </NonAuthLayout>
                        }
                        key={idx}
                        exact={true}
                    />
                ))}

                {authProtectedRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <Authmiddleware route={route}>
                                <Layout>{route.component}</Layout>
                            </Authmiddleware>}
                        key={idx}
                        exact={true}
                    />
                ))}
            </Routes>
        </React.Fragment>
    );
};

App.propTypes = {
    layout: PropTypes.any
};

export default App;
