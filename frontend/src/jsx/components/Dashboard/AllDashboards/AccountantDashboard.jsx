import React, { useContext, useEffect } from "react";
//Import Components
import { ThemeContext } from "../../../../context/ThemeContext";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";

const Home = () => {
  const { permissions } = useSelector((state) => state.auth);

  const { changeBackground } = useContext(ThemeContext);

  const [totalBillings, setTotalBillings] = React.useState(null);
  const [totalBillingsApproved, setTotalBillingsApproved] =
    React.useState(null);
  const [totalBillingsPending, setTotalBillingsPending] = React.useState(null);

  const getTotalBilling = async () => {
    try {
      const response = await get("/billing/total-billing");
      setTotalBillings(response.data?.totalBilling);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalBillingApproved = async () => {
    try {
      const response = await get("/billing/total-bill-approved");
      setTotalBillingsApproved(response.data?.totalBillApproved);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalBillingPending = async () => {
    try {
      const response = await get("/billing/total-bill-pending");
      setTotalBillingsPending(response.data?.totalBillPending);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
  }, []);

  useEffect(() => {
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
    hasComponentPermission(permissions, 8) && getTotalBilling();

    hasComponentPermission(permissions, 9) && getTotalBillingApproved();

    hasComponentPermission(permissions, 10) && getTotalBillingPending();
  }, []);

  return (
    <>
      <div className="row">
        {hasComponentPermission(permissions, 8) && (
          <div className="col-xl-3 col-sm-6">
            <div className="card booking">
              <div className="card-body">
                <div className="booking-status d-flex align-items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="20"
                      viewBox="0 0 384 512"
                    >
                      <path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z" />
                    </svg>
                  </span>
                  <div className="ms-4">
                    <h2 className="mb-0 font-w600">{totalBillings || 0}</h2>
                    <p className="mb-0 text-nowrap">Total Billing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {hasComponentPermission(permissions, 9) && (
          <div className="col-xl-3 col-sm-6">
            <div className="card booking">
              <div className="card-body">
                <div className="booking-status d-flex align-items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="20"
                      viewBox="0 0 512 512"
                    >
                      <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
                    </svg>
                  </span>
                  <div className="ms-4">
                    <h2 className="mb-0 font-w600">
                      {totalBillingsApproved || 0}
                    </h2>
                    <p className="mb-0 text-nowrap ">Total Bill Approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasComponentPermission(permissions, 10) && (
          <div className="col-xl-3 col-sm-6">
            <div className="card booking">
              <div className="card-body">
                <div className="booking-status d-flex align-items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="20"
                      viewBox="0 0 512 512"
                    >
                      <path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16H286.5c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8H384c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H32z" />
                    </svg>
                  </span>
                  <div className="ms-4">
                    <h2 className="mb-0 font-w600">
                      {totalBillingsPending || 0}
                    </h2>
                    <p className="mb-0 text-nowrap ">Total Bill Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Home;
