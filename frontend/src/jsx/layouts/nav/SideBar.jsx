import React, { useEffect, useContext, useReducer, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MenuList } from "./Menu";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  hasMenuPermission,
  hasSubMenuPermission,
} from "../../auth/PrivateRoute";
import { get } from "../../../services/apiServices";
import AIAssistant from "../AIAssistant";

const badgeStyle = {
  backgroundColor: "#ff4d4f", // Softer red
  borderRadius: "100%", // Rounded edges
  padding: "2px", // Add horizontal padding for better proportions
  color: "white", // Text color for contrast
  fontSize: "0.75rem", // Adjust font size
  fontWeight: "bold", // Make the text bold
  display: "inline-block", // Ensure it stays inline
  minWidth: "20px",
  minHeight: "20px", // Ensure consistent width
  textAlign: "center",
  margin: "4px 4px -4px 4px", // Center the text
};
const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = JSON.parse(localStorage.getItem("menuState")) || {
  active: "Dashboard",
  activeSubmenu: "",
};

const updateState = (newState) => {
  localStorage.setItem("menuState", JSON.stringify(newState));
};

const SideBar = () => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
    ChangeIconSidebar,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, updateState);
  const [counts, setCounts] = useState({
    loyaltyCount: 0,
    allLoyaltyCount: 0,
    expiredListGroupTour: 0,
    allEnquiryExpiredListGT: 0,
    expiredEnquiryFollowCT: 0,
    allEnqExpiredCT: 0,
  });
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const { permissions } = useSelector((state) => state.auth);

  //For scroll

  let handleheartBlast = document.querySelector(".heart");
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }

  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const statusLocal = localStorage.getItem("status");

  const handleMenuActive = (status) => {
    localStorage.setItem("status", status);
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };
  // Menu dropdown list End
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  useEffect(() => {
    setState({ active: statusLocal });
    MenuList.map((data, index) => {
      if (data.content && data.content.length > 0) {
        data.content.map((data1, index) => {
          if (data1.to === path) {
            setState({ active: data.title });
            setState({ activeSubmenu: data1.title });
          }
        });
      }
    });
  }, [path]);

  const getNewNofifyCounts = async () => {
    try {
      // TODO: Enable when backend endpoint is ready
      // const response = await get(`/get-new-reqests-count`);
      // if (response?.data) {
      //   setCounts({
      //     loyaltyCount: response.data["loyalty-guests"] || 0,
      //     allLoyaltyCount: response.data["all-loyalty-guests"] || 0,
      //     expiredListGroupTour: response.data["expired-list-group-tour"] || 0,
      //     allEnquiryExpiredListGT:
      //       response.data["all-enquiry-expired-list-gt"] || 0,
      //     expiredEnquiryFollowCT:
      //       response.data["expired-enquiry-follow-CT"] || 0,
      //     allEnqExpiredCT: response.data["all-enq-expired-ct"] || 0,
      //   });
      // }
    } catch (error) {
      // Silently ignore - endpoint not available
    }
  };

  useEffect(() => {
    // Function to fetch the counts

    // Initial call to fetch da
    getNewNofifyCounts();

    // Set up an interval to fetch data every minute (60000 ms)
    const intervalId = setInterval(() => {
      getNewNofifyCounts();
    }, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`dlabnav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((data, index) => {
            // debugger;
            return (
              <li
                className={` ${
                  state.active === data.title ? "mm-active " : ""
                }`}
                key={index}
              >
                {data.content &&
                data.content.length > 0 &&
                hasMenuPermission(permissions, data.content) ? (
                  <>
                    <Link
                      to={"#"}
                      className="has-arrow"
                      onClick={() => {
                        handleMenuActive(data.title);
                      }}
                    >
                      {data.iconStyle}
                      {data.title === "Loyalty Program" &&
                        counts.loyaltyCount > 0 && (
                          <span style={badgeStyle}></span>
                        )}

                      {/* Parent badge for "Enquiry Follow-up" */}
                      {data.title === "Enquiry Follow-up" &&
                        (counts.expiredListGroupTour > 0 ||
                          counts.expiredEnquiryFollowCT > 0 ||
                          counts.allEnquiryExpiredListGT > 0 ||
                          counts.allEnqExpiredCT > 0) && (
                          <span style={badgeStyle}></span>
                        )}
                      <span className="nav-text">{data.title}</span>
                    </Link>
                    <Collapse in={state.active === data.title ? true : false}>
                      <ul
                        className={`${
                          data.classsChange === "mm-collapse w-fit"
                            ? "mm-show "
                            : ""
                        }`}
                      >
                        {data.content &&
                          data.content.map((data, index) => {
                            return hasSubMenuPermission(
                              permissions,
                              data.catId
                            ) ? (
                              <li
                                key={index}
                                className={`${
                                  state.activeSubmenu === data.title
                                    ? "mm-active active-li"
                                    : ""
                                }`}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {data.content && data.content.length > 0 ? (
                                  <>
                                    <Link
                                      to={data.to}
                                      className="has-arrow"
                                      onClick={() => {
                                        handleSubmenuActive(data.title);
                                      }}
                                    >
                                      {data.title === "Loyalty List" &&
                                        counts.loyaltyCount > 0 && (
                                          <span style={badgeStyle}></span>
                                        )}

                                      {data.title === "All Loyalty List" &&
                                        counts.allLoyaltyCount > 0 && (
                                          <span style={badgeStyle}></span>
                                        )}

                                      {data.title === "Group Tours Enquiries" &&
                                        counts.expiredListGroupTour > 0 && (
                                          <span style={badgeStyle}></span>
                                        )}
                                      {data.title ===
                                        "Customized Tours Enquiries" &&
                                        counts.expiredEnquiryFollowCT > 0 && (
                                          <span style={badgeStyle}>
                                            {" "}
                                            {counts.expiredEnquiryFollowCT}
                                          </span>
                                        )}
                                      {data.title ===
                                        "All Group Tours Enquiries" &&
                                        counts.allEnquiryExpiredListGT > 0 && (
                                          <span style={badgeStyle}>
                                            {counts.allEnquiryExpiredListGT}
                                          </span>
                                        )}
                                      {data.title ===
                                        "All Customized Tours Enquiries" &&
                                        counts.allEnqExpiredCT > 0 && (
                                          <span style={badgeStyle}>
                                            {counts.allEnqExpiredCT}
                                          </span>
                                        )}
                                      {data.title}
                                    </Link>
                                  </>
                                ) : (
                                  <Link
                                    to={data.to}
                                    className={`${
                                      path === data.to
                                        ? "mm-active"
                                        : "menu-active"
                                    }`}
                                    id={data.to}
                                  >
                                    {data.title === "Loyalty List" &&
                                      counts.loyaltyCount > 0 && (
                                        <span style={badgeStyle}>
                                          {counts.loyaltyCount}
                                        </span>
                                      )}

                                    {data.title === "All Loyalty List" &&
                                      counts.allLoyaltyCount > 0 && (
                                        <span style={badgeStyle}>
                                          {counts.allLoyaltyCount}
                                        </span>
                                      )}

                                    {/* Individual badges for sub-menu items */}
                                    {data.title === "Group Tours Enquiries" &&
                                      counts.expiredListGroupTour > 0 && (
                                        <span style={badgeStyle}>
                                          {counts.expiredListGroupTour}
                                        </span>
                                      )}
                                    {data.title ===
                                      "Customized Tours Enquiries" &&
                                      counts.expiredEnquiryFollowCT > 0 && (
                                        <span style={badgeStyle}>
                                          {" "}
                                          {counts.expiredEnquiryFollowCT}
                                        </span>
                                      )}
                                    {data.title ===
                                      "All Group Tours Enquiries" &&
                                      counts.allEnquiryExpiredListGT > 0 && (
                                        <span style={badgeStyle}>
                                          {counts.allEnquiryExpiredListGT}
                                        </span>
                                      )}
                                    {data.title ===
                                      "All Customized Tours Enquiries" &&
                                      counts.allEnqExpiredCT > 0 && (
                                        <span style={badgeStyle}>
                                          {counts.allEnqExpiredCT}
                                        </span>
                                      )}
                                    {data.title}
                                  </Link>
                                )}
                              </li>
                            ) : (
                              ""
                            );
                          })}
                      </ul>
                    </Collapse>
                  </>
                ) : hasSubMenuPermission(permissions, data.catId) ? (
                  <Link
                    to={data.to}
                    onClick={() => {
                      handleMenuActive(data.title);
                    }}
                    id={data.title}
                  >
                    {data.iconStyle}
                    <span className="nav-text">{data.title}</span>
                    <span className="nav-text-mobile">{data.title}</span>
                  </Link>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      </PerfectScrollbar>

      {/* Waari AI Button */}
      <div className="ai-assistant-btn-wrapper">
        <button
          className="ai-assistant-toggle-btn"
          onClick={() => setIsAIAssistantOpen(true)}
          title="Open Waari AI"
          aria-label="Waari AI"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 8V4m0 16v-4m8-8h-4m-8 0H4m11.313 11.313l2.828-2.828m-5.656 0l-2.828 2.828m0-5.656l2.828-2.828m-5.656 0l2.828 2.828" />
          </svg>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default SideBar;
