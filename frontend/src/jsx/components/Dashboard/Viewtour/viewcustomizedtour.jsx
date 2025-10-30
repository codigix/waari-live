import React, { useEffect, useState } from "react";
import Select from "react-select";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";

const ViewCustomizedtour = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [groupName, setGroupName] = useState("");
	const [travelMonth, setTravelMonth] = useState("");
	const [travelDateStart, setTravelDateStart] = useState("");
	const [travelDateEnd, setTravelDateEnd] = useState("");
	const [totalDuration, setTotalDuration] = useState("");

	const [city, setCity] = useState(null);
	const [cityOptions, setCityOptions] = useState([]);

	const { permissions } = useSelector((state) => state.auth);

	//get city data
	const getCityList = async () => {
		try {
			const response = await get(`/city-list`);
			setCityOptions(
				response.data.data.map((m) => ({
					label: m.citiesName,
					value: m.citiesId,
				}))
			);
		} catch (error) {
			console.log(error);
		}
	};
	//TABLE COLOMN
	const columns = [
		{
			title: "Tour Id",
			dataIndex: "uniqueEnqueryId",
			key: "TourId",
			width: 50,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			width: 150,
			sortable: true,
		},
		{
			title: "Tour Type",
			dataIndex: "tourType",
			key: "tourType",
			width: 100,
			sortable: true,
		},
		{
			title: "Departure Date",
			dataIndex: "startDate",
			key: "startDate",
			width: 80,
		},
		{
			title: "Arrival date",
			dataIndex: "endDate",
			key: "endDate",
			width: 80,
		},

		{
			title: "Duration",
			dataIndex: "duration",
			key: "duration",
			width: 70,
		},

		{
			title: "View",
			render: (item) => (
				<>
					<div className="d-flex justify-content-center">
						<Link
							to={`/view-customized-tour-details/${item.enquiryCustomId}`}
							className="btn-tick"
						>
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
			key: "view",
			width: 80,
		},
	];

	// for pagination start

	const [totalCount, setTotalCount] = useState(0);
	const [perPageItem, setPerPageItem] = useState(10);

	const [page, setPage] = React.useState(1);
	const handleChange = (event, value) => {
		console.log(value);
		setPage(value);
	};

	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};
	//to start get tour customized list
	const [data, setData] = useState([]);
	const getViewcustomizedlist = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/view-custom-tour?perPage=${perPageItem}&page=${page}&groupName=${groupName}&travelMonth=${travelMonth}&startDate=${travelDateStart}&endDate=${travelDateEnd}&duration=${totalDuration}&cityId=${city?.value || ""
				}`
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

	useEffect(() => {
		getCityList();
	}, []);

	useEffect(() => {
		hasComponentPermission(permissions, 110) && getViewcustomizedlist();
	}, [page, perPageItem]);
	// to get the tour customized list
	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};
	return (
		<>
			{/* <div className="mt-2 mb-2 d-flex justify-content-end align-items-center flex-wrap">
					<Link to="/add-grouptour" className="btn btn-secondary">Add Enquiry</Link>	
          </div> */}
			{hasComponentPermission(permissions, 110) && (
				<>
					<div className="row">
						<div className="col-lg-12" style={{ paddingTop: '40px' }}>
							<div className="card">
								<div className="row page-titles mx-0 fixed-top-breadcrumb">
									<ol className="breadcrumb">
									
										<li className="breadcrumb-item active">
											<Link to="/dashboard">Dashboard</Link>
										</li>
										<li className="breadcrumb-item">
											<Link to="#">View Tour</Link>
										</li>
										<li className="breadcrumb-item  ">
											<Link to="/View-customized-tour">Customized Tour</Link>
										</li>
									</ol>
								</div>
							</div>
							<div className="card">
								<div className="card-body">
									<form>
										<div className="row">
											<div className="col-md-3">
												<div className="mb-2">
													<label>Group Name</label>
													<input
														type="text"
														className="form-control"
														onChange={(e) => setGroupName(e.target.value)}
													/>
												</div>
											</div>

											{/* <div className="col-md-3">
                    <div className="mb-2">
                      <label>Tour type</label>
                      
                    </div>
                  </div> */}
											<div className="col-md-3">
												<div className="mb-2">
													<label>Travel Month</label>
													<input
														type="date"
														className="form-control"
														onChange={(e) => setTravelMonth(e.target.value)}
													/>
												</div>
											</div>
											<div className="col-md-3">
												<div className="mb-2">
													<label>Total Duration(days)</label>
													<input
														type="text"
														className="form-control"
														onChange={(e) => setTotalDuration(e.target.value)}
													/>
												</div>
											</div>
											<div className="col-md-3">
												<div className="mb-2">
													<label>Travel Date Start From</label>
													<input
														type="date"
														className="form-control"
														onChange={(e) => setTravelDateStart(e.target.value)}
													/>
												</div>
											</div>
											<div className="col-md-3">
												<div className="mb-2">
													<label>Travel Date End To</label>
													<input
														type="date"
														className="form-control"
														onChange={(e) => setTravelDateEnd(e.target.value)}
													/>
												</div>
											</div>
											{/* <div className="col-md-3">
                    <div className="mb-2">
                      <label>Departure Type</label>
                      <Select
                       styles={customStyles}
                        className="basic-single"
                        classNamePrefix="select"
                        isLoading={isLoading}
                        isClearable={isClearable}
                        isSearchable={isSearchable}
                        name="color"
                        options={deptype}
                      />
                    </div>
                  </div> */}
											<div className="col-md-3">
												<div className="mb-2">
													<label>City</label>
													<Select
														styles={customStyles}
														className="basic-single"
														classNamePrefix="select"
														name="color"
														options={cityOptions}
														onChange={(e) => setCity(e)}
														value={city}
													/>
												</div>
											</div>
											<div className="col-md-3  d-flex align-items-end">
												<button
													type="button"
													className="btn btn-primary mb-2 filter-btn"
													onClick={() => (getViewcustomizedlist(), setPage(1))}
												>
													Search
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12">
							<div className="card">
								<div className="card-body">
									<Table
										cols={columns}
										page={page}
										data={data}
										totalPages={totalCount}
										isTableLoading={isLoading}
										handlePageChange={handleChange}
										handleRowsPerPageChange={handleRowsPerPageChange}
										isPagination={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};
export default ViewCustomizedtour;
