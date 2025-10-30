import React, { useContext, useEffect, useState } from "react";

//Import Components
import { ThemeContext } from "../../../../context/ThemeContext";

import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";

const Home = () => {
  const { permissions } = useSelector((state) => state.auth);
  const { changeBackground } = useContext(ThemeContext);


  const [groupToursCount, setGroupToursCount] = useState(null);
  const [numberOfGuest, setNumberOfGuest] = useState(null);


  const getGroupToursCount = async () => {
    try {
      const response = await get(`/billing/group-tour-count`);
      setGroupToursCount(response.data?.groupTourCount);
    } catch (error) {
      console.log(error);
    }
  };

  const getNumberOfGuest = async () => {
    try {
      const response = await get(`/billing/no-of-guests`);
      setNumberOfGuest(response.data?.guestCount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
  }, []);

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
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

  useEffect(() => {
    hasComponentPermission(permissions, 4) && getGroupToursCount();

    hasComponentPermission(permissions, 7) && getNumberOfGuest();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-12">
              <div className="row">
                {hasComponentPermission(permissions, 4) && (
                  <div className="col-xl-3 col-sm-6">
                    <div className="card booking">
                      <div className="card-body">
                        <div className="booking-status d-flex align-items-center">
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="28"
                              height="20"
                              viewBox="0 0 28 20"
                            >
                              <path
                                d="M27,14V7a1,1,0,0,0-1-1H6A1,1,0,0,0,5,7v7a3,3,0,0,0-3,3v8a1,1,0,0,0,2,0V24H28v1a1,1,0,0,0,2,0V17A3,3,0,0,0,27,14ZM7,8H25v6H24V12a2,2,0,0,0-2-2H19a2,2,0,0,0-2,2v2H15V12a2,2,0,0,0-2-2H10a2,2,0,0,0-2,2v2H7Zm12,6V12h3v2Zm-9,0V12h3v2ZM4,17a1,1,0,0,1,1-1H27a1,1,0,0,1,1,1v5H4Z"
                                transform="translate(-2 -6)"
                                fill="var(--primary)"
                              />
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">
                              {groupToursCount || 0}
                            </h2>
                            <p className="mb-0 text-nowrap">Group Tour Count</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hasComponentPermission(permissions, 7) && (
                  <div className="col-xl-3 col-sm-6">
                    <div className="card booking">
                      <div className="card-body">
                        <div className="booking-status d-flex align-items-center">
                          <span>
                            <svg
                              id="_009-log-out"
                              data-name="009-log-out"
                              xmlns="http://www.w3.org/2000/svg"
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                            >
                              <path
                                data-name="Path 1957"
                                d="M151.435,178.842v2.8a5.6,5.6,0,0,1-5.6,5.6h-14a5.6,5.6,0,0,1-5.6-5.6v-16.8a5.6,5.6,0,0,1,5.6-5.6h14a5.6,5.6,0,0,1,5.6,5.6v2.8a1.4,1.4,0,0,1-2.8,0v-2.8a2.8,2.8,0,0,0-2.8-2.8h-14a2.8,2.8,0,0,0-2.8,2.8v16.8a2.8,2.8,0,0,0,2.8,2.8h14a2.8,2.8,0,0,0,2.8-2.8v-2.8a1.4,1.4,0,0,1,2.8,0Zm-10.62-7,1.81-1.809a1.4,1.4,0,1,0-1.98-1.981l-4.2,4.2a1.4,1.4,0,0,0,0,1.981l4.2,4.2a1.4,1.4,0,1,0,1.98-1.981l-1.81-1.81h12.02a1.4,1.4,0,1,0,0-2.8Z"
                                transform="translate(-126.235 -159.242)"
                                fill="var(--primary)"
                                fill-rule="evenodd"
                              />
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h2 className="mb-0 font-w600">
                              {numberOfGuest || 0}
                            </h2>
                            <p className="mb-0">Number of Guest</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
