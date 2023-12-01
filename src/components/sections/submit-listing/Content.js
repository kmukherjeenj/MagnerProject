import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { TYPES } from "../../../data/type";
import L from "leaflet";
import { MapContainer, TileLayer, Popup, Marker, useMapEvent } from "react-leaflet";
import { fromLatLng, setDefaults } from "react-geocode";
import { toast } from "react-toastify";
import { addListing } from "../../../api/listing";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../../api/upload";

setDefaults({
	key: "AIzaSyDLs8yb_ANP72I7nKNkiYd51P6zh_R5_4Q",
	language: "en",
});

const FEATURES = [
	{ id: 1, icon: "bone", title: "Pet Friendly" },
	{ id: 2, icon: "chair", title: "Furnished" },
	{ id: 3, icon: "fan", title: "Cooling" },
	{ id: 4, icon: "garage", title: "Parking" },
	{ id: 5, icon: "mailbox", title: "Mailbox" },
	{ id: 6, icon: "eye", title: "City View" },
];

const customMarker = L.icon({
	iconUrl: process.env.PUBLIC_URL + "/assets/img/misc/marker.png",
	iconSize: [34, 34],
});

function Content(props) {
	const dispatch = useDispatch();

	const [listType, setListType] = useState("Sales");
	const [currentStep, setCurrentStep] = useState(0);

	// Step 0
	const [buildingName, setBuildingName] = useState("");
	const [tenant, setTenant] = useState("Single");
	const [description, setDescription] = useState("");
	const [type, setType] = useState(null);
	const [subtype, setSubtype] = useState(null);
	const [types, setTypes] = useState([]);
	const [subtypes, setSubtypes] = useState([]);
	const [rentableSize, setRentableSize] = useState(null);
	const [useableSize, setUseableSize] = useState(null);
	const [annualPrice, setAnnualPrice] = useState(null);
	const [monthlyPrice, setMonthlyPrice] = useState(null);
	const [pricePerSqft, setPricePerSqft] = useState(null);
	const [dimensions, setDimensions] = useState("");
	const [frontage, setFrontage] = useState("");
	const [floor, setFloor] = useState("");
	const [listingType, setListingType] = useState("Direct");
	const [leaseStructure, setLeaseStructure] = useState("Modified Gross");
	const [leaseTerm, setLeaseTerm] = useState("");
	const [crossStreet, setCrossStreet] = useState("");
	const [zoning, setZoning] = useState("");

	// Step 1
	const [thumbnail, setThumbnail] = useState([]);
	const [gallery, setGallery] = useState([]);
	const [video, setVideo] = useState("");

	// Step 2
	const [currentPos, setCurrentPos] = useState(null);
	const [fullAddress, setFullAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");

	// Step 3
	const [features, setFeatures] = useState([]);

	// Step 4
	const [totalBuildingSize, setTotalBuildingSize] = useState(null);
	const [maxContiguoseSize, setMaxContiguoseSize] = useState(null);
	const [totalSpaceAvailable, setTotalSpaceAvailable] = useState(null);
	const [totalVacant, setTotalVacant] = useState(null);
	const [buildingFar, setBuildingFar] = useState("");
	const [elevator, setElevator] = useState("");
	const [lotSize, setLotSize] = useState(null);
	const [lotDimensions, setLotDimentions] = useState("");
	const [buildingClass, setBuildingClass] = useState("");
	const [floorLoad, setFloorLoad] = useState("");
	const [yearBuilt, setYearBuilt] = useState(null);
	const [ofFloors, setOfFloors] = useState("");
	const [taxes, setTaxes] = useState("");
	const [totalParkingSpaces, setTotalParkingSpaces] = useState("");

	// Step 5
	const [investmentTyper, setInvestmentTyper] = useState("Ground Up");
	const [occupancy, setOccupancy] = useState(null);
	const [netOperatingIncome, setNetOperatingIncome] = useState("");
	const [capRate, setCapRate] = useState("");
	const [proformaNoi, setProFormaNoi] = useState("");
	const [proformaCap, setProFormaCap] = useState("");
	const [investPricePerSqft, setInvestPricePerSqft] = useState(null);
	const [investPricePerUnit, setInvestPricePerUnit] = useState(null);
	const [investPricePerSf, setInvestPricePerSf] = useState(null);
	const [groundLease, setGroundLease] = useState("Yes");
	const [yearRemaining, setYearRemaining] = useState("");

	useEffect(() => {
		if (annualPrice) {
			setMonthlyPrice((annualPrice / 12).toFixed(2));
			if (rentableSize) {
				setPricePerSqft((annualPrice / rentableSize).toFixed(2));
			}
		} else {
			setMonthlyPrice(0);
		}
	}, [annualPrice, rentableSize]);

	useEffect(() => {
		window.scrollTo({
			top: 380,
			behavior: "smooth",
		});
	}, [currentStep]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setGallery(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	const getThumbProps = useDropzone({
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setThumbnail(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	useEffect(() => {
		if (currentPos) {
			fromLatLng(currentPos.lat, currentPos.lng)
				.then(({ results }) => {
					if (results && results.length > 0) {
						setFullAddress(results[0]?.formatted_address);
						const { city, state, country } = results[0]?.address_components.reduce((acc, component) => {
							if (component.types.includes("locality")) acc.city = component.long_name;
							else if (component.types.includes("administrative_area_level_1")) acc.state = component.long_name;
							else if (component.types.includes("country")) acc.country = component.long_name;
							return acc;
						}, {});
						setCity(city);
						setState(state);
						setCountry(country);
					}
				})
				.catch(console.error);
		}
	}, [currentPos]);

	useEffect(() => {
		setTypes(
			Object.keys(TYPES).map((item) => ({
				label: item,
				value: item,
			}))
		);
	}, []);

	useEffect(() => {
		if (type) {
			setSubtypes(
				TYPES[type.value].map((sub) => ({
					label: sub,
					value: sub,
				}))
			);
		} else {
			setSubtypes([]);
		}
	}, [type]);

	useEffect(() => {
		if (gallery) {
			gallery.forEach((file) => URL.revokeObjectURL(file.preview));
		}
	}, [gallery]);

	useEffect(() => {
		if (thumbnail) {
			thumbnail.forEach((file) => URL.revokeObjectURL(file.preview));
		}
	}, [thumbnail]);

	const MyMarker = (props) => {
		const map = useMapEvent({
			click(e) {
				map.locate();
				setCurrentPos(e.latlng);
				map.flyTo(e.latlng, map.getZoom());
			},
		});

		return currentPos === null ? null : (
			<Marker position={currentPos} icon={customMarker}>
				<Popup position={currentPos}>
					Current location: <pre>{JSON.stringify(currentPos, null, 2)}</pre>
				</Popup>
			</Marker>
		);
	};

	const onSubmit = () => {
		console.log(type, subtype);
		uploadFile(dispatch, [...gallery, thumbnail[0]])
			.then((res) => {
				const thumbnailRequest = res.filter((file) => file.name === thumbnail[0].name)[0].url;
				const galleryRequest = res.filter((file) => file.name !== thumbnail[0].name).map((item) => item.url);

				const data = {
					listType,
					name: buildingName,
					tenant,
					description,
					type: type.label,
					subtype: subtype.map((sub) => sub.label),
					rentableSize,
					useableSize,
					annualPrice,
					monthlyPrice,
					pricePerSqft,
					dimensions,
					frontage,
					floor,
					listingType,
					leaseStructure,
					leaseTerm,
					crossStreet,
					zoning,
					thumbnail: thumbnailRequest,
					gallery: galleryRequest,
					video,
					location: {
						fullAddress,
						city,
						state,
						country,
						latitude: currentPos.lat,
						longitude: currentPos.lng,
					},
					features,
					totalBuildingSize,
					maxContiguoseSize,
					totalSpaceAvailable,
					totalVacant,
					buildingFar,
					elevator,
					lotSize,
					lotDimensions,
					buildingClass,
					floorLoad,
					yearBuilt,
					ofFloors,
					taxes,
					totalParkingSpaces,
					investment:
						listType === "Sales"
							? {
									typer: investmentTyper,
									occupancy,
									netOperatingIncome,
									capRate,
									proformaCap,
									proformaNoi,
									investPricePerSqft,
									investPricePerUnit,
									investPricePerSf,
									groundLease,
									yearRemaining,
							  }
							: null,
				};
				addListing(dispatch, data)
					.then((res) => {
						setCurrentStep(0);
						setBuildingName("");
						setDescription("");
						setType(null);
						setSubtype(null);
						setRentableSize(null);
						setUseableSize(null);
						setAnnualPrice(null);
						setMonthlyPrice(null);
						setPricePerSqft(null);
						setDimensions("");
						setFrontage("");
						setFloor("");
						setLeaseTerm("");
						setCrossStreet("");
						setZoning("");
						setThumbnail([]);
						setGallery([]);
						setVideo("");
						setCurrentPos(null);
						setFullAddress("");
						setCity("");
						setState("");
						setCountry("");
						setFeatures([]);
						setTotalBuildingSize(null);
						setMaxContiguoseSize(null);
						setTotalSpaceAvailable(null);
						setTotalVacant(null);
						setBuildingFar("");
						setElevator("");
						setLotSize(null);
						setLotDimentions("");
						setBuildingClass("");
						setFloorLoad("");
						setYearBuilt(null);
						setOfFloors("");
						setTaxes("");
						setTotalParkingSpaces("");
						setOccupancy(null);
						setNetOperatingIncome("");
						setCapRate("");
						setProFormaNoi("");
						setProFormaCap("");
						setInvestPricePerSf(null);
						setInvestPricePerSqft(null);
						setInvestPricePerUnit(null);
						setYearRemaining("");
					})
					.catch((err) => {
						toast(err, { type: "error" });
					});
			})
			.catch((err) => {
				toast(err, { type: "error" });
			});
	};

	const thumbs = thumbnail.map((file) => (
		<div className="thumb" key={file.name}>
			<div className="thumbInner">
				<img src={file.preview} alt="img" />
			</div>
		</div>
	));

	const galleryPreview = gallery.map((file) => (
		<div className="thumb" key={file.name}>
			<div className="thumbInner">
				<img src={file.preview} alt="img" />
			</div>
		</div>
	));

	return (
		<div className="section">
			<div className="container">
				<Tab.Container defaultActiveKey="Sales">
					<Nav
						justify
						variant="tabs"
						onSelect={(tab) => {
							setListType(tab);
							setCurrentStep(0);
						}}
					>
						<Nav.Item>
							<Nav.Link eventKey="Sales">Sales</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="Lease">Lease</Nav.Link>
						</Nav.Item>
					</Nav>
					<Tab.Content>
						<Tab.Pane eventKey="Sales">
							<div className="row">
								<Tab.Container defaultActiveKey={0} activeKey={currentStep}>
									{/* Tabs Start */}
									<div className="col-md-4">
										<Nav variant="tabs" className="nav nav-tabs tab-cards">
											<Nav.Item>
												<Nav.Link eventKey={0} disabled={currentStep !== 0}>
													<span>01</span> Basic Information
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={1} disabled={currentStep !== 1}>
													<span>02</span> Gallery
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={2} disabled={currentStep !== 2}>
													<span>03</span> Location
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={3} disabled={currentStep !== 3}>
													<span>04</span> Features
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={4} disabled={currentStep !== 4}>
													<span>05</span> Details
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={5} disabled={currentStep !== 5}>
													<span>06</span> Investment
												</Nav.Link>
											</Nav.Item>
										</Nav>
									</div>
									{/* Tabs End */}
									{/* Tab Content Start */}
									<div className="col-md-8">
										<form>
											<Tab.Content className="m-0">
												<Tab.Pane eventKey={0}>
													<div className="row">
														<div className="col-md-6 form-group">
															<label>Building Name</label>
															<input
																type="text"
																className="form-control"
																value={buildingName}
																onChange={(e) => setBuildingName(e.target.value)}
																placeholder="Building Name"
																name="Building Name"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Tenant Type</label>
															<select className="form-control" name="status" onChange={(e) => setTenant(e.target.value)}>
																<option value={"Single"}>Single</option>
																<option value={"Multi"}>Multi</option>
															</select>
														</div>
														<div className="col-md-12 form-group">
															<label>Property Description</label>
															<textarea
																name="Property Description"
																rows={4}
																value={description}
																onChange={(e) => setDescription(e.target.value)}
																className="form-control"
																placeholder="Property Description"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Property Type</label>
															<Select options={types} value={type} onChange={setType} />
														</div>
														<div className="col-md-6 form-group">
															<label>Property Subtype</label>
															<Select isMulti options={subtypes} value={subtype} onChange={setSubtype} />
														</div>
														<div className="col-md-6">
															<label>Rentable Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={rentableSize}
																	onChange={(e) => setRentableSize(e.target.value)}
																	className="form-control"
																	name="Rentable Size"
																	placeholder="Rentable Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Useable Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={useableSize}
																	onChange={(e) => setUseableSize(e.target.value)}
																	className="form-control"
																	name="Useable Size"
																	placeholder="Useable Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Annual Price</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={annualPrice}
																	onChange={(e) => setAnnualPrice(e.target.value)}
																	className="form-control"
																	name="Annual Price"
																	placeholder="Annual Price"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Monthly Price</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={monthlyPrice}
																	onChange={(e) => setMonthlyPrice(e.target.value)}
																	className="form-control"
																	name="Monthly Price"
																	placeholder="Monthly Price"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Price per Sqft</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={pricePerSqft}
																	onChange={(e) => setPricePerSqft(e.target.value)}
																	className="form-control"
																	name="Price per Sqft"
																	placeholder="Price per Sqft"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Dimensions</label>
															<input
																type="text"
																value={dimensions}
																onChange={(e) => setDimensions(e.target.value)}
																className="form-control"
																placeholder="23 * 23 * 23"
																name="Dimensions"
															/>
														</div>
														{type && type.value === "Retail" && (
															<div className="col-md-6 form-group">
																<label>Frontage</label>
																<input
																	type="text"
																	value={frontage}
																	onChange={(e) => setFrontage(e.target.value)}
																	className="form-control"
																	placeholder="Frontage"
																	name="Frontage"
																/>
															</div>
														)}
														<div className="col-md-6 form-group">
															<label>Floor</label>
															<input
																type="text"
																value={floor}
																onChange={(e) => setFloor(e.target.value)}
																className="form-control"
																placeholder="Floor"
																name="Floor"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Listing Type</label>
															<select
																className="form-control"
																name="Listing Type"
																onChange={(e) => setListingType(e.target.value)}
															>
																<option value={"Direct"}>Direct</option>
																<option value={"Sublet"}>Sublet</option>
															</select>
														</div>
														<div className="col-md-6 form-group">
															<label>Lease Structure</label>
															<select
																className="form-control"
																name="Lease Structure"
																onChange={(e) => setLeaseStructure(e.target.value)}
															>
																<option value={"Modified Gross"}>Modified Gross</option>
																<option value={"Gross"}>Gross</option>
																<option value={"NNN"}>NNN</option>
																<option value={"Net"}>Net</option>
																<option value={"Full Service"}>Full Service</option>
															</select>
														</div>
														<div className="col-md-12 form-group">
															<label>Lease Term</label>
															<textarea
																type="text"
																rows={4}
																value={leaseTerm}
																onChange={(e) => setLeaseTerm(e.target.value)}
																className="form-control"
																placeholder="Lease Term"
																name="Lease Term"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Cross Street</label>
															<input
																type="text"
																value={crossStreet}
																onChange={(e) => setCrossStreet(e.target.value)}
																className="form-control"
																placeholder="Cross Street"
																name="Cross Street"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Zoning</label>
															<input
																type="text"
																value={zoning}
																onChange={(e) => setZoning(e.target.value)}
																className="form-control"
																placeholder="Zoning"
																name="Zoning"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom-2 btn-secondary" name="Prev" disabled>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (
																	buildingName &&
																	tenant &&
																	description &&
																	type &&
																	rentableSize &&
																	useableSize &&
																	annualPrice &&
																	monthlyPrice &&
																	pricePerSqft &&
																	dimensions &&
																	floor &&
																	listingType &&
																	leaseStructure &&
																	leaseTerm &&
																	crossStreet &&
																	zoning
																) {
																	setCurrentStep(1);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={1}>
													<div className="form-group">
														<label>Property Thumbnail</label>
														<div {...getThumbProps.getRootProps({ className: "dropzone" })}>
															<input {...getThumbProps.getInputProps()} />
															<div className="dropzone-msg dz-message needsclick">
																<i className="fas fa-cloud-upload-alt" />
																<h5 className="dropzone-msg-title">Drop thumbnail here or click to upload.</h5>
															</div>
														</div>
														<aside className="thumbsContainer">{thumbs}</aside>
													</div>
													<div className="form-group">
														<label>Property Gallery</label>
														<div {...getRootProps({ className: "dropzone" })}>
															<input {...getInputProps()} />
															<div className="dropzone-msg dz-message needsclick">
																<i className="fas fa-cloud-upload-alt" />
																<h5 className="dropzone-msg-title">Drop files here or click to upload.</h5>
																<span className="acr-form-notice">*You can upload up to 5 images for your listing</span>
																<span className="acr-form-notice">*Listing images should be atleast 620x480 in dimensions</span>
															</div>
														</div>
														<aside className="thumbsContainer">{galleryPreview}</aside>
													</div>
													<div className="form-group">
														<label>Property Video</label>
														<input
															type="text"
															value={video}
															onChange={(e) => setVideo(e.target.value)}
															className="form-control"
															placeholder="Property Video URL"
															name="video"
														/>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(0)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (thumbnail && gallery && video) {
																	setCurrentStep(2);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={2}>
													<div className="form-group submit-listing-map">
														<MapContainer zoom={10} center={{ lat: 40.799004, lng: -74.023484 }} zoomControl={false}>
															<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
															<MyMarker />
														</MapContainer>
													</div>
													<div className="form-group">
														<span className="acr-form-notice">Click the left button of your mouse to choose your address</span>
													</div>
													<div className="row">
														<div className="col-md-12 form-group">
															<label>Full Address</label>
															<input
																type="text"
																name="Full Address"
																value={fullAddress}
																className="form-control"
																placeholder="Full Address"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>City</label>
															<input type="text" name="city" id="city" value={city} className="form-control" placeholder="City" />
														</div>
														<div className="col-md-6 form-group">
															<label>State</label>
															<input
																type="text"
																name="state"
																id="state"
																value={state}
																className="form-control"
																placeholder="State"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Country</label>
															<input
																type="text"
																name="country"
																id="country"
																value={country}
																className="form-control"
																placeholder="Country"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Longitude</label>
															<input
																type="text"
																name="lng"
																id="lngVal"
																value={currentPos?.lng}
																className="form-control"
																placeholder="Longitude"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Latitude</label>
															<input
																type="text"
																name="lat"
																id="latVal"
																value={currentPos?.lat}
																className="form-control"
																placeholder="Latitude"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(1)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (currentPos && fullAddress && city && state && country) {
																	setCurrentStep(3);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={3}>
													<div className="row">
														{FEATURES.map((item, i) => (
															<div key={i} className="col-lg-4 col-md-6 col-sm-6">
																<label className="acr-listing-feature">
																	<input
																		type="checkbox"
																		name={"feature" + item.id + ""}
																		onChange={(e) => {
																			if (features.includes(item.title)) {
																				setFeatures(features.filter((feature) => feature !== item.title));
																			} else {
																				setFeatures((prev) => [...prev, item.title]);
																			}
																		}}
																	/>
																	<i className="acr-feature-check fas fa-check" />
																	<i className={"acr-listing-feature-icon flaticon-" + item.icon + ""} />
																	{item.title}
																</label>
															</div>
														))}
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(2)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (features && features.length) {
																	setCurrentStep(4);
																} else {
																	toast("Please choose at lease one!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={4}>
													<div className="row">
														<div className="col-md-6 form-group">
															<label>Total Building Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalBuildingSize}
																	onChange={(e) => setTotalBuildingSize(e.target.value)}
																	className="form-control"
																	name="Total Building Size"
																	placeholder="Total Building Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Maximum Contiguous Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={maxContiguoseSize}
																	onChange={(e) => setMaxContiguoseSize(e.target.value)}
																	className="form-control"
																	name="Maximum Contiguous Size"
																	placeholder="Maximum Contiguous Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Spaces Available</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalSpaceAvailable}
																	onChange={(e) => setTotalSpaceAvailable(e.target.value)}
																	className="form-control"
																	name="Total Spaces Available"
																	placeholder="Total Spaces Available"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Vacant</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalVacant}
																	onChange={(e) => setTotalVacant(e.target.value)}
																	className="form-control"
																	name="Total Vacant"
																	placeholder="Total Vacant"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Building FAR</label>
															<input
																type="text"
																value={buildingFar}
																onChange={(e) => setBuildingFar(e.target.value)}
																className="form-control"
																placeholder="Building FAR"
																name="Building FAR"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Elevator</label>
															<input
																type="text"
																value={elevator}
																onChange={(e) => setElevator(e.target.value)}
																className="form-control"
																placeholder="Elevator"
																name="Elevator"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Lot size</label>
															<input
																type="number"
																value={lotSize}
																onChange={(e) => setLotSize(e.target.value)}
																className="form-control"
																placeholder="Lot size"
																name="Lot size"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Lot Dimensions</label>
															<input
																type="text"
																value={lotDimensions}
																onChange={(e) => setLotDimentions(e.target.value)}
																className="form-control"
																placeholder="Lot Dimensions"
																name="Lot Dimensions"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Building Class</label>
															<input
																type="text"
																value={buildingClass}
																onChange={(e) => setBuildingClass(e.target.value)}
																className="form-control"
																placeholder="Building Class"
																name="Building Class"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Floor Load</label>
															<input
																type="text"
																value={floorLoad}
																onChange={(e) => setFloorLoad(e.target.value)}
																className="form-control"
																placeholder="Floor Load"
																name="Floor Load"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Year Built</label>
															<input
																type="number"
																value={yearBuilt}
																onChange={(e) => setYearBuilt(e.target.value)}
																className="form-control"
																placeholder="Property Year Built"
																name="built"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label># of Floors</label>
															<input
																type="text"
																value={ofFloors}
																onChange={(e) => setOfFloors(e.target.value)}
																className="form-control"
																placeholder="# of Floors"
																name="# of Floors"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Taxes</label>
															<input
																type="text"
																value={taxes}
																onChange={(e) => setTaxes(e.target.value)}
																className="form-control"
																placeholder="Taxes "
																name="Taxes"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Parking Spaces</label>
															<input
																type="text"
																value={totalParkingSpaces}
																onChange={(e) => setTotalParkingSpaces(e.target.value)}
																className="form-control"
																placeholder="Total Parking Spaces"
																name="Total Parking Spaces"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(3)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (
																	totalBuildingSize &&
																	maxContiguoseSize &&
																	totalSpaceAvailable &&
																	totalVacant &&
																	buildingFar &&
																	elevator &&
																	lotSize &&
																	lotDimensions &&
																	buildingClass &&
																	floorLoad &&
																	yearBuilt &&
																	ofFloors &&
																	taxes &&
																	totalParkingSpaces
																) {
																	setCurrentStep(5);
																} else {
																	toast("Pleaes fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={5}>
													<div className="row">
														<div className="col-md-6 form-group">
															<label>Investment Typer</label>
															<select
																className="form-control"
																name="Investment Typer"
																onChange={(e) => setInvestmentTyper(e.target.value)}
															>
																<option value={"Ground Up"}>Ground Up</option>
																<option value={"Value Add"}>Value Add</option>
																<option value={"Core"}>Core</option>
																<option value={"CorePlus"}>CorePlus</option>
																<option value={"Stabilized"}>Stabilized</option>
																<option value={"Owner/User"}>Owner/User</option>
																<option value={"Redevelopment"}>Redevelopment</option>
															</select>
														</div>
														<div className="col-md-6 form-group">
															<label>Occupancy (%)</label>
															<input
																type="number"
																value={occupancy}
																onChange={(e) => setOccupancy(e.target.value)}
																className="form-control"
																placeholder="Occupancy (%)"
																name="Occupancy (%)"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Net Operating Income</label>
															<input
																type="text"
																value={netOperatingIncome}
																onChange={(e) => setNetOperatingIncome(e.target.value)}
																className="form-control"
																placeholder="Net Operating Income"
																name="Net Operating Income"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Cap Rate</label>
															<input
																type="text"
																value={capRate}
																onChange={(e) => setCapRate(e.target.value)}
																className="form-control"
																placeholder="Cap Rate"
																name="Cap Rate"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Proforma NOI</label>
															<input
																type="text"
																value={proformaNoi}
																onChange={(e) => setProFormaNoi(e.target.value)}
																className="form-control"
																placeholder="Proforma NOI"
																name="Proforma NOI"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Proforma Cap</label>
															<input
																type="text"
																value={proformaCap}
																onChange={(e) => setProFormaCap(e.target.value)}
																className="form-control"
																placeholder="Proforma Cap"
																name="Proforma Cap"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Price per Sqft</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={investPricePerSqft}
																	onChange={(e) => setInvestPricePerSqft(e.target.value)}
																	className="form-control"
																	name="Price per Sqft"
																	placeholder="Price per Sqft"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Price per Unit</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={investPricePerUnit}
																	onChange={(e) => setInvestPricePerUnit(e.target.value)}
																	className="form-control"
																	name="Price per Unit"
																	placeholder="Price per Unit"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Price per SF (Land Value)</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={investPricePerSf}
																	onChange={(e) => setInvestPricePerSf(e.target.value)}
																	className="form-control"
																	name="Price per SF"
																	placeholder="Price per SF"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Ground Lease</label>
															<select
																className="form-control"
																name="Ground Lease"
																onChange={(e) => setGroundLease(e.target.value)}
															>
																<option value={"Yes"}>Yes</option>
																<option value={"No"}>No</option>
															</select>
														</div>
														<div className="col-md-12 form-group">
															<label>Ground Lease (year remaining)</label>
															<input
																type="text"
																value={yearRemaining}
																onChange={(e) => setYearRemaining(e.target.value)}
																className="form-control"
																placeholder="Ground Lease"
																name="Ground Lease"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(4)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (
																	investmentTyper &&
																	occupancy &&
																	netOperatingIncome &&
																	capRate &&
																	proformaNoi &&
																	proformaCap &&
																	investPricePerSqft &&
																	investPricePerUnit &&
																	investPricePerSf &&
																	groundLease &&
																	yearRemaining
																) {
																	onSubmit();
																} else {
																	toast("Pleaes fill all fields!", { type: "warning" });
																}
															}}
														>
															Submit
														</button>
													</div>
												</Tab.Pane>
											</Tab.Content>
										</form>
									</div>
								</Tab.Container>
								{/* Tab Content End */}
							</div>
						</Tab.Pane>
						<Tab.Pane eventKey="Lease">
							<div className="row">
								<Tab.Container defaultActiveKey={0} activeKey={currentStep}>
									{/* Tabs Start */}
									<div className="col-md-4">
										<Nav variant="tabs" className="nav nav-tabs tab-cards">
											<Nav.Item>
												<Nav.Link eventKey={0} disabled={currentStep !== 0}>
													<span>01</span> Basic Information
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={1} disabled={currentStep !== 1}>
													<span>02</span> Gallery
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={2} disabled={currentStep !== 2}>
													<span>03</span> Location
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={3} disabled={currentStep !== 3}>
													<span>04</span> Features
												</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey={4} disabled={currentStep !== 4}>
													<span>05</span> Details
												</Nav.Link>
											</Nav.Item>
										</Nav>
									</div>
									{/* Tabs End */}
									{/* Tab Content Start */}
									<div className="col-md-8">
										<form>
											<Tab.Content className="m-0">
												<Tab.Pane eventKey={0}>
													<div className="row">
														<div className="col-md-6 form-group">
															<label>Building Name</label>
															<input
																type="text"
																className="form-control"
																value={buildingName}
																onChange={(e) => setBuildingName(e.target.value)}
																placeholder="Building Name"
																name="Building Name"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Tenant Type</label>
															<select className="form-control" name="status" onChange={(e) => setTenant(e.target.value)}>
																<option value={"Single"}>Single</option>
																<option value={"Multi"}>Multi</option>
															</select>
														</div>
														<div className="col-md-12 form-group">
															<label>Property Description</label>
															<textarea
																name="Property Description"
																rows={4}
																value={description}
																onChange={(e) => setDescription(e.target.value)}
																className="form-control"
																placeholder="Property Description"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Property Type</label>
															<Select options={types} value={type} onChange={setType} />
														</div>
														<div className="col-md-6 form-group">
															<label>Property Subtype</label>
															<Select isMulti options={subtypes} value={subtype} onChange={setSubtype} />
														</div>
														<div className="col-md-6">
															<label>Rentable Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={rentableSize}
																	onChange={(e) => setRentableSize(e.target.value)}
																	className="form-control"
																	name="Rentable Size"
																	placeholder="Rentable Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Useable Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={useableSize}
																	onChange={(e) => setUseableSize(e.target.value)}
																	className="form-control"
																	name="Useable Size"
																	placeholder="Useable Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Annual Price</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={annualPrice}
																	onChange={(e) => setAnnualPrice(e.target.value)}
																	className="form-control"
																	name="Annual Price"
																	placeholder="Annual Price"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Monthly Price</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={monthlyPrice}
																	onChange={(e) => setMonthlyPrice(e.target.value)}
																	className="form-control"
																	name="Monthly Price"
																	placeholder="Monthly Price"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Price per Sqft</label>
															<div className="input-group">
																<div className="input-group-prepend">
																	<span className="input-group-text">$</span>
																</div>
																<input
																	type="number"
																	value={pricePerSqft}
																	onChange={(e) => setPricePerSqft(e.target.value)}
																	className="form-control"
																	name="Price per Sqft"
																	placeholder="Price per Sqft"
																/>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Dimensions</label>
															<input
																type="text"
																value={dimensions}
																onChange={(e) => setDimensions(e.target.value)}
																className="form-control"
																placeholder="23 * 23 * 23"
																name="Dimensions"
															/>
														</div>
														{type && type.value === "Retail" && (
															<div className="col-md-6 form-group">
																<label>Frontage</label>
																<input
																	type="text"
																	value={frontage}
																	onChange={(e) => setFrontage(e.target.value)}
																	className="form-control"
																	placeholder="Frontage"
																	name="Frontage"
																/>
															</div>
														)}
														<div className="col-md-6 form-group">
															<label>Floor</label>
															<input
																type="text"
																value={floor}
																onChange={(e) => setFloor(e.target.value)}
																className="form-control"
																placeholder="Floor"
																name="Floor"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Listing Type</label>
															<select
																className="form-control"
																name="Listing Type"
																onChange={(e) => setListingType(e.target.value)}
															>
																<option value={"Direct"}>Direct</option>
																<option value={"Sublet"}>Sublet</option>
															</select>
														</div>
														<div className="col-md-6 form-group">
															<label>Lease Structure</label>
															<select
																className="form-control"
																name="Lease Structure"
																onChange={(e) => setLeaseStructure(e.target.value)}
															>
																<option value={"Modified Gross"}>Modified Gross</option>
																<option value={"Gross"}>Gross</option>
																<option value={"NNN"}>NNN</option>
																<option value={"Net"}>Net</option>
																<option value={"Full Service"}>Full Service</option>
															</select>
														</div>
														<div className="col-md-12 form-group">
															<label>Lease Term</label>
															<textarea
																type="text"
																rows={4}
																value={leaseTerm}
																onChange={(e) => setLeaseTerm(e.target.value)}
																className="form-control"
																placeholder="Lease Term"
																name="Lease Term"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Cross Street</label>
															<input
																type="text"
																value={crossStreet}
																onChange={(e) => setCrossStreet(e.target.value)}
																className="form-control"
																placeholder="Cross Street"
																name="Cross Street"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Zoning</label>
															<input
																type="text"
																value={zoning}
																onChange={(e) => setZoning(e.target.value)}
																className="form-control"
																placeholder="Zoning"
																name="Zoning"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom-2 btn-secondary" name="Prev" disabled>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (
																	buildingName &&
																	tenant &&
																	description &&
																	type &&
																	rentableSize &&
																	useableSize &&
																	annualPrice &&
																	monthlyPrice &&
																	pricePerSqft &&
																	dimensions &&
																	floor &&
																	listingType &&
																	leaseStructure &&
																	leaseTerm &&
																	crossStreet &&
																	zoning
																) {
																	setCurrentStep(1);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={1}>
													<div className="form-group">
														<label>Property Thumbnail</label>
														<div {...getThumbProps.getRootProps({ className: "dropzone" })}>
															<input {...getThumbProps.getInputProps()} />
															<div className="dropzone-msg dz-message needsclick">
																<i className="fas fa-cloud-upload-alt" />
																<h5 className="dropzone-msg-title">Drop thumbnail here or click to upload.</h5>
															</div>
														</div>
														<aside className="thumbsContainer">{thumbs}</aside>
													</div>
													<div className="form-group">
														<label>Property Gallery</label>
														<div {...getRootProps({ className: "dropzone" })}>
															<input {...getInputProps()} />
															<div className="dropzone-msg dz-message needsclick">
																<i className="fas fa-cloud-upload-alt" />
																<h5 className="dropzone-msg-title">Drop files here or click to upload.</h5>
																<span className="acr-form-notice">*You can upload up to 5 images for your listing</span>
																<span className="acr-form-notice">*Listing images should be atleast 620x480 in dimensions</span>
															</div>
														</div>
														<aside className="thumbsContainer">{galleryPreview}</aside>
													</div>
													<div className="form-group">
														<label>Property Video</label>
														<input
															type="text"
															value={video}
															onChange={(e) => setVideo(e.target.value)}
															className="form-control"
															placeholder="Property Video URL"
															name="video"
														/>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(0)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (thumbnail && gallery && video) {
																	setCurrentStep(2);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={2}>
													<div className="form-group submit-listing-map">
														<MapContainer zoom={10} center={{ lat: 40.799004, lng: -74.023484 }} zoomControl={false}>
															<TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
															<MyMarker />
														</MapContainer>
													</div>
													<div className="form-group">
														<span className="acr-form-notice">Click the left button of your mouse to choose your address</span>
													</div>
													<div className="row">
														<div className="col-md-12 form-group">
															<label>Full Address</label>
															<input
																type="text"
																name="Full Address"
																value={fullAddress}
																className="form-control"
																placeholder="Full Address"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>City</label>
															<input type="text" name="city" id="city" value={city} className="form-control" placeholder="City" />
														</div>
														<div className="col-md-6 form-group">
															<label>State</label>
															<input
																type="text"
																name="state"
																id="state"
																value={state}
																className="form-control"
																placeholder="State"
															/>
														</div>
														<div className="col-md-12 form-group">
															<label>Country</label>
															<input
																type="text"
																name="country"
																id="country"
																value={country}
																className="form-control"
																placeholder="Country"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Longitude</label>
															<input
																type="text"
																name="lng"
																id="lngVal"
																value={currentPos?.lng}
																className="form-control"
																placeholder="Longitude"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Latitude</label>
															<input
																type="text"
																name="lat"
																id="latVal"
																value={currentPos?.lat}
																className="form-control"
																placeholder="Latitude"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(1)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (currentPos && fullAddress && city && state && country) {
																	setCurrentStep(3);
																} else {
																	toast("Please fill all fields!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={3}>
													<div className="row">
														{FEATURES.map((item, i) => (
															<div key={i} className="col-lg-4 col-md-6 col-sm-6">
																<label className="acr-listing-feature">
																	<input
																		type="checkbox"
																		name={"feature" + item.id + ""}
																		onChange={(e) => {
																			if (features.includes(item.title)) {
																				setFeatures(features.filter((feature) => feature !== item.title));
																			} else {
																				setFeatures((prev) => [...prev, item.title]);
																			}
																		}}
																	/>
																	<i className="acr-feature-check fas fa-check" />
																	<i className={"acr-listing-feature-icon flaticon-" + item.icon + ""} />
																	{item.title}
																</label>
															</div>
														))}
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(2)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (features && features.length) {
																	setCurrentStep(4);
																} else {
																	toast("Please choose at lease one!", { type: "warning" });
																}
															}}
														>
															Next
														</button>
													</div>
												</Tab.Pane>
												<Tab.Pane eventKey={4}>
													<div className="row">
														<div className="col-md-6 form-group">
															<label>Total Building Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalBuildingSize}
																	onChange={(e) => setTotalBuildingSize(e.target.value)}
																	className="form-control"
																	name="Total Building Size"
																	placeholder="Total Building Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Maximum Contiguous Size</label>
															<div className="input-group">
																<input
																	type="number"
																	value={maxContiguoseSize}
																	onChange={(e) => setMaxContiguoseSize(e.target.value)}
																	className="form-control"
																	name="Maximum Contiguous Size"
																	placeholder="Maximum Contiguous Size"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Spaces Available</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalSpaceAvailable}
																	onChange={(e) => setTotalSpaceAvailable(e.target.value)}
																	className="form-control"
																	name="Total Spaces Available"
																	placeholder="Total Spaces Available"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Vacant</label>
															<div className="input-group">
																<input
																	type="number"
																	value={totalVacant}
																	onChange={(e) => setTotalVacant(e.target.value)}
																	className="form-control"
																	name="Total Vacant"
																	placeholder="Total Vacant"
																/>
																<div className="input-group-append">
																	<span className="input-group-text">Sqft</span>
																</div>
															</div>
														</div>
														<div className="col-md-6 form-group">
															<label>Building FAR</label>
															<input
																type="text"
																value={buildingFar}
																onChange={(e) => setBuildingFar(e.target.value)}
																className="form-control"
																placeholder="Building FAR"
																name="Building FAR"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Elevator</label>
															<input
																type="text"
																value={elevator}
																onChange={(e) => setElevator(e.target.value)}
																className="form-control"
																placeholder="Elevator"
																name="Elevator"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Lot size</label>
															<input
																type="number"
																value={lotSize}
																onChange={(e) => setLotSize(e.target.value)}
																className="form-control"
																placeholder="Lot size"
																name="Lot size"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Lot Dimensions</label>
															<input
																type="text"
																value={lotDimensions}
																onChange={(e) => setLotDimentions(e.target.value)}
																className="form-control"
																placeholder="Lot Dimensions"
																name="Lot Dimensions"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Building Class</label>
															<input
																type="text"
																value={buildingClass}
																onChange={(e) => setBuildingClass(e.target.value)}
																className="form-control"
																placeholder="Building Class"
																name="Building Class"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Floor Load</label>
															<input
																type="text"
																value={floorLoad}
																onChange={(e) => setFloorLoad(e.target.value)}
																className="form-control"
																placeholder="Floor Load"
																name="Floor Load"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Year Built</label>
															<input
																type="number"
																value={yearBuilt}
																onChange={(e) => setYearBuilt(e.target.value)}
																className="form-control"
																placeholder="Property Year Built"
																name="built"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label># of Floors</label>
															<input
																type="text"
																value={ofFloors}
																onChange={(e) => setOfFloors(e.target.value)}
																className="form-control"
																placeholder="# of Floors"
																name="# of Floors"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Taxes</label>
															<input
																type="text"
																value={taxes}
																onChange={(e) => setTaxes(e.target.value)}
																className="form-control"
																placeholder="Taxes "
																name="Taxes"
															/>
														</div>
														<div className="col-md-6 form-group">
															<label>Total Parking Spaces</label>
															<input
																type="text"
																value={totalParkingSpaces}
																onChange={(e) => setTotalParkingSpaces(e.target.value)}
																className="form-control"
																placeholder="Total Parking Spaces"
																name="Total Parking Spaces"
															/>
														</div>
													</div>
													<div className="form-group d-flex justify-content-between">
														<button type="button" className="btn-custom" name="Prev" onClick={() => setCurrentStep(3)}>
															Prev
														</button>
														<button
															type="button"
															className="btn-custom"
															name="Next"
															onClick={() => {
																if (
																	totalBuildingSize &&
																	maxContiguoseSize &&
																	totalSpaceAvailable &&
																	totalVacant &&
																	buildingFar &&
																	elevator &&
																	lotSize &&
																	lotDimensions &&
																	buildingClass &&
																	floorLoad &&
																	yearBuilt &&
																	ofFloors &&
																	taxes &&
																	totalParkingSpaces
																) {
																	onSubmit();
																} else {
																	toast("Pleaes fill all fields!", { type: "warning" });
																}
															}}
														>
															Submit
														</button>
													</div>
												</Tab.Pane>
											</Tab.Content>
										</form>
									</div>
								</Tab.Container>
								{/* Tab Content End */}
							</div>
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</div>
		</div>
	);
}

export default Content;
