import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip, Dropdown, NavLink } from "react-bootstrap";
import Sidebar from "../../layouts/Shopsidebar";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { searchListings } from "../../../api/listing";
import { SET_SEARCH } from "../../../redux/types";
import { toast } from "react-toastify";

const gallerytip = <Tooltip>Gallery</Tooltip>;
const gridtip = <Tooltip>Grid</Tooltip>;
const listtip = <Tooltip>List</Tooltip>;

const Content = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const searchParam = useSelector((state) => state.search);

	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [viewMode, setViewMode] = useState("grid");

	const itemsPerPage = 6;
	const [listings, setListings] = useState([]);

	useEffect(() => {
		searchListings(dispatch, searchParam, { pageSize: itemsPerPage, pageNumber: currentPage })
			.then((res) => {
				setListings(res.data);
				setTotalCount(res.meta.pagination.total);
			})
			.catch((err) => {
				toast(err, { type: "error" });
			});
	}, [dispatch, searchParam, currentPage]);

	useEffect(() => {
		const pageNumbers = [];
		for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++) {
			pageNumbers.push(i);
		}
		setPageCount(pageNumbers);
	}, [totalCount]);

	const handleClick = (event) => {
		var paginationContent = event.target.closest(".pagination-content");

		if (paginationContent) {
			paginationContent.scrollIntoView();
		}
		setCurrentPage(Number(event.target.getAttribute("data-page")));
	};

	const goDetail = (e, item) => {
		e.preventDefault();
		navigate("/listing-details-v1", { state: item });
	};

	const renderitems = listings.map((attr, i) => {
		const item = attr?.attributes;
		if (viewMode === "grid") {
			return (
				<div key={i} className="col-md-6">
					<div className="listing">
						<div className="listing-thumbnail" style={{ height: 180 }}>
							<Link to="#" onClick={(e) => goDetail(e, item)}>
								<img src={item.thumbnail} alt="listing" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
							</Link>
							<div className="listing-badges">
								{item.listType === "Sales" ? (
									<span className="listing-badge sale">Sales</span>
								) : (
									<span className="listing-badge rent">Lease</span>
								)}
							</div>
							<div className="listing-controls">
								<Link to="#" className="favorite">
									<i className="far fa-heart" />
								</Link>
								<Link to="#" className="compare">
									<i className="fas fa-sync-alt" />
								</Link>
							</div>
						</div>
						<div className="listing-body">
							<div className="listing-author">
								<img src={process.env.PUBLIC_URL + "/assets/img/people/2.jpg"} alt="author" />
								<div className="listing-author-body">
									<p>
										{" "}
										<Link to="#">{"Apex Cup"}</Link>{" "}
									</p>
									<span className="listing-date">{"Nov 12, 2023"}</span>
								</div>
								<Dropdown className="options-dropdown">
									<Dropdown.Toggle as={NavLink}>
										<i className="fas fa-ellipsis-v" />
									</Dropdown.Toggle>
									<Dropdown.Menu className="dropdown-menu-right">
										<ul>
											<li>
												{" "}
												<Link to="tel:+123456789">
													{" "}
													<i className="fas fa-phone" /> Call Agent
												</Link>{" "}
											</li>
											<li>
												{" "}
												<Link to="mailto:+123456789">
													{" "}
													<i className="fas fa-envelope" /> Send Message
												</Link>{" "}
											</li>
											<li>
												{" "}
												<Link to="#" onClick={(e) => goDetail(e, item)}>
													{" "}
													<i className="fas fa-bookmark" /> Book Tour
												</Link>{" "}
											</li>
										</ul>
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<h5 className="listing-title">
								{" "}
								<Link to="#" title={item.name} onClick={(e) => goDetail(e, item)}>
									{item.name}
								</Link>{" "}
							</h5>
							<span className="listing-price">
								{new Intl.NumberFormat().format(item.monthlyPrice?.toFixed(2))}$ <span>/month</span>{" "}
							</span>
							<p className="listing-text">{item.description?.substring(0, 130) + "..."}</p>
							<div className="acr-listing-icons">
								{item.features?.map((feature, index) => {
									let icon = "flaticon-bone";
									if (feature === "Pet Friendly") {
										icon = "flaticon-bone";
									} else if (feature === "Furnished") {
										icon = "flaticon-chair";
									} else if (feature === "Cooling") {
										icon = "flaticon-fan";
									} else if (feature === "Parking") {
										icon = "flaticon-garage";
									} else if (feature === "Mailbox") {
										icon = "flaticon-mailbox";
									} else if (feature === "City View") {
										icon = "flaticon-eye";
									}
									return (
										<OverlayTrigger overlay={<Tooltip>{feature}</Tooltip>} key={index}>
											<div className="acr-listing-icon">
												<i className={"acr-listing-feature-icon " + icon + " acr-listing-icon-value"} />
												{/* <span className="acr-listing-icon-value">{feature}</span> */}
											</div>
										</OverlayTrigger>
									);
								})}
							</div>
							<div className="listing-gallery-wrapper">
								<Link to="#" className="btn-custom btn-sm secondary" onClick={(e) => goDetail(e, item)}>
									View Details
								</Link>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div key={i} className="listing listing-list">
					<div className="listing-thumbnail" style={{ height: 340 }}>
						<Link to="#" onClick={(e) => goDetail(e, item)}>
							<img src={item.thumbnail} alt="listing" style={{ height: "100%", width: 540, objectFit: "cover" }} />
						</Link>
						<div className="listing-badges">
							{item.listType === "Sales" ? <span className="listing-badge sale">Sales</span> : <span className="listing-badge rent">Lease</span>}
						</div>
						<div className="listing-controls">
							<Link to="#" className="favorite">
								<i className="far fa-heart" />
							</Link>
							<Link to="#" className="compare">
								<i className="fas fa-sync-alt" />
							</Link>
						</div>
					</div>
					<div className="listing-body">
						<div className="listing-author">
							<img src={process.env.PUBLIC_URL + "/assets/img/people/2.jpg"} alt="author" />
							<div className="listing-author-body">
								<p>
									{" "}
									<Link to="#">{"Apex Cup"}</Link>{" "}
								</p>
								<span className="listing-date">{"Nov 12, 2023"}</span>
							</div>
							<Dropdown className="options-dropdown">
								<Dropdown.Toggle as={NavLink}>
									<i className="fas fa-ellipsis-v" />
								</Dropdown.Toggle>
								<Dropdown.Menu className="dropdown-menu-right">
									<ul>
										<li>
											{" "}
											<Link to="tel:+123456789">
												{" "}
												<i className="fas fa-phone" /> Call Agent
											</Link>{" "}
										</li>
										<li>
											{" "}
											<Link to="mailto:+123456789">
												{" "}
												<i className="fas fa-envelope" /> Send Message
											</Link>{" "}
										</li>
										<li>
											{" "}
											<Link to="#" onClick={(e) => goDetail(e, item)}>
												{" "}
												<i className="fas fa-bookmark" /> Book Tour
											</Link>{" "}
										</li>
									</ul>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						<h5 className="listing-title">
							{" "}
							<Link to="#" title={item.name} onClick={(e) => goDetail(e, item)}>
								{item.name}
							</Link>{" "}
						</h5>
						<span className="listing-price">
							{new Intl.NumberFormat().format(item.monthlyPrice?.toFixed(2))}$ <span>/month</span>{" "}
						</span>
						<p className="listing-text">{item.description?.substring(0, 130) + "..."}</p>
						<div className="acr-listing-icons">
							{item.features?.map((feature, index) => {
								let icon = "flaticon-bone";
								if (feature === "Pet Friendly") {
									icon = "flaticon-bone";
								} else if (feature === "Furnished") {
									icon = "flaticon-chair";
								} else if (feature === "Cooling") {
									icon = "flaticon-fan";
								} else if (feature === "Parking") {
									icon = "flaticon-garage";
								} else if (feature === "Mailbox") {
									icon = "flaticon-mailbox";
								} else if (feature === "City View") {
									icon = "flaticon-eye";
								}
								return (
									<OverlayTrigger overlay={<Tooltip>{feature}</Tooltip>} key={index}>
										<div className="acr-listing-icon">
											<i className={"acr-listing-feature-icon " + icon + " acr-listing-icon-value"} />
											{/* <span className="acr-listing-icon-value">{feature}</span> */}
										</div>
									</OverlayTrigger>
								);
							})}
						</div>
						<div className="listing-gallery-wrapper">
							<Link to="#" className="btn-custom btn-sm secondary" onClick={(e) => goDetail(e, item)}>
								View Details
							</Link>
						</div>
					</div>
				</div>
			);
		}
	});

	const renderPagination = pageCount.map((number) => {
		const activeCondition = currentPage === number ? "active" : "";
		return (
			<Fragment key={number}>
				{pageCount.length > 1 ? (
					<li className={classNames("page-item", { active: activeCondition })}>
						<Link className="page-link" to="#" data-page={number} onClick={handleClick}>
							{number}
						</Link>
					</li>
				) : (
					""
				)}
			</Fragment>
		);
	});

	return (
		<div className="section pagination-content">
			<div className="container">
				<div className="row">
					{/* Sidebar Start */}
					<div className="col-lg-4">
						<Sidebar />
					</div>
					{/* Sidebar End */}
					{/* Posts Start */}
					<div className="col-lg-8">
						{/* Controls Start */}
						<div className="acr-global-listing-controls">
							<div className="acr-listing-active-filters">
								{searchParam && searchParam.location && searchParam.location !== "Any Location" && (
									<Link
										to="#"
										onClick={() => {
											dispatch({
												type: SET_SEARCH,
												payload: {
													...searchParam,
													location: "",
												},
											});
										}}
									>
										<div className="close-btn close-dark">
											<span />
											<span />
										</div>
										{searchParam.location}
									</Link>
								)}
								{searchParam && searchParam.status && searchParam.status !== "Any Status" && (
									<Link
										to="#"
										onClick={() => {
											dispatch({
												type: SET_SEARCH,
												payload: {
													...searchParam,
													status: "",
												},
											});
										}}
									>
										<div className="close-btn close-dark">
											<span />
											<span />
										</div>
										{searchParam.status}
									</Link>
								)}
								{searchParam && searchParam.type && searchParam.type !== "Any Type" && (
									<Link
										to="#"
										onClick={() => {
											dispatch({
												type: SET_SEARCH,
												payload: {
													...searchParam,
													type: "",
												},
											});
										}}
									>
										<div className="close-btn close-dark">
											<span />
											<span />
										</div>
										{searchParam.type}
									</Link>
								)}
								{searchParam && searchParam.price && searchParam.price && searchParam.price !== "Any Range" && (
									<Link
										to="#"
										onClick={() => {
											dispatch({
												type: SET_SEARCH,
												payload: {
													...searchParam,
													price: "",
												},
											});
										}}
									>
										<div className="close-btn close-dark">
											<span />
											<span />
										</div>
										{searchParam.price}
									</Link>
								)}
							</div>
							<div className="acr-toggle-views">
								<OverlayTrigger placement="top" overlay={gridtip}>
									<Link to="#" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
										<i className="fas fa-th-large" />
									</Link>
								</OverlayTrigger>
								<OverlayTrigger placement="top" overlay={listtip}>
									<Link to="#" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
										<i className="fas fa-th-list" />
									</Link>
								</OverlayTrigger>
								{/* <OverlayTrigger placement="top" overlay={maptip}>
                                        <Link to="/listing-map"><i className="fas fa-map" /></Link>
                                    </OverlayTrigger> */}
							</div>
						</div>
						{/* Controls End */}
						<div className="row">
							{/* Listing Start */}
							{renderitems}
							{/* Listing End */}
						</div>
						{/* Pagination Start */}
						{pageCount.length > 1 ? (
							<ul className="pagination">
								{/* Prev */}
								{/* to show previous, we need to be on the 2nd or more page */}
								{pageCount.length > 1 && currentPage !== 1 ? (
									<li className="page-item">
										<Link className="page-link" to="#" data-page={currentPage - 1} onClick={handleClick}>
											<i className="fas fa-chevron-left" />
										</Link>
									</li>
								) : (
									""
								)}
								{/* Prev */}
								{renderPagination}
								{/* Next */}
								{/* to show next, we should not be on the last page */}
								{pageCount.length > 1 && currentPage !== pageCount.length ? (
									<li className="page-item">
										<Link className="page-link" to="#" data-page={parseInt(currentPage + 1)} onClick={handleClick}>
											<i className="fas fa-chevron-right" />
										</Link>
									</li>
								) : (
									""
								)}
								{/* Next */}
							</ul>
						) : (
							""
						)}
						{/* Pagination End */}
					</div>
					{/* Posts End */}
				</div>
			</div>
		</div>
	);
};

export default Content;
