import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";

const Customizedtour = () => {
	const navigate = useNavigate();
	const { permissions } = useSelector((state) => state.auth);

	//TABLE COLOMN
	const columns = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},

		{
			title: "Name",
			dataIndex: "contactName",
			key: "contactName",
			width: 100,
			sortable: true,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			key: "groupName",
			width: 100,
		},
		{
			title: "Travel Start Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 70,
			sortable: true,
		},
		{
			title: "Travel End Date",
			dataIndex: "endDate",
			key: "endDate",
			width: 70,
			sortable: true,
		},
		{
			title: "Phone No.",
			dataIndex: "contact",
			key: "contact",
			width: 100,
		},

		{
			title: "Tour Price",
			dataIndex: "tourPrice",
			key: "tourPrice",
			width: 100,
		},
		{
			title: "Discount",
			dataIndex: "additionalDis",
			key: "additionalDis",
			width: 90,
		},
		{
			title: "Discounted",
			dataIndex: "discountPrice",
			key: "discountPrice",
			width: 90,
		},
		{
			title: "GST",
			dataIndex: "gst",
			key: "gst",
			width: 90,
		},
		{
			title: "TCS",
			dataIndex: "tcs",
			key: "tcs",
			width: 90,
		},
		{
			title: "Grand",
			dataIndex: "grandTotal",
			key: "grandTotal",
			width: 90,
		},
		{
			title: "Paid",
			dataIndex: "advancePayment",
			key: "advancePayment",
			width: 90,
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			width: 90,
		},
		{
			title: "Due Date",
			dataIndex: "dueDate",
			key: "dueDate",
			width: 90,
		},
		{
			title: "Billing",
			render: (item) => (
				<>
					{/* <div className="d-flex  justify-content-center">
            <Link to="/details/customized-tour" className="btn-link">
              View Details
            </Link>
          </div> */}
					<div className="d-flex  justify-content-center">
						<span
							onClick={() =>
								navigate(
									`/details/customized-tour/${item?.enquiryCustomId}/${item.enquiryDetailCustomId}`
								)
							}
						>
							<Link className="btn-tick">
								<Tooltip title="View">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="1em"
										viewBox="0 0 576 512"
									>
										<path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
									</svg>
								</Tooltip>
							</Link>
						</span>
					</div>
				</>
			),
			width: 90,
		},
	];
	//TABLE COLOMN1
	const columns_upcoming = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},

		{
			title: "Name",
			dataIndex: "contactName",
			key: "contactName",
			width: 120,
			sortable: true,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			key: "groupName",
			width: 100,
		},
		{
			title: "Travel Start Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 70,
			sortable: true,
		},
		{
			title: "Travel End Date",
			dataIndex: "endDate",
			key: "endDate",
			width: 70,
			sortable: true,
		},
		{
			title: "Phone No.",
			dataIndex: "contact",
			key: "contact",
			width: 100,
		},

		{
			title: "Tour Price",
			dataIndex: "tourPrice",
			key: "tourPrice",
			width: 100,
		},
		{
			title: "Discount",
			dataIndex: "additionalDis",
			key: "additionalDis",
			width: 90,
		},
		{
			title: "Discounted",
			dataIndex: "discountPrice",
			key: "discounted",
			width: 90,
		},
		{
			title: "GST",
			dataIndex: "gst",
			key: "gst",
			width: 90,
		},
		{
			title: "TCS",
			dataIndex: "tcs",
			key: "tcs",
			width: 90,
		},
		{
			title: "Grand",
			dataIndex: "grandTotal",
			key: "grandTotal",
			width: 50,
		},
		{
			title: "Paid",
			dataIndex: "advancePayment",
			key: "advancePayment",
			width: 50,
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			width: 70,
		},
		{
			title: "Due Date",
			dataIndex: "dueDate",
			key: "dueDate",
			width: 90,
		},
		{
			title: "Billing",
			render: (item) => (
				<>
					<div className="d-flex  justify-content-center">
						<span
							onClick={() =>
								navigate(
									`/details/customized-tour/${item?.enquiryCustomId}/${item.enquiryDetailCustomId}`
								)
							}
						>
							<Link className="btn-tick">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 576 512"
								>
									<path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
								</svg>
							</Link>
						</span>
					</div>
				</>
			),
			key: "billing",
			width: 120,
		},
	];

	// for todays pagination start

	const [totalCount, setTotalCount] = useState(0);
	const [perPageItem, setPerPageItem] = useState(10);

	const [page, setPage] = React.useState(1);
	const handleChange = (event, value) => {
		setPage(value);
	};

	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};

	// for todays pagination end

	// to get the data for todays followup start
	const [data, setData] = useState([]);

	const todaysFollowUp = async () => {
		try {
			const response = await get(
				`/pending-pay-list-ct?perPage=${perPageItem}&page=${page}`
			);
			setData(response?.data?.data);
			let totalPages = response.data.total / response.data.perPage;
			setTotalCount(Math.ceil(totalPages));
			setPerPageItem(response.data.perPage);
		} catch (error) {
			console.log(error);
		}
	};
	// to get the data for todays followup end

	useEffect(() => {
		hasComponentPermission(permissions, 51) && todaysFollowUp();
	}, [page, perPageItem]);

	// for upcoming pagination start

	const [totalCountUpcoming, setTotalCountUpcoming] = useState(0);
	const [perPageItemUpcoming, setPerPageItemUpcoming] = useState(10);

	const [pageUpcoming, setPageUpcoming] = React.useState(1);
	const handleChangeUpcoming = (event, value) => {
		setPageUpcoming(value);
	};

	const handleRowsPerPageChangeUpcoming = (perPage) => {
		setPerPageItemUpcoming(perPage);
		setPageUpcoming(1);
	};

	// for upcoming pagination end

	// to get the data for todays followup start
	const [data_next, setDataNext] = useState([]);
	const UpcomingFollowUp = async () => {
		try {
			const response = await get(
				`/confirm-pay-list-ct?perPage=${perPageItemUpcoming}&page=${pageUpcoming}`
			);
			setDataNext(response?.data?.data);
			let totalPages = response.data.total / response.data.perPage;
			setTotalCountUpcoming(Math.ceil(totalPages));
			setPerPageItemUpcoming(response.data.perPage);
		} catch (error) {
			console.log(error);
		}
	};
	// to get the data for todays followup end

	useEffect(() => {
		hasComponentPermission(permissions, 55) && UpcomingFollowUp();
	}, [pageUpcoming, perPageItemUpcoming]);

	return (
		<>
			<div className="card"  style={{ marginBottom: '40px' }}>
				<div className="row page-titles mx-0 fixed-top-breadcrumb">
					   <ol className="breadcrumb">
                    
						<li className="breadcrumb-item active">
							<Link to="/dashboard">Dashboard</Link>
						</li>
						<li className="breadcrumb-item">
							<Link to="#">Billing</Link>
						</li>
						<li className="breadcrumb-item  ">
							<Link to="/billing-customized-tour">Customized Tour</Link>
						</li>
					</ol>
				</div>
			</div>
			{hasComponentPermission(permissions, 51) && (
				<>
					<div className="row">
						<div className="col-lg-12">
							<div className="card">
								<div className="card-body">
									<div>
										<div className="row">
											<div className="col-lg-10">
												<div className="row">
													<div className="col-md-4 col-lg-3 col-sm-6 col-12">
														<div className="form-group">
															<label>Guest Name</label>
															<input type="text" className="form-control" />
														</div>
													</div>
													<div className="col-md-4 col-lg-3 col-sm-6 col-12">
														<div className="form-group">
															<label>Tour Name</label>
															<input type="text" className="form-control" />
														</div>
													</div>
													<div className="col-md-4 col-lg-3 col-sm-6 col-12">
														<div className="form-group">
															<label>Travel Date Start From</label>
															<input
																type="date"
																className="form-control"
																name="tourName"
															/>
														</div>
													</div>
													<div className="col-md-4 col-lg-3 col-sm-6 col-12">
														<div className="form-group">
															<label>Travel Date End To</label>

															<input
																type="date"
																className="form-control"
																name="tourName"
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-2 d-flex align-items-end">
												<button
													type="submit"
													className="btn btn-primary filter-btn"
												>
													Search
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12">
							<div className="card">
								<div className="card-header">
									<div className="card-title h5">New Payments Received</div>
								</div>
								<div className="card-body">
									<Table
										cols={columns}
										page={page}
										data={data}
										totalPages={totalCount}
										handlePageChange={handleChange}
										handleRowsPerPageChange={handleRowsPerPageChange}
										isTableLoading={false}
										isPagination={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
			{hasComponentPermission(permissions, 55) && (
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-title h5">Payments and Billing</div>
							</div>
							<div className="card-body">
								<Table
									cols={columns_upcoming}
									page={pageUpcoming}
									data={data_next}
									totalPages={totalCountUpcoming}
									handlePageChange={handleChangeUpcoming}
									handleRowsPerPageChange={handleRowsPerPageChangeUpcoming}
									isTableLoading={false}
									isPagination={true}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default Customizedtour;
