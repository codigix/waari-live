import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Table from "../../table/VTable";
import { Tab, Nav } from "react-bootstrap";
import PopupModal from "../Popups/PopupModal";
import AssignToPopUp from "./AssignToPopUp";
import BackButton from "../../common/BackButton";

const UnderTeamLeadSalesData = () => {
    const { id } = useParams();
    const tabs = ["GROUP TOUR", "CUSTOM TOUR"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [guestList, setGuestList] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPageItem, setPerPageItem] = useState(10);

    const [showAssignTo, setShowAssignTo] = useState(false);
    const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

    // Get Sales Enquires Statistics for Each Under Sales Agent (for group tour and customized tour)
    const getGuestList = async () => {
        try {
            setIsTableLoading(true);
            // const response = await get(`guests-details?guestId=${id}&page=${page}&perPage=${perPageItem}&tab=${selectedTab == 'GROUP TOUR' ? 1 : 2}`);
            const response = await get(
                `enq-list-${selectedTab == "GROUP TOUR" ? "gt" : "ct"
                }-sales?userId=${id}&page=${page}&perPage=${perPageItem}`
            );
            setTotalPages(response?.data?.lastPage);
            // setOffSetData(response?.data?.data)
            setGuestList(response?.data?.data);
            setPerPageItem(response?.data?.perPage);
            setIsTableLoading(false);
        } catch (error) {
            setGuestList([]);
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

    const columns = [
        {
            title: "Sr.no",
            render: (item, index) => (
                <>{page * perPageItem - perPageItem + index + 1}</>
            ),
            key: "srno",
            width: 40,
        },
        {
            title: "Enquiry Id",
            dataIndex: "uniqueEnqueryId",
            key: "uniqueEnqueryId",
            width: 80,
        },
        selectedTab == "GROUP TOUR" ? {
            title: "Tour Name",
            dataIndex: "tourName",
            key: "tourName",
            width: 80,
        } : null,
        {
            title: "Group Name",
            dataIndex: "groupName",
            key: "groupName",
            width: 80,
        },
        {
            title: "Status",
            dataIndex: "enquiryProcess",
            key: "enquiryProcess",
            width: 80,
        },
        {
            title: "Tour Start Date",
            dataIndex: "startDate",
            key: "startDate",
            width: 80,
        },
        {
            title: "Tour End Date",
            dataIndex: "endDate",
            key: "endDate",
            width: 80,
        },
        selectedTab == "GROUP TOUR" ? {
            title: "Date of Enquiry",
            dataIndex: "enquiryDate",
            key: "enquiryDate",
            width: 80,
        } : {
            title: "Date of Enquiry",
            dataIndex: "enqDate",
            key: "enqDate",
            width: 80,
        },

        selectedTab == "GROUP TOUR" ? {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            width: 80,
        } : {
            title: "Guest Name",
            dataIndex: "contactName",
            key: "contactName",
            width: 80,
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            width: 80,
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            width: 80,
        },
        selectedTab == "GROUP TOUR" ? {
            title: "No of Pax",
            dataIndex: "paxNo",
            key: "paxNo",
            width: 80,
        } : {
            title: "No of Pax",
            dataIndex: "pax",
            key: "pax",
            width: 80,
        },
        selectedTab == "CUSTOM TOUR" ? {
            title: "Destination",
            dataIndex: "destinationName",
            key: "destinationName",
            width: 80,
        } : null,
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 80,
            render: (item) => (
                <div className="d-flex">
                    <button
                        onClick={() => {
                            setShowAssignTo(true)
                            setSelectedEnquiryId(item.enquiryGroupId || item.enquiryCustomId)
                        }}
                        type="button"
                        className="btn btn-submit btn-primary"
                    >
                        Assign To
                    </button>
                </div>
            )
        },
    ];

    const finalColumns = columns.filter(column => column)

    useEffect(() => {
        // While view farmer page is active, the yadi tab must also activated
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        let element = document.getElementById("under-team-lead-sales-list");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' class to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
            }
        };
    }, []);


    useEffect(() => {
        getGuestList();
    }, [page, perPageItem, selectedTab]);

    const handleDialogClose = () => {
        setShowAssignTo(false);
        getGuestList()
    };

    return (
        <>
            {showAssignTo && (
                <PopupModal open={true} onDialogClose={handleDialogClose}>
                    <AssignToPopUp
                        onClose={handleDialogClose}
                        selectedTab={selectedTab == "GROUP TOUR" ? "gt" : "ct"}
                        selectedEnquiryId={selectedEnquiryId}
                    />
                </PopupModal>
            )}
            <div className="card"  style={{ marginBottom: '40px' }}>
                <div className="row page-titles mx-0 fixed-top-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                        <li className="breadcrumb-item active">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/under-team-lead-sales-list">Sales Agents list</Link>
                        </li>
                        <li className="breadcrumb-item  ">
                            <Link to="javascript:void(0)">View Sales Enquiries</Link>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="basic-form">
                        <form className="needs-validation">
                            <div
                                className="card-header mb-2 pt-0"
                                style={{ paddingLeft: "0" }}
                            >
                                <div className="card-title h5">
                                    Destinations Visited
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-md-12">
                                    <div className="tabs">
                                        <Tab.Container
                                            defaultActiveKey={tabs[0]}
                                        >

                                            <div className="card-action coin-tabs">
                                                <Nav
                                                    as="ul"
                                                    className="nav nav-tabs"
                                                >
                                                    {tabs.map(
                                                        (tab, index) => (
                                                            <Nav.Item
                                                                as="li"
                                                                className="nav-item"
                                                                key={index}
                                                            >
                                                                <Nav.Link
                                                                    eventKey={
                                                                        tab
                                                                    }
                                                                    onClick={() =>
                                                                        setSelectedTab(
                                                                            tab
                                                                        )
                                                                    }
                                                                >
                                                                    {tab}
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    )}
                                                </Nav>
                                            </div>

                                            <div className="mt-3">
                                                <Tab.Content>
                                                    <Tab.Pane
                                                        className="tab-pane"
                                                        eventKey={
                                                            selectedTab
                                                        }
                                                    >
                                                        <Table
                                                            cols={finalColumns}
                                                            page={page}
                                                            data={guestList}
                                                            totalPages={
                                                                totalPages
                                                            }
                                                            isTableLoading={
                                                                isTableLoading
                                                            }
                                                            isPagination={
                                                                true
                                                            }
                                                            handlePageChange={
                                                                handlePageChange
                                                            }
                                                            handleRowsPerPageChange={
                                                                handleRowsPerPageChange
                                                            }
                                                        />
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </div>

                                        </Tab.Container>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2 row">
                                <div className="col-lg-12 d-flex justify-content-start mt-2">
                                    <Link
                                        to="/under-team-lead-sales-list"
                                        type="submit"
                                        className="btn btn-back"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default UnderTeamLeadSalesData;
