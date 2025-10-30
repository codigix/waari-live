import React, { useEffect, useState } from "react";
import PopupModal from "../../Popups/PopupModal";
import Vouchersmodal from "./Vouchersmodal";
import { get } from "../../../../../services/apiServices";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import Table from "../../../table/VTable";
import { Tooltip } from "@mui/material";

const Vouchers = ({ enquiryId }) => {
	const [open, setOpen] = useState(false);
	const [voucher, setVoucher] = useState(null);
	const { permissions } = useSelector((state) => state.auth);

	const [isLoading, setIsLoading] = useState(false);
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
	//to start booking record list
	const [data, setData] = useState([]);
	const getVoucherList = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-vouchers?enquiryCustomId=${enquiryId}&perPage=${perPageItem}&page=${page}`
			);
			setIsLoading(false);
			setData(response?.data?.data);
			setTotalCount(response?.data?.lastPage);
			setPerPageItem(response.data.perPage);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};
	//TABLE COLOMN
	const columns = [
		{
			title: "Loyalty Card",
			render: (rowData) => rowData.voucherName,
			key: "cardNo",
			width: 40,
		},
		{
			title: "Vouchers",
			render: (rowData) => (
				<>
					{/* <div className="d-flex justify-content-center">
						<a href={rowData?.vouchers} className="btn-tick" target="_blank">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="1em"
								viewBox="0 0 576 512"
							>
								<path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
							</svg>
						</a>
					</div> */}
					<a href={rowData?.vouchers} className="btn-tick" target="_blank">
					<Tooltip title="Download">
						<button type="button" className=" btn-edit-user me-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								width="1.2rem"
								height="1.1rem"
								style={{ marginRight: "5px" }}
							>
								<path
									d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 
															12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 
															64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 
															56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
								></path>
							</svg>
						</button>
						</Tooltip>
					</a>
				</>
			),
			key: "vouchers",
			width: 40,
		},
	];
	useEffect(() => {
		getVoucherList();
	}, [page, perPageItem]);

	const handleOpen = (voucher) => {
		setOpen(true);
		setVoucher(voucher);
	};

	const handleDialogClose = () => {
		setOpen(false);
		getVoucherList()
	};

	// to get the group tour bill details start
	const [voucherTypes, setVoucherTypes] = useState([]);

	const getVoucherTypes = async () => {
		try {
			const response = await get(`/dropdown-vouchers-name`);
			setVoucherTypes(response?.data?.data);
			// console.log(response)
		} catch (error) {
			setVoucherTypes({});
			console.log(error);
		}
	};

	useEffect(() => {
		getVoucherTypes();
	}, []);

	return (
		<>
			{hasComponentPermission(permissions, 284) && (
				<>
					<PopupModal open={open} onDialogClose={handleDialogClose}>
						<Vouchersmodal
							onClose={handleDialogClose}
							enquiryCustomId={enquiryId}
							voucher={voucher}
						/>
					</PopupModal>

					<div className="card ">
						<div className="card-body">
							<div
								className="card-header mb-2 p-0"
								style={{ paddingLeft: "0" }}
							>
								<div className="card-title h5">Vouchers</div>
							</div>
							<div className="basic-form">
								<div className="needs-validation">
									<div className="row">
										<div className="col-md-12 col-lg-6 col-sm-12">
											{voucherTypes.map((voucher) => (
												<div key={voucher.voucherTypeId} className="row">
													<div
														className="col-md-6 col-sm-6 col-lg-6 col-12 d-flex"
														style={{ alignItems: "center" }}
													>
														<label className="form-label">
															{voucher.voucherName}
														</label>
													</div>
													<div className="col-md-6 col-sm-6 col-lg-6 col-12 d-flex">
														<div className="d-flex justify-content-center mt-3 mb-2">
															<button
																className="btn btn-back "
																onClick={() => handleOpen(voucher)}
																style={{ margin: "0 10px 0 0" }}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 512 512"
																	width="1.2rem"
																	height="1.1rem"
																	style={{
																		fill: "rgb(5, 146, 153)",
																		marginRight: "5px",
																	}}
																>
																	<path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
																</svg>
																Upload
															</button>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}

			<>
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
			</>
		</>
	);
};

export default Vouchers;
