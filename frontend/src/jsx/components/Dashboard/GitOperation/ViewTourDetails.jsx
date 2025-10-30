import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { get } from "../../../../services/apiServices";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";

const ViewTourDetails = ({tourId}) => {

	const [data, setData] = useState([]);
	const [skeleton, setSkeleton] = useState([]);
	const [grouptour, setGrouptour] = useState([]);
	const [tourprice, setTourprice] = useState([]);
	const [detailedItinerary, setDetailedItinerary] = useState([]);
	const [visaDetails, setVisaDetails] = useState([]);
	const [flightDetails, setFlightDetails] = useState([]);
	const [trainDetails, setTrainDetails] = useState([]);
	const [seatAvailable, setSeatAvailable] = useState("");
	const [d2dDetails, setD2dDetails] = useState("");
	const [inclusions, setInclusions] = useState([{ description: "" }]);
	const [exclusions, setExclusions] = useState([{ description: "" }]);
	const [printPdfURL, setPrintPdfURL] = useState("");
	const [notes, setNotes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getViewgrouplist = async () => {
		try {
			setIsLoading(true);
			const response = await get(`/view-details-group-tour?groupTourId=${tourId}`);

			setData(response.data);
			setGrouptour(response?.data?.detailGroupTour);
			setSkeleton(response?.data?.skeletonItinerary);
			setTourprice(response?.data?.tourPrice);
			setDetailedItinerary(response?.data?.detailedItinerary);
			setVisaDetails(response?.data?.visaDocuments);
			setFlightDetails(response?.data?.flightDetails);
			setTrainDetails(response?.data?.trainDetails);
			setSeatAvailable(response?.data?.seatsAvailable);
			setD2dDetails(response?.data?.dtod);
			setInclusions(response?.data?.inclusions);
			setExclusions(response?.data?.exclusions);
			setPrintPdfURL(response?.data?.printUrl);
			setNotes(response?.data?.notes);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};
	useEffect(() => {
		getViewgrouplist();
	}, []);

	// to get the confirm group list
	// to end get customized tour details
	useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		console.log(window.location.href.split("/"));
		const pathArray = window.location.href.split("/");
		const path = pathArray[pathArray.length - 1];
		console.log(path);
		let element = document.getElementById("View-group-tour");
		console.log(element);
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	const mealType = ["Breakfast", "Lunch", "Dinner"];

	return (
		<>
			{isLoading ? (
				<h1>Loading...</h1>
			) : (
				<section>
					<div className="row">
						<div className="col-md-12">
							
							<div className="card">
								<div className="card-body">
									<div
										className="card-header card-tour"
										style={{ paddingLeft: "0" }}
									>
										<div className="card-title h5">Tour Details</div>
									</div>
									<form>
										<div className="details-tour">
											<div className="row mb-2">
												{/* {grouptour.map((item, index) => ( */}
												<>
													<div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Tour Name</label>
															<div className="view-details">
																<h6>{`${
																	grouptour
																		? !!grouptour[0]?.tourName
																			? grouptour[0]?.tourName
																			: "-"
																		: "-"
																}`}</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Tour code</label>
															<div className="view-details">
																<h6>{`${
																	!!grouptour[0]?.tourCode
																		? grouptour[0]?.tourCode
																		: "-"
																}`}</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Tour type</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.tourTypeName
																		? grouptour[0]?.tourTypeName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Destination</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.destinationName
																		? grouptour[0]?.destinationName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Departure</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.departureName
																		? grouptour[0]?.departureName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Country</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.countryName
																		? grouptour[0]?.countryName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">state</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.stateName
																		? grouptour[0]?.stateName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">
																Tour start date
															</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.startDate
																		? grouptour[0]?.startDate
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">
																Tour end date
															</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.endDate
																		? grouptour[0]?.endDate
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="row">
															<div className="col-sm-6 pax-adults">
																<label className="text-label">
																	Duration(Nights)
																</label>
																{/* <input
                                  type="text"
                                  className="form-control form-view"
                                  placeholder=""
                                  name="nameofguest"
                                  value={grouptour[0]?.night}
                                /> */}
																<div className="view-details">
																	<h6>
																		{!!grouptour[0]?.night
																			? grouptour[0]?.night
																			: "-"}
																	</h6>
																</div>
															</div>
															<div className="col-sm-6 pax-child">
																<label className="text-label">
																	Duration(Days)
																</label>
																{/* <input
                                  type="text"
                                  className="form-control form-view"
                                  placeholder=""
                                  name="nameofguest"
                                  value={grouptour[0]?.days}
                                /> */}
																<div className="view-details">
																	<h6>
																		{!!grouptour[0]?.days
																			? grouptour[0]?.days
																			: "-"}
																	</h6>
																</div>
															</div>
														</div>

														{/* <div className="d-flex">
                              <div className="me-1 "> */}

														{/* <h6>{!!item.night ? item.night : "-"}</h6> */}
														{/* </div>
                              <span className="me-1">Nights</span>
                              <div className="me-1"> */}

														{/* <h6>{!!item.days ? item.days : "-"}</h6> */}

														{/* <span className="me-1">Days</span>
                            </div>
                          </div> */}
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Unique Experiences</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.uniqueExperience
																		? grouptour[0]?.uniqueExperience
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-9 col-md-12 col-sm-12 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Cities</label>
															<div className="view-details">
																<ul className="view-ul">
																	{data.city?.map((c) => (
																		<li>
																			<h6>{c.citiesName}</h6>
																		</li>
																	))}
																</ul>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Total Seats</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.totalSeats
																		? grouptour[0]?.totalSeats
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">
																Seats Available
															</label>
															<div className="view-details">
																<h6>{!!seatAvailable ? seatAvailable : "-"}</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Vehicle Used</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.vehicleName
																		? grouptour[0]?.vehicleName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Meal Plan</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.mealPlanName
																		? grouptour[0]?.mealPlanName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Kitchen</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.kitchenName
																		? grouptour[0]?.kitchenName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Meal Type</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.mealTypeName
																		? grouptour[0]?.mealTypeName
																		: "-"}
																</h6>
															</div>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">Tour Manager</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.tourManager
																		? grouptour[0]?.tourManager
																		: "-"}
																</h6>
															</div>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<div className="form-group">
															<label className="text-label">
																Tour Manager Number
															</label>
															<div className="view-details">
																<h6>
																	{!!grouptour[0]?.managerNo
																		? grouptour[0]?.managerNo
																		: "-"}
																</h6>
															</div>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2 banner-image-part">
														<div className="form-group">
															<label className="text-label">
																Background Image
															</label>

															<div
																className="view-details border-0"
																style={{
																	display: "flex",
																	flexDirection: "column",
																}}
															>
																<a
																	className="btn btn-save btn-primary mb-2 print-btn"
																	target="_blank"
																	style={{ width: "150px" }}
																	href={
																		!!grouptour[0]?.bgImage
																			? grouptour[0]?.bgImage
																			: ""
																	}
																>
																	View Image
																</a>
																<img
																	src={grouptour[0]?.bgImage}
																	alt="backgroud"
																	style={{ height: "200px" }}
																	className="print-image"
																/>
															</div>
														</div>
													</div>
												</>
												{/* ))} */}
											</div>
										</div>
									</form>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="skeleton mb-2">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Skeleton Itinerary</div>
										</div>
										<div className="table-responsive">
											<table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1">
												<thead>
													<tr>
														<th
															className=""
															style={{ width: "8%", cursor: "default" }}
														>
															Sr.no
														</th>
														<th
															className=""
															style={{ width: "10%", cursor: "default" }}
														>
															Days
														</th>
														<th
															className=""
															style={{ width: "10%", cursor: "default" }}
														>
															Date
														</th>
														<th
															className=""
															style={{ width: "15%", cursor: "default" }}
														>
															Journey/Destination
														</th>
														<th
															className=""
															style={{ width: "15%", cursor: "default" }}
														>
															Overnight at
														</th>
														<th
															className=""
															style={{ width: "15%", cursor: "default" }}
														>
															Hotel Name
														</th>
														<th
															className=""
															style={{ width: "27%", cursor: "default" }}
														>
															Hotel Address
														</th>
													</tr>
												</thead>
												{skeleton.map((item, index) => (
													<tbody className="divide-y divide-gray-600">
														<tr>
															<td className="px-6 py-2">{index + 1}</td>
															<td className="px-6 py-2 ">Day {index + 1}</td>
															<td className="px-6 py-2 ">
																{!!item.date ? item.date : "-"}
															</td>
															<td className="px-6 py-2 ">
																{!!item.destination ? item.destination : "-"}
															</td>
															<td className="px-6 py-2">
																{!!item.overnightAt ? item.overnightAt : "-"}
															</td>
															<td className="px-6 py-2 ">
																{!!item.hotelName ? item.hotelName : "-"}
															</td>
															<td>
																<Tooltip title={item.hotelAddress} arrow>
																	<p className="truncate">
																		{!!item.hotelAddress
																			? item.hotelAddress
																			: "-"}
																	</p>
																</Tooltip>
															</td>
														</tr>
													</tbody>
												))}
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="tourprice mb-2">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">
												Tour price and discounts
											</div>
										</div>
										<div className="table-responsive">
											<table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1">
												<thead>
													<tr>
														<th
															className=""
															style={{ width: "10px", cursor: "default" }}
														>
															Sr.no
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Room Sharing
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Tour Price
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Offer Price
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Commission Price
														</th>
													</tr>
												</thead>
												{tourprice.map((item, index) => (
													<tbody className="divide-y divide-gray-600">
														<tr>
															<td className="px-6 py-2">{index + 1}</td>
															<td className="px-6 py-2">
																{!!item.roomShareName
																	? item.roomShareName
																	: "-"}
															</td>
															<td className="px-6 py-2">
																{!!item.tourPrice ? item.tourPrice : "-"}
															</td>
															<td className="px-6 py-2">
																{!!item.offerPrice ? item.offerPrice : "-"}
															</td>
															<td className="px-6 py-2">
																{!!item.commissionPrice
																	? Number(item.commissionPrice).toFixed()
																	: "-"}
															</td>
														</tr>
													</tbody>
												))}
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="detailsitinerary mb-2">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Detailed Itinerary</div>
										</div>
										{detailedItinerary.map((item, index) => (
											<div className="mb-3">
												<div className="d-flex mb-1">
													<label
														className="me-1"
														style={{
															color: "#024670",
															fontWeight: "600",
															fontSize: "1rem",
														}}
													>
														Day {index + 1} :{" "}
													</label>
													<div className="">
														<h6>{!!item.title ? item.title : "-"}</h6>
													</div>
												</div>
												<div
													className="list-type list-dec view-details mb-3"
													dangerouslySetInnerHTML={{
														__html: !!item.description ? item.description : "-",
													}}
												></div>
												<div className="row print-row-img">
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<label>Meal</label>
														<div>
															{item.mealTypeId.map((md) => (
																<div className="form-check form-check-inline">
																	<label
																		className="form-check-label"
																		htmlFor="inlineCheckbox1"
																	>
																		<input
																			className="form-check-input"
																			type="checkbox"
																			id="inlineCheckbox1"
																			value="option1"
																			checked={mealType.includes(
																				md.replace(/\d/g, "")
																			)}
																		/>

																		{md.replace(/\d/g, "")}
																	</label>
																</div>
															))}
														</div>
													</div>
													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<label>Stay</label>
														<div className="view-details">
															<h6>
																{!!item.nightStayAt ? item.nightStayAt : "-"}
															</h6>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<label>From City</label>
														<div className="view-details">
															<h6>{!!item.fromCity ? item.fromCity : "-"}</h6>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2">
														<label>To City</label>
														<div className="view-details">
															<h6>{!!item.toCity ? item.toCity : "-"}</h6>
														</div>
													</div>

													<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2 appro-print">
														<label>Approx. Travel Time</label>
														<div className="view-details">
															<h6>
																{!!item.approxTravelTime
																	? item.approxTravelTime
																	: "-"}
															</h6>
														</div>
													</div>
												</div>
												<div className="row">
													<div className="col-lg-2 col-md-3 col-12 col-sm-6 mb-2 print-img-row">
														<label>Banner Image</label>
														<div
															className="view-details border-0"
															style={{
																display: "flex",
																flexDirection: "column",
															}}
														>
															<a
																style={{
																	textTransform: "capitalize",
																	width: "150px",
																}}
																className="btn btn-save btn-primary print-btn"
																target="_blank"
																href={
																	!!item.bannerImage ? item.bannerImage : ""
																}
															>
																View Image
															</a>
															<img
																src={item.bannerImage}
																alt="backgroud"
																style={{ height: "200px" }}
																className="print-image"
															/>
														</div>
													</div>

													<div className="col-lg-2 col-md-3 col-12 mb-2 print-img-row">
														<label>Hotel Image</label>
														<div
															className="view-details border-0"
															style={{
																display: "flex",
																flexDirection: "column",
															}}
														>
															<a
																style={{
																	textTransform: "capitalize",
																	width: "150px",
																}}
																className="btn btn-save btn-primary print-btn"
																target="_blank"
																href={!!item.hotelImage ? item.hotelImage : ""}
															>
																View Image
															</a>
															<img
																src={item.hotelImage}
																alt="backgroud"
																style={{ height: "200px" }}
																className="print-image"
															/>
														</div>
													</div>
												</div>
												<div className="divider"></div>
											</div>
										))}
									</div>
								</div>
							</div>

							{flightDetails.length > 0 && (
								<div className="card">
									<div className="card-body">
										<div className="traindetails mb-2">
											<div
												className="card-header  pb-2 pt-2"
												style={{ paddingLeft: "0" }}
											>
												<div className="card-title h5">Flight Details</div>
											</div>

											<div className="table-responsive">
												<table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1">
													<thead>
														<tr>
															<th className="" style={{ cursor: "default" }}>
																Journey
															</th>
															<th className="" style={{ cursor: "default" }}>
																Flight No.
															</th>
															<th className="" style={{ cursor: "default" }}>
																Airline
															</th>
															<th className="" style={{ cursor: "default" }}>
																Class
															</th>
															<th className="" style={{ cursor: "default" }}>
																From
															</th>
															<th className="" style={{ cursor: "default" }}>
																Date
															</th>
															<th className="" style={{ cursor: "default" }}>
																Time
															</th>
															<th className="" style={{ cursor: "default" }}>
																To
															</th>
															<th className="" style={{ cursor: "default" }}>
																Date
															</th>
															<th className="" style={{ cursor: "default" }}>
																Time
															</th>
															<th className="" style={{ cursor: "default" }}>
																Weight
															</th>
														</tr>
													</thead>

													<tbody className="divide-y divide-gray-600">
														<tr>
															<td className="px-6 py-2">
																{flightDetails[0].journey}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].flight}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].airline}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].class}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].from}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].fromDate}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].fromTime}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].to}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].toDate}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].toTime}
															</td>
															<td className="px-6 py-2">
																{flightDetails[0].weight}
															</td>
														</tr>
														<tr>
															<td className="px-6 py-2">
																{flightDetails[1].journey}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].flight}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].airline}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].class}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].from}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].fromDate}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].fromTime}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].to}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].toDate}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].toTime}
															</td>
															<td className="px-6 py-2">
																{flightDetails[1].weight}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}

							{trainDetails.length > 0 && (
								<div className="card">
									<div className="card-body">
										<div className="traindetails mb-2">
											<div
												className="card-header  pb-2 pt-2"
												style={{ paddingLeft: "0" }}
											>
												<div className="card-title h5">Train Details</div>
											</div>

											<div className="table-responsive">
												<table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1">
													<thead>
														<tr>
															<th className="" style={{ cursor: "default" }}>
																Journey
															</th>
															<th className="" style={{ cursor: "default" }}>
																Train No.
															</th>
															<th className="" style={{ cursor: "default" }}>
																Train Name
															</th>
															<th className="" style={{ cursor: "default" }}>
																From
															</th>
															<th className="" style={{ cursor: "default" }}>
																Date
															</th>
															<th className="" style={{ cursor: "default" }}>
																Time
															</th>
															<th className="" style={{ cursor: "default" }}>
																To
															</th>
															<th className="" style={{ cursor: "default" }}>
																Date
															</th>
															<th className="" style={{ cursor: "default" }}>
																Time
															</th>
														</tr>
													</thead>

													<tbody className="divide-y divide-gray-600">
														<tr>
															<td className="px-6 py-2">
																{trainDetails[0].journey}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].trainNo}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].trainName}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].from}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].fromDate}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].fromTime}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].to}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].toDate}
															</td>
															<td className="px-6 py-2">
																{trainDetails[0].toTime}
															</td>
														</tr>
														<tr>
															<td className="px-6 py-2">
																{trainDetails[1].journey}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].trainNo}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].trainName}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].from}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].fromDate}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].fromTime}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].to}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].toDate}
															</td>
															<td className="px-6 py-2">
																{trainDetails[1].toTime}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="card">
								<div className="card-body">
									<div className="tourprice mb-2">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">
												Suggested Timings for D2D clients
											</div>
										</div>
										<div className="table-responsive">
											<table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1">
												<thead>
													<tr>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Arrival Details
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Arrival
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Departure Details
														</th>
														<th
															className=""
															style={{ width: "20px", cursor: "default" }}
														>
															Departure
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-600">
													<tr>
														<td className="px-6 py-2">Tour Start City</td>
														<td className="px-6 py-2">
															{!!d2dDetails.startCity
																? d2dDetails.startCity
																: "-"}
														</td>
														<td className="px-6 py-2">Tour End City</td>
														<td className="px-6 py-2">
															{!!d2dDetails.endCity ? d2dDetails.endCity : "-"}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2">
															Pick-up/Meeting point*
														</td>
														<td className="px-6 py-2">
															{!!d2dDetails.pickUpMeet
																? d2dDetails.pickUpMeet
																: "-"}
														</td>
														<td className="px-6 py-2">Drop-off point</td>
														<td className="px-6 py-2">
															{!!d2dDetails.dropOffPoint
																? d2dDetails.dropOffPoint
																: "-"}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2">Pick-up/Meeting time</td>
														<td className="px-6 py-2">
															{!!d2dDetails.pickUpMeetTime
																? d2dDetails.pickUpMeetTime
																: "-"}
														</td>
														<td className="px-6 py-2">Drop-off time</td>
														<td className="px-6 py-2">
															{!!d2dDetails.dropOffTime
																? d2dDetails.dropOffTime
																: "-"}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2">Arrive before</td>
														<td className="px-6 py-2">
															{!!d2dDetails.arriveBefore
																? d2dDetails.arriveBefore
																: "-"}
														</td>
														<td className="px-6 py-2">
															Book flight/train after
														</td>
														<td className="px-6 py-2">
															{!!d2dDetails.bookAfter
																? d2dDetails.bookAfter
																: "-"}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									{visaDetails.map((vs) => (
										<>
											<div className="skeleton mb-2">
												<div
													className="card-header  pb-2 pt-2"
													style={{ paddingLeft: "0" }}
												>
													{" "}
													<div className="card-title h5">Visa Details</div>
												</div>
												<div className="row mb-2">
													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>Visa Documents Required</label>
														<ul
															className="list-disc view-details mb-1"
															style={{ height: "auto" }}
														>
															<li>{vs.visaDocuments}</li>
														</ul>
													</div>

													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>Visa Fees</label>
														<div className="view-details">
															<h6>Rs.{vs.visaFee}</h6>
														</div>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>Visa Instruction</label>
														<div
															className="view-details"
															style={{ height: "auto" }}
														>
															<h6>{vs.visaInstruction}</h6>
														</div>
													</div>

													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>Visa Alerts</label>
														<div className="view-details">
															<h6>{vs.visaAlerts}</h6>
														</div>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-lg-3 col-md-4 col-sm-6 col-12">
														<label>Insurance Details</label>
														<ul
															className="list-disc view-details mb-1"
															style={{ height: "auto" }}
														>
															<li>{vs.insuranceDetails}</li>
														</ul>
													</div>

													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>Euro Star Train Details</label>
														<div className="view-details">
															<h6>{vs.euroTrainDetails}</h6>
														</div>
													</div>
												</div>
												<div className="row mb-2">
													<div className="col-lg-6 col-md-6 col-sm-12 col-12">
														<label>NRI/OCI/Foreign Details</label>
														<div className="view-details">
															<h6>{vs.nriOriForDetails}</h6>
														</div>
													</div>
												</div>
											</div>
										</>
									))}
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="inclusion mb-2">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Inclusions</div>
										</div>

										<ul className="list-type view-details">
											<>
												{" "}
												{inclusions?.length > 0
													? inclusions.map((inclusion, i) => (
															<li>
																{i + 1 + ")"} {inclusion.description}
															</li>
													  ))
													: "-"}
											</>
										</ul>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="exclusion">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Exclusions</div>
										</div>
										<ul className="list-type view-details">
											<>
												{" "}
												{exclusions.length > 0
													? exclusions.map((exclusion, i) => (
															<li>
																{i + 1 + ")"} {exclusion.description}
															</li>
													  ))
													: "-"}
											</>
										</ul>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="notes">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Notes</div>
										</div>
										<ul className="list-type view-details">
											{notes.map((item, index) => (
												<li style={{ marginBottom: "10px" }}>
													{" "}
													{!!item.note ? item.note : "-"}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="notes">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Shopping</div>
										</div>
										{grouptour.map((item, index) => (
											<ul className="list-type view-details">
												<li> {!!item.shopping ? item.shopping : "-"}</li>
											</ul>
										))}
									</div>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<div className="notes">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Weather</div>
										</div>
										{grouptour.map((item, index) => (
											<ul className="list-type view-details">
												<li> {!!item.weather ? item.weather : "-"}</li>
											</ul>
										))}
									</div>
									<div className="notes">
										<div
											className="card-header  pb-2 pt-2"
											style={{ paddingLeft: "0" }}
										>
											<div className="card-title h5">Website Description (Overview)</div>
										</div>
									
											<ul className="list-type view-details">
												<li> {!!grouptour[0]?.websiteDescription ? grouptour[0].websiteDescription : "-"}</li>
											</ul>
										
									</div>

									<div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2 banner-image-part">
														<div className="form-group">
															<label className="text-label">
																Website Banner Image
															</label>

															<div
																className="view-details border-0"
																style={{
																	display: "flex",
																	flexDirection: "column",
																}}
															>
																<a
																	className="btn btn-save btn-primary mb-2 print-btn"
																	target="_blank"
																	style={{ width: "150px" }}
																	href={
																		!!grouptour[0]?.websiteBanner
																			? grouptour[0]?.websiteBanner
																			: ""
																	}
																>
																	View Image
																</a>
																<img
																	src={grouptour[0]?.websiteBanner}
																	alt="backgroud"
																	style={{ height: "200px" }}
																	className="print-image"
																/>
															</div>
														</div>
													</div>
									
									<div className="col-lg-12 d-flex justify-content-between mb-2 mt-2 ">
										<Link
											to="/View-group-tour"
											type="submit"
											className="btn btn-back no-print"
										>
											Back
										</Link>

										{printPdfURL?.length > 0 ? (
											<a target="_blank" href={printPdfURL}>
												<button
													type="button"
													className="btn btn-submit no-print"
												>
													Print
													<svg
														xmlns="http://www.w3.org/2000/svg"
														height="0.7em"
														viewBox="0 0 512 512"
														style={{ paddingLeft: "2px" }}
													>
														<path d="M448 192V77.25c0-8.49-3.37-16.62-9.37-22.63L393.37 9.37c-6-6-14.14-9.37-22.63-9.37H96C78.33 0 64 14.33 64 32v160c-35.35 0-64 28.65-64 64v112c0 8.84 7.16 16 16 16h48v96c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32v-96h48c8.84 0 16-7.16 16-16V256c0-35.35-28.65-64-64-64zm-64 256H128v-96h256v96zm0-224H128V64h192v48c0 8.84 7.16 16 16 16h48v96zm48 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z" />
													</svg>
												</button>
											</a>
										) : (
											""
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
};
export default ViewTourDetails;
