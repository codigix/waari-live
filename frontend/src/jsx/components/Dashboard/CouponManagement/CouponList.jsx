import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import Select from "react-select";
import { get, post } from "../../../../services/apiServices";
import { Switch, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import PopupModal from "../../Dashboard/Popups/PopupModal";
import ConfirmationDialog from "../../Dashboard/Popups/ConfirmationDialog";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../common/BackButton";

const CouponList = () => {
	const [CouponsList, setCouponsList] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [perPageItem, setPerPageItem] = useState(10);
	const [hasStatusChange, setHasStatusChange] = useState(false);
	const [statusChangeData, setStatusChangeData] = useState({
		id: null,
		status: 0,
	});
	const { permissions } = useSelector((state) => state.auth);
	// const [couponName, setCouponName] = useState("");
	// const [loyaltyCard, setLoyaltyCard] = useState(null);

	//GET COUPONS LIST

	// fetching all coupons with pagination
	const getCouponsList = async () => {
		try {
			setIsTableLoading(true);
			const response = await get(
				`coupons-list?page=${page}&perPage=${perPageItem}`
			);
			// const response = await get(`users-listing?page=${page}&perPage=${perPageItem}&couponName=${couponName}`);
			setTotalPages(response?.data?.lastPage);
			setCouponsList(response?.data?.data);
			setPerPageItem(response?.data?.perPage);
			setIsTableLoading(false);
		} catch (error) {
			setIsTableLoading(false);
			console.log(error);
		}
	};

	// For To Toggle Coupon status from active , inactive
	const updateCouponStatus = async () => {
		try {
			const data = {
				couponId: statusChangeData.id,
				status: statusChangeData.status ? 1 : 0,
			};
			const response = await post("update-status-coupon", data);
			await getCouponsList();
			toast.success(response?.data?.message);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	//TABLE COLOMN1
	const columns = [
		{
			title: "Sr.No.",
			render: (item, index) => (
				<>{page * perPageItem - perPageItem + (index + 1)}</>
			),
			width: 40,
		},
		{
			title: "Coupon Name",
			dataIndex: "couponName",
			key: "couponName",
			width: 100,
		},
		{
			title: "Validity From",
			dataIndex: "fromDate",
			key: "fromDate",
			width: 80,
		},
		{
			title: "Validity To",
			dataIndex: "toDate",
			key: "toDate",
			width: 80,
		},
		{
			title: "Coupon For",
			dataIndex: "isType",
			key: "isType",
			width: 100,
			render: (item) => (
				<div className="mb-2">
					{item.isType === 1 ? "For All Users" : "For New Users"}
				</div>
			),
		},
		{
			title: "Discount Type",
			dataIndex: "discountType",
			key: "discountType",
			width: 100,
			render: (item) => (
				<div className="mb-2">
					{item.discountType === 1 ? "Fixed" : "Percentage"}
				</div>
			),
		},
		{
			title: "Discount Amount",
			dataIndex: "discountValue",
			key: "discountValue",
			width: 100,
		},

		{
			title: "Max Discount",
			dataIndex: "maxDiscount",
			key: "maxDiscount",
			width: 100,
			render: (item) => (
				<div className="mb-2">{item.maxDiscount ? item.maxDiscount : "-"}</div>
			),
		},

		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (item) => (
				<badge
					className={`badge ${item.status ? "badge light badge-success" : "badge light badge-warning"
						}`}
				>{item.status ? "Active" : "Inactive"}</badge>
			),
			width: 100,
		},
		hasComponentPermission(permissions, 88) ? {

			title: "Update Status",
			dataIndex: "updatestatus",
			key: "updatestatus",
			render: (item) => (
				<Switch
					name="status"
					checked={item.status ? true : false}
					onChange={(event) => {
						setHasStatusChange(true);
						setStatusChangeData({
							id: item.couponId,
							status: event.target.checked,
						});
					}}
					inputProps={{ "aria-label": "controlled" }}
				/>
			),
			width: 100,

		} : undefined,
		{
			title: "Action",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">

						{/* {hasComponentPermission(permissions, 85) && <Link
							to={`/edit-coupon/${item.couponId}`}
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
						</Link>} */}

						<Link to={`/view-coupon/${item.couponId}`} className="btn-tick  me-1">
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


					</div>
				</>
			),
			key: "billing",
			width: 80,
		},
	];

	//HANDLE PAGE CHANGE
	const handlePageChange = (e, page) => {
		setPage(page);
	};

	//handleRowsPerPageChange
	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};

	const handleDialogClose = (apiCall) => {
		if (apiCall) {
			updateCouponStatus();
		}
		setHasStatusChange(false);
	};

	useEffect(() => {
		hasComponentPermission(permissions, 83) && getCouponsList();
	}, [page, perPageItem]);

	return (
		<>
			{hasStatusChange && (
				<PopupModal  open={true} onDialogClose={handleDialogClose}>
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
									<Link to="/coupon-list">Coupon Information</Link>
								</li>
							</ol>
						</div>
					</div>
					{/* <div className="card">
                        <div className="card-body">

                            <form>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="mb-3">
                                            <label>Coupon Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="couponName"
                                                onChange={(e) => setCouponName(e.target.value)}
                                                value={couponName}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3 d-flex align-items-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary filter-btn"
                                            onClick={() => (getCouponsList(), setPage(1))}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div> */}
					<div className="card">
						<div className="card-body">
							{hasComponentPermission(permissions, 82) && (
								<div className="row">
									<div className="d-flex justify-content-end align-items-center flex-wrap">
										<Link to="/add-coupon" className="btn add-btn btn-secondary">
										<svg xmlns="http://www.w3.org/2000/svg" height="1em" className="svg-add" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
											Add Coupon
										</Link>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div className="card-header mb-2 pt-0" style={{ paddingLeft: "0" }}>
								<div className="card-title h5">Coupon List</div>
								{/* add button */}

							</div>
							{hasComponentPermission(permissions, 83) && (

								<Table
									cols={columns}
									page={page}
									data={CouponsList}
									totalPages={totalPages}
									isTableLoading={isTableLoading}
									isPagination={true}
									handlePageChange={handlePageChange}
									handleRowsPerPageChange={handleRowsPerPageChange}
								/>

							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default CouponList;
