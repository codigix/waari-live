import React, { Fragment, useEffect, useState } from "react";
import Groupdetails from "./groupdetails";
import { Link, useLocation, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";

const Customizedbooking = () => {
  const {id} = useParams()
  const [data, setData] = useState([]);

  const getCustomizeddetails = async () => {
    try {
      const response = await get(
        `/enquiry-ct?enquiryCustomId=${id}`
      );
      setData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCustomizeddetails();
  }, []);

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/") 
    const path = pathArray[pathArray.length-1]
    let element = document.getElementById("customized-tour")
    console.log(element)
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
          <div className="col-xl-12 col-xxl-12" style={{ paddingTop: '40px' }}>
            <div className="card">
              {/* <div className="card-header">
							<h4 className="card-title">Form step</h4>
						</div> */}
              <div className="row page-titles mx-0 fixed-top-breadcrumb">
                   <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                  <li className="breadcrumb-item active">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={`/customizedbooking/booking/`}>Booking</Link>
                  </li>
                </ol>
              </div>
              {/* <div className="card-body">
                <Stepper
                  className="nav-wizard"
                  activeStep={goSteps}
                  label={false}
                >
                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(0)}
                    label="Group Details"
                  /> */}

              {/* <Step
                    className="nav-link"
                    onClick={() => setGoSteps(1)}
                    label="Guest Details"
                  /> */}
              {/* <Step
                    className="nav-link"
                    onClick={() => setGoSteps(1)}
                    label="Discount Details"
                  />
                  <Step
                    className="nav-link"
                    onClick={() => setGoSteps(2)}
                    label="Payment Details"
                  /> */}
              {/* <Step className="nav-link" onClick={() => setGoSteps(4)}  label="Extra Details"/> */}
              {/* </Stepper>
              </div> */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 col-xxl-12">
            <div className="card">
              <div className="card-body">
                {/* {goSteps === 0 && (
                  <> */}
                <div className="form-details">
                  <h6>Group Details</h6>
                </div>
                <Groupdetails
                  dataToFill={data}
                  enqCustomId={id}
                />
                <div className="text-end toolbar d-flex justify-content-between toolbar-bottom p-2">
                  <Link
                    to="/customized-tour"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
                  {/* <button className="btn btn-primary btn-submit sw-btn-next">
                    Submit
                  </button> */}
                </div>
                {/* </>
                )} */}

                {/* {goSteps === 1 && (
                  <> */}
                {/* <div className="form-details">
                      <h6>Discount Details</h6>
                    </div>
                    <Discountdetails />
                    <div className="text-end toolbar d-flex justify-content-between toolbar-bottom p-2">
                      <button
                        className="btn btn-danger sw-btn-prev me-1"
                        onClick={() => setGoSteps(0)}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-primary btn-submit sw-btn-next ms-1"
                        onClick={() => setGoSteps(2)}
                      >
                        Next
                      </button>
                    </div> */}
                {/* </>
                )} */}
                {/* {goSteps === 2 && (
                  <> */}
                {/* <div className="form-details">
                      <h6>Payment Details</h6>
                    </div> */}
                {/* <Paymentdetails />
                    <div className="text-end toolbar d-flex justify-content-between toolbar-bottom p-2">
                      <button
                        className="btn btn-danger sw-btn-prev me-1"
                        onClick={() => setGoSteps(1)}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-primary btn-submit sw-btn-next ms-1"
                        onClick={() => setGoSteps(2)}
                      >
                        Submit
                      </button>
                    </div> */}
                {/* </>
                )} */}
                {/* {goSteps === 4 && (
								<>
									<StepFour />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-secondary sw-btn-prev me-1" onClick={() => setGoSteps(2)}>Prev</button>
										<button className="btn btn-primary sw-btn-next ms-1"  onClick={() => setGoSteps(4)}>Submit</button>
									</div>	
								</>	
							  )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Customizedbooking;
