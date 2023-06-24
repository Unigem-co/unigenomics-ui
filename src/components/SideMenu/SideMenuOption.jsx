import React from 'react'
import { Link } from 'react-router-dom';
import './SideMenuOption.scss';

const SideMenuOption = (props) => {
  const { name, link, icon } = props;
  return (
        <div className="side-menu-option">
            <div className="side-menu-option-description">
                <i className={icon} />
                <Link to={link}>{name}</Link>
            </div>
            <div className="side-menu-separator"></div>
        </div>
  )
}

export default SideMenuOption