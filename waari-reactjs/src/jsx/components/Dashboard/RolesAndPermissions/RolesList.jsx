import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";

const RolesList = () => {
	const [rolesList, setRolesList] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [perPageItem, setPerPageItem] = useState(10);
	const [roleName, setRoleName] = useState("");
	const { permissions } = useSelector((state) => state.auth);

	//GET Roles LIST
	const getRolesList = async () => {
		try {
			setIsTableLoading(true);
			const response = await get(
				`list-roles?page=${page}&perPage=${perPageItem}${roleName ? "&roleName=" + roleName : ""
				}`
			);
			setRolesList(response?.data?.data);
			setTotalPages(response?.data?.lastPage);
			setPerPageItem(response?.data?.perPage);
			setIsTableLoading(false);
		} catch (error) {
			setIsTableLoading(false);
			console.log(error);
		}
	};

	//TABLE COLOMN1
	const columns = [
		{
			title: "Role Name",
			dataIndex: "roleName",
			key: "roleName",
			width: 100,
		},
		{
			title: "Role Id",
			dataIndex: "roleId",
			key: "roleId",
			width: 100,
		},

		{
			title: "Created Date",
			dataIndex: "created_at",
			key: "created_at",
			width: 100,
		},

		hasComponentPermission(permissions, 126) && {
			title: "Action",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center gap-3">
						<Link to={`/edit-roles/${item.roleId}`} className="btn-edit-user me-1">
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
					</div>
				</>
			),
			key: "role",
			width: 80,
		},
	];

	const finalColumns = columns.filter(column => column)

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
		hasComponentPermission(permissions, 125) && getRolesList();
	}, [page, perPageItem]);

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
									<Link to="/role-list">Role List</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							{hasComponentPermission(permissions, 124) && (
								<div className="row d-flex justify-content-end">
									<div className="col-md-3" style={{ textAlign: "right" }}>
										<Link
											type="button"
											className="btn add-btn btn-secondary "
											to={"/add-roles"}
										>
											<svg xmlns="http://www.w3.org/2000/svg" height="1em" className="svg-add" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
											Add Roles
										</Link>
									</div>
								</div>
							)}
							{hasComponentPermission(permissions, 125) && (
								<div>
									<div className="row">
										<div className="col-md-3">
											<div className="mb-3">
												<label>Role Name</label>
												<input
													type="text"
													className="form-control"
													name="roleName"
													onChange={(e) => setRoleName(e.target.value)}
													value={roleName}
												/>
											</div>
										</div>

										<div className="col-md-3 d-flex align-items-center">
											<button
												type="button"
												className="btn btn-primary filter-btn"
												onClick={() => (getRolesList(), setPage(1))}
											>
												Search
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
					{hasComponentPermission(permissions, 125) && (
						<div className="card">
							<div className="card-body" >
								<div className="card-header mb-2 p-0" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Roles List</div>
								</div>

								<Table
									cols={finalColumns}
									page={page}
									data={rolesList}
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
		</>
	);
};
export default RolesList;
