import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../table/VTable";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../../common/BackButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { get, post } from "../../../../../services/apiServices";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
};

const ConfirmCustomizedtourCT = () => {
    //TABLE COLOMN
    const navigate = useNavigate();
    const { permissions } = useSelector((state) => state.auth);

    const [openLost, setOpenLost] = React.useState(false);
    const [customEnquiryId, setCustomEnquiryID] = React.useState("");

    const handleOpenLost = (enquiryCustomId) => {
        setCustomEnquiryID(enquiryCustomId);
        setOpenLost(true);
    };

    const handleCloseLost = () => setOpenLost(false);

    const columns = [
        {
            title: "Enquiry Id",
            dataIndex: "uniqueEnqueryId",
            key: "uniqueEnqueryId",
            width: 40,
        },
        {
            title: "Group Name",
            dataIndex: "groupName",
            key: "groupName",
            width: 120,
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            width: 120,
        },
        {
            title: "Phone No",
            dataIndex: "phoneNo",
            key: "phoneNo",
            width: 120,
        },
        {
            title: "Destination Type",
            dataIndex: "destination",
            key: "destination",
            width: 120,
        },
        {
            title: "No of Pax",
            dataIndex: "pax",
            key: "pax",
            width: 120,
        },

        {
            title: "Travel Start Date",
            dataIndex: "startDate",
            key: "startDate",
            width: 70,
            sortable: true,
        },
        {
            title: "Travel End Date",
            dataIndex: "endDate",
            key: "endDate",
            width: 70,
            sortable: true,
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            width: 120,
        },
        hasComponentPermission(permissions, 42) && {
            title: "Billing",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center">
                        <span
                            onClick={() =>
                                navigate(`/confirm-custom-enquiry/${item.enquiryCustomId}/`)
                            }
                        >
                            <Link className="btn-tick">
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
                        </span>

                        {hasComponentPermission(permissions, 36) && (
                            <button
                                className=" btn-trash"
                                onClick={() => handleOpenLost(item?.enquiryCustomId)}
                            >
                                <Tooltip title="Delete">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 448 512"
                                    >
                                        <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                                    </svg>
                                </Tooltip>
                            </button>
                        )}
                    </div>
                </>
            ),
            key: "billing",
            width: 80,
        },
    ];

    //TABLE COLOMN1
    const columns_upcoming = [
        {
            title: "Enq Id",
            dataIndex: "enqno",
            key: "enqno",
            width: 40,
        },
        {
            title: "Group Name",
            dataIndex: "tour-name",
            key: "tour-name",
            width: 100,
        },
        {
            title: "Guest Name",
            dataIndex: "name",
            width: 100,
            sortable: true,
        },
        {
            title: "Numbers",
            dataIndex: "number",
            key: "number",
            width: 100,
            sortable: true,
        },

        {
            title: "Tour Price",
            dataIndex: "tour-price",
            key: "tour-price",
            width: 100,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            width: 90,
        },
        {
            title: "Discounted",
            dataIndex: "discounted",
            key: "discounted",
            width: 90,
        },
        {
            title: "GST",
            dataIndex: "gst",
            key: "gst",
            width: 90,
        },
        {
            title: "TCS",
            dataIndex: "tcs",
            key: "tcs",
            width: 90,
        },
        {
            title: "Grand",
            dataIndex: "grand",
            key: "grand",
            width: 90,
        },
        {
            title: "Paid",
            dataIndex: "paid",
            key: "Paid",
            width: 90,
        },
        // {
        //   title: "Due Date",
        //   dataIndex: "duedate",
        //   key: "duedate",
        //   width: 90,
        // },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            width: 90,
        },

        {
            title: "Collect",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center">
                        <Link to="/payment-customized-tour" className="btn-link">
                            Receiver
                        </Link>
                    </div>
                </>
            ),
            key: "collect",
            width: 90,
        },
        hasComponentPermission(permissions, 42) && {
            title: "Billing",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center">
                        <Link
                            to={`/confirm-custom-enquiry/${item.enquiryCustomId}/`}
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
            key: "billing",
            width: 60,
        },
    ];

    const data_next = [
        {
            enqno: "1",
            name: "Neha Sharma",
            number: "1",
            "tour-name": "Shimla",
            "tour-price": "3000",
            discount: "30%",
            discounted: "10%",
            gst: "2%",
            tcs: "dd",
            Grand: "re",
            paid: "2000",
            duedate: "20/03/2022",
            balance: "1000",
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

    // for pagination end
    // serching
    const [tourName, setTourName] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    //to start get confirm group list
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getConfirmcustomlist = async () => {
        try {
            setIsLoading(true);
            const response = await get(
                `/confirm-custom-list?perPage=${perPageItem}&page=${page}&tourName=${tourName}&startDate=${startDate}&endDate=${endDate}`
            );
            setIsLoading(false);
            setData(response?.data?.data);
            let totalPages = response.data.total / response.data.perPage;
            setTotalCount(Math.ceil(totalPages));
            setPerPageItem(response.data.perPage);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const validationLost = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            closureReason: "",
        },
        validationSchema: Yup.object({
            closureReason: Yup.string().required("Enter The closureReason"),
        }),

        onSubmit: async (values, { resetForm }) => {
            try {
                let data = {
                    enquiryCustomId: customEnquiryId,
                    closureReason: values.closureReason,
                };

                setIsLoading(true);
                const response = await post(`/cancel-custom-enquiry`, data);
                setIsLoading(false);
                resetForm();
                setOpenLost(false);
                toast.success(response?.data?.message);
                getConfirmcustomlist();
            } catch (error) {
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        hasComponentPermission(permissions, 41) && getConfirmcustomlist();
    }, [page, perPageItem]);

    return (
        <>
            {hasComponentPermission(permissions, 41) && (
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
                                            <Link to="#">Confirmed</Link>
                                        </li>
                                        <li className="breadcrumb-item  ">
                                            <Link to="/confirm-custom-tour-new">
                                                Customized Tour
                                            </Link>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label>Group Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="tourName"
                                                        onChange={(e) =>
                                                            setTourName(e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label>Travel Date Start From</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="tourName"
                                                        onChange={(e) =>
                                                            setStartDate(e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label>Travel Date End To</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="tourName"
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 d-flex align-items-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary filter-btn"
                                                    onClick={() => (
                                                        setPage(0), getConfirmcustomlist()
                                                    )}
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
                                    <div className="card-header mb-2 p-0">
                                        <div className="card-title h5">
                                            Payment Collection Due Today
                                        </div>
                                    </div>

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
                    <div className="row d-none">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title h5">Payment Collection Due Late</div>
                                </div>
                                <div className="card-body">
                                    <Table
                                        cols={columns_upcoming}
                                        page={1}
                                        data={data_next}
                                        totalPages={1}
                                        isTableLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Modal
                open={openLost}
                onClose={handleCloseLost}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography>
                        <Link
                            onClick={() => setOpenLost(false)}
                            className="close d-flex justify-content-end text-danger"
                        >
                            &times;
                        </Link>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <form
                            className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                validationLost.handleSubmit();
                                return false;
                            }}
                        >
                            <div className="form-group mb-2">
                                <label>Reason For Closure</label>
                                <textarea
                                    type="text"
                                    id="reasonclosure"
                                    name="closureReason"
                                    className="textarea"
                                    onChange={validationLost.handleChange}
                                    onBlur={validationLost.handleBlur}
                                    value={validationLost.values.closureReason}
                                />
                                {validationLost.touched.closureReason &&
                                validationLost.errors.closureReason ? (
                                    <span className="error">
                                        {validationLost.errors.closureReason}
                                    </span>
                                ) : null}
                            </div>
                            <div className="mb-2 mt-2 row">
                                <div className="col-lg-12 d-flex justify-content-end">
                                    <button type="submit" className="btn btn-submit btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </>
    );
};
export default ConfirmCustomizedtourCT;
