import React, { useContext, useEffect, useState } from "react";
import Table from "../../table/VTable";
//Import Components
import { ThemeContext } from "../../../../context/ThemeContext";
import DualLine from "../charts/dualLine";
import Bar3 from "../charts/bar3";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { Link } from "react-router-dom";

const calculateProgressPercentage = (
	currentBookings,
	bookingsNeededForNextRank
) => {
	const progressPercentage =
		(currentBookings * bookingsNeededForNextRank) / 100;
	return progressPercentage;
};

const Home = () => {
	const { permissions } = useSelector((state) => state.auth);

	const [isLoading, setIsLoading] = useState(false);

	const [guestsWithDOB, setGuestsWithDOB] = useState([]);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [perPageItem, setPerPageItem] = useState(10);
	const [page, setPage] = React.useState(1);

	const [loyaltyBooking, setLoyaltyBooking] = useState(null);
	const [welcomeBooking, setWelcomeBooking] = useState(null);
	const [refferalRate, setRefferalRate] = useState(null);

	const [top5SalesPartner, setTop5SalesPartner] = useState(null);
	const [nextRankCount, setNextRankCount] = useState(null);
	const [topTenRankCount, setTopTenRankCount] = useState(null);
	const [topFiveRankCount, setTopFiveRankCount] = useState(null);
	const [currentBookingCount, setCurrentBookingCount] = useState(null);

	// Group Tour Related States
	const [gtGraphArray, setGtGraphArray] = useState([]);
	const [gtAchieveArray, setGtAchieveArray] = useState([]);

	const [monthlyTargetGt, setMonthlyTargetGt] = useState(null);
	const [quarterlyTargetGt, setQuarterlyTargetGt] = useState(null);
	const [yearlyTargetGt, setYearlyTargetGt] = useState(null);

	const [achieveMonthlyTargetGt, setAchieveMonthlyTargetGt] = useState(null);
	const [achieveQuarterTargetGt, setAchieveQuarterTargetGt] = useState(null);
	const [achieveYearTargetGt, setAchieveYearTargetGt] = useState(null);

	const [remainingMonthlyTargetGt, setRemainingMonthlyTargetGt] =
		useState(null);
	const [remainingQuarterTargetGt, setRemainingQuarterTargetGt] =
		useState(null);
	const [remainingYearTargetGt, setRemainingYearTargetGt] = useState(null);

	const [enquiriesGT, setEnquiriesGT] = useState([]);

	const [totalEnquiriesGt, setTotalEnquiriesGt] = useState([]);
	const [confirmedEnquiriesGt, setConfirmedEnquiriesGt] = useState([]);
	const [lostEnquiriesGt, setLostEnquiriesGt] = useState([]);

	// Cusomized Tour Related States
	const [ctGraphArray, setCtGraphArray] = useState([]);
	const [ctAchieveArray, setCtAchieveArray] = useState([]);

	const [monthlyTargetCt, setMonthlyTargetCt] = useState(null);
	const [quarterlyTargetCt, setQuarterlyTargetCt] = useState(null);
	const [yearlyTargetCt, setYearlyTargetCt] = useState(null);

	const [achieveMonthlyTargetCt, setAchieveMonthlyTargetCt] = useState(null);
	const [achieveQuarterTargetCt, setAchieveQuarterTargetCt] = useState(null);
	const [achieveYearTargetCt, setAchieveYearTargetCt] = useState(null);

	const [remainingMonthlyTargetCt, setRemainingMonthlyTargetCt] =
		useState(null);
	const [remainingQuarterTargetCt, setRemainingQuarterTargetCt] =
		useState(null);
	const [remainingYearTargetCt, setRemainingYearTargetCt] = useState(null);

	const [enquiriesCT, setEnquiriesCT] = useState([]);

	const [totalEnquiriesCt, setTotalEnquiriesCt] = useState([]);
	const [confirmedEnquiriesCt, setConfirmedEnquiriesCt] = useState([]);
	const [lostEnquiriesCt, setLostEnquiriesCt] = useState([]);

	const [isFollowsLoading, setIsFollowsLoading] = useState(false);
	const [todaysGTFolloups, setTodaysGTFolloups] = useState([])
	const [todaysCTFolloups, setTodaysCTFolloups] = useState([])

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleRowsPerPageChange = (perPage) => {
		setPerPageItem(perPage);
		setPage(1);
	};

	//get birthday and annivasary data
	const getBirthDayData = async () => {
		try {
			setIsTableLoading(true);
			const result = await get(
				`/billing/birthday-lists?page=${page}&perPage=${perPageItem}`
			);

			setTotalCount(result.data.lastPage);
			setGuestsWithDOB(result.data.guestsWithDOB);
		} catch (error) {
			console.log(error);
		} finally {
			setIsTableLoading(false);
		}
	};

	// for particular sales enquiries todays followups 
	const todaysFollowUpGT = async () => {
		try {
			setIsFollowsLoading(true);
			const response = await get(
				`/list-group-tour?perPage=10&page=1`
			);
			setTodaysGTFolloups(response?.data?.data);
			setIsFollowsLoading(false);

		} catch (error) {
			setIsFollowsLoading(false);
			console.log(error);
		}
	};

	const todaysFollowUpCT = async () => {
		try {
			setIsFollowsLoading(true);
			const response = await get(
				`/billing/enquiry-follow-custom?perPage=10&page=1`
			);
			setTodaysCTFolloups(response?.data?.data);
			setIsFollowsLoading(false);

		} catch (error) {
			setIsFollowsLoading(false);
			console.log(error);
		}
	};


	useEffect(() => {
		hasComponentPermission(permissions, 26) && todaysFollowUpGT();
		hasComponentPermission(permissions, 32) && todaysFollowUpCT();
	}, [page, perPageItem]);


	//get loyalty booking
	const getLoyaltyBooking = async () => {
		try {
			const result = await get(`/billing/loyalty-booking`);

			setLoyaltyBooking(result.data.loyaltyBooking);
		} catch (error) {
			console.log(error);
		}
	};

	//get welcome booking
	const getWelcomeBooking = async () => {
		try {
			const result = await get(`/billing/welcome-booking`);

			setWelcomeBooking(result.data.welcomeBooking);
		} catch (error) {
			console.log(error);
		}
	};

	//get refferal rate
	const getRefferalRate = async () => {
		try {
			const result = await get(`/billing/referral-rate`);

			setRefferalRate(result.data.referralRate);
		} catch (error) {
			console.log(error);
		}
	};

	//get more booking counts like nextRankCount, currentBookingCount, topTenRankCount, topFiveRankCount
	const getMoreBookingCount = async () => {
		try {
			const result = await get(`/billing/more-booking-count`);

			setNextRankCount(result.data.nextRankCount);
			setTopTenRankCount(result.data.topTenRankCount);
			setTopFiveRankCount(result.data.topFiveRankCount);
			setCurrentBookingCount(result.data.currentBookingCount);
		} catch (error) {
			console.log(error);
		}
	};

	//get top 5 sales partner data
	const getTop5SalesPartnerData = async () => {
		try {
			const result = await get(`/billing/top-sales-partner`);
			setTop5SalesPartner(result.data?.topSales);
		} catch (error) {
			console.log(error);
		}
	};

	// Group Tour Related Data like graphs counts Apis
	//get monthly target graph for group tour
	const getMonthlyTargetGraphGt = async () => {
		try {
			const result = await get(`/billing/monthly-target-graph-gt`);
			setGtGraphArray(result.data.gtGraphArray);
			setGtAchieveArray(result.data.gtAchieveArray);
		} catch (error) {
			console.log(error);
		}
	};

	//get Group Tour Target Counts
	const getGroupTourTargets = async () => {
		try {
			const result = await get(`/billing/target-gt`);
			setMonthlyTargetGt(result.data.monthlyTarget);
			setQuarterlyTargetGt(result.data.quarterlyTarget);
			setYearlyTargetGt(result.data.yearlyTarget);

			setAchieveMonthlyTargetGt(result.data.achieveMonthlyTargetGt);
			setAchieveQuarterTargetGt(result.data.achieveQuarterTargetGt);
			setAchieveYearTargetGt(result.data.achieveYearTargetGt);

			setRemainingMonthlyTargetGt(result.data.remainingMonthlyTargetGt);
			setRemainingQuarterTargetGt(result.data.remainingQuarterTargetGt);
			setRemainingYearTargetGt(result.data.remainingYearTargetGt);
		} catch (error) {
			console.log(error);
		}
	};

	//get enquiry list gt
	const getEnquiriesGT = async () => {
		try {
			const result = await get(`/billing/enquiry-list-gt`);
			setEnquiriesGT(result.data?.enquiriesGT);
		} catch (error) {
			console.log(error);
		}
	};

	//get enquiry graph gt
	const getEnquiryGraphGt = async () => {
		try {
			const result = await get(`/billing/enquiry-graph-gt`);
			setTotalEnquiriesGt(result.data?.totalEnquiriesGt);
			setConfirmedEnquiriesGt(result.data?.confirmedEnquiriesGt);
			setLostEnquiriesGt(result.data?.lostEnquiriesGt);
		} catch (error) {
			console.log(error);
		}
	};

	// Customized Tour Related Data like graphs counts Apis
	//get monthly target graph for customized tour
	const getMonthlyTargetGraphCt = async () => {
		try {
			const result = await get(`/billing/monthly-target-graph-ct`);
			setCtGraphArray(result.data.ctTargetArray);
			setCtAchieveArray(result.data.ctAchieveArray);
		} catch (error) {
			console.log(error);
		}
	};

	//get Custom Tour Target Counts
	const getCustomTourTargets = async () => {
		try {
			const result = await get(`/billing/target-ct`);
			setMonthlyTargetCt(result.data.monthlyTarget);
			setQuarterlyTargetCt(result.data.quarterlyTarget);
			setYearlyTargetCt(result.data.yearlyTarget);

			setAchieveMonthlyTargetCt(result.data.achieveMonthlyTargetCt);
			setAchieveQuarterTargetCt(result.data.achieveQuarterTargetCt);
			setAchieveYearTargetCt(result.data.achieveYearTargetCt);

			setRemainingMonthlyTargetCt(result.data.remainingMonthlyTargetCt);
			setRemainingQuarterTargetCt(result.data.remainingQuarterTargetCt);
			setRemainingYearTargetCt(result.data.remainingYearTargetCt);
		} catch (error) {
			console.log(error);
		}
	};

	//get enquiry list ct
	const getEnquiriesCT = async () => {
		try {
			const result = await get(`/billing/enquiry-list-ct`);
			setEnquiriesCT(result.data?.enquiriesCt);
		} catch (error) {
			console.log(error);
		}
	};

	//get enquiry graph ct
	const getEnquiryGraphCt = async () => {
		try {
			const result = await get(`/billing/enquiry-graph-ct`);
			setTotalEnquiriesCt(result.data?.totalEnquiriesCt);
			setConfirmedEnquiriesCt(result.data?.confirmedEnquiriesCt);
			setLostEnquiriesCt(result.data?.lostEnquiriesCt);
		} catch (error) {
			console.log(error);
		}
	};

	const columns = [
		{
			title: "Previous Month",
			dataIndex: "previousMonthTotal",
			key: "previousMonthTotal",
			width: 100,
		},
		{
			title: "Current Month",
			dataIndex: "currentMonthTotal",
			key: "currentMonthTotal",
			width: 100,
		},
		{
			title: "On going",
			dataIndex: "ongoing",
			key: "ongoing",
			width: 100,
		},
		{
			title: "Confirm",
			dataIndex: "confirmed",
			key: "confirmed",
			width: 100,
		},
		{
			title: "Lost",
			dataIndex: "lost",
			key: "lost",
			width: 100,
		},

		{
			title: "Conversion Rate(%)",
			dataIndex: "conversionRate",
			key: "conversionRate",
			width: 100,
		},
	];
	const columns_ct = [
		{
			title: "Previous Month",
			dataIndex: "previousMonthTotal",
			key: "previousMonthTotal",
			width: 100,
		},
		{
			title: "Current Month",
			dataIndex: "currentMonthTotal",
			key: "currentMonthTotal",
			width: 100,
		},
		{
			title: "On going",
			dataIndex: "ongoing",
			key: "ongoing",
			width: 100,
		},
		{
			title: "Confirm",
			dataIndex: "confirmed",
			key: "confirmed",
			width: 100,
		},
		{
			title: "Lost",
			dataIndex: "lost",
			key: "lost",
			width: 100,
		},
		// {
		//   title: "Total",
		//   dataIndex: "total",
		//   key: "total",
		//   width: 100,
		// },
		{
			title: "Conversion Rate(%)",
			dataIndex: "conversionRate",
			key: "conversionRate",
			width: 100,
		},
	];

	const birthday = [
		{
			title: "Name",
			dataIndex: "familyHeadName",
			key: "familyHeadName",
			width: 100,
		},
		{
			title: "Birthday",
			dataIndex: "dob",
			key: "dob",
			width: 100,
		},
		{
			title: "Annivasary",
			dataIndex: "marriageDate",
			key: "marriageDate",
			width: 100,
		},
		{
			title: "Phone No.",
			dataIndex: "contact",
			key: "contact",
			width: 100,
		},
	];

	const todaysFollowupColumnsGT = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},


		{
			title: "Follow up Date",
			dataIndex: "nextFollowUp",
			width: 50,
			sortable: true,
		},
		{
			title: "Follow up Time",
			dataIndex: "nextFollowUpTime",
			width: 50,
			sortable: true,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			key: "groupName",
			width: 120,
			sortable: true,
		},


		{
			title: "Pax",
			dataIndex: "paxNo",
			key: "pax",
			width: 90,
		},
		{
			title: "Allocated To",
			dataIndex: "userName",
			key: "userName",
			width: 90,
		},

	];

	const todaysFollowupColumnsCT = [
		{
			title: "Enquiry Id",
			dataIndex: "uniqueEnqueryId",
			key: "uniqueEnqueryId",
			width: 40,
		},
		{
			title: "Follow up Date",
			dataIndex: "nextFollowUp",
			width: 50,
			sortable: true,
		},
		{
			title: "Follow up Time",
			dataIndex: "nextFollowUpTime",
			width: 50,
			sortable: true,
		},
		{
			title: "Group Name",
			dataIndex: "groupName",
			key: "groupName",
			width: 120,
			sortable: true,
		},
		{
			title: "Pax",
			dataIndex: "pax",
			key: "pax",
			width: 80,
		},

		{
			title: "Allocated To",
			dataIndex: "userName",
			key: "userName",
			width: 90,
		},

	]

	const { changeBackground } = useContext(ThemeContext);

	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	useEffect(() => {
		hasComponentPermission(permissions, 11) && getBirthDayData();
	}, [page, perPageItem]);

	useEffect(() => {
		hasComponentPermission(permissions, 1) && getLoyaltyBooking();

		hasComponentPermission(permissions, 2) && getWelcomeBooking();

		hasComponentPermission(permissions, 3) && getRefferalRate();

		hasComponentPermission(permissions, 21) && getMoreBookingCount();

		// Grout Tour Graphs and list related Api Calls
		hasComponentPermission(permissions, 12) && getMonthlyTargetGraphGt();

		hasComponentPermission(permissions, 14) && getGroupTourTargets();

		hasComponentPermission(permissions, 16) && getEnquiryGraphGt();

		hasComponentPermission(permissions, 18) && getEnquiriesGT();

		// Custmized Tour Graphs and list related Api Calls
		hasComponentPermission(permissions, 13) && getMonthlyTargetGraphCt();

		hasComponentPermission(permissions, 15) && getCustomTourTargets();

		hasComponentPermission(permissions, 17) && getEnquiryGraphCt();

		hasComponentPermission(permissions, 19) && getEnquiriesCT();
	}, []);

	useEffect(() => {
		hasComponentPermission(permissions, 20) && getTop5SalesPartnerData();
		// While view farmer page is active, the yadi tab must also activated
		let element = document.getElementById("Dashboard");
		if (element) {
			element.classList.add("mm-active1"); // Add the 'active' class to the element
		}
		return () => {
			if (element) {
				element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
			}
		};
	}, []);

	return (
		<>
			<div className="row ">
				{hasComponentPermission(permissions, 11) ? (
					<div className="col-lg-6 col-sm-12">
						<div className="card bg-yellow">
							<div className="card-body ">
								<div className="card-header" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Birthday</div>
								</div>
								<div className="mt-3 mb-3 birthday-table">
									<Table
										cols={birthday}
										data={guestsWithDOB || []}
										totalPages={totalCount}
										isTableLoading={isTableLoading}
										handlePageChange={handlePageChange}
										isPagination={true}
										handleRowsPerPageChange={handleRowsPerPageChange}
									/>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				{hasComponentPermission(permissions, 26) ? (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body ">
								<div className="card-header" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Group Tour Today's Followups</div>
								</div>
								<div className="mt-3 mb-3 birt`hday-table">
									<Table
										cols={todaysFollowupColumnsGT}
										data={todaysGTFolloups || []}
										isTableLoading={isFollowsLoading}
										isPagination={false}
									/>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				{hasComponentPermission(permissions, 32) ? (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body ">
								<div className="card-header" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Custom Tour Today's Followups</div>
								</div>
								<div className="mt-3 mb-3 birt`hday-table">
									<Table
										cols={todaysFollowupColumnsCT}
										data={todaysCTFolloups || []}
										isTableLoading={isFollowsLoading}
										isPagination={false}
									/>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
				<div className="col-lg-6 col-sm-12">
					<div className="row">
						{hasComponentPermission(permissions, 1) && (
							<div className="col-xl-6 col-md-6 col-lg-6 col-12">
								<div className="card booking">
									<div className="card-body">
										<div className="booking-status d-flex align-items-center">
											<div className="ms-4">
												<p className="mb-0 text-nowrap">Loyalty Booking</p>
												<h2 className="mb-0 font-w600">
													{loyaltyBooking || 0}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						{hasComponentPermission(permissions, 2) && (
							<div className="col-xl-6 col-md-6 col-lg-6 col-12">
								<div className="card booking">
									<div className="card-body">
										<div className="booking-status d-flex align-items-center">
											<div className="ms-4">
												<p className="mb-0 text-nowrap ">Welcome Booking</p>
												<h2 className="mb-0 font-w600">
													{welcomeBooking || 0}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{hasComponentPermission(permissions, 3) && (
							<div className="col-xl-6 col-md-6 col-lg-6 col-sm-6">
								<div className="card booking">
									<div className="card-body">
										<div className="booking-status d-flex text-center align-items-center">
											<div className="ms-4">
												<p className="mb-0">Referral Rate</p>
												<h2 className="mb-0 font-w600">{refferalRate || 0}</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						{/* <div className="col-xl-2 col-md-4 col-lg-3 col-sm-6">
          <div className="card booking">
            <div className="card-body">
              <div className="booking-status d-flex  align-items-center">
              <div className="ms-4">
                <p className="mb-0">Card sold</p>
                  <h2 className="mb-0 font-w600">516</h2>
                 </div>
   
              </div>
            </div>
          </div>
        </div> */}
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12 col-sm-12">
					{(hasComponentPermission(permissions, 12) ||
						hasComponentPermission(permissions, 14) ||
						hasComponentPermission(permissions, 16) ||
						hasComponentPermission(permissions, 18)) && (
							<div className="card">
								<div className="card-body">
									<div
										className="card-header"
										style={{ paddingLeft: "0", paddingTop: "0" }}
									>
										<div className="card-title h2">Group Tour</div>
									</div>
								</div>
							</div>
						)}
				</div>

				{hasComponentPermission(permissions, 12) && (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-header pt-0" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Monthly Target</div>
								</div>
								<DualLine
									achivedTarget={gtAchieveArray || []}
									actualTarget={gtGraphArray || []}
								/>
							</div>
						</div>
					</div>
				)}
				{hasComponentPermission(permissions, 16) ||
					hasComponentPermission(permissions, 18) ? (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div
									className="card-header"
									style={{ paddingLeft: "0", paddingTop: "0" }}
								>
									<div className="card-title h5">Enquiries</div>
								</div>

								{hasComponentPermission(permissions, 16) && (
									<Bar3
										confirmEnqData={confirmedEnquiriesGt}
										lostEnqData={lostEnquiriesGt}
										totalEnqData={totalEnquiriesGt}
									/>
								)}

								{hasComponentPermission(permissions, 18) && (
									<div className="mt-3">
										<Table
											cols={columns}
											page={1}
											data={enquiriesGT || []}
											totalPages={1}
											isTableLoading={isLoading}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					""
				)}
				{hasComponentPermission(permissions, 14) && (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-header pt-0" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Target</div>
								</div>
								<div className="row mt-2 mb-2">
									<div
										className="col-lg-4 col-sm-4 col-6  m-auto  d-flex justify-content-center text-center purple-progress"
										style={{ flexDirection: "column" }}
									>
										<CircularProgressbar
											value={monthlyTargetGt || 0}
											text={`Total-${monthlyTargetGt || 0}`}
										/>
										<h6 className="mt-2">Monthly Target</h6>
										<div className="heading-card">
											<h6>Achieved:{achieveMonthlyTargetGt || 0}</h6>
											<h6>Remaining:{remainingMonthlyTargetGt || 0}</h6>
										</div>
									</div>
									<div
										className="col-lg-4 col-sm-4 col-6 m-auto  d-flex justify-content-center text-center yellow-progress"
										style={{ flexDirection: "column" }}
									>
										<CircularProgressbar
											value={quarterlyTargetGt || 0}
											text={`Total-${quarterlyTargetGt || 0}`}
										/>
										<h6 className="mt-2">Quarter Target</h6>
										<div className="heading-card1">
											<h6>Achieved:{achieveQuarterTargetGt || 0}</h6>
											<h6>Remaining:{remainingQuarterTargetGt || 0}</h6>
										</div>
									</div>
									<div
										className="col-lg-4 col-sm-4 col-6 m-auto  d-flex justify-content-center text-center blue-progress"
										style={{ flexDirection: "column" }}
									>
										<CircularProgressbar
											value={yearlyTargetGt || 0}
											text={`Total-${yearlyTargetGt || 0}`}
										/>
										<h6 className="mt-2">Yearly Target</h6>
										<div className="heading-card2">
											<h6>Achieved:{achieveYearTargetGt || 0}</h6>
											<h6>Remaining:{remainingYearTargetGt || 0}</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{/* Customised */}
				<div className="col-lg-12 col-sm-12">
					{(hasComponentPermission(permissions, 13) ||
						hasComponentPermission(permissions, 15) ||
						hasComponentPermission(permissions, 17) ||
						hasComponentPermission(permissions, 19)) && (
							<div className="card">
								<div className="card-body">
									<div
										className="card-header"
										style={{ paddingLeft: "0", paddingTop: "0" }}
									>
										<div className="card-title h2">Customized Tour</div>
									</div>
								</div>
							</div>
						)}
				</div>
				{hasComponentPermission(permissions, 13) && (
					<div className="col-lg-6 col-sm-12">

						<div className="card">
							<div className="card-body">
								<div className="card-header pt-0" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Monthly Target</div>
								</div>
								<DualLine
									achivedTarget={ctAchieveArray}
									actualTarget={ctGraphArray}
								/>
							</div>
						</div>

					</div>
				)}
				{hasComponentPermission(permissions, 17) ||
					hasComponentPermission(permissions, 19) ? (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div
									className="card-header"
									style={{ paddingLeft: "0", paddingTop: "0" }}
								>
									<div className="card-title h5">Enquiries</div>
								</div>

								{hasComponentPermission(permissions, 17) && (
									<Bar3
										confirmEnqData={confirmedEnquiriesCt}
										lostEnqData={lostEnquiriesCt}
										totalEnqData={totalEnquiriesCt}
									/>
								)}

								{hasComponentPermission(permissions, 19) && (
									<div className="mt-3">
										<Table
											cols={columns_ct}
											page={1}
											data={enquiriesCT || []}
											totalPages={1}
											isTableLoading={isLoading}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					""
				)}
				{hasComponentPermission(permissions, 15) && (
					<div className="col-lg-6 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-header pt-0" style={{ paddingLeft: "0" }}>
									<div className="card-title h5">Target</div>
								</div>
								<div className="row mt-2 mb-2">
									<div
										className="col-lg-4 col-sm-4 col-6 m-auto d-flex justify-content-center text-center purple-progress"
										style={{ flexDirection: "column" }}
									>
										{/* <Pie4 /> */}
										<CircularProgressbar
											value={monthlyTargetCt || 0}
											text={`Total-${monthlyTargetCt || 0}`}
										/>
										<h6 className="mt-2">Monthly Target</h6>
										<div className="heading-card">
											<h6>Achieved:{achieveMonthlyTargetCt || 0}</h6>
											<h6>Remaining:{remainingMonthlyTargetCt || 0}</h6>
										</div>
									</div>
									<div
										className="col-lg-4 col-sm-4 col-6 m-auto  d-flex justify-content-center text-center yellow-progress"
										style={{ flexDirection: "column" }}
									>
										{/* <Pie5 /> */}
										<CircularProgressbar
											value={quarterlyTargetCt || 0}
											text={`Total-${quarterlyTargetCt || 0}`}
										/>
										<h6 className="mt-2">Quarter Target</h6>
										<div className="heading-card1">
											<h6>Achieved:{achieveQuarterTargetCt || 0}</h6>
											<h6>Remaining:{remainingQuarterTargetCt || 0}</h6>
										</div>
									</div>
									<div
										className="col-lg-4 col-sm-4 col-6 m-auto  d-flex justify-content-center text-center blue-progress"
										style={{ flexDirection: "column" }}
									>
										{/* <Pie6 /> */}
										<CircularProgressbar
											value={yearlyTargetCt || 0}
											text={`Total-${yearlyTargetCt || 0}`}
										/>
										<h6 className="mt-2">Yearly Target</h6>
										<div className="heading-card2">
											<h6>Achieved:{achieveYearTargetCt || 0}</h6>
											<h6>Remaining:{remainingYearTargetCt || 0}</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}



				{hasComponentPermission(permissions, 20) && (
					<div className="col-md-12">
						<div className="card">
							<div className="card-body">
								<div
									className="card-header"
									style={{ paddingLeft: "0", paddingTop: "0" }}
								>
									<div className="card-title h5">Top 5 Sales Partners </div>
								</div>
								<div className="table-responsive mb-3 mt-3">
									<table className="table  table-bordered table-responsive-sm table-tour table-tour1 table-tour2">
										<thead>
											<tr>
												<th className="" style={{ width: "180px" }}>
													Name
												</th>
												<th className="" colSpan="3" style={{ width: "100px" }}>
													FIT
												</th>
												<th className="" colSpan="3" style={{ width: "100px" }}>
													GIT
												</th>
												<th className="" style={{ width: "120px" }}>
													Overall Total
												</th>
												<th className="" style={{ width: "120px" }}>
													Today New Booking
												</th>
											</tr>
										</thead>

										<tbody className="divide-y divide-gray-600">
											<tr>
												<td></td>
												<td>
													<b>Domestic</b>
												</td>
												<td>
													<b>International</b>
												</td>
												<td>
													<b>Total</b>
												</td>
												<td>
													<b>Domestic</b>
												</td>
												<td>
													<b>International</b>
												</td>
												<td>
													<b>Total</b>
												</td>
												<td></td>
												<td></td>
											</tr>
											{top5SalesPartner &&
												top5SalesPartner?.map((item, index) => (
													<tr key={item.userName + index}>
														<td>{item.userName}</td>
														<td>{item.domesticCountGt}</td>
														<td>{item.internationalCountGt}</td>
														<td>{item.total_count_gt}</td>
														<td>{item.domesticCountCt}</td>
														<td>{item.internationalCountCt}</td>
														<td>{item.total_count_ct}</td>
														<td>{item.total_count_overall}</td>
														<td>{item?.todaysBooking || 0}</td>
													</tr>
												))}
											{top5SalesPartner &&
												top5SalesPartner?.data?.length == 0 && (
													<tr>
														<td colSpan={8}>Data not found</td>
													</tr>
												)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{hasComponentPermission(permissions, 21) && (
				<div className="row">
					<div className="col-lg-3 col-sm-6">
						<div className="card bg-card">
							<div className="card-body">
								<div className="d-flex align-items-end pb-2 justify-content-between">
									<span className="fs-20 font-w500 text-white">
										More Bookings for Top 10
									</span>
									<span className="fs-22 font-w600 text-white">
										<span className="pe-2"></span>
										{topTenRankCount}
									</span>
								</div>
								{topTenRankCount ? (
									<div className="progress default-progress h-auto">
										<div
											className="progress-bar bg-white progress-animated"
											style={{
												width: `${calculateProgressPercentage(
													currentBookingCount,
													topTenRankCount
												)}%`,
												height: "13px",
											}}
										>
											<span className="sr-only">
												{calculateProgressPercentage(
													currentBookingCount,
													topTenRankCount
												)}
												% Complete
											</span>
										</div>
									</div>
								) : (
									<div style={{ textTransform: 'capitalize', color: "#ffc504", fontWeight: "600" }}>You are in top 10</div>
								)}
							</div>
						</div>
					</div>
					<div className="col-lg-3 col-sm-6">
						<div className="card bg-card">
							<div className="card-body">
								<div className="d-flex align-items-end pb-4 justify-content-between">
									<span className="fs-20 font-w500 text-white">
										More Bookings to (next rank)
									</span>
									<span className="fs-22 font-w600 text-white">
										<span className="pe-2"></span>
										{nextRankCount}
									</span>
								</div>
								<div className="progress default-progress h-auto">
									<div
										className="progress-bar bg-white progress-animated"
										style={{
											width: `${calculateProgressPercentage(
												currentBookingCount,
												nextRankCount
											)}%`,
											height: "13px",
										}}
									>
										<span className="sr-only">
											{calculateProgressPercentage(
												currentBookingCount,
												nextRankCount
											)}
											% Complete
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-3 col-sm-6">
						<div className="card bg-card">
							<div className="card-body">
								<div className="d-flex align-items-end pb-4 justify-content-between">
									<span className="fs-20 font-w500 text-white">
										More Bookings for Top 5
									</span>
									<span className="fs-22 font-w600 text-white">
										<span className="pe-2"></span>
										{topFiveRankCount}
									</span>
								</div>
								{topFiveRankCount ? (
									<div className="progress default-progress h-auto">
										<div
											className="progress-bar bg-white progress-animated"
											style={{
												width: `${calculateProgressPercentage(
													currentBookingCount,
													topFiveRankCount
												)}%`,
												height: "13px",
											}}
										>
											<span className="sr-only">
												{calculateProgressPercentage(
													currentBookingCount,
													topFiveRankCount
												)}
												% Complete
											</span>
										</div>
									</div>
								) : (
									<div className="text-white">You are in top 5</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			{/* {
        top5SalesPartner && top5SalesPartner?.isFirst &&
        <div className="row mb-3">
          <div className="col-md-12 m-auto">
            <div className="card ">
              <div className="card-body text-center body-trophy">
                <img src="assets/images/trophy.png" alt="trophy" className="mx-auto" style={{ width: "6%" }} />
                <h4 className="mb-0">Congratulation!!</h4>
                <p className="mb-0">Your at Top 1st</p>
              </div>
            </div>
          </div>
        </div>
      } */}
		</>
	);
};
export default Home;
