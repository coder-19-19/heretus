import React from "react";
import {Navigate} from "react-router-dom";
import LocalStorageManager from "../helpers/localStorageManager";
import {toast} from "react-toastify";
import NotFound from "../pages/NotFound";

const Authmiddleware = (props) => {
    const actions = LocalStorageManager.get('user')?.can
    const token = localStorage.getItem("token")
    if (!token) {
        return (
            <Navigate to={{pathname: "/login", state: {from: props.location}}}/>
        );
    }
    if (!actions) {
        toast.error('Sizin heç bir səlahiyyətiniz yoxdur')
        return <Navigate to={{pathname: "/login",}}/>

    }

    if (!actions?.[props.route.can] && props.route.path !== 'dashboard') {
        return <NotFound/>
    }

    return (<React.Fragment>
        {props.children}
    </React.Fragment>);
};

export default Authmiddleware;
