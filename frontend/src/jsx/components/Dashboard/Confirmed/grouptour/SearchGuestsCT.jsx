import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../table/VTable";
import { get } from "../../../../../services/apiServices";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../../common/BackButton";

const SearchGuestsCT = () => {
	//TABLE COLOMN
	const navigate = useNavigate();
	const { permissions } = useSelector((state) => state.auth);

	const columns = [
		{
			title: "Sr.no",
			render: (item, index) =>
				<>{page * perPageItem - perPageItem + index + 1}</>,
			key: "srno",
			width: 8,
		},
		{
			title: "Guest Name",
			dataIndex: "guestName",
			key: "guestName",
			width: 120,
			sortable: true,
			render: (item, index) => (
				<span>
					{item.firstName + " " + item.lastName}
				</span>
			)
		},
		{
			title: "Gender",
			dataIndex: "gender",
			key: "gender",
			width: 50,
		},
		{
			title: "GuestId",
			dataIndex: "guestId",
			key: "guestId",
			width: 50,
		},
		{
			title: "Contact",
			dataIndex: "contact",
			key: "contact",
			width: 50,
		},
		{
			title: "View Details",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<span
							className="p-1"
							onClick={() => {
								navigate(
									`/custom-tour-guests-details/${item?.enquiryCustomId}/${item.enquiryDetailCustomId}`
								);
							}}
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
			key: "billing",
			width: 80,
		},
	];

	const finalColumns = columns.filter((column) => column);

	// for pagination start

	const [totalCount, setTotalCount] = useState(0);
	const [perPageItem, setPerPageItem] = useState(10);

	const [page, setPage] = React.useState(1);
	const handleChange = (event, value) => {
		console.log(value);
		setPage(value);
	};

	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};

	// for pagination end

	// to get the confirm group list
	const [data, setData] = useState([]);
	const [guestId, setGuestId] = useState("");
	const [isLoading, setIsLoading] = useState(false);


	const getGuestsList = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/guest-detail-ct-list?guestId=${guestId}&perPage=${perPageItem}&page=${page}`
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
		hasComponentPermission(permissions, 318) && getGuestsList();
	}, [page, perPageItem]);

	return (
		<>
			{hasComponentPermission(permissions, 318) && (
				<>
					<div className="row">
						<div className="col-lg-12" style={{ paddingTop: '40px' }}>
							<div className="card">
								<div className="row page-titles mx-0 fixed-top-breadcrumb">
									<ol className="breadcrumb">
									
										<li className="breadcrumb-item active">
											<Link to="/dashboard">Dashboard</Link>
										</li>
										<li className="breadcrumb-item">
											<Link to="#">Search Guests</Link>
										</li>

									</ol>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<form>
										<div className="row">
											<div className="col-lg-6">
												<div className="row">
													<div className="col-md-3">
														<div className="form-group">
															<label>Guest Id</label>
															<input
																type="text"
																className="form-control"
																name="guestID"
																placeholder="Search by GuestID..."
																onChange={(e) => setGuestId(e.target.value)}
															/>
														</div>
													</div>

												</div>
											</div>
											<div className="col-lg-2 d-flex align-items-end">
												<button
													type="button"
													className="btn btn-primary filter-btn"
													onClick={() => {
														setPage(1);
														getGuestsList();
													}}
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
								<div className="card-body">
									<div className="card-header  mb-2 p-0">
										<div className="card-title h5">
											Custom Tour Guests List
										</div>
									</div>

									<Table
										cols={finalColumns}
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
				</>
			)}
		</>
	);
};
export default SearchGuestsCT;
