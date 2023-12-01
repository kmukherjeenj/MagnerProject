import React, { Component, Fragment } from "react";
import MetaTags from "react-meta-tags";
import Header from "../layouts/Header1";
import Content from "../sections/register/Content";

class Register extends Component {
	render() {
		return (
			<Fragment>
				<MetaTags>
					<title>Magner | Register</title>
					<meta name="description" content="#" />
				</MetaTags>
				<Header />
				<Content />
			</Fragment>
		);
	}
}

export default Register;
