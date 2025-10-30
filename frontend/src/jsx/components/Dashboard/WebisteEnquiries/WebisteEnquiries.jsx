import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { get } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";

const WebisteEnquiries = () => {
	const [FeedbacksList, setFeedbacksList] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [perPageItem, setPerPageItem] = useState(10);
	const { permissions } = useSelector((state) => state.auth);

	// fetching all coupons with pagination
	const getWebisteEnquiries = async () => {
		try {
			setIsTableLoading(true);
			const response = await get(
				`contact-us-list?page=${page}&perPage=${perPageItem}`
			);
			setTotalPages(response?.data?.lastPage);
			setFeedbacksList(response?.data?.data);
			setPerPageItem(response?.data?.perPage);
			setIsTableLoading(false);
		} catch (error) {
			setIsTableLoading(false);
			console.log(error);
		}
	};
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
		hasComponentPermission(permissions, 310) && getWebisteEnquiries();
	}, [page, perPageItem]);

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
			dataIndex: "fullName",
			key: "fullName",
			width: 120,
			sortable: true,
		},
		{
			title: "Contact Number",
			dataIndex: "phoneNo",
			key: "phoneNo",
			width: 120,
			sortable: true,
		},

		{
			title: "Contacted Date",
			dataIndex: "Date",
			key: "Date",
			width: 100,
		},

	];

	return (
		<>
			{hasComponentPermission(permissions, 310) ? (
				<div className="row">
					<div className="col-lg-12" style={{ paddingTop: '40px' }}>
						<div className="card">
							<div className="row page-titles mx-0 fixed-top-breadcrumb">
								<ol className="breadcrumb">
								
									<li className="breadcrumb-item active">
										<Link to="/dashboard">Dashboard</Link>
									</li>

									<li className="breadcrumb-item ">
										<Link to="/website-enquiries">Website Enquiries list</Link>
									</li>
								</ol>
							</div>
						</div>

						<div className="card">
							<div className="card-header">
								<div className="card-title h5">Website Enquiries List</div>
							</div>
							<div className="card-body">
								<Table
									isTableLoading={isTableLoading}
									cols={columns}
									page={page}
									data={FeedbacksList}
									totalPages={totalPages}
									handlePageChange={handlePageChange}
									handleRowsPerPageChange={handleRowsPerPageChange}
									isPagination={true}
								/>
							</div>
						</div>
					</div>
				</div>
			) :   <h2 className="centered-message">
            You do not have permission for this page
        </h2>}
		</>
	);
};
export default WebisteEnquiries;
