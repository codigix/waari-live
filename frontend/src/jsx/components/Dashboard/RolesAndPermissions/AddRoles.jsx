import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";

const initialState = {
	roleName: "",
	isActive: 1,
	permissions: [],
};

const AddRoles = () => {
	const [activeTab, setActiveTab] = useState(1);
	const [isTabsLoading, setIsTabsLoading] = useState(false);
	const [isComponentsLoading, setIsComponentsLoading] = useState(false);
	const [tabsData, setTabsData] = useState([]);
	const [componentsData, setComponentsData] = useState([]);
	const [allFormData, setAllFormData] = useState(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		getAllTabs();
	}, []);

	useEffect(() => {
		getAllComponentsByTab();
	}, [activeTab]);

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

	// const handleCheckBoxChange = (catId, listId) => {
	//   // Toggle the selected state of the permission
	//   setAllFormData((prev) => {
	//     const categoryIndex = prev.permissions.findIndex(
	//       (item) => item.catId === catId
	//     );

	//     if (categoryIndex === -1) {
	//       // If the category doesn't exist, add a new category with the current listId
	//       const newCategory = {
	//         catId,
	//         listIds: [listId],
	//       };

	//       return {
	//         ...prev,
	//         permissions: [...prev.permissions, newCategory],
	//       };
	//     }

	//     const updatedPermissions = prev.permissions.map((item, index) => {
	//       if (index === categoryIndex) {
	//         // If the listIds array already includes the listId, remove it, otherwise add it
	//         if (item.listIds.includes(listId)) {
	//           // Remove listId
	//           return {
	//             ...item,
	//             listIds: item.listIds.filter((id) => id !== listId),
	//           };
	//         } else {
	//           // Add listId
	//           return {
	//             ...item,
	//             listIds: [...item.listIds, listId],
	//           };
	//         }
	//       }
	//       return item;
	//     });

	//     // Check if all listIds are removed from the category, then remove the entire category
	//     const categoryToRemove = updatedPermissions.find(
	//       (item) => item.catId === catId && item.listIds.length === 0
	//     );

	//     if (categoryToRemove && updatedPermissions.length > 1) {
	//       const filteredPermissions = updatedPermissions.filter(
	//         (item) => item.catId !== catId
	//       );
	//       return {
	//         ...prev,
	//         permissions: filteredPermissions,
	//       };
	//     }

	//     return {
	//       ...prev,
	//       permissions: updatedPermissions,
	//     };
	//   });
	// };

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

	// Submit All Data to add-roles Api to create new role
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
			const response = await post(`/add-roles`, allFormData);
			setIsSubmitting(false);
			toast.success(response?.data?.message);
			navigate("/role-list");
		} catch (error) {
			setIsSubmitting(false);
			toast.error(error?.response?.data?.message[0]);
			console.log(error);
		}
	};

	console.log("componentListIds", componentsData);
	console.log("permissions", allFormData.permissions);

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
									<Link to="/add-roles">Add New Role</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div>
								<div className="row">
									<div className="col-md-4 col-lg-3 col-12 col-sm-6">
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
						<div className="card-body">
							<div
								className="card-header mb-2 pt-0"
								style={{ paddingLeft: "0" }}
							>
								<div className="card-title h5">Assign Permissions</div>
							</div>

							<div
								className="nav nav-tabs role-tab"
								style={{ borderBottom: 0 }}
							>
								<div className="row">
									{isTabsLoading ? (
										<p>Loading...</p>
									) : (
										tabsData.map((tab) => (
											<div
												key={tab.catId}
												className="mb-2  col-lg-4 col-md-6  col-sm-6 col-12 nav-item cursor-pointer"
												onClick={() => setActiveTab(tab.catId)}
											>
												<div
													className={`border p-2 fw-bold text-center nav-link  ${
														activeTab === tab.catId ? "active" : ""
													}`}
												>
													<p>
														{tab.catName}
														{/* <span className="ms-2  px-1 bg-yellow">
                              {calculateSelectedListCount(tab.catId)}
                            </span> */}
														<span
															className={` ms-2  px-1 ${
																parseInt(
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
													checked={componentsData.map(i => i.listId).length === allFormData.permissions.find(item => item.catId === activeTab)?.listIds?.length}
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

										{componentsData.map((component, index) => (
											<div
												key={component.listId}
												className="col-lg-3 col-md-4 col-sm-6 col-12 mb-2"
											>
												<Tooltip title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua">
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
														className="form-check-label me-1"
														htmlFor={component.listName}
														style={{ cursor: "pointer" }}
													>
														{component.listName}
													</label>
													{/* <svg xmlns="http://www.w3.org/2000/svg" width="0.9rem" fill="#ffc36878"  height="0.9rem" viewBox="0 0 512 512" style={{fill:"rgb(7 111 176 / 40%)",color:"rgb(7 111 176 / 40%)"}}><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg> */}
												</div>
												</Tooltip>
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
export default AddRoles;
