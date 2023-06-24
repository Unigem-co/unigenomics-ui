import React from 'react'
import './Search.scss';

const Search = (props) => {
  const {
    placeholder,
    onChange,
  } = props;
  return (
    <div className="search-input">
        <i className="bi bi-search"></i>
        <input onChange={onChange} placeholder={placeholder}/>
    </div>
  )
}

export default Search