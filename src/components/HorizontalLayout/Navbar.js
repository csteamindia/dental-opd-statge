import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import cookieHelper from "helpers/getCookieData";
import LiveTimer from "helpers/live_timer"
import { useLocation } from "react-router-dom";

const Navbar = props => {
  const [clinic, setClinic] = useState(false);
  const [role, setRole] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const showTimerRoutes = ["/appointment", "/chairs"];

  const shouldShowTimer = showTimerRoutes.includes(location.pathname);

  useEffect(() => {
    const authCookie = JSON.parse(cookieHelper.getCookie("authUser"));
    const role = localStorage.getItem("role");
    const clinicCookie = cookieHelper.getCookie("_c");

    if (authCookie) {
      try {
        setRole(role.toLowerCase());
      } catch (err) {
        console.error("Invalid authUser cookie:", err);
      }
    }

    if (clinicCookie && atob(clinicCookie) != "undefined") {
      try {
        const obj = JSON.parse(atob(clinicCookie));
        setClinic(obj);
        localStorage.setItem('clinic', obj.id);
        if (obj.client_id == authCookie.user.user_id) {
          setIsAdmin(!isAdmin)
        }
      } catch (err) {
        console.error("Invalid _c cookie:", err);
        setClinic(null);
      }
    }
  }, []);

  if (clinic === false) {
    return '';
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/dashboard"><i className="bx bx-home-circle me-2"></i>{props.t("Dashboard")} {props.menuOpen}</Link>
                </li> */}
                <li className="nav-item">
                  <Link to="/chairs" className="nav-link" > <i className="bx bx-table me-2"></i> {props.t("Chairs")}</Link>
                </li>
                <li className="nav-item">
                  <Link to="/appointment" className="nav-link" > <i className="bx bx-user-plus me-2"></i> {props.t("Appointment")}</Link>
                </li>
                {
                  (role == "admin" || role == "doctor" || role == "receptionist") &&
                  <li className="nav-item">
                    <Link to="/patients" className="nav-link"><i className="bx bx-user me-2"></i> {props.t("Patients")} </Link>
                  </li>
                }
                {/* <li className="nav-item">
                  <Link to="/accounts" className="nav-link dropdown-togglez arrow-none" > <i className="bx bx-calendar me-2"></i> {props.t("Accounts")}</Link>
                </li> */}
                {
                  (role == "admin" || role == "doctor") &&
                  <li className="nav-item">
                    <Link to="/reports" className="nav-link" > <i className="bx bx-layer me-2"></i> {props.t("Reports")}</Link>
                  </li>
                }
                {
                  (role == "admin" && isAdmin) &&
                  <li className="nav-item">
                    <Link to="/settings" className="nav-link" > <i className="bx bx-chip me-2"></i> {props.t("Settings")}</Link>
                  </li>
                }
              </ul>
            </Collapse>
            {/* {shouldShowTimer && <LiveTimer />} */}
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
