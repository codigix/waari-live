import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import Delete from "../../../../images/delete.png"
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
	borderRadius: "0.3rem",
};
const AllFutureEnquiries = () => {
	// serching
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNo, setPhoneNo] = useState("");

	// to delete a user
	const [open, setOpen] = React.useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [render, setRender] = useState(true);

	const { permissions } = useSelector((state) => state.auth);


	const navigate = useNavigate();

	// to handle user delete popup
	const handleOpenDelete = (id) => {
		setDeleteId(id);
		setOpen(true);
	};


	// to delete user
	const handleDelete = async () => {
		try {
			setIsLoading(true);
			const responseData = await get(`/delete-future-enq?futureEnqId=${deleteId}`);
			setOpen(false);
			setRender(!render);

			if (responseData && responseData.status == 200) {
				toast.success(responseData?.data?.message);
			}
		} catch (error) {
		} finally {
			setIsLoading(false)
		}
	};

	//TABLE COLOMN
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
			dataIndex: "name",
			width: 50,
			sortable: true,
		},
		{
			title: "Cities",
			render: (item) => <div style={{textAlign:"center"}}>
				<Tooltip title={item.city.join(",")} arrow>
					<p className="truncate" >{item.city.join(",")}</p>
				</Tooltip>

			</div>,
			dataIndex: "city",
			key: "city",
			width: 80,
			sortable: true,
		},

		{
			title: "Phone Number",
			dataIndex: "phoneNo",
			key: "phoneNo",
			width: 80,
		},

		{
			title: "Start Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 70,
			sortable: true,
		},
		{
			title: "End Date",
			dataIndex: "endDate",
			key: "endDate",
			width: 70,
			sortable: true,
		},

		{
			title: "Address",
			render: (item) => <div>
				<Tooltip title={item.address} arrow>
					<p className="truncate">{item.address}</p>
				</Tooltip>

			</div>,
			dataIndex: "address",
			key: "address",
			width: 150,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: 90,
		},
		// {
		// 	title: "Status",
		// 	render: (item) => (
		// 		<div>
		// 			<badge className={`badge ${item.status ? "badge-success" : "badge-warning"}`}>
		// 				{item.status ? "Active" : "Inactive"}
		// 			</badge>
		// 		</div>
		// 	),
		// 	dataIndex: "status",
		// 	key: "status",
		// 	width: 80,
		// },
		hasComponentPermission(permissions, 137) &&	{
			title: "Action",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center gap-2">

						{hasComponentPermission(permissions, 137) && (
							<button
								className="btn-trash"
								onClick={() => handleOpenDelete(item?.futureEnqId)}
							>
								<Tooltip title="Delete" >
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="1em"
										viewBox="0 0 448 512"
									>
										<path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
									</svg>
								</Tooltip>
							</button>
						)}
					</div>
				</>
			),
			key: "role",
			width: 80,
		},

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
				`/future-enquiry-all-listing?perPage=${perPageItem}&page=${page}&name=${name}&email=${email}&phoneNo=${phoneNo}`
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
		hasComponentPermission(permissions, 135) && todaysFollowUp();
	}, [page, perPageItem, render]);



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
									<Link to="#">Future Tour Enquiry</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="#">All Enquiries</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div className="card-header mb-2" style={{ padding: "0" }}>
								<div className="card-title h5">Future Enquiries</div>
							</div>

						
							{hasComponentPermission(permissions, 135) && (
								<>
									<form className="mb-4">
										<div className="row">
											<div className="col-lg-10">
												<div className="row">
													<div className="col-md-4">
														<div className="form-group">
															<label>Guest Name</label>
															<input
																type="text"
																className="form-control"
																name="guestName"
																placeholder="Search..."
																onChange={(e) => setName(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<label>Email</label>
															<input
																type="text"
																className="form-control"
																name="email"
																placeholder="Search..."
																onChange={(e) => setEmail(e.target.value)}
															/>
														</div>
													</div>
													<div className="col-md-4">
														<div className="form-group">
															<label>Phone No</label>
															<input
																type="text"
																className="form-control"
																name="phoneNo"
																placeholder="Search..."
																onChange={(e) => setPhoneNo(e.target.value)}
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
									</form>
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
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				// onClose={handleClose}
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
						<img src={Delete} style={{width:"80px",display:"flex",justifyContent:"center",margin:"5px auto "}}/>
						<Typography id="transition-modal-title" variant="h6" component="h2">
							{/* <img
                src="../assets/images/delete.gif"
                width="150"
                className="mx-auto"
                alt=""
              /> */}
							<h3 className="info-text text-center mb-2">Delete</h3>
							{/* <Link
                onClick={() => setOpen(false)}
                className="text-red-500 close-btn absolute  top-0 right-2"
              >
                &times;
              </Link> */}
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
export default AllFutureEnquiries;
