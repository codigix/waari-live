import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../../../services/apiServices";
import { Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import BackButton from "../../../common/BackButton";

const Detailgrouptour = () => {
  const navigate = useNavigate();
  const { id, idPayment, familyHeadGtId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  //to start details
  const [data, setData] = useState([]);
  const [advance, setAdvance] = useState([]);
  const { permissions } = useSelector((state) => state.auth);

  const getbillingdetails = async () => {
    try {
      const response = await get(
        `/view-bill-group-tour?enquiryGroupId=${id}&familyHeadGtId=${familyHeadGtId}`
      );
      setData(response.data.data);
      setAdvance(response?.data?.data?.advancePayments);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    hasComponentPermission(permissions, 45) && getbillingdetails();
  }, []);

  //to end details
  //to start payment details
  const [data_next, setData_next] = useState([]);

  const getpaymentdetails = async () => {
    try {
      const response = await get(
        `/viewNew-pay-details?groupPaymentDetailId=${idPayment}`
      );
      setData_next(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    hasComponentPermission(permissions, 46) && getpaymentdetails();
  }, []);
  //to end payment details

  // generate receipt start

  const generateReceipt = async () => {
    try {
      setIsLoading(true);
      const response = await post(
        `/update-pay-status?groupPaymentDetailId=${idPayment}&enquiryGroupId=${id}&familyHeadGtId=${familyHeadGtId}`
      );
      toast.success(response?.data?.message);
      setIsLoading(false);
      hasComponentPermission(permissions, 45) && getbillingdetails();
      hasComponentPermission(permissions, 46) && getpaymentdetails();
    } catch (error) {
      setIsLoading(false);
    }
  };

  // generate receipt end

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    let element = document.getElementById("billing-group-tour");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
      }
    };
  }, []);

  // const [showFullScreen, setShowFullScreen] = useState(false);

  // const handleImageClick = () => {
  //   setShowFullScreen(true);
  // };

  // const handleCloseFullScreen = () => {
  //   setShowFullScreen(false);
  // };

  // const [zoomed, setZoomed] = useState(false);

  // const toggleZoom = () => {
  //   setZoomed(!zoomed);
  // };

  return (
    <>
      <div className="card" style={{ marginBottom: "40px" }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <BackButton />
            </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashoard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/billing-group-tour">Billing</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="javascript:void(0)">Group Tour</Link>
            </li>
          </ol>
        </div>
      </div>
      {hasComponentPermission(permissions, 45) && (
        <div className="card">
          <div className="card-header">
            <div className="card-title h5">Previous Payments</div>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <form>
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">Billing Name</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.billingName}</h6>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-flex">
                      <Link
                        to=""
                        className="btn btn-warning pdf-btn btn-sm d-none"
                        style={{
                          // height: "32px",
                          margin: "0 10px 0 0",
                          lineHeight: "1",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">Address</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.address}</h6>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-flex">
                      <Link
                        to=""
                        className="btn btn-warning pdf-btn btn-sm  d-none"
                        style={{
                          // height: "32px",
                          margin: "0 10px 0 0",
                          lineHeight: "1",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">Phone No.</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.phoneNumber}</h6>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-flex">
                      <Link
                        to=""
                        className="btn btn-warning pdf-btn btn-sm  d-none"
                        style={{
                          // height: "32px",
                          margin: "0 10px 0 0",
                          lineHeight: "1",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">GSTIN</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.gstIn}</h6>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-flex">
                      <Link
                        to=""
                        className="btn btn-warning pdf-btn btn-sm  d-none"
                        style={{
                          // height: "32px",
                          margin: "0 10px 0 0",
                          lineHeight: "1",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">PAN Number</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.panNumber}</h6>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="d-flex">
                      <Link
                        to=""
                        className="btn btn-warning pdf-btn btn-sm  d-none"
                        style={{
                          height: "32px",
                          margin: "0 10px 0 0",
                          lineHeight: "1",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">Grand Total</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.grandTotal}</h6>
                    </div>
                  </div>
                </div>
                {advance.map((item, index) => (
                  <div className="mb-2 row">
                    <div className="col-md-3">
                      <label className="form-label">Advance {index + 1}</label>
                    </div>
                    <div className="col-md-4">
                      <div className="view-details">
                        <h6 key={index}>{`${item.advancePayment}`}</h6>
                      </div>
                    </div>

                    <div className="col-md-5 mt-2 mt-lg-0 mt-md-0">
                      {item.status == 0 ? (
                        <>
                          <badge
                            className="badge light badge-warning"
                            style={{ height: "32px" }}
                          >
                            Pending
                          </badge>
                        </>
                      ) : (
                        <>
                          <div className="d-flex">
                            <span
                              onClick={() => {
                                navigate(
                                  `/receipt/${familyHeadGtId}/${item?.groupPaymentDetailId}`
                                );
                              }}
                            >
                              <Link
                                className="btn btn-secondary add-btn pdf-btn btn-sm"
                                style={{
                                  height: "32px",
                                  margin: "0 10px 0 0",
                                  lineHeight: "1",
                                }}
                              >
                                View Receipt
                              </Link>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mb-2 row">
                  <div className="col-md-3">
                    <label className="form-label">Balance</label>
                  </div>
                  <div className="col-md-4">
                    <div className="view-details">
                      <h6>{data.balance}</h6>
                    </div>
                  </div>
                  <div className="col-md-4">
                    {data?.isPaymentDone && (
                      <div className="col-md-4">
                        <Link
                          to={`/invoice/${familyHeadGtId}`}
                          className="btn btn-secondary add-btn btn-sm"
                          style={{
                            height: "32px",
                            margin: "0px 10px 0px 0px",
                            lineHeight: "1",
                          }}
                        >
                          Invoice
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* {data_next.map((item, index) => ( */}
      {Boolean(!data_next.status) && (
        <div className="card">
          <div className="card-header">
            <div className="card-title h5">New Payment Received</div>
          </div>
          <div className="card-body">
            <div className="basic-form">
              {/* <form> */}
              {hasComponentPermission(permissions, 46) && (
                <>
                  <div className="mb-2 row">
                    <div className="col-md-3">
                      <label className="form-label">New Payment Amount</label>
                    </div>
                    <div className="col-md-4">
                      <div className="view-details">
                        <h6>{data_next?.advancePayment}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <div className="col-md-3">
                      <label className="form-label">Payment Mode</label>
                    </div>
                    <div className="col-md-4">
                      <div className="view-details">
                        <h6>{data_next?.paymentMode}</h6>
                      </div>
                    </div>
                  </div>
                  {data_next?.bankName && (
                    <div className="mb-2 row">
                      <div className="col-md-3">
                        <label className="form-label">Bank Name</label>
                      </div>
                      <div className="col-md-4">
                        <div className="view-details">
                          <h6>{data_next?.bankName}</h6>
                        </div>
                      </div>
                    </div>
                  )}
                  {data_next?.chequeNo && (
                    <div className="mb-2 row">
                      <div className="col-md-3">
                        <label className="form-label">Cheque No.</label>
                      </div>
                      <div className="col-md-4">
                        <div className="view-details">
                          <h6>{data_next?.chequeNo}</h6>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mb-2 row">
                    <div className="col-md-3">
                      <label className="form-label">Date of payment</label>
                    </div>
                    <div className="col-md-4">
                      <div className="view-details">
                        <h6>{data_next?.paymentDate}</h6>
                      </div>
                    </div>
                  </div>
                  {data_next?.transactionId && (
                    <div className="mb-2 row">
                      <div className="col-md-3">
                        <label className="form-label">Transaction ID</label>
                      </div>
                      <div className="col-md-4">
                        <div className="view-details">
                          <h6>{data_next?.transactionId}</h6>
                        </div>
                      </div>
                    </div>
                  )}
                  {data_next?.transactionProof && (
                    <div className="mb-2 row">
                      <div className="col-md-3">
                        <label className="form-label">Transaction Proof</label>
                      </div>
                      <div className="col-md-2 ">
                        {/* <img src={data_next?.transactionProof} alt="proof" style={{ maxWidth: "100%", height: "120px",width:"200px" }} /> */}
                        <a
                          href={data_next?.transactionProof}
                          target="_blank"
                          className="btn btn-primary filter-btn"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
              {hasComponentPermission(permissions, 47) && (
                <div className="mb-2 row">
                  <div className="col-lg-12 d-flex justify-content-end">
                    <button
                      className="btn btn-submit btn-primary"
                      onClick={() => generateReceipt()}
                      disabled={isLoading || Boolean(data_next.status)}
                    >
                      {isLoading ? "Generating Receipt..." : "Generate Receipt"}
                    </button>
                  </div>
                </div>
              )}
              {/* </form> */}
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-start">
              <Link
                to="/billing-group-tour"
                type="submit"
                className="btn btn-back"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Detailgrouptour;
