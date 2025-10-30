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
import BackButton from "../../common/BackButton"
import * as XLSX from "xlsx";

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

const GitOperationToursList = () => {
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

	const [isExporting, setIsExporting] = useState(false);

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
			const response = await get(`${import.meta.env.VITE_WAARI_BASEURL}/city-list`);
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
	const exportToExcel = async (enquiryId, tourName) => {
		try {
			setIsExporting(true);

			const response = await get(`guests-group-tour?groupTourId=${enquiryId}`);
			const headers = [
				"Sr. No.",
				"familyHeadName",
				"Gender",
				"Contact",
				"Address",
				"Date of Birth",
				"Aadhaar Number",
			];

			// Map the data to use custom headers
			const mappedData = response.data?.data?.map(
				(
					{ familyHeadName, gender, contact, address, dob, adharNo },
					index
				) => ({
					"Sr. No.": index + 1,
					familyHeadName: familyHeadName,
					Gender: gender,
					Contact: contact || "-",
					Address: address,
					"Date of Birth": dob,
					"Aadhaar Number": adharNo,
				})
			);

			// Create a worksheet
			const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });

			// Create a workbook
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

			// Save the workbook to a file
			XLSX.writeFile(wb, `${tourName}.xlsx`);

			setIsExporting(false);
		} catch (err) {
			setIsExporting(false);
			console.error(err);
		}
	};

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
			title: "View",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<span
							onClick={() => navigate(`/git-operation-tabs/${item.groupTourId}`)}
						>
							<Link className="btn-tick me-2">
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
				`/view-group-tour?perPage=${perPageItem}&page=${page}&tourName=${tourName}&tourType=${
					tourType?.value || ""
				}&travelMonth=${travelMonth}&totalDuration=${totalDuration}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}&departureType=${departureType}&cityId=${
					city?.value || ""
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
		(hasComponentPermission(permissions, 369) )  && getViewgrouplist();
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
							
								<li className="breadcrumb-item  ">
									<Link to="/git-operation-tours-list">Operation Tours List</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
						
							{(hasComponentPermission(permissions, 369)) && (
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

			{( hasComponentPermission(permissions, 369)) && (
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
export default GitOperationToursList;
