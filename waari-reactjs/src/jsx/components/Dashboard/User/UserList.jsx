import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import Select from "react-select";
import { get, post } from "../../../../services/apiServices";
import { Switch, Tooltip } from "@mui/material";
import PopupModal from "../Popups/PopupModal";
import ConfirmationDialog from "../Popups/ConfirmationDialog";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import Delete from "../../../../images/delete.png";
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

const User = () => {
	const [usersList, setUsersList] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [perPageItem, setPerPageItem] = useState(10);
	// const [userName, setUserName] = useState("");
	const [hasStatusChange, setHasStatusChange] = useState(false);
	const [statusChangeData, setStatusChangeData] = useState({
		userId: null,
		status: 0,
	});
	// to delete a user
	const [open, setOpen] = React.useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [render, setRender] = useState(true);
	const { permissions } = useSelector((state) => state.auth);

	// to handle user delete popup
	const handleOpenDelete = (id) => {
		setDeleteId(id);
		setOpen(true);
	};

	// to delete user
	const handleDelete = async () => {
		try {
			setIsTableLoading(true);
			const responseData = await get(`/delete-user?userId=${deleteId}`);
			setOpen(false);
			setRender(!render);
			setIsTableLoading(false);

			if (responseData && responseData.status == 200) {
				toast.success(responseData?.data?.message);
			}
		} catch (error) {
			setIsTableLoading(false);
		}
	};

	//GET GUEST LIST
	const getUsersList = async () => {
		try {
			setIsTableLoading(true);
			const response = await get(
				`lists-user?page=${page}&perPage=${perPageItem}`
			);
			setTotalPages(response?.data?.lastPage);
			setUsersList(response?.data?.data);
			setPerPageItem(response?.data?.perPage);
			setIsTableLoading(false);
		} catch (error) {
			setIsTableLoading(false);
			console.log(error);
		}
	};

	// To Toggle User status from active , inactive
	const updateUserStatus = async () => {
		try {
			const data = {
				userId: statusChangeData.userId,
				status: statusChangeData.status ? 1 : 0,
			};
			setIsTableLoading(true);
			const response = await post("update-user-status", data);
			await getUsersList();
			toast.success(response?.data?.message);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		} finally {
			setIsTableLoading(false);
		}
	};

	const handleDialogClose = (apiCall) => {
		if (apiCall) {
			updateUserStatus();
		}
		setHasStatusChange(false);
	};

	//TABLE COLOMN1
	const columns = [
		{
			title: "User Name",
			dataIndex: "userName",
			key: "userName",
			width: 100,
		},

		{
			title: "User Role",
			dataIndex: "roleName",
			key: "roleName",
			width: 100,
		},
		{
			title: "Contact",
			dataIndex: "contact",
			key: "contact",
			width: 100,
		},

		{
			title: "email",
			dataIndex: "email",
			key: "email",
			width: 100,
			render: (item, index) => (
				<span className="user-table-email">{item.email}</span>
			)
		},

		{
			title: "User Status",
			dataIndex: "userstatus",
			key: "userstatus",
			width: 100,
			render: (item) => (
				<>
					<badge
						className={`badge ${item.status
								? "badge light badge-success"
								: "badge light badge-warning"
							}`}
					>
						{item.status ? "Active" : "Inactive"}
					</badge>
				</>
			),
		},
		hasComponentPermission(permissions, 130)
			? {
				title: "Update User Status",
				dataIndex: "updateuserstatus",
				key: "updateuserstatus",
				width: 100,
				render: (item) => (
					<Switch
						name="status"
						checked={item.status ? true : false}
						onChange={(event) => {
							setHasStatusChange(true);
							setStatusChangeData({
								userId: item.userId,
								status: event.target.checked,
							});
						}}
						inputProps={{ "aria-label": "controlled" }}
					/>
				),
			}
			: undefined,

		{
			title: "Action",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center ">
						<Link to={`/view-user/${item.userId}`} className="btn-tick me-1">
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

						{hasComponentPermission(permissions, 129) && (
							<Link
								to={`/edit-user/${item.userId}`}
								className="btn-edit-user me-1"
							>
								<Tooltip title="Edit">
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
						)}

						{/* <Link to="#" className="btn-block-user me-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H392.6c-5.4-9.4-8.6-20.3-8.6-32V352c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7H178.3zM528 240c17.7 0 32 14.3 32 32v48H496V272c0-17.7 14.3-32 32-32zm-80 32v48c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32V272c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
              </svg>
            </Link> */}

						{hasComponentPermission(permissions, 131) && (
							<button
								className="btn-trash"
								onClick={() => handleOpenDelete(item?.userId)}
							>
								<Tooltip title="Delete">
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

	const finalUserListColumns = columns.filter((column) => column);

	//HANDLE PAGE CHANGE
	const handlePageChange = (e, page) => {
		setPage(page);
	};

	//handleRowsPerPageChange
	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};

	useEffect(() => {
		hasComponentPermission(permissions, 138) && getUsersList();
	}, [page, perPageItem, render]);

	return (
		<>
			{hasStatusChange && (
				<PopupModal open={true} onDialogClose={handleDialogClose}>
					<ConfirmationDialog
						onClose={handleDialogClose}
						confirmationMsg={"Are you sure you want to change status?"}
					/>
				</PopupModal>
			)}
			<div className="row">
				<div className="col-lg-12" style={{ paddingTop: '40px' }}>
					<div className="card">
						<div className="row page-titles mx-0 fixed-top-breadcrumb">
							<ol className="breadcrumb">
								
								<li className="breadcrumb-item active">
									<Link to="/dashboard">Dashboard</Link>
								</li>

								<li className="breadcrumb-item  ">
									<Link to="/users-list">User</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							{hasComponentPermission(permissions, 127) && (
								<div className="row d-flex justify-content-end">
									<div className="col-md-3" style={{ textAlign: "right" }}>
										<Link
											type="button"
											className="btn add-btn btn-secondary"
											to={"/add-user"}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												height="1em"
												className="svg-add"
												viewBox="0 0 448 512"
											>
												<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
											</svg>
											Add User
										</Link>
									</div>
								</div>
							)}
							<form>
								{/* <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label>User Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="userName"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary filter-btn"
                   >
                      Search
                    </button>
                  </div>
                
                </div> */}
							</form>
						</div>
					</div>
					{hasComponentPermission(permissions, 138) && (
						<div className="card">
							<div className="card-body">
								<div
									className="card-header pt-0 mb-2"
									style={{ paddingLeft: "0" }}
								>
									<div className="card-title h5">Users List</div>
								</div>

								<Table
									cols={finalUserListColumns}
									page={page}
									data={usersList}
									totalPages={totalPages}
									isTableLoading={isTableLoading}
									isPagination={true}
									handlePageChange={handlePageChange}
									handleRowsPerPageChange={handleRowsPerPageChange}
								/>
							</div>
						</div>
					)}
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
						<img src={Delete} style={{ width: "80px", display: "flex", justifyContent: "center", margin: "5px auto " }} />
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
									disabled={isTableLoading}
								>
									{isTableLoading ? "Deleting..." : "Delete"}
								</button>
								<button
									className="btn btn-save btn-primary"
									disabled={isTableLoading}
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
export default User;
