import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
	borderRadius: "0.3rem",
};
const PresaleGroupTour = () => {
	// serching
	const [search, setSearch] = useState("");
	const [tourName, setTourName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");


	const { permissions } = useSelector((state) => state.auth);

	const [open, setOpen] = React.useState(false);
	const [enquiryGroupId, setEnquiryGroupId] = useState("");
	const handleOpen = (item) => {
		setEnquiryGroupId(item?.enquiryGroupId);
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const [openLost, setOpenLost] = React.useState(false);
	const [customEnquiryId, setCustomEnquiryID] = React.useState("");

	const handleOpenLost = (enquiryId) => {
		setCustomEnquiryID(enquiryId);
		setOpenLost(true);
	};

	const navigate = useNavigate();

	//TABLE COLOMN
	const columns = [
		{
			title: "Sr.No.",
			render: (item, index) => (
				<>{page * perPageItem - perPageItem + (index + 1)}</>
			),
			width: 40,
		},
		{
			title: "Full Name",
			dataIndex: "firstName",
			width: 50,
			sortable: true,
		},
		{
			title: "Preferred Tour",
			dataIndex: "tourName",
			key: "tour_name",
			width: 120,
		},

	
		{
			title: "Contact Number",
			dataIndex: "contactNo",
			key: "number",
			width: 80,
		},


	
		{
			title: "No of Travel People",
			dataIndex: "noOfTravelPeople",
			key: "pax",
			width: 90,
		},
		{
			title: "Enquiry Reference",
			dataIndex: "enquiryReferName",
			key: "pax",
			width: 90,
		},
		hasComponentPermission(permissions, 302)
			? {
					title: "Assign",
					render: (item) => (
						<>
							<div className="d-flex justify-content-center">
								{hasComponentPermission(permissions, 302) && (
									<span
										className=""
										onClick={() => navigate(`/assign-gt-enquiry/${item.id}`)}
									>
										<Link className="btn-edit-user  me-2">
										<Tooltip title="Assign">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												classname="svg-edit"
												height="1em"
												viewBox="0 0 512 512"
											>
												<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
											</svg>
											</Tooltip>
										</Link>
									</span>
								)}

				
							</div>
						</>
					),
					key: "Status",
					width: 90,
			  }
			: undefined,
	];

	const finalTodaysFollowupColumns = columns.filter((column) => column);


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
	const [isLoading, setIsLoading] = useState(false);

	const todaysFollowUp = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/plan-enq-users-list-gt?perPage=${perPageItem}&page=${page}`
			);
			setIsLoading(false);
			setData(response?.data?.data);
			setTotalCount(response.data?.lastPage);
			setPerPageItem(response.data.perPage);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};
	// to get the data for todays followup end

	useEffect(() => {
		hasComponentPermission(permissions, 303) && todaysFollowUp();
	}, [page, perPageItem]);


	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			nextFollowUpDate: "",
			remark: "",
		},
		validationSchema: Yup.object({
			nextFollowUpDate: Yup.string().required("Enter The Next Follow Up"),
			remark: Yup.string().required("Enter The Remark"),
		}),

		onSubmit: async (values, { resetForm }) => {
			console.log(values);

			let data = {
				enquiryGroupId: enquiryGroupId,
				nextFollowUp: values.nextFollowUpDate,
				remark: values.remark,
			};

			try {
				setIsLoading(true);
				const response = await post(`/update-group-follow-up`, data);
				setIsLoading(false);
				resetForm();
				setOpen(false);
				toast.success(response?.data?.message);
				todaysFollowUp();
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});

	// to put the enquiry in lost start
	const handleCloseLost = () => setOpenLost(false);
	const validationLost = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			closureReason: "",
		},
		validationSchema: Yup.object({
			closureReason: Yup.string().required("Enter The closureReason"),
		}),

		onSubmit: async (values, { resetForm }) => {
			try {
				let data = {
					enquiryGroupId: customEnquiryId,
					closureReason: values.closureReason,
				};

				setIsLoading(true);
				const response = await post(`/cancel-enquiry-group-tour`, data);
				setIsLoading(false);
				resetForm();
				setOpenLost(false);
				toast.success(response?.data?.message);
				todaysFollowUp();
			} catch (error) {
				setIsLoading(false);
			}
		},
	});

	useEffect(() => {
		setTimeout(() => {
			const textareas = document.getElementById("remark1");

			textareas &&
				textareas.addEventListener("input", function () {
					this.style.height = "auto"; // Reset height to auto
					this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
				});
		}, 1000);
	}, [open]);

	useEffect(() => {
		setTimeout(() => {
			const textareas = document.getElementById("reasonclosure");

			textareas &&
				textareas.addEventListener("input", function () {
					this.style.height = "auto"; // Reset height to auto
					this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
				});
		}, 1000);
	}, [open]);
	return (
		<>
			<div className="row">
				<div className="col-lg-12" style={{ paddingTop: '40px' }}>
					<div className="card">
						<div
							className="row page-titles pages-title-btn pages-btn mx-0 fixed-top-breadcrumb"
							style={{ marginBottom: "0" }}
						>
							<ol className="breadcrumb">
								<li className="breadcrumb-item active">
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item ">
									<Link to="/presale-group-tour-new">Enquiry follow-up</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="/presale-group-tour-new">Group Tour</Link>
								</li>
							</ol>
						</div>
					</div>
		
					<div className="card">
						<div className="card-body">
							<div className="card-header mb-3" style={{ padding: "0" }}>
								<div className="card-title h5">Presales Group Journey Enquiries</div>
							</div>

							
							{hasComponentPermission(permissions, 303) && (
								<>
									{/* <form className="mb-4">
										<div className="row">
											<div className="col-lg-10">
												<div className="row">
													<div className="col-md-3">
														<div className="form-group">
															<label>Guest Name</label>
															<input
																type="text"
																className="form-control"
																name="guestName"
																placeholder="Search..."
																onChange={(e) => setSearch(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="form-group">
															<label>Tour Name</label>
															<input
																type="text"
																className="form-control"
																name="tourName"
																placeholder="Search..."
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
													onClick={() => todaysFollowUp()}
												>
													Search
												</button>
											</div>
										</div>
									</form> */}
									<Table
										cols={finalTodaysFollowupColumns}
										page={page}
										data={data}
										totalPages={totalCount}
										handlePageChange={handleChange}
										handleRowsPerPageChange={handleRowsPerPageChange}
										isTableLoading={isLoading}
										isPagination={true}
									/>
								</>
							)}
						</div>
					</div>
				</div>
			</div>


			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography>
						<Link
							onClick={() => setOpen(false)}
							className="close d-flex justify-content-end text-danger"
						>
							&times;
						</Link>
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						<form
							className="needs-validation"
							onSubmit={(e) => {
								e.preventDefault();
								validation.handleSubmit();
								return false;
							}}
						>
							<div className="form-group mb-2">
								<label>Next Follow Up</label>
								<input
									type="date"
									className="form-control"
									name="nextFollowUpDate"
									min={new Date().toISOString().split("T")[0]}
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.nextFollowUpDate}
								/>
								{validation.touched.nextFollowUpDate &&
								validation.errors.nextFollowUpDate ? (
									<span className="error">
										{validation.errors.nextFollowUpDate}
									</span>
								) : null}
							</div>
							<div className="form-group mb-2">
								<label>Remark</label>
								<textarea
									// ref={textareaRef}
									type="text"
									id="remark1"
									className="textarea"
									name="remark"
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.remark}
								/>
								{validation.touched.remark && validation.errors.remark ? (
									<span className="error">{validation.errors.remark}</span>
								) : null}
							</div>
							<div className="mb-2 mt-2 row">
								<div className="col-lg-12 d-flex justify-content-end">
									<button
										type="submit"
										className="btn btn-submit btn-primary"
										disabled={isLoading}
									>
										{isLoading ? "Submitting" : "Submit"}
									</button>
								</div>
							</div>
						</form>
					</Typography>
				</Box>
			</Modal>

			<Modal
				open={openLost}
				onClose={handleCloseLost}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography>
						<Link
							onClick={() => setOpenLost(false)}
							className="close d-flex justify-content-end text-danger"
						>
							<span>&times;</span>
						</Link>
					</Typography>
			
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						<form
							className="needs-validation"
							onSubmit={(e) => {
								e.preventDefault();
								validationLost.handleSubmit();
								return false;
							}}
						>
							<div className="form-group mb-2">
								<label>Reason For Closure</label>
								<textarea
									type="text"
									id="reasonclosure"
									name="closureReason"
									className="textarea"
									onChange={validationLost.handleChange}
									onBlur={validationLost.handleBlur}
									value={validationLost.values.closureReason}
								/>
								{validationLost.touched.closureReason &&
								validationLost.errors.closureReason ? (
									<span className="error">
										{validationLost.errors.closureReason}
									</span>
								) : null}
							</div>
							<div className="mb-2 mt-2 row">
								<div className="col-lg-12 d-flex justify-content-end">
									<button type="submit" className="btn btn-submit btn-primary">
										Submit
									</button>
								</div>
							</div>
						</form>
					</Typography>
				</Box>
			</Modal>
		</>
	);
};
export default PresaleGroupTour;
