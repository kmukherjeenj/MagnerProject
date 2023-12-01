import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

class Menu extends Component {
	render() {
		return (
			<Fragment>
				{/* Logo */}
				<Link className="navbar-brand" to="/">
					{" "}
					<img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} alt="logo" />{" "}
				</Link>
				{/* Menu */}
				<ul className="navbar-nav">
					<li className="menu-item menu-item-has-children">
						<Link to="/">Home Page</Link>
					</li>
					<li className="menu-item menu-item-has-children">
						<Link to="/listings">Listings</Link>
					</li>
					<li className="menu-item menu-item-has-children">
						<Link to="/pricing">Pricing</Link>
					</li>
					<li className="menu-item menu-item-has-children">
						<Link to="/services">Services</Link>
					</li>
					<li className="menu-item menu-item-has-children">
						<Link to="/contact">Contact us</Link>
					</li>
				</ul>
			</Fragment>
		);
	}
}

export default Menu;
