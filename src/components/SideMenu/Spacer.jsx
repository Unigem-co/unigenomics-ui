import React from 'react'
import './Spacer.scss';

const Spacer = (props) => {
  const {
    text,
    children,
  } = props;
  return (
    <div className="side-menu-spacer">
        <span>{text}</span>
        <div className="side-menu-separator-children">
            {children}
        </div>
    </div>
  )
}

export default Spacer