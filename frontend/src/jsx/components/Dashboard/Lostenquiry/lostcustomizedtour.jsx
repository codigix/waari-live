import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { set } from "lodash";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";

const LostCustomizedtour = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [guestName, setGuestName] = useState("");
	const { permissions } = useSelector((state) => state.auth);

	//TABLE COLOMN1
	const columns_upcoming = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},
		{
			title: "Enquiry Date",
			dataIndex: "enqDate",
			width: 80,
			sortable: true,
		},
		{
			title: "Name of Guest",
			dataIndex: "guestName",
			key: "guestName",
			width: 120,
			sortable: true,
		},
		{
			title: "Phone No.",
			dataIndex: "contact",
			key: "contact",
			width: 80,
		},
		{
			title: "Destination",
			dataIndex: "destinationName",
			key: "destinationName",
			width: 100,
		},
		{
			title: "Pax",
			dataIndex: "pax",
			key: "pax",
			width: 80,
		},
		{
			title: "Last Follow-up",
			dataIndex: "lastFollow",
			key: "lastFollow",
			width: 80,
		},

		{
			title: "Reason of Closure",
			dataIndex: "closureReason",
			key: "closureReason",
			width: 100,
		},
	];

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
	// for pagination End

	// to get the Lost group list
	const [data, setData] = useState([]);
	const getLostlist = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/lost-enquiry-custom?perPage=${perPageItem}&page=${page}&guestName=${guestName}`
			);
			setIsLoading(false);
			setData(response?.data?.data);
			let totalPages = response.data.total / response.data.perPage;
			setTotalCount(Math.ceil(totalPages));
			setPerPageItem(response.data.perPage);
		} catch (error) {
			setIsLoading(true);
			console.log(error);
		}
	};
	useEffect(() => {
		hasComponentPermission(permissions, 107) && getLostlist();
	}, [page, perPageItem]);
	// to get the Lost group list
	return (
		<>
			{hasComponentPermission(permissions, 107) && (
				<div className="row">
					<div className="col-lg-12" style={{ paddingTop: '40px' }}>
						<div className="card">
							<div className="row page-titles mx-0 fixed-top-breadcrumb">
								   <ol className="breadcrumb">
                       
									<li className="breadcrumb-item active">
										<Link to="/dashboard">Dashboard</Link>
									</li>
									<li className="breadcrumb-item active">
										<Link to="#">Lost Enquiry</Link>
									</li>
									<li className="breadcrumb-item  ">
										<Link to="/lost-customizedtour">Customized Tour</Link>
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
												<label>Guest Name</label>
												<input
													type="text"
													className="form-control"
													name="guestName"
													onChange={(e) => setGuestName(e.target.value)}
												/>
											</div>
										</div>
										{/* <div className="col-md-3">
                    <div className="mb-3">
                      <label>Tour Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="tourName"
                        
                      />
                    </div>
                  </div> */}
										<div className="col-md-3 d-flex align-items-center">
											<button
												type="button"
												className="btn btn-primary filter-btn"
												onClick={() => (getLostlist(), setPage(1))}
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
							<div className="card-header  mb-2 p-0">
								<div className="card-title h5">Closure Enquiries</div>
							</div>
							
								<Table
									cols={columns_upcoming}
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
			)}
		</>
	);
};
export default LostCustomizedtour;
