import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../table/VTable";
import { get, post } from "../../../../../services/apiServices";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import BackButton from "../../../common/BackButton";
import { Box, Modal, Tooltip, Typography } from "@mui/material";
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
    borderRadius: "0.3rem",
};

const ConfirmGrouptour = () => {
    //TABLE COLOMN
    const navigate = useNavigate();
    const { permissions } = useSelector((state) => state.auth);
    const [openLost, setOpenLost] = React.useState(false);
    const [customEnquiryId, setCustomEnquiryID] = React.useState("");

    const handleOpenLost = (enquiryId) => {
        setCustomEnquiryID(enquiryId);
        setOpenLost(true);
    };

    const columns = [
        {
            title: "Enquiry Id",
            dataIndex: "uniqueEnqueryId",
            key: "uniqueEnqueryId",
            width: 50,
        },
        {
            title: "Name",
            dataIndex: "guestName",
            key: "guestName",
            width: 120,
            sortable: true,
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
            title: "Contact No.",
            dataIndex: "contact",
            key: "contact",
            width: 80,
            sortable: true,
        },
        {
            title: "Tour Name",
            dataIndex: "tourName",
            key: "tourName",
            width: 120,
        },
        {
            title: "Tour Price",
            dataIndex: "tourPrice",
            key: "tourPrice",
            width: 100,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            width: 80,
        },
        {
            title: "Discounted",
            dataIndex: "discounted",
            key: "discounted",
            width: 80,
        },
        {
            title: "GST",
            dataIndex: "gst",
            key: "gst",
            width: 70,
        },
        {
            title: "TCS",
            dataIndex: "tcs",
            key: "tcs",
            width: 70,
        },
        {
            title: "Grand",
            dataIndex: "grand",
            key: "grand",
            width: 90,
        },
        {
            title: "Paid",
            dataIndex: "advancePayment",
            key: "advancePayment",
            width: 90,
        },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            width: 90,
        },

        hasComponentPermission(permissions, 212) && {
            title: "Billing",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center">
                        <span
                            className="p-1"
                            onClick={() => {
                                navigate(
                                    `/all-confirm-enquiry/${item?.enquiryGroupId}/${item.familyHeadGtId}`
                                );
                            }}
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

                        {hasComponentPermission(permissions, 29) && (
                            <button
                                className=" btn-trash"
                                onClick={() => handleOpenLost(item?.enquiryGroupId)}
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

    const finalColumns = columns.filter((column) => column);

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

    // for pagination end

    // to get the confirm group list
    const [data, setData] = useState([]);
    const [guestName, setGuestName] = useState("");
    const [tourName, setTourName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getConfirmlist = async () => {
        try {
            setIsLoading(true);
            const response = await get(
                `/all-confirm-group-tour-list?guestName=${guestName}&tourName=${tourName}&perPage=${perPageItem}&page=${page}&startDate=${startDate}&endDate=${endDate}`
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

    // to put the enquiry in lost start
    const handleCloseLost = () => setOpenLost(false);
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
                    enquiryGroupId: customEnquiryId,
                    closureReason: values.closureReason,
                };

                setIsLoading(true);
                const response = await post(`/cancel-enquiry-group-tour`, data);
                setIsLoading(false);
                resetForm();
                setOpenLost(false);
                toast.success(response?.data?.message);
                getConfirmlist();
            } catch (error) {
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        hasComponentPermission(permissions, 211) && getConfirmlist();
    }, [page, perPageItem]);

    return (
        <>
            {hasComponentPermission(permissions, 211) && (
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
                                            <Link to="/confirm-group-tour-new">Group Tour</Link>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-lg-10">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label>Guest Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="guestName"
                                                                placeholder="Search..."
                                                                onChange={(e) =>
                                                                    setGuestName(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label>Tour Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="tourName"
                                                                placeholder="Search..."
                                                                onChange={(e) =>
                                                                    setTourName(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label>Travel Date Start From</label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="startDate"
                                                                onChange={(e) =>
                                                                    setStartDate(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label>Travel Date End To</label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="endDate"
                                                                onChange={(e) =>
                                                                    setEndDate(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-2 d-flex align-items-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary filter-btn"
                                                    onClick={() => {
                                                        setPage(1);
                                                        getConfirmlist();
                                                    }}
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
                                    <div className="card-header  mb-2 p-0">
                                        <div className="card-title h5">
                                            Payment Collection Due Today
                                        </div>
                                    </div>

                                    <Table
                                        cols={finalColumns}
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
                            <span>&times;</span>
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
export default ConfirmGrouptour;
