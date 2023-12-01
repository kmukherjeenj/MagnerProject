import React, { Fragment, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Header from "../layouts/Header";
import Breadcrumb from "../layouts/Breadcrumb";
import Footer from "../layouts/Footer";
import Content from "../sections/listinggrid/Content";
import { useLocation } from "react-router-dom";

const Listinggrid = () => {
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
				<title>Magner | Listings</title>
				<meta name="description" content="#" />
			</MetaTags>
			<Header />
			<Breadcrumb breadcrumb={{ pagename: "Listings" }} />
			<Content />
			<Footer />
		</Fragment>
	);
};

export default Listinggrid;
