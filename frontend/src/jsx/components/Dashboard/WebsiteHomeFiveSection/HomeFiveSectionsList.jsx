import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { Tooltip } from "@mui/material";

import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import BackButton from "../../common/BackButton";

const HomeFiveSectionsList = () => {
    const [homeFiveSectionsList, setHomeFiveSectionsList] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPageItem, setPerPageItem] = useState(10);
    // const [reviewName, setReviewName] = useState("");
    // to delete a review
    const { permissions } = useSelector((state) => state.auth);

    //GET GUEST LIST
    const getTopFiveGroupJourneyList = async () => {
        try {
            setIsTableLoading(true);
            const response = await get(
                `topfivegroupjourney-list?page=${page}&perPage=${perPageItem}`
            );
            setTotalPages(response?.data?.lastPage);
            setHomeFiveSectionsList(response?.data?.data);
            setPerPageItem(response?.data?.perPage);
            setIsTableLoading(false);
        } catch (error) {
            setIsTableLoading(false);
            console.log(error);
        }
    };

    //TABLE COLOMN1
    const columns = [
        {
            title: "Section Item No",
            dataIndex: "topFiveGroupJourneyId",
            key: "topFiveGroupJourneyId",
            width: 150,
        },

        {
            title: "Image",
            dataIndex: "topFiveGroupJourneyImageUrl",
            key: "topFiveGroupJourneyImageUrl",
            width: 100,
            render: (item) => (
                <img
                    src={item.topFiveGroupJourneyImageUrl}
                    alt="section name"
                    style={{ width: "50px", height: "50px" }}
                />
            ),
        },

        {
            title: "Redirection Link",
            dataIndex: "topFiveGroupJourneyPathUrl",
            key: "topFiveGroupJourneyPathUrl",
            width: 40,
            render: (item) => {
                // Define a minimum length before trimming the URL
                const minLength = 30;

                const link = item.topFiveGroupJourneyPathUrl;

                // Check if the URL is shorter than the defined minLength
                const isShortUrl = link.length < minLength;

                return (
                    <Tooltip title={link}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            <span>
                                {!link
                                    ? "-"
                                    : isShortUrl
                                    ? link
                                    : link.substring(8, 16) +
                                      "..." +
                                      link.substring(link.length - 15)}
                            </span>
                        </a>
                    </Tooltip>
                );
            },
        },

        {
            title: "Action",
            render: (item) => (
                <>
                    <div className="d-flex justify-content-center ">
                        {hasComponentPermission(permissions, 346) && (
                            <Link
                                to={`/edit-top-five/${item.topFiveGroupJourneyId}`}
                                className="btn-edit-user me-1"
                            >
                                <Tooltip title="Edit">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        classname="svg-edit"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                                    </svg>
                                </Tooltip>
                            </Link>
                        )}
                    </div>
                </>
            ),
            key: "role",
            width: 80,
        },
    ];

    const finalReviewListColumns = columns.filter((column) => column);

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
        hasComponentPermission(permissions, 344) && getTopFiveGroupJourneyList();
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
                                    <Link to="/home-five-sections-list">
                                        Home Page Five sections List
                                    </Link>
                                </li>
                            </ol>
                        </div>
                    </div>

                    {hasComponentPermission(permissions, 344) ? (
                        <div className="card">
                            <div className="card-body">
                                <div className="card-header pt-0 mb-2" style={{ paddingLeft: "0" }}>
                                    <div className="card-title h5">Website Five Section Manage</div>
                                </div>

                                <Table
                                    cols={finalReviewListColumns}
                                    page={page}
                                    data={homeFiveSectionsList}
                                    totalPages={totalPages}
                                    isTableLoading={isTableLoading}
                                    handlePageChange={handlePageChange}
                                    handleRowsPerPageChange={handleRowsPerPageChange}
                                    isPagination={false}
                                />
                            </div>
                        </div>
                    ) : <h2 className="centered-message">
                    You do not have permission for this page
                </h2>}
                </div>
            </div>
        </>
    );
};
export default HomeFiveSectionsList;
