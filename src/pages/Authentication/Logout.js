import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { logoutUser } from "../../store/actions"

//redux
import { useSelector, useDispatch } from "react-redux"
import cookieHelper from "helpers/getCookieData"

const Logout = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

      // Set the cookie expiry to the past
      document.cookie = name + 
        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    dispatch(logoutUser(props.history))
  }, [dispatch])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
