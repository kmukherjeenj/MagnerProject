import React, { useState } from "react";
import SELECT_DATA from "../../../data/select.json";
import Select2 from "react-select2-wrapper";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_SEARCH } from "../../../redux/types";

const Banner = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [location, setLocation] = useState("");
	const [type, setType] = useState("");
	const [price, setPrice] = useState("");

	const goSearch = () => {
		dispatch({
			type: SET_SEARCH,
			payload: {
				location,
				type,
				price,
				status: "",
			},
		});
		navigate("/listings");
	};

	return (
		<div className="banner banner-1 bg-cover bg-center" style={{ backgroundImage: "url(" + process.env.PUBLIC_URL + "/assets/img/banner/15.jpg )" }}>
			<div className="container">
				<div className="banner-item">
					<div className="banner-inner">
						<div className="banner-text">
							<h1 className="title">Real Estate Agents Near You</h1>
							<p className="subtitle">Thousands of people have their flats up for grabs. Don't miss your chance to grab your own house today.</p>
						</div>
						<div className="acr-filter-form">
							<form method="post">
								<div className="row">
									<div className="col-lg-3 col-md-6">
										<div className="form-group acr-custom-select">
											<label>Location: </label>
											<Select2
												value={location}
												data={SELECT_DATA.locationlist}
												onSelect={(e) => setLocation(e.target.value)}
												options={{
													placeholder: "Any Location",
												}}
											/>
										</div>
									</div>
									<div className="col-lg-3 col-md-6">
										<div className="form-group acr-custom-select">
											<label>Type: </label>
											<Select2
												value={type}
												data={SELECT_DATA.typelist}
												onSelect={(e) => setType(e.target.value)}
												options={{
													placeholder: "Any Type",
												}}
											/>
										</div>
									</div>
									<div className="col-lg-4 col-md-6">
										<div className="form-group acr-custom-select">
											<label>Price Range: </label>
											<Select2
												value={price}
												data={SELECT_DATA.pricerangelist}
												onSelect={(e) => setPrice(e.target.value)}
												options={{
													placeholder: "Any Range",
												}}
											/>
										</div>
									</div>
									<div className="col-lg-2 col-md-6">
										<div className="form-group">
											<button type="button" className="btn-custom btn-block" onClick={goSearch}>
												Search listings
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Banner;
