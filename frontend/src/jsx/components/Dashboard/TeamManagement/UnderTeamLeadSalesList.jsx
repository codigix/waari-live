import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";

const UnderTeamLeadSalesList = () => {
    const [teamsList, setTeamsList] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPageItem, setPerPageItem] = useState(10);
    const { permissions } = useSelector((state) => state.auth);

    //GET Teams LIST
    const getTeamsList = async () => {
        try {
            setIsTableLoading(true);
            const response = await get(
                `sales-list-team-lead?page=${page}&perPage=${perPageItem}`
            );
            setTeamsList(response?.data?.data);
            setTotalPages(response?.data?.lastPage || 1);
            setPerPageItem(response?.data?.perPage || 10);
            setIsTableLoading(false);
        } catch (error) {
            setIsTableLoading(false);
            console.log(error);
        }
    };

    //TABLE COLOMN1
    const columns = [
        {
            title: "Sr.No.",
            render: (item, index) => (
                <>{page * perPageItem - perPageItem + (index + 1)}</>
            ),
            width: 40,
        },
        {
            title: "Sales Agent Name",
            dataIndex: "userName",
            key: "userName",
            width: 100,
        },

        hasComponentPermission(permissions, 273) && {
            title: "Action",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center gap-3">
                        <Link
                            to={`/under-team-lead-sales-data/${item.userId}`}
                            className="btn-tick  me-1"
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
            key: "action",
            width: 80,
        },
    ];

    const finalColumns = columns.filter((column) => column);

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
        hasComponentPermission(permissions, 273) && getTeamsList();
    }, [page, perPageItem]);

    return (
        <>
            <div className="row">
                <div className="col-lg-12" style={{ paddingTop: '40px' }}>
                    <div className="card">
                        <div className="row page-titles mx-0 fixed-top-breadcrumb">
                            <ol className="breadcrumb">
                             
                                <li className="breadcrumb-item active">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="/under-team-lead-sales-list">Team Lead Sales List</Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    {hasComponentPermission(permissions, 273) && (
                        <div className="card">
                            <div className="card-body">
                                <div
                                    className="card-header mb-2 p-0"
                                    style={{ paddingLeft: "0" }}
                                >
                                    <div className="card-title h5">
                                        Sales List
                                    </div>
                                </div>

                                <Table
                                    cols={finalColumns}
                                    page={page}
                                    data={teamsList}
                                    totalPages={totalPages}
                                    isTableLoading={isTableLoading}
                                    isPagination={true}
                                    handlePageChange={handlePageChange}
                                    handleRowsPerPageChange={
                                        handleRowsPerPageChange
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default UnderTeamLeadSalesList;
