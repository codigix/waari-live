import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../common/BackButton";

const ConfirmCustomizedtour = () => {
	//TABLE COLOMN
	const navigate = useNavigate();
	const { permissions } = useSelector((state) => state.auth);

	const columns = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			key: "groupName",
			width: 120,
		},
		{
			title: "Guest Name",
			dataIndex: "contactName",
			key: "contactName",
			width: 120,
			sortable: true,
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
			width: 80,
			sortable: true,
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
			key: "discountPrice",
			width: 80,
		},
		{
			title: "Discounted",
			dataIndex: "discountPrice",
			key: "additionalDis",
			width: 80,
		},
		{
			title: "GST",
			dataIndex: "gst",
			key: "gst",
			width: 80,
		},
		{
			title: "TCS",
			dataIndex: "tcs",
			key: "tcs",
			width: 80,
		},
		{
			title: "Grand",
			dataIndex: "grandTotal",
			key: "grandTotal",
			width: 80,
		},
		{
			title: "Paid",
			dataIndex: "advancePayment",
			key: "advancePayment",
			width: 80,
		},
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			width: 80,
		},
		{
			title: "Billing",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<span
							onClick={() =>
								navigate(
									`/payment-customized-tour/${item?.enquiryCustomId}/${item.enquiryDetailCustomId}`
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
			width: 80,
		},
	];

	//TABLE COLOMN1
	const columns_upcoming = [
		{
			title: "Enq Id",
			dataIndex: "enqno",
			key: "enqno",
			width: 40,
		},
		{
			title: "Group Name",
			dataIndex: "tour-name",
			key: "tour-name",
			width: 100,
		},
		{
			title: "Guest Name",
			dataIndex: "name",
			width: 100,
			sortable: true,
		},
		{
			title: "Numbers",
			dataIndex: "number",
			key: "number",
			width: 100,
			sortable: true,
		},

		{
			title: "Tour Price",
			dataIndex: "tour-price",
			key: "tour-price",
			width: 100,
		},
		{
			title: "Discount",
			dataIndex: "discount",
			key: "discount",
			width: 90,
		},
		{
			title: "Discounted",
			dataIndex: "discounted",
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
			dataIndex: "grand",
			key: "grand",
			width: 90,
		},
		{
			title: "Paid",
			dataIndex: "paid",
			key: "Paid",
			width: 90,
		},
		// {
		//   title: "Due Date",
		//   dataIndex: "duedate",
		//   key: "duedate",
		//   width: 90,
		// },
		{
			title: "Balance",
			dataIndex: "balance",
			key: "balance",
			width: 90,
		},

		{
			title: "Collect",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<Link to="/payment-customized-tour" className="btn-link">
							Receiver
						</Link>
					</div>
				</>
			),
			key: "collect",
			width: 90,
		},
		{
			title: "Billing",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<Link to="/view-billing" className="btn-tick">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="1em"
								viewBox="0 0 576 512"
							>
								<path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
							</svg>
						</Link>
					</div>
				</>
			),
			key: "billing",
			width: 60,
		},
	];

	const data_next = [
		{
			enqno: "1",
			name: "Neha Sharma",
			number: "1",
			"tour-name": "Shimla",
			"tour-price": "3000",
			discount: "30%",
			discounted: "10%",
			gst: "2%",
			tcs: "dd",
			Grand: "re",
			paid: "2000",
			duedate: "20/03/2022",
			balance: "1000",
		},
	];

	// for pagination start

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

	// for pagination end
	// serching
	const [guestName, setGuestName] = useState([]);
	const [tourName, setTourName] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	//to start get confirm group list
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const getConfirmcustomlist = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/confirm-custom-list?perPage=${perPageItem}&page=${page}&guestName=${guestName}&tourName=${tourName}&startDate=${startDate}&endDate=${endDate}`
			);
			setIsLoading(false);
			setData(response?.data?.data);
			let totalPages = response.data.total / response.data.perPage;
			setTotalCount(Math.ceil(totalPages));
			setPerPageItem(response.data.perPage);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};
	useEffect(() => {
		hasComponentPermission(permissions, 41) && getConfirmcustomlist();
	}, [page, perPageItem]);

	return (
		<>
			{hasComponentPermission(permissions, 41) && (
				<>
					<div className="row">
						<div className="col-lg-12" style={{ paddingTop: '40px' }}>
							<div className="card">
								<div className="row page-titles mx-0 fixed-top-breadcrumb">
									<ol className="breadcrumb">
										<li className="breadcrumb-item">
											<BackButton />
										</li>
										<li className="breadcrumb-item active">
											<Link to="/dashboard">Dashboard</Link>
										</li>
										<li className="breadcrumb-item">
											<Link to="#">Confirmed</Link>
										</li>
										<li className="breadcrumb-item  ">
											<Link to="/confirm-customized-tour">Customized Tour</Link>
										</li>
									</ol>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<form>
										<div className="row">
											<div className="col-md-10">
												<div className="row">
													<div className="col-md-3">
														<div className="form-group">
															<label>Guest Name</label>
															<input
																type="text"
																className="form-control"
																placeholder="Search..."
																onChange={(e) => setGuestName(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="form-group">
															<label>Group Name</label>
															<input
																type="text"
																className="form-control"
																name="tourName"
																onChange={(e) => setTourName(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="form-group">
															<label>Travel Date Start From</label>
															<input
																type="date"
																className="form-control"
																name="tourName"
																onChange={(e) => setStartDate(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="form-group">
															<label>Travel Date End To</label>
															<input
																type="date"
																className="form-control"
																name="tourName"
																onChange={(e) => setEndDate(e.target.value)}
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-2 d-flex align-items-end">
												<button
													type="button"
													className="btn btn-primary filter-btn"
													onClick={() => (setPage(0), getConfirmcustomlist())}
												>
													Search
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12">
							<div className="card">
								<div className="card-header mt-2">
									<div className="card-title h5">
										Payment Collection Due Today
									</div>
								</div>
								<div className="card-body">
									<Table
										cols={columns}
										page={page}
										data={data}
										handlePageChange={handleChange}
										totalPages={totalCount}
										isTableLoading={isLoading}
										handleRowsPerPageChange={handleRowsPerPageChange}
										isPagination={true}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row d-none">
						<div className="col-lg-12">
							<div className="card">
								<div className="card-header">
									<div className="card-title h5">
										Payment Collection Due Late
									</div>
								</div>
								<div className="card-body">
									<Table
										cols={columns_upcoming}
										page={1}
										data={data_next}
										totalPages={1}
										isTableLoading={isLoading}
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};
export default ConfirmCustomizedtour;
