import React, { Fragment, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import Footer from "../layouts/Footer";
import Content from "../sections/listinglist/Content";
import { useLocation } from "react-router-dom";

const Listinglist = () => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant",
		});
	}, [location]);

	return (
		<Fragment>
			<MetaTags>
				<title>Magner | Listing</title>
				<meta name="description" content="#" />
			</MetaTags>
			<Header />
			<Breadcrumb breadcrumb={{ pagename: "Listings" }} />
			<Content />
			<Footer />
		</Fragment>
	);
};

export default Listinglist;
