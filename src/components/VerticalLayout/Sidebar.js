import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";
import withRouter from "components/Common/withRouter";

//i18n
import {withTranslation} from "react-i18next";
import SidebarContent from "./SidebarContent";

const Sidebar = props => {
    return (
        <React.Fragment>
            <div className="vertical-menu">
                <div className="navbar-brand-box bg-white">
                    <a href="#" className="logo logo-light text-dark" style={{fontSize: '20px'}}>
                        {process.env.REACT_APP_COMPANY_NAME}
                    </a>
                </div>
                <div data-simplebar className="h-100">
                    {props.type !== "condensed" ? <SidebarContent/> : <SidebarContent/>}
                </div>
                <div className="sidebar-background"></div>
            </div>
        </React.Fragment>
    );
};

Sidebar.propTypes = {
    type: PropTypes.string,
};

const mapStatetoProps = state => {
    return {
        layout: state.Layout,
    };
};
export default connect(
    mapStatetoProps,
    {}
)(withRouter(withTranslation()(Sidebar)));
