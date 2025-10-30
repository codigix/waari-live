import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../common/BackButton";


const Allbilling = () => {
  const { id } = useParams();
  // to get the group tour bill details start
  const [groupTourBillDetails, setGroupTourBillDetails] = useState([]);
  const {permissions} = useSelector(state => state.auth)
  
  const getGroupTourBillDetails = async () => {
    try {
      const response = await get(
        `/view-all-bills-gt?enquiryGroupId=${id}`
      );
      setGroupTourBillDetails(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupTourBillDetails();
  }, []);


  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("booking-record-grouptour")
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
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
             <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/booking-record">Booking Record</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="/all-billing">All Billing</Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="card">
        <div className="card-header card-header-second">
          <div className="card-title h5">Payments</div>
        </div>
        <div className="card-body">
          <div className="basic-form">
            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">Billing Name</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.billingName}</h6>
                </div>

              </div>
            </div>
            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">Address</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.address}</h6>
                </div>
              </div>
            </div>
            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">Phone No.</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.phoneNumber}</h6>
                </div>
              </div>
            </div>

            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">GSTIN</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.gstIn}</h6>
                </div>
              </div>
            </div>
            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">PAN Number</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.panNumber}</h6>
                </div>
              </div>
            </div>
            <div className="mb-2 row">
              <div className="col-md-3">
                <label className="form-label">Grand Total</label>
              </div>
              <div className="col-md-5">
                <div className="view-details">
                  <h6>{groupTourBillDetails?.grandTotal}</h6>
                </div>
              </div>
            </div>

            {groupTourBillDetails?.advancePayments &&
              groupTourBillDetails?.advancePayments.map((item, index) => {
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
                            <badge className="badge light badge-warning" >
                              Pending
                            </badge>
                          </> :
                            <>
                              <div className="d-flex  mt-2 mt-lg-0 mt-md-0">

                                <badge className="badge light badge-success" >
                                  Confirm
                                </badge>

                               {hasComponentPermission(permissions, 95) && <Link to={`/receipt/${id}/${item.groupPaymentDetailId}`} className="btn btn-secondary add-btn btn-sm" style={{ height: "32px", margin: "0px 10px 0px 0px", lineHeight: "1" }}>
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
                  <h6>{groupTourBillDetails?.balance}</h6>
                </div>
              </div>
              {
                groupTourBillDetails?.balance <= 0 &&
                <div className="col-md-4">
                { hasComponentPermission(permissions, 96) && <Link to={`/invoice/${id}`} className="btn btn-secondary add-btn btn-sm" style={{ height: "32px", margin: "0px 10px 0px 0px", lineHeight: "1" }}>
                    Invoice
                  </Link>}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Allbilling;
