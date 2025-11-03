import React, { useEffect, useState } from "react";
import Select from "react-select";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Delete from "../../../../images/delete.png";
import * as XLSX from "xlsx";
import BackButton from "../../common/BackButton";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
};

const DraftGroupTourList = () => {
	const [isClearable, setIsClearable] = useState(true);
	const [isSearchable, setIsSearchable] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { permissions } = useSelector((state) => state.auth);

	// to delete record start
	const [open, setOpen] = React.useState(false);
	const [deleteId, setDeleteId] = useState("");

	const handleOpenDelete = (id) => {
		setDeleteId(id);
		setOpen(true);
	};

	const [render, setRender] = useState(true);
	const handleDelete = async () => {
		try {
			setIsLoading(true);
			const responseData = await get(
				`/delete-group-tour-list?groupTourId=${deleteId}`
			);
			setOpen(false);
			setRender(!render);
			setIsLoading(false);

			toast.success(responseData?.data?.message);
		} catch (error) {
			setIsLoading(false);
		}
	};
	// to delete record end

	// search parameters start
	const [tourName, setTourName] = useState("");
	const [tourType, setTourType] = useState(null);
	const [travelMonth, setTravelMonth] = useState("");
	const [totalDuration, setTotalDuration] = useState("");
	const [travelStartDate, setTravelStartDate] = useState("");
	const [travelEndDate, setTravelEndDate] = useState("");
	const [departureType, setDepartureType] = useState("");
	const [city, setCity] = useState(null);
	const [tourTypeOptions, setTourTypeOptions] = useState([]);
	const [cityOptions, setCityOptions] = useState([]);


	// search parameters end
	//get tour type
	const getTourTypeList = async () => {
		try {
			const response = await get(`/tour-type-list`);
			setTourTypeOptions(
				response.data.data.map((m) => ({
					value: m.tourTypeId,
					label: m.tourTypeName,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};

	//get city data
	const getCityList = async () => {
		try {
			const response = await get(`/city-list`);
			setCityOptions(
				response.data.data.map((m) => ({
					label: m.citiesName,
					value: m.citiesId,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};

	//  // Function to handle download when button is clicked
	//  const handleDownload = (pdfUrl, tourName) => {
	// 	if (pdfUrl) {
	// 	  // Create a hidden anchor element
	// 	  const anchor = document.createElement('a');
	// 	  anchor.style.display = 'none';
	// 	  anchor.href = pdfUrl;
	// 	  anchor.download = `${tourName}.pdf`;
	// 	  document.body.appendChild(anchor);
	// 	  anchor.click();
	// 	  document.body.removeChild(anchor);
	// 	} else {
	// 	  console.error('PDF URL is empty');
	// 	}
	//   };

	//TABLE COLOMN

	const columns = [
		{
			title: "Tour Id",
			dataIndex: "groupTourId",
			key: "groupTourId",
			width: 50,
		},
		{
			title: "Tour Name",
			dataIndex: "tourName",
			key: "tourName",
			width: 150,
			sortable: true,
		},
		{
			title: "Tour Code",
			dataIndex: "tourCode",
			key: "tourCode",
			width: 100,
			sortable: true,
		},
		{
			title: "Tour Type",
			dataIndex: "tourTypeName",
			key: "tourTypeName",
			width: 100,
			sortable: true,
		},
		{
			title: "Departure Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 70,
		},
		{
			title: "Arrival date",
			dataIndex: "endDate",
			key: "endDate",
			width: 70,
		},

		{
			title: "Duration",
			dataIndex: "duration",
			key: "duration",
			width: 70,
		},

		{
			title: "Total Seats",
			dataIndex: "totalSeats",
			key: "totalSeats",
			width: 70,
		},
		{
			title: "Seats Booked",
			dataIndex: "seatsBook",
			key: "seatsBook",
			width: 70,
		},
		{
			title: "Available",
			dataIndex: "seatsAval",
			key: "seatsAval",
			width: 70,
		},
		{
			title: "View",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">


						{hasComponentPermission(permissions, 77) && (
							<span
								className=""
								onClick={() => {
									navigate(`/group-tour-draft/${item?.groupTourId}`);
								}}
							>
								<Link
									// to="/group-edit-tour"
									className=" btn-tick me-2"
								>
									<Tooltip title="Edit">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 512 512"
										>
											<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
										</svg>
									</Tooltip>
								</Link>
							</span>
						)}



						{hasComponentPermission(permissions, 78) && (
							<Link
								className="btn-trash me-1"
								onClick={() => handleOpenDelete(item?.groupTourId)}
							>
								<Tooltip title="Delete">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="1em"
										viewBox="0 0 448 512"
									>
										<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
									</svg>
								</Tooltip>
							</Link>
						)}


					</div>
				</>
			),
			key: "view",
			width: 150,
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

	//to start get tour group list
	const [data, setData] = useState([]);

	const getViewgrouplist = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-draft-group-tour?perPage=${perPageItem}&page=${page}&tourName=${tourName}&tourType=${tourType?.value || ""
				}&travelMonth=${travelMonth}&totalDuration=${totalDuration}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}&departureType=${departureType}&cityId=${city?.value || ""
				}`
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
		hasComponentPermission(permissions, 74) && getViewgrouplist();
	}, [page, perPageItem, render]);
	// to get the tour group list
	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};
	useEffect(() => {
		getTourTypeList();
		getCityList();
	}, []);

	return (
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
									<Link to="javascript:void(0)">View Tour</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="/view-draft-grouptours-list">Draft Group Tours</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">

							{hasComponentPermission(permissions, 74) && (
								<form>
									<div className="row">
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Tour Name</label>
												<input
													type="text"
													className="form-control"
													placeholder="Search..."
													onChange={(e) => setTourName(e.target.value)}
												/>
											</div>
										</div>

										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Tour type</label>
												<Select
													styles={customStyles}
													id="tours"
													name="tours"
													options={tourTypeOptions}
													className="basic-single"
													classNamePrefix="select"
													onChange={(e) => setTourType(e)}
													value={tourType}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Travel Month</label>
												<input
													type="month"
													className="form-control"
													placeholder="Search..."
													onChange={(e) => setTravelMonth(e.target.value)}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Total Duration(days)</label>
												<input
													type="text"
													className="form-control"
													placeholder="Search..."
													onChange={(e) => setTotalDuration(e.target.value)}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Travel Date Start From</label>
												<input
													type="date"
													className="form-control"
													placeholder="Search..."
													onChange={(e) => setTravelStartDate(e.target.value)}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>Travel Date End To</label>
												<input
													type="date"
													className="form-control"
													placeholder="Search..."
													onChange={(e) => setTravelEndDate(e.target.value)}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-4 col-sm-6 col-12">
											<div className="mb-2">
												<label>City</label>
												<Select
													styles={customStyles}
													className="basic-single"
													classNamePrefix="select"
													name="color"
													options={cityOptions}
													onChange={(e) => setCity(e)}
													value={city}
												/>
											</div>
										</div>
										<div className="col-md-1 d-flex align-items-end">
											<button
												type="button"
												className="btn btn-primary mb-2 filter-btn"
												onClick={() => {
													setPage(1);
													getViewgrouplist();
												}}
											>
												Search
											</button>
										</div>
									</div>
								</form>
							)}
						</div>
					</div>
				</div>
			</div>

			{hasComponentPermission(permissions, 74) && (
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
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
			)}

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<Typography>
							<Link
								onClick={() => setOpen(false)}
								className="close d-flex justify-content-end text-danger"
							>
								<span>&times;</span>
							</Link>
						</Typography>
						<img
							src={Delete}
							style={{
								width: "80px",
								display: "flex",
								justifyContent: "center",
								margin: "5px auto ",
							}}
						/>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							<h3 className="info-text text-center mb-2">Delete</h3>
						</Typography>
						<Typography id="transition-modal-description" sx={{ mt: 2 }}>
							<p className="info  text-sm mb-2 mt-2 text-center">
								Are you sure want to delete?
							</p>
							<div className=" d-flex mx-auto  justify-content-center">
								<button
									className="btn btn-back me-1"
									onClick={handleDelete}
									disabled={isLoading}
								>
									{isLoading ? "Deleting..." : "Delete"}
								</button>
								<button
									className="btn btn-save btn-primary"
									disabled={isLoading}
									onClick={(e) => setOpen(false)}
								>
									Cancel
								</button>
							</div>
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};
export default DraftGroupTourList;
