import React, {useState} from "react";
import PropTypes from 'prop-types';
import {Dropdown, DropdownMenu, DropdownToggle,} from "reactstrap";

//i18n
import {withTranslation} from "react-i18next";
// Redux
import {connect} from "react-redux";
import withRouter from "components/Common/withRouter";

// users
import LocalStorageManager from "../../../helpers/localStorageManager";
import User from "../../../helpers/user";

const ProfileMenu = props => {
    const [menu, setMenu] = useState(false)
    const user = LocalStorageManager.get('user')

    return (
        <React.Fragment>
            <Dropdown
                isOpen={menu}
                toggle={() => setMenu(!menu)}
                className="d-inline-block"
            >
                <DropdownToggle
                    className="btn header-item d-flex align-items-center"
                    id="page-header-user-dropdown"
                    tag="button"
                >
                        <span className="rounded-circle header-profile-user p-2">
                  {User.getFirstChars(user)}
                </span>
                    <span className="d-none d-xl-inline-block ms-2 me-1">
                        <span>{user?.name}</span>
                        <small className="d-block">{user?.position_name}</small>
                    </span>
                    <i className="mdi mdi-chevron-down d-none d-xl-inline-block"/>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    {/*<DropdownItem tag={Link} to="/profile">*/}
                    {/*    {" "}*/}
                    {/*    <i className="bx bx-user font-size-16 align-middle me-1"/>*/}
                    {/*    {props.t("Profile")}{" "}*/}
                    {/*</DropdownItem>*/}
                    {/*<DropdownItem tag="a" href="auth-lock-screen">*/}
                    {/*  <i className="bx bx-lock-open font-size-16 align-middle me-1" />*/}
                    {/*  {props.t("Lock screen")}*/}
                    {/*</DropdownItem>*/}
                    <div className="dropdown-divider"/>
                    <a onClick={() => {
                        localStorage.clear()
                        window.location.href = '/login'
                    }} className="dropdown-item">
                        <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
                        <span>{props.t("Çıxış et")}</span>
                    </a>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

ProfileMenu.propTypes = {
    success: PropTypes.any,
    t: PropTypes.any
};

const mapStatetoProps = state => {
    const {error, success} = state.Profile;
    return {error, success};
};

export default withRouter(
    connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
