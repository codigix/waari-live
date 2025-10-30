import React from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import * as XLSX from "xlsx";
import Select from "react-select";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Pagination, Stack } from "@mui/material";
import BackButton from "../../common/BackButton";

const customStyles = {
	control: (provided, state) => ({
		...provided,
		height: "34px", // Adjust the height to your preference
	}),
};

// its dynamic year array from current year

const yearArray = () => {
	let year = new Date().getFullYear();
	let yearArray = [];
	for (let i = 2023; i <= year; i++) {
		yearArray.push({ value: i, label: i });
	}
	return yearArray;
};


function Waariselect() {
	const [page, setPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);
	const [isTableLoading, setIsTableLoading] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [data, setData] = React.useState([]);
	const [isExporting, setIsExporting] = React.useState(false);
	const [year, setYear] = React.useState({
		value: new Date().getFullYear(),
		label: new Date().getFullYear(),
	});

	const columns = [
		{
			title: "Sr. No.",
			render: (item, index) => (<>
				{page * rowsPerPage - rowsPerPage + index + 1}
			</>),
			key: "srNo",
			sortable: true
		},
		{
			title: "Guest Name",
			dataIndex: "userName",
			key: "userName",
			sortable: true
		},
		{
			title: "Waari Select ID",
			dataIndex: "referralId",
			key: "referralId",
			sortable: true
		},
		{
			title: "Self Booking",
			dataIndex: "selfBooking",
			key: "selfBooking",
			sortable: true
		},
		{
			title: "Self Tour Sale",
			dataIndex: "selfTourSale",
			key: "selfTourSale",
			sortable: true
		},
		{
			title: "Points Earned Through Self Booking",
			dataIndex: "selfBookingPoints",
			key: "selfBookingPoints",
			sortable: true
		},
		{
			title: "Reffered Guests",
			dataIndex: "referredGuest",
			key: "referredGuest",
			sortable: true
		},
		{
			title: "Referred Guests Sale",
			dataIndex: "referredGuestSale",
			key: "referredGuestSale",
			sortable: true
		},
		{
			title: "Points Earned Through Reference",
			dataIndex: "pointsEarnedTroughReferral",
			key: "pointsEarnedTroughReferral",
			sortable: true
		},
		{
			title: "Total Points Earned",
			dataIndex: "totalPointsEarned",
			key: "totalPointsEarned",
			sortable: true
		},
		{
			title: "Points Redeemed",
			dataIndex: "pointsReedem",
			key: "pointsReedem",
			sortable: true
		}

	]


	const { permissions } = useSelector((state) => state.auth);

	const handlePageChange = (e, page) => {
		setPage(page);
	};

	const handleRowsPerPageChange = (rowsPerPage) => {
		setRowsPerPage(rowsPerPage);
		setPage(1);
	};

	const getWaariSelectReport = async (pp) => {
		setIsTableLoading(true);
		try {
			const response = await get(
				`waari-select-report?page=${pp || page}&perPage=${rowsPerPage}&year=${year?.value
				}`
			);
			setData(response.data.data);
			setTotalPages(response.data.lastPage);
			setIsTableLoading(false);
		} catch (err) {
			setIsTableLoading(false);
			console.error(err);
		}
	};

	const exportToExcel = async () => {
		try {
			setIsExporting(true);

			const response = await get(
				`download-waari-select-report?year=${year?.value}`
			);
			const headers = [
				"Sr. No.",
				"Guest Name",
				"Waari Select ID",
				"Self Booking",
				"Self Tour Sale",
				"Points Earned Through Self Booking",
				"Referred Guests",
				"Referred Guests Sale",
				"Points Earned Through Reference",
				"Total Points Earned",
				"Points Redeemed",
			];

			// Map the data to use custom headers
			const mappedData = response.data.map(
				(
					{
						userName,
						referralId,
						selfTourSale,
						referredGuestSale,
						pointsEarnedTroughReferral,
						totalPointsEarned,
						selfBooking,
						selfBookingPoints,
						referredGuest,
						pointsReedem,
					},
					index
				) => ({
					"Sr. No.": index + 1,
					"Guest Name": userName || "-",
					"Waari Select ID": referralId || "-",
					"Self Booking": selfBooking || "-",
					"Self Tour Sale": selfTourSale || "-",
					"Points Earned Through Self Booking": selfBookingPoints || "-",
					"Referred Guests": referredGuest || "-",
					"Referred Guests Sale": referredGuestSale || "-",
					"Points Earned Through Reference": pointsEarnedTroughReferral || "-",
					"Total Points Earned": totalPointsEarned || "-",
					"Points Redeemed": pointsReedem || "-",
				})
			);

			// Create a worksheet
			const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });

			// Create a workbook
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

			// Save the workbook to a file
			XLSX.writeFile(wb, `reports.xlsx`);

			setIsExporting(false);
		} catch (err) {
			setIsExporting(false);
			console.error(err);
		}
	};

	React.useEffect(() => {
		hasComponentPermission(permissions, 81) && getWaariSelectReport(null);
	}, [page, rowsPerPage]);

	return (
		<>
			{hasComponentPermission(permissions, 81) && (
				<>
					<div className="card"  style={{ marginBottom: '40px' }}>
						<div className="row page-titles mx-0 fixed-top-breadcrumb">
							<ol className="breadcrumb">
								
								<li className="breadcrumb-item active">
									<Link to="/dashboard">Dashboard</Link>
								</li>
								<li className="breadcrumb-item">
									<Link to="/waari-select">Waari Select</Link>
								</li>
							</ol>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<form>
								<div className="row">
									<div className="col-md-3">
										<div className="mb-3">
											<label>Year</label>
											<Select
												styles={customStyles}
												className="basic-single"
												classNamePrefix="select"
												name="year"
												options={yearArray()}
												onChange={(e) => setYear(e)}
												value={year}
											/>
										</div>
									</div>

									<div className="col-md-3 d-flex align-items-center">
										<button
											type="button"
											className="btn btn-primary filter-btn"
											onClick={() => (getWaariSelectReport(1), setPage(1))}
										>
											Search
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							<div className="row">
								<div className="col-md-12">
									<div className=" d-flex align-items mb-3  justify-content-end">
										<button
											type="button"
											className="btn add-btn btn-secondary"
											onClick={() => exportToExcel()}
										>
											{isExporting ? "Exporting..." : "Export to Excel"}
										</button>
									</div>
									<Table cols={columns} data={data} page={page} totalPages={totalPages} handlePageChange={handlePageChange} isPagination={true} isTableLoading={isTableLoading} handleRowsPerPageChange={handleRowsPerPageChange} />
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default Waariselect;
