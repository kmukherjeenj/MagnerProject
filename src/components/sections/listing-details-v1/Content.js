import React, { Fragment, useEffect } from "react";
import Banner from "./Banner";
import Listingwrapper from "./Listingwrapper";
import { useLocation } from "react-router-dom";

const Content = () => {
	const location = useLocation();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant",
		});
	}, [location]);

	return (
		<Fragment>
			<Banner />
			<Listingwrapper />
		</Fragment>
	);
};

export default Content;
