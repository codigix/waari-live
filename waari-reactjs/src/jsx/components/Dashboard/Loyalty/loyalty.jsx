import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import Select from "react-select";
import { get, post } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";
import { toast } from "react-toastify";
import PopupModal from "../Popups/PopupModal";
import ConfirmationDialog from "../Popups/ConfirmationDialog";

const Loyalty = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [numberOfGuests, setNumberOfGuests] = useState([]);
    const [salesReceived, setSalesReceived] = useState([]);
    const [isTableLoadingResult, setIsTableLoadingResult] = useState(false);
    const [resultsData, setResultsData] = useState([]);
    const [page, setPage] = useState(1);
    const [perPageItem, setPerPageItem] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [guestName, setGuestName] = useState("");
    const [loyaltyCard, setLoyaltyCard] = useState(null);
    const [refferalId, setRefferalId] = useState("");
    const { permissions } = useSelector((state) => state.auth);

    // Status change Popup
    const [hasStatusChange, setHasStatusChange] = useState(false);
    const [statusChangeData, setStatusChangeData] = useState({
        status: 0,
        statusFor: "",
    });

    // To Toggle User status from active , inactive
    const updateUserStatus = async () => {
        try {
            const data = {
                userId: statusChangeData.userId,
            };
            setIsTableLoading(true);
            const response = await post(`change-status-${statusChangeData.statusFor}`, data);
            await getResults();
            toast.success(response?.data?.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsTableLoading(false);
        }
    };

    const handleDialogClose = (apiCall) => {
        if (apiCall) {
            updateUserStatus();
        }
        setHasStatusChange(false);
    };

    const getNumberOfGuests = async () => {
        try {
            setIsTableLoading(true);
            const response = await get(`/referee-no-of-guests`);
            setNumberOfGuests(response.data.refereeGuests);
            // setSalesReceived(response.data.refereeGuestsSales);
            setIsTableLoading(false);
        } catch (error) {
            setIsTableLoading(false);
            console.log(error);
        }
    };

    const getGuestSalesReceived = async () => {
        try {
            setIsTableLoading(true);
            const response = await get(`/guests-sales-received`);
            setSalesReceived(response.data.refereeGuestsSales);
            setIsTableLoading(false);
        } catch (error) {
            setIsTableLoading(false);
            console.log(error);
        }
    };

    const getResults = async () => {
        try {
            setIsTableLoadingResult(true);
            const response = await get(
                `/loyalty-guests?name=${guestName}&cardName=${
                    loyaltyCard?.value || ""
                }&refferalId=${refferalId}&page=${page}&perPageItem=${perPageItem}`
            );
            setResultsData(response.data.data);
            setIsTableLoadingResult(false);
            setTotalPages(response.data.lastPage);
        } catch (error) {
            setIsTableLoadingResult(false);
            console.log(error);
        }
    };
    const handlePageChange = (e, page) => {
        setPage(page);
    };
    const handlePerPageItemChange = (e) => {
        setPerPageItem(e);
        setPage(1);
    };

    //TABLE COLOMN1
    const columns = [
        {
            title: "Rank",
            render: (item, index) => index + 1,
            key: "rank",
            width: 40,
        },
        {
            title: "Name",
            dataIndex: "firstName",
            key: "firstName",
            width: 100,
            render: (item, index) => <p>{item.firstName + " " + item.lastName}</p>,
        },
        {
            title: "Guests referred ",
            dataIndex: "enquiryCount",
            key: "enquiryCount",
            width: 80,
        },
    ];

    const columns_sales = [
        {
            title: "Rank",
            render: (item, index) => index + 1,
            key: "rank",
            width: 40,
        },
        {
            title: "Name",
            dataIndex: "userName",
            key: "userName",
            width: 100,
            render: (item, index) => <> {item.firstName + " " + item.lastName} </>,
        },
        {
            title: "Sales referred",
            dataIndex: "loyaltyPoints",
            key: "loyaltyPoints",
            width: 80,
        },
    ];

    const columns_result = [
        {
            title: "Name",
            dataIndex: "userName",
            key: "userName",
            width: 120,
        },
        {
            title: "Loaylty Card",
            dataIndex: "cardName",
            key: "cardName",
            width: 120,
        },
        {
            title: "Referral ID ",
            render: (item) => item.referralId || "--",
            key: "referralid",
            width: 80,
        },
        {
            title: "Points ",
            dataIndex: "loyaltyPoints",
            key: "loyaltyPoints",
            width: 80,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 80,
        },
        {
            title: "Print Status",
            dataIndex: "printedStatusName",
            key: "printedStatusName",
            width: 100,
            render: (item) => (
                <div className="d-flex justify-content-center gap-1">
                    {item.printedStatusName}

                    <Tooltip title="Update Status to Printed">
                        {!item.printedStatus && (
                            <input
                                type="checkbox"
                                checked={item.printedStatus}
                                value={item.printedStatus}
                                onChange={(event) => {
                                    setHasStatusChange(true);
                                    setStatusChangeData({
                                        userId: item.userId,
                                        statusFor: "print",
                                    });
                                }}
                            />
                        )}
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Courier Delivery Status",
            dataIndex: "deliveryStatusName",
            key: "deliveryStatusName",
            width: 100,
            render: (item) => (
                <div className="d-flex justify-content-center gap-1">
                    {item.deliveryStatusName}

                    <Tooltip title="Update Status to Printed">
                        {!item.deliveryStatus && (
                            <input
                                type="checkbox"
                                checked={item.deliveryStatus}
                                value={item.deliveryStatus}
                                onChange={(event) => {
                                    setHasStatusChange(true);
                                    setStatusChangeData({
                                        userId: item.userId,
                                        statusFor: "delivery",
                                    });
                                }}
                            />
                        )}
                    </Tooltip>
                </div>
            ),
        },

        {
            title: "Action",
            width: 60,
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center">
                        <Link to={`/view-loyalty/${item.referralId}`} className="btn-tick">
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
        },
    ];

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };

    useEffect(() => {
        hasComponentPermission(permissions, 101) && getNumberOfGuests();

        hasComponentPermission(permissions, 102) && getGuestSalesReceived();
    }, []);

    useEffect(() => {
        hasComponentPermission(permissions, 103) && getResults();
    }, [page, perPageItem]);

    return (
        <>
            {hasStatusChange && (
                <PopupModal open={true} onDialogClose={handleDialogClose}>
                    <ConfirmationDialog
                        onClose={handleDialogClose}
                        confirmationMsg={`Are you sure you want to change ${
                            statusChangeData.statusFor == "print"
                                ? "Print Status"
                                : "Delivery Status"
                        }?`}
                    />
                </PopupModal>
            )}
            <div className="row">
                <div className="col-lg-12" style={{ paddingTop: "40px" }}>
                    <div className="card">
                        <div className="row page-titles mx-0 fixed-top-breadcrumb">
                            <ol className="breadcrumb">
                               
                                <li className="breadcrumb-item active">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>

                                <li className="breadcrumb-item  ">
                                    <Link to="#">Loyalty</Link>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="card-header card-header-title p-0">
                                <div className="card-title h5">Loyalty Program</div>
                            </div>

                            <div className="row">
                                {hasComponentPermission(permissions, 101) && (
                                    <div className="col-md-6 col-sm-12 col-lg-6 col-12">
                                        <div className="card-header" style={{ paddingLeft: "0" }}>
                                            <div className="card-title h5">
                                                Top 5 Referee Guests (Number of Guests)
                                            </div>
                                        </div>
                                        <Table
                                            cols={columns}
                                            page={1}
                                            data={numberOfGuests}
                                            totalPages={1}
                                            isTableLoading={isTableLoading}
                                        />
                                    </div>
                                )}

                                {hasComponentPermission(permissions, 102) && (
                                    <div className="col-md-6 col-sm-12 col-lg-6 col-12">
                                        <div
                                            className="card-header  pl-0 "
                                            style={{ paddingLeft: "0" }}
                                        >
                                            <div className="card-title h5">
                                                Top 5 Referee Guests (Sales Recieved)
                                            </div>
                                        </div>
                                        <Table
                                            cols={columns_sales}
                                            page={1}
                                            data={salesReceived}
                                            totalPages={1}
                                            isTableLoading={isTableLoading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {hasComponentPermission(permissions, 103) && (
                        <>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                                <div className="form-group">
                                                    <label>Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="guestName"
                                                        onChange={(e) =>
                                                            setGuestName(e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4  col-sm-6 col-lg-3 col-12">
                                                <div className="form-group">
                                                    <label>Loyalty Card</label>
                                                    <Select
                                                        styles={customStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name="loyalty"
                                                        options={[
                                                            { value: "1", label: "Silver" },
                                                            { value: "2", label: "Gold" },
                                                            { value: "3", label: "Platinum" },
                                                            { value: "4", label: "Diamond" },
                                                        ]}
                                                        onChange={(e) => setLoyaltyCard(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-6 col-lg-3 col-12">
                                                <div className="form-group">
                                                    <label>Referral ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="refferalId"
                                                        onChange={(e) =>
                                                            setRefferalId(e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-sm-6 col-lg-3 col-12 d-flex align-items-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary filter-btn"
                                                    onClick={() => (getResults(), setPage(1))}
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
                                            <div
                                                className="card-header  card-header-title p-0"
                                                style={{ paddingLeft: "0" }}
                                            >
                                                <div className="card-title h5">Results</div>
                                            </div>
                                            <Table
                                                cols={columns_result}
                                                page={page}
                                                data={resultsData}
                                                totalPages={totalPages}
                                                isTableLoading={isTableLoadingResult}
                                                handlePageChange={handlePageChange}
                                                handleRowsPerPageChange={handlePerPageItemChange}
                                                isPagination={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
export default Loyalty;
