import React from 'react';

import './Header.css';

function Header(props) {
	const { userSelection, changeSelection, options } = props;
	return (
		<header className="header">
			<img src="/favicon.png" alt="logo"/>
			<h1>Yelp Vimcar</h1>
			<div className="search">
					{
						options.map( (opt) => {
							return <div className="opt" key={opt}>
								<input 
									id={opt} 
									type="radio" 
									name="selection" 
									checked={opt===userSelection} 
									value={opt}
									onChange={(e) => { changeSelection(e.target.value) }}
								/>
								<label name="selection" for={opt}>{opt}</label>
							</div>
						})
					}
			</div>
		</header>
	);
}

export default Header;
