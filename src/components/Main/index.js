import React from 'react';

import './Main.css';

const COORDS = {
	'Europe/Berlin': {lat: 52.518611, lng: 13.408333}
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			businesses: [],
			loading: false
		};
	}

	componentDidMount() {
		this.updateRestaurants();
		this.mapsApiLoaded = window.setTimeout(this.checkMapsApi.bind(this), 200);
	}

	componentDidUpdate(prevProps) {
		if(this.props.userSelection !== prevProps.userSelection) {
			this.updateRestaurants();
		}
	}

	fetchRestaurants = async () => {
		const query = {
			limit: 50,
			location: "Berlin, Germany",
			term: "restaurants"
		}
		if (this.props.userSelection != null) {
			query.term = `${this.props.userSelection} restaurants`;
		}
		const urlParams = new URLSearchParams(query);
		this.setState({
			loading: true
		});
		const response = await fetch(`/-/search?${urlParams}`);
		const body = await response.json();
		this.setState({
			loading: false
		});
		if (response.status !== 200) {
			throw Error(body.message);
		}
		return body;
	}

	updateRestaurants() {
		this.fetchRestaurants()
			.then(res => this.setState({ businesses: res.businesses || [] }, this.updateMap()))
			.catch(err => console.log(err));
	}

	checkMapsApi() {
		if (window.google && window.google.maps) {
			window.clearTimeout(this.mapsApiLoaded);
			this.initMap();
		}
	}

	initMap() {
		const mapEl = document.getElementById('places-map');
		if (mapEl && !this.mapInstance) {
			this.mapInstance = new window.google.maps.Map(mapEl, {
				center: COORDS['Europe/Berlin'],
				zoom: 8
			  });
			this.markers = [];
		}
	}

	updateMap() {
		this.markers.forEach( (marker) => {
			marker.setMap(null);
		})
		const bounds = new window.google.maps.LatLngBounds();
		this.markers = this.state.businesses.map( (business) => {
			const {latitude, longitude} = business.coordinates;
			let newMarker = new window.google.maps.Marker({
				position: new window.google.maps.LatLng(latitude, longitude),
				map: this.mapInstance
			});
			bounds.extend(newMarker.getPosition());
			return newMarker;
		});
		if (this.markers.length > 0)
			this.mapInstance.fitBounds(bounds);
		
	}

	render() {
		return (
			<main>
			{
				this.state.loading && <LoadingScreen/>
			}
				<div id='places-map' className='places-map'></div>
				{this.state.businesses.map(business => {
					return <BusinessBlock business={business} key={business.id} />
				})}
			</main>
		);
	}
}

function LoadingScreen(props) {
	return <div className="loading">Loading...</div>
}

function BusinessBlock(props) {
	const {business} = props;
	return (<div className="card">
		<img src={business.image_url} alt={business.name} />
		<div className="container">
			<h4><a href={business.url}>{business.name}</a></h4>
			{
				business.location &&
				business.location.display_address &&
				(
					<p>
						{business.location.display_address[0]}
						<br />
						{business.location.display_address[1]}
					</p>
				)
			}
			<p>{business.display_phone}</p>
		</div>
	</div>)
}
export default Main;
