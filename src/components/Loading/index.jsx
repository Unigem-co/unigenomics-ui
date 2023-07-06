import React from 'react'
import './Loading.scss';

const Loading = () => {
  return (
		<div className='loading-container'>
			<div className='loading-icon'>
				<i class='bi bi-arrow-clockwise'></i>
			</div>
			<span>Esto puede tardar unos segundos...</span>
		</div>
  );
}

export default Loading