import React, { Fragment, useEffect, useState } from "react";
//import Multistep from "react-multistep";
import { Stepper, Step } from "react-form-stepper";

import Tourdetails from "./tourdetails";
import Guestdetails from "./guestdetails";
import Discountdetails from "./discountdetails";
import Paymentdetails from "./paymentdetails";
import { Link, useLocation, useParams } from "react-router-dom";
import BackButton from "../../common/BackButton";

const Booking = () => {
  const [goSteps, setGoSteps] = useState(0);
  const location = useLocation();
  const {id} = useParams();
  const [totalPrice, setTotalPrice] = useState(0)
  const [enqData, setEnqData] = useState("")
  const [sharedData, setSharedData] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);


  const updateDataFromComp2 = (data) => {
    setSharedData({ ...sharedData, ...data });
  };

  const updateDataFromComp3 = (data) => {
    setSharedData({ ...sharedData,...data });
  };
  const updateDataFromComp4 = (data) => {
    setSharedData({ ...sharedData,...data });
  };
  const updateDataFromComp5 = (data) => {
    setSharedData({ ...sharedData,...data });
  };
  const tourPrice = (data) => {
    setTotalPrice(data);
  };

    // this if for setting selected applied coupon
  const applyCoupon = (coupon) => {
    setAppliedCoupon({ ...coupon });
  };

  const enquiryGrpData = (data) => {
    setEnqData(data);
  };
  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/") 
    const path = pathArray[pathArray.length-1]
    let element = document.getElementById("group-tour")
    if (element) {
      element.classList.add("mm-active1") // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
      }
    }
  }, [])

  return (
    <Fragment>
      <div className="form-wizard ">
        <div className="row">
          <div className="col-xl-12 col-xxl-12"  style={{ paddingTop: '40px' }}>
            <div className="card">
              <div className="row page-titles mx-0 fixed-top-breadcrumb">
                   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                  <li className="breadcrumb-item active">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                  <Link to="/group-tour">Enquiry follow-up</Link>
                </li>
                  <li className="breadcrumb-item">
                    <Link to="/booking">Booking</Link>
                  </li>
                </ol>
              </div>
              
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 col-xxl-12">
            <div className="card">
              <div className="card-body">

              <Stepper
                  className="nav-wizard"
                  activeStep={goSteps}
                  label={true}
                >
                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(0)}
                    label="Tour Details"
                  />

                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(1)}
                    label="Guest Details"
                  />
                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(2)}
                    label="Discount Details"
                  />
                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(3)}
                    label="Payment Details"
                  />
                </Stepper>
                {goSteps === 0 && (
                  <>
                    <div className="form-details">
                      <h6>Tour Details</h6>
                    </div>
                    <Tourdetails sharedData={sharedData} moveToStep={() => setGoSteps(1) } updateData={updateDataFromComp2} enquiryId={id} enquiryGrpData= {enquiryGrpData}/>
                  </>
                )}
                {goSteps === 1 && (
                  <>
                    <div className="form-details">
                      <h6>Guest Details</h6>
                    </div>
                    <Guestdetails sharedData={sharedData} destinationId={enqData?.destinationId}  moveToStep2={() => setGoSteps(2)} moveToStep1={() => setGoSteps(0)} roomSharedId = {id} dataLength = {sharedData ? sharedData?.pax : 0} updateData3={updateDataFromComp3}  tourPrice={tourPrice} guestData={enqData}/>
                  </>
                )}
                {goSteps === 2 && (
                  <>
                    <div className="form-details">
                      <h6>Discount Details</h6>
                    </div>
                    <Discountdetails guestData={enqData} destinationId={enqData?.destinationId} sharedData={sharedData} tourPrice={totalPrice} moveToStep3={() => setGoSteps(3)} moveToStep2={() => setGoSteps(1)} updateData4={updateDataFromComp4} appliedCoupon={appliedCoupon} applyCoupon={applyCoupon} />
                  </>
                )}
                {goSteps === 3 && (
                  <>
                    <div className="form-details">
                      <h6>Payment Details</h6>
                    </div>
                    <Paymentdetails roomSharedId = {id} updateData5={updateDataFromComp5} grandTotal={sharedData}  moveToStep4={() => setGoSteps(2)} totalData={sharedData}/>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Booking;
