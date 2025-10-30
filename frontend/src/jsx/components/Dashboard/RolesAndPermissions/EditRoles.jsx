import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";

const initialState = {
	roleId: null,
	roleName: "",
	isActive: 1,
	permissions: [
		{
			catId: 1,
			listIds: [],
		},
	],
};

const EditRoles = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [isTabsLoading, setIsTabsLoading] = useState(false);
	const [isComponentsLoading, setIsComponentsLoading] = useState(false);
	const [tabsData, setTabsData] = useState([]);
	const [componentsData, setComponentsData] = useState([]);
	const [allFormData, setAllFormData] = useState(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		getRoleDetails();
	}, []);

	useEffect(() => {
		getAllTabs();
	}, []);

	useEffect(() => {
		getAllComponentsByTab();
	}, [activeTab]);

	//GET Role Details by Id for prefilled data
	const getRoleDetails = async () => {
		try {
			// setIsTabsLoading(true);
			const response = await get(`get-role-data?roleId=${id}`);
			setAllFormData({
				roleName: response.data?.data?.roleName,
				roleId: id,
				isActive: response.data?.data?.isActive,
				permissions: [...response.data?.data?.permissions],
			});
			// setIsTabsLoading(false);
		} catch (error) {
			// setIsTabsLoading(false);
			console.log(error);
		}
	};

	//GET All tabs List
	const getAllTabs = async () => {
		try {
			setIsTabsLoading(true);
			const response = await get(`get-cats`);
			setTabsData(response?.data?.data);
			setIsTabsLoading(false);
		} catch (error) {
			setIsTabsLoading(false);
			console.log(error);
		}
	};

	//GET Components LIST by Selected Tab
	const getAllComponentsByTab = async () => {
		try {
			setIsComponentsLoading(true);
			const response = await get(`get-lists?catId=${activeTab}`);
			setComponentsData(response?.data?.data);
			setIsComponentsLoading(false);
		} catch (error) {
			setIsComponentsLoading(false);
			console.log(error);
		}
	};

	const handleCheckBoxChange = (catId, listId) => {
		setAllFormData((prev) => {
			// Map through the existing permissions
			const updatedPermissions = prev.permissions.map(
				(item) =>
					// If the category matches the current one being modified
					item.catId === catId
						? {
							...item,
							// Toggle the listId in the array
							listIds: item.listIds.includes(listId)
								? item.listIds.filter((id) => id !== listId) // If already present, remove it
								: [...item.listIds, listId], // If not present, add it
						}
						: item // If it's a different category, leave it unchanged
			);

			// Update the state with the modified permissions
			return {
				...prev,
				permissions: updatedPermissions,
			};
		});
	};

	const handleSelectAllChange = (e) => {
		setAllFormData((prev) => {
			const updatedPermissions = prev.permissions.map((item) => {
				if (item.catId === activeTab) {
					// Get listIds for the components of the active tab
					const listIds = componentsData
						.filter((component) => component.catId === activeTab)
						.map((component) => component.listId);

					return {
						...item,
						listIds: e.target.checked ? listIds : [],
					};
				} else {
					return item;
				}
			});

			return {
				...prev,
				permissions: updatedPermissions,
			};
		});
	};

	useEffect(() => {
		setAllFormData((prev) => {
			// Check for empty listIds in each category
			const updatedPermissions = prev.permissions.filter(
				(item) => item.listIds.length > 0
			);

			// Check if the category corresponding to the new activeTab already exists
			const categoryExists = updatedPermissions.some(
				(item) => item.catId === activeTab
			);

			if (!categoryExists) {
				// If the category doesn't exist, add a new category with an empty listIds array
				const newCategory = {
					catId: activeTab,
					listIds: [],
				};

				updatedPermissions.push(newCategory);
			}

			return {
				...prev,
				permissions: updatedPermissions,
			};
		});
	}, [activeTab]);

	const handleRoleNameChange = (e) => {
		const enteredValue = e.target.value;
		const filteredValue = enteredValue.replace(/[^a-zA-Z0-9\s]/g, ""); // Allow alphabets, numbers, and spaces

		if (enteredValue !== filteredValue) {
			toast.warn(
				"Invalid characters removed. Only alphabets, numbers, and spaces are allowed."
			);
		}

		setAllFormData((prev) => ({
			...prev,
			roleName: filteredValue,
		}));
	};

	// Function to calculate the total count of selected listIds under a category
	const calculateSelectedListCount = (catId) => {
		const category = allFormData.permissions.find(
			(item) => item.catId === catId
		);

		if (category) {
			return category.listIds.length;
		}

		return 0;
	};

	// Submit All Data to edit-roles Api to edit existing role
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation for empty fields
		if (!allFormData.roleName.trim()) {
			toast.error("Role name is required");
			return;
		}

		// Check if at least one list id is selected from at least one tab
		const isAtLeastOneListIdSelected = allFormData.permissions.some(
			(item) => item.listIds && item.listIds.length > 0
		);

		if (!isAtLeastOneListIdSelected) {
			toast.error("Please assign at least one permission");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await post(`/update-role-data`, allFormData);
			setIsSubmitting(false);
			toast.success(response?.data?.message);
			navigate("/role-list");
		} catch (error) {
			setIsSubmitting(false);
			toast.error(error?.response?.data?.message[0]);
			console.log(error);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="row">
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
									<Link to="/role-list">Role Information</Link>
								</li>
								<li className="breadcrumb-item  ">
									<Link to="javascript:void(0)">Edit Role</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div>
								<div className="row">
									<div className="col-md-3 col-lg-3 col-12 col-sm-6">
										<div className="mb-3">
											<label>
												Role Name<span className="error-star">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												name="roleName"
												onChange={handleRoleNameChange}
												value={allFormData.roleName}
											/>
										</div>
									</div>

									<div className="col-md-3 col-lg-2 col-12 col-sm-3">
										<div className="mb-3">
											<label className="form-label">Active Status</label>
											<div className="d-flex" style={{ gap: "5px" }}>
												<div className="filled-in chk-col-primary">
													<input
														className="form-check-input"
														type="radio"
														name="isActive"
														id="yes"
														value={1}
														checked={allFormData.isActive === 1}
														onChange={(e) =>
															setAllFormData((prev) => ({
																...prev,
																isActive: parseInt(e.target.value),
															}))
														}
													/>
													<label
														className="form-check-label"
														htmlFor="yes"
														style={{ margin: "0 5px" }}
													>
														Yes
													</label>
												</div>
												<div className="filled-in chk-col-primary">
													<input
														className="form-check-input"
														type="radio"
														name="isActive"
														id="No"
														value={0}
														checked={allFormData.isActive === 0}
														onChange={(e) =>
															setAllFormData((prev) => ({
																...prev,
																isActive: parseInt(e.target.value),
															}))
														}
													/>
													<label
														className="form-check-label"
														htmlFor="No"
														style={{ margin: "0 5px" }}
													>
														No
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="card-header card-header-title">
							<div className="card-title h5">Assign Permissions</div>
						</div>
						<div className="card-body">
							<div className="nav nav-tabs role-tab">
								<div className="row">
									{isTabsLoading ? (
										<p>Loading...</p>
									) : (
										tabsData.map((tab) => (
											<div
												key={tab.catId}
												className="mb-2 col-lg-4 col-md-6  col-sm-6 col-12 nav-item cursor-pointer"
												onClick={() => setActiveTab(tab.catId)}
											>
												<div
													className={`border p-2 fw-bold text-center nav-link  ${activeTab === tab.catId ? "active" : ""
														}`}
												>
													<p>
														{tab.catName}
														{/* <span className="ms-2  px-1 bg-yellow">{calculateSelectedListCount(tab.catId)}</span> */}
														<span
															className={` ms-2  px-1 ${parseInt(
																calculateSelectedListCount(tab.catId)
															) > 0
																	? "bg-green"
																	: "bg-yellow"
																}`}
														>
															{calculateSelectedListCount(tab.catId)}
														</span>
													</p>
												</div>
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="card-body">
							<div className="row">
								{isComponentsLoading ? (
									<div className="col-md-2 mb-2">Loading...</div>
								) : (
									<>
										<div className="col-md-12 mb-2">
											<div className="form-check">
												<input
													className="form-check-input"
													type="checkbox"
													id="select-all"
													checked={
														componentsData.map((i) => i.listId).length ===
														allFormData.permissions.find(
															(item) => item.catId === activeTab
														)?.listIds?.length
													}
													onChange={handleSelectAllChange}
												/>
												<label
													className="form-check-label"
													htmlFor="select-all"
												>
													<strong>Select All</strong>
												</label>
											</div>
										</div>

										{componentsData.map((component) => (
											<div
												key={component.listId}
												className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2"
											>
												<div className="form-check">
													<input
														className="form-check-input"
														type="checkbox"
														checked={allFormData.permissions
															.find((item) => item.catId === component.catId)
															?.listIds.includes(component.listId)}
														onChange={() =>
															handleCheckBoxChange(
																component.catId,
																component.listId
															)
														}
														id={component.listName}
													/>
													<label
														className="form-check-label"
														htmlFor={component.listName}
														style={{ cursor: "pointer" }}
													>
														{component.listName}
													</label>
												</div>
											</div>
										))}
									</>
								)}

								<div className="row">
									<div className="col-md-12 d-flex align-items-center justify-content-between">
										<button
											type="button"
											className="btn btn-back mt-5"
											onClick={() => navigate(-1)}
										>
											Back
										</button>
										<button
											type="submit"
											disabled={isSubmitting}
											className="btn btn-primary btn-submit me-2 mt-5"
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
};
export default EditRoles;
