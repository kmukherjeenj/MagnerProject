import React, { useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";

const Spinner = ({ show }) => {
	useEffect(() => {
		if (show) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [show]);

	return (
		<div
			style={{
				zIndex: 10000,
				width: "100%",
				height: "100vh",
				position: "fixed",
				background: "#00000070",
				display: show ? "flex" : "none",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<HashLoader size={90} color="#1FC8BE" loading />
		</div>
	);
};

export default Spinner;
