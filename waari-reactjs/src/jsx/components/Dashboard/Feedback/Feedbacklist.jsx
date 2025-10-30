import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { get } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";

const Feedbacklist = () => {
	const [FeedbacksList, setFeedbacksList] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [perPageItem, setPerPageItem] = useState(10);
	const { permissions } = useSelector((state) => state.auth);

	// fetching all coupons with pagination
	const getFeedbackList = async () => {
		try {
			setIsTableLoading(true);
			const response = await get(
				`feedbacks-list?page=${page}&perPage=${perPageItem}`
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
		hasComponentPermission(permissions, 199) && getFeedbackList();
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
			title: "Tour Name",
			dataIndex: "tourName",
			width: 50,
			sortable: true,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: 120,
			sortable: true,
		},
		{
			title: "Mail Id",
			dataIndex: "email",
			key: "email",
			width: 70,
			sortable: true,
		},
		{
			title: "Contact Us",
			dataIndex: "contact",
			key: "contact",
			width: 70,
			sortable: true,
		},
		{
			title: "Start Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 80,
		},
		{
			title: "End Date",
			dataIndex: "endDate",
			key: "endDate",
			width: 100,
		},
		{
			title: "Feedback",
			dataIndex: "feedback",
			key: "feedback",
			width: 100,
		},
	];

	return (
		<>
			{/* <div className="mb-2 d-flex justify-content-end align-items-center flex-wrap">
					<Link to="/add-grouptour" className="btn btn-secondary">Add Enquiry</Link>	
          </div> */}
			{hasComponentPermission(permissions, 199) && (
				<div className="row">
					<div className="col-lg-12" style={{ paddingTop: '40px' }}>
						<div className="card">
							<div className="row page-titles mx-0 fixed-top-breadcrumb">
								<ol className="breadcrumb">
									
									<li className="breadcrumb-item active">
										<Link to="/dashboard">Dashboard</Link>
									</li>

									<li className="breadcrumb-item ">
										<Link to="/feedback-list">Feedback list</Link>
									</li>
								</ol>
							</div>
						</div>

						<div className="card">
							<div className="card-header">
								<div className="card-title h5">Feedback List</div>
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
			)}
		</>
	);
};
export default Feedbacklist;
