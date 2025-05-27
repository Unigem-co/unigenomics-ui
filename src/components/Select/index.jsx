import React from 'react';
import { createPortal } from 'react-dom';
import Search from '../Search';
import './Select.scss';
import { useState, useRef, useEffect } from 'react';

const searchValue = (data, searchedValue) =>
	searchedValue ? data.filter(d => d.text.includes(searchedValue)) : data;

const Select = props => {
	const { value, options = [], onSelect, disabled } = props;
	const [showDropdown, setshowDropdown] = useState(false);
	const [searchedValue, setSearchedValue] = useState('');
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
	const selectRef = useRef(null);

	const searchedOptions = searchValue(options, searchedValue);

	const selectItem = option => {
		if (onSelect && option?.id !== undefined) {
			onSelect(option.id);
		}
		setshowDropdown(false);
		setSearchedValue('');
	};

	const onDropDown = () => {
		if (!showDropdown && selectRef.current) {
			const rect = selectRef.current.getBoundingClientRect();
			const position = {
				top: Math.max(rect.bottom + 2, 0), // Ensure it's not negative
				left: Math.max(rect.left, 0), // Ensure it's not negative
				width: Math.max(rect.width, 100) // Ensure minimum width
			};
			setDropdownPosition(position);
			
			// Debug logging - remove in production
			console.log('Dropdown position:', position);
			console.log('Viewport size:', { width: window.innerWidth, height: window.innerHeight });
			console.log('Options count:', options.length);
			console.log('Searched options count:', searchedOptions.length);
		}
		setshowDropdown(!showDropdown);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setshowDropdown(false);
				setSearchedValue('');
			}
		};

		if (showDropdown) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDropdown]);

	return (
		<div className={`select ${disabled && 'disabled'}`} ref={selectRef}>
			<div className={`select-display-value ${disabled && 'disabled'}`} onClick={onDropDown}>
				<span>{options.find(o => o.id === value)?.text}</span>
				{showDropdown ? (
					<i className='bi bi-caret-up-fill'></i>
				) : (
					<i className='bi bi-caret-down-fill'></i>
				)}
			</div>

			{showDropdown && createPortal(
				<div 
					className='select-drop-down'
					style={{
						top: `${dropdownPosition.top}px`,
						left: `${dropdownPosition.left}px`,
						width: `${dropdownPosition.width}px`,
						minHeight: '50px' // Debug: ensure it's visible
					}}
				>
					<Search
						placeholder='Buscar'
						onClick={event => {
							event.preventDefault();
							event.stopPropagation();
						}}
						onChange={event => setSearchedValue(event.target.value)}
					/>
					{searchedOptions && searchedOptions.length > 0 ? (
						searchedOptions.map(o => (
							<span
								className={`select-option ${o?.id === value ? 'selected' : ''}`}
								onClick={() => selectItem(o)}
								key={o.text || o.id}
							>
								{o?.text}
							</span>
						))
					) : (
						<span className="select-option" style={{ color: '#666', fontStyle: 'italic' }}>
							No hay opciones disponibles
						</span>
					)}
				</div>,
				document.body
			)}
		</div>
	);
};

export default Select;
