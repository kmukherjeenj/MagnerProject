import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Calculator from "./Calculator";
import Select2 from "react-select2-wrapper";
import listing from "../../data/listings.json";
import SELECT_DATA from "../../data/select.json";
import { Collapse } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { SET_SEARCH } from "../../redux/types";

const Shopsidebar = () => {
	const dispatch = useDispatch();
	const searchParam = useSelector((state) => state.search);
	const [status, setStatus] = useState("");
	const [location, setLocation] = useState("");
	const [type, setType] = useState("");
	const [price, setPrice] = useState("");

	const [open, setOpen] = useState(true);
	const [open2, setOpen2] = useState(true);
	const [open3, setOpen3] = useState(true);

	useEffect(() => {
		setStatus(searchParam.status);
		setLocation(searchParam.location);
		setType(searchParam.type);
		setPrice(searchParam.price);
	}, [searchParam]);

	const goSearch = () => {
		dispatch({
			type: SET_SEARCH,
			payload: {
				location,
				price,
				status,
				type,
			},
		});
	};

	return (
		<div className="sidebar sidebar-left">
			<div className="sidebar-widget">
				<div className="acr-collapse-trigger acr-custom-chevron-wrapper" onClick={() => setOpen((prev) => !prev)}>
					<h5>Filter Listings</h5>
					<div className="acr-custom-chevron">
						<span />
						<span />
					</div>
				</div>
				<Collapse in={open}>
					<div className="acr-collapsable">
						<div className="acr-filter-form">
							<form>
								<div className="acr-custom-select form-group">
									<label>Location: </label>
									<Select2
										value={location}
										onSelect={(e) => setLocation(e.target.value)}
										data={SELECT_DATA.locationlist}
										options={{
											placeholder: "Any Location",
										}}
									/>
								</div>
								<div className="acr-custom-select form-group">
									<label>Status: </label>
									<Select2
										value={status}
										onSelect={(e) => setStatus(e.target.value)}
										data={SELECT_DATA.statuslist}
										options={{
											placeholder: "Any Status",
										}}
									/>
								</div>
								<div className="acr-custom-select form-group">
									<label>Type: </label>
									<Select2
										value={type}
										onSelect={(e) => setType(e.target.value)}
										data={SELECT_DATA.typelist}
										options={{
											placeholder: "Any Type",
										}}
									/>
								</div>
								<div className="acr-custom-select form-group">
									<label>Price Range: </label>
									<Select2
										value={price}
										onSelect={(e) => setPrice(e.target.value)}
										data={SELECT_DATA.pricerangelist}
										options={{
											placeholder: "Any Range",
										}}
									/>
								</div>
								<button type="button" className="btn-block btn-custom" name="button" onClick={goSearch}>
									Apply filters
								</button>
							</form>
						</div>
					</div>
				</Collapse>
			</div>
			<div className="sidebar-widget">
				<div className="acr-collapse-trigger acr-custom-chevron-wrapper" onClick={() => setOpen2((prev) => !prev)}>
					<h5>Recent Listing</h5>
					<div className="acr-custom-chevron">
						<span />
						<span />
					</div>
				</div>
				<Collapse in={open2}>
					<div className="acr-collapsable">
						{/* Listing Start */}
						{listing
							.filter(function (item) {
								return item.recent === true;
							})
							.slice(0, 4)
							.map((item, i) => (
								<div key={i} className="listing listing-list">
									<div className="listing-thumbnail">
										<Link to="/listing-details-v1">
											<img src={process.env.PUBLIC_URL + "/" + item.gridimg} alt="listing" />
										</Link>
									</div>
									<div className="listing-body">
										<h6 className="listing-title">
											{" "}
											<Link to="/listing-details-v1" title={item.title}>
												{item.title}
											</Link>{" "}
										</h6>
										<span className="listing-price">
											{new Intl.NumberFormat().format(item.monthlyprice.toFixed(2))}$ <span>/month</span>{" "}
										</span>
									</div>
								</div>
							))}
						{/* Listing End */}
					</div>
				</Collapse>
			</div>
			<div className="sidebar-widget">
				<div className="acr-collapse-trigger acr-custom-chevron-wrapper" onClick={() => setOpen3((prev) => !prev)}>
					<h5>Mortgage Calculator</h5>
					<div className="acr-custom-chevron">
						<span />
						<span />
					</div>
				</div>
				<Collapse in={open3}>
					<div className="acr-collapsable">
						<Calculator />
					</div>
				</Collapse>
			</div>
		</div>
	);
};

export default Shopsidebar;
