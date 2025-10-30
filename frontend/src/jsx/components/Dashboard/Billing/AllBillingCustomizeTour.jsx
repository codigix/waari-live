
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../common/BackButton";

const AllBillingCustomizeTour = () => {

  const { id, idPayment } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [customizedTourDetail, setCustomizedTourDetail] = useState(null);
  const {permissions} = useSelector(state => state.auth)

  const getCustomTourDetails = async () => {
    try {
      const response = await get(
        `/view-bill-ct?enquiryDetailCustomId=${idPayment}`
      );
      setCustomizedTourDetail(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomTourDetails();
  }, []);

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("confirm-customized-tour")
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
    <>
        <div className="card">

          <div className="row page-titles mx-0 mb-2 fixed-top-breadcrumb">
               <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
              <li className="breadcrumb-item active">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/confirm-customized-tour">Confirmed</Link>
              </li>
              <li className="breadcrumb-item  ">
                <Link to="/payment-customized-tour">Received Payment</Link>
              </li>
            </ol>

          </div>
        </div>
        <div className="card">
          <div className="card-header card-header-second">
            <div className="card-title h5">Previous Payments</div>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Billing Name</label>
                </div>
                <div className="col-md-5">
                 
                  <div className="view-details">
                    <h6>{customizedTourDetail?.billingName}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Address</label>
                </div>
                <div className="col-md-5">
                 <div className="view-details">
                    <h6>{customizedTourDetail?.address}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Phone No.</label>
                </div>
                <div className="col-md-5">
                <div className="view-details">
                    <h6>{customizedTourDetail?.phoneNumber}</h6>
                  </div>
                </div>
              </div>

              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">GSTIN</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.gstIn}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">PAN Number</label>
                </div>
                <div className="col-md-5">
                 <div className="view-details">
                    <h6>{customizedTourDetail?.panNumber}</h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Grand Total</label>
                </div>
                <div className="col-md-5">
                  <div className="view-details">
                    <h6>{customizedTourDetail?.grandTotal}</h6>
                  </div>
                </div>
              </div>

              {customizedTourDetail?.advancePayments &&
                customizedTourDetail?.advancePayments.map((item, index) => {
                  return (
                    <>
                      <div className="mb-2 row">
                        <div className="col-md-3">
                          <label className="form-label">
                            Advance {index + 1}
                          </label>
                        </div>
                        <div className="col-md-5">
                       
                          <div className="view-details">
                            <h6>{item?.advancePayment}</h6>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="">
                            <div key={index}>{item.status == 0 ? <>
                              <badge className="badge badge-warning" >
                                Pending
                              </badge>
                            </> :
                              <>
                                <div className="d-flex  mt-2 mt-lg-0 mt-md-0">

                                  <badge className="badge badge-success" >
                                    Confirm
                                  </badge>

                                 { hasComponentPermission(permissions, 98) &&   <Link to={`/receipt-ct/${item.customPayDetailId}`} className="btn btn-secondary add-btn pdf-btn btn-sm" style={{ height: "32px", margin: "0px 10px 0px 0px", lineHeight: "1.2", padding: "0px" }}>
                                    View Receipt
                                  </Link>}
                                </div>
                              </>
                            }</div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              <div className="mb-2 row">
                <div className="col-md-3">
                  <label className="form-label">Balance</label>
                </div>
                <div className="col-md-5">
                 
                  <div className="view-details">
                    <h6>{customizedTourDetail?.balance}</h6>
                  </div>
                </div>
                {
                customizedTourDetail?.balance <= 0 &&
                hasComponentPermission(permissions, 99) &&   <div className="col-md-4">
                  <Link to={`/invoice-ct/${id}/${idPayment}`} className="btn btn-secondary add-btn btn-sm" style={{ height: "32px", margin: "0px 10px 0px 0px", lineHeight: "1" }}>
                    Invoice
                  </Link>
                </div>
              }
              </div>
            </div>
          </div>
        </div>
    </>
  );
};
export default AllBillingCustomizeTour;
