import React from 'react';
import Search from '../Search';
import './Select.scss';
import { useState } from 'react';

const searchValue = (data, searchedValue) =>
	searchedValue ? data.filter(d => d.text.includes(searchedValue)) : data;

const Select = props => {
	const { value, options, onSelect, disabled } = props;
	const [showDropdown, setshowDropdown] = useState(false);
	const [searchedValue, setSearchedValue] = useState('');

	const searchedOptions = searchValue(options, searchedValue);

	const selectItem = option => {
		onSelect(option?.id);
		setshowDropdown(false);
		setSearchedValue('');
	};

	const onDropDown = () => {
		setshowDropdown(!showDropdown);
	};

	return (
		<div className={`select ${disabled && 'disabled'}`}>
			<div className={`select-display-value ${disabled && 'disabled'}`} onClick={onDropDown}>
				<span>{options.find(o => o.id === value)?.text}</span>
				{showDropdown ? (
					<i className='bi bi-caret-up-fill'></i>
				) : (
					<i className='bi bi-caret-down-fill'></i>
				)}
			</div>

			{showDropdown && (
				<div className='select-drop-down'>
					<Search
						placeholder='Buscar'
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
						}}
						onChange={event => setSearchedValue(event.target.value)}
					/>
					{searchedOptions?.map(o => (
						<span
							className={`select-option ${o?.id === value ? 'selected' : ''}`}
							onClick={() => selectItem(o)}
							key={o.text}
						>
							{o?.text}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

export default Select;
