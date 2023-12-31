import React, { Component, Fragment } from "react";
import MetaTags from "react-meta-tags";
import Header from "../layouts/Header";
import Content from "../sections/listingmap/Content";

class Listingmap extends Component {
	render() {
		return (
			<Fragment>
				<MetaTags>
					<title>Magner | Listing Map</title>
					<meta name="description" content="#" />
				</MetaTags>
				<Header />
				<Content />
			</Fragment>
		);
	}
}

export default Listingmap;
