import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { hasComponentPermission } from "../../../auth/PrivateRoute";
import ViewTourDetails from "./ViewTourDetails";
import TourBookings from "./TourBookings";
import TourGuestDetails from "./TourGuestDetails";
import AllMiscFilesList from "./MiscFiles/AllMiscFilesList";
import AllSupplierPaymentsList from "./SupplierPayments/AllSupplierPaymentsList";
import BackButton from "../../common/BackButton";

const GitOperationTabs = () => {
    const { id } = useParams();
    const { permissions } = useSelector((state) => state.auth);
    const { groupName } = useSelector((state) => state.groupTour);
    const tabs = [
        {
            path: "tourDetails",
            label: "Tour Details",
            requiredId: 369,
            tabClickAllowed: true,
        },
        {
            path: "bookingDetails",
            label: "Tour Bookings",
            requiredId: 319,
            tabClickAllowed: true,
        },
        {
            path: "guestDetails",
            label: "Guest Bookings",
            requiredId: 320,
            tabClickAllowed: true,
        },
        {
            path: "miscellaneousFiles",
            label: "Miscellaneous Files",
            requiredId: 368,
            tabClickAllowed: true,
        },
        {
            path: "supplierPayments",
            label: "Supplier Payments",
            requiredId: 367,
            tabClickAllowed: true,
        },
    ];
    const [URLSearchParams, setURLSearchParams] = useSearchParams();

    // const [activeTab, setActiveTab] = useState(tabs[0].path);
    const [activeTab, setActiveTab] = useState(tabs[0].path);

    // Parse active tab from query string (if present)
    useEffect(() => {
        const tabFromURL = URLSearchParams.get("activeTab");

        if (tabFromURL && tabs.some((tab) => tab.path === tabFromURL)) {
            setActiveTab(tabFromURL);
        } else {
            setURLSearchParams({ activeTab: tabs[0].path });
        }
    }, [URLSearchParams, setURLSearchParams, tabs]);

    useEffect(() => {
        // While view farmer page is active, the yadi tab must also activated
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        let element = document.getElementById("git-operation-tours-list");
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
            {/* <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="group-name col-md-10">
                            <BackButton redirectTo={"/git-operation-tours-list"}/>
                         <h2>{groupName}</h2>
                        </div>
                    </div>
                </div>
            </div> */}
            <Tab.Container defaultActiveKey="All">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 d-flex gap-4 pe-4 align-items-center">
                                <div className="">
                                    <div className="">
                                        <div className="group-name">
                                            <BackButton redirectTo={"/git-operation-tours-list"} />
                                            <h2>{groupName}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center flex-wrap">

                                    <div className="card-action enquiry-tabs">
                                        <Nav as="ul" className="nav nav-tabs">
                                            {tabs.map((item) => (
                                                <>
                                                    {hasComponentPermission(
                                                        permissions,
                                                        item.requiredId
                                                    ) && (
                                                            <Nav.Item
                                                                as="li"
                                                                className={`nav-item cursor-pointer`}
                                                                onClick={() => {
                                                                    if (item.tabClickAllowed)
                                                                        setURLSearchParams({
                                                                            activeTab: item.path,
                                                                        });
                                                                    // setActiveTab(item.path);
                                                                }}
                                                            >
                                                                <div
                                                                    style={
                                                                        !item.tabClickAllowed
                                                                            ? {
                                                                                backgroundColor:
                                                                                    "#f3f3f3",
                                                                            }
                                                                            : null
                                                                    }
                                                                    className={`nav-link  ${activeTab === item.path
                                                                        ? "active"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    {item.label}
                                                                </div>
                                                            </Nav.Item>
                                                        )}
                                                </>
                                            ))}
                                        </Nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {activeTab == "tourDetails" && (
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <ViewTourDetails tourId={id} />
                            </div>
                        </div>
                    )}

                    {activeTab == "bookingDetails" && (
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <TourBookings tourId={id} />
                            </div>
                        </div>
                    )}
                    {activeTab == "guestDetails" && (
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <TourGuestDetails tourId={id} />
                            </div>
                        </div>
                    )}
                    {activeTab == "miscellaneousFiles" && (
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <AllMiscFilesList tourId={id} />
                            </div>
                        </div>
                    )}
                    {activeTab == "supplierPayments" && (
                        <div className="row">
                            <div className="col-xl-12 col-xxl-12">
                                <AllSupplierPaymentsList tourId={id} />
                            </div>
                        </div>
                    )}
                </div>
            </Tab.Container>
        </>
    );
};
export default GitOperationTabs;
