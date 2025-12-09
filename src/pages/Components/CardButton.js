import PropTypes from "prop-types";
import React from "react";

const CardButton = ({ title, icon, callback=() => {} }) => {
    return (
        <button className="btn btn-success w-100" onClick={callback}><i className={icon}/>{" "}{title}</button>
    )
}

CardButton.propTypes = {
    title: PropTypes.any,
    icon: PropTypes.any,
    callback: PropTypes.any,
}

export default CardButton;