import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import PopupModal from "../Popups/PopupModal";
import ConfirmationDialog from "../Popups/ConfirmationDialog";
import ReworkReason from "../Popups/ReworkReason";
import BackButton from "../../common/BackButton";
const Customizedtourdetails = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  //to start get customized tour details
  const [data, setData] = useState(null);
  const [age, setAge] = useState([]);
  const getCustomizeddetails = async () => {
    try {
      const response = await get(
        `/enquiry-ct?enquiryCustomId=${id}`
      );
      setData(response?.data);
      setAge(JSON.parse(response?.data?.age));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCustomizeddetails();
  }, []);

  // to get package list start
  const [packageList, setPackageList] = useState([]);
  const getPackageList = async () => {
    try {
      const response = await get(
        `package-list?enquiryCustomId=${id}`
      );
      setPackageList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackageList();
  }, []);
  // to get package list end

  // finalize package start
  const finalizePackage = async (values) => {
    const data = {
      packageCustomId: values.packageCustomId,
      enquiryCustomId: id,
    };
    try {
      const response = await post(`/final-package`, data);
      navigate(`/customizedbooking/booking/${id}`);
      toast.success(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };

  // finalize package end
  const [isRework, setRework] = useState(false)
  const [offsetReworkData, setOffsetReworkData] = useState(null)
  const handleReworkDialogClose = (apiCall) => {
    if(apiCall){
      getPackageList();
      getCustomizeddetails();
    }
    setRework(false)
  }


  // to end get customized tour details
  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = window.location.href.split("/");
    const path = pathArray[pathArray.length - 1];
    let element = document.getElementById("customized-tour");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
      }
    };
  }, []);

  const [isFinalPackage, setisFinalPackage] = useState(false)
  const [offsetData, setOffsetData] = useState(null)

  function handleDialogClose(isApicall) {
    if (isApicall) {
      finalizePackage(offsetData)
    }
    setisFinalPackage(false)
  }

  return (
    <>
      {isFinalPackage && (
        <PopupModal open={true} onDialogClose={handleDialogClose}>
          <ConfirmationDialog
            onClose={handleDialogClose}
            confirmationMsg={"Are you sure to confirm this tour ?"}
          />
        </PopupModal>
      )}
      {isRework && (
        <PopupModal open={true} onDialogClose={handleReworkDialogClose}>
          <ReworkReason
            onClose={handleReworkDialogClose}
            data={offsetReworkData}
          />
        </PopupModal>
      )}
      {
       
          <div className="row">
            <div className="col-lg-12"  style={{ paddingTop: '40px' }}>
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
                      <Link to="/customized-tour">Enquiry follow-up</Link>
                    </li>
                    <li className="breadcrumb-item  ">
                      <Link to="/customized-tour-details">Details</Link>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="basic-form">
                    <form>
                      <div className="card-header" style={{ paddingLeft: "0" }}>
                        <div className="card-title h5">Personal Details</div>
                      </div>
                      <div className="row">
                        <div className="mb-2 col-md-6">
                          <label className="form-label">Name of Group</label>
                          <div className="view-details">
                            <h6>{data?.groupName}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-6">
                          <label className="form-label">Name of Contact</label>
                          <div className="view-details">
                            <h6>{data?.contactName}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-6">
                          <label className="form-label">Select Destination</label>
                          <div className="view-details">
                            <h6>{data?.destinationName}</h6>
                          </div>
                        </div>

                        <div className="mb-2 col-md-6">
                          <label>Contact</label>
                          <div className="view-details">
                            <h6>{data?.contact}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-3">
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Durations(Nights)</label>
                              <div className="view-details">
                                <h6>{data?.nights}</h6>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <label>Durations(Days)</label>
                              <div className="view-details">
                                <h6>{data?.days}</h6>
                              </div>
                              {/* <span className="d-flex px-2 justify-content-center align-items-center">
                            Days
                          </span> */}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 col-md-3">
                          <div className="row">
                            <div className="col-md-6">
                              <label>Pax(Adults)</label>
                              <div className="view-details">
                                <h6>{data?.adults}</h6>
                              </div>
                              {/* <span className="d-flex px-2 justify-content-center align-items-center">
                            Adults
                          </span> */}
                            </div>
                            <div className="col-md-6">
                              <label>Pax(Childrens)</label>
                              <div className="view-details">
                                <h6>{data?.child}</h6>
                              </div>
                              {/* <span className="d-flex px-2 justify-content-center align-items-center">
                            Children
                          </span> */}
                            </div>
                          </div>
                        </div>
                        {
                          age.length > 0 &&
                        <div className="mb-2 col-md-6">
                          <label>Ages</label>
                          <div className="child-row">
                            {age.map((item, index) => (
                              <div className="view-details me-1">
                                <h6 key={index}>{`${item}`}</h6>
                              </div>
                            ))}
                            {/* <h6 className="view-details me-2">{data.age}</h6>  */}
                          </div>
                        </div>
                        }
                        <div className="mb-2 col-md-6">
                          <label>No. of family Heads</label>
                          <div className="view-details">
                            <h6>{data?.familyHeadNo}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-6">
                          <label>Reference</label>
                          <div className="view-details">
                            <h6>{data?.enquiryReferName}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-6">
                          <label>Guest Reference Id<span className="error-star">*</span></label>
                          <div className="view-details">
                            <h6>{data?.guestRefId}</h6>
                          </div>
                        </div>
                        <div className="mb-2 col-md-6">
                          <label className="form-label">Priority</label>
                          <div className="view-details">
                            <h6>{data?.priorityName}</h6>
                          </div>
                        </div>
                      </div>
                      {/* <div className="divider"></div> */}


                      {packageList.length > 0 &&

                        <div className="card-header" style={{ paddingLeft: "0" }}>
                          <div className="card-title h5">Packages Details</div>
                        </div> &&
                        packageList?.map((item, index) => {
                          return (
                            <>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="mb-2 d-flex">
                                    <label className="form-label d-flex align-items-center p-1">
                                      Packages Option {index + 1}
                                    </label>
                                    <Link
                                      className="btn btn-warning btn-follow btn-sm pdf-btn"
                                      style={{
                                        height: "32px",
                                        whiteSpace: "nowrap",
                                      }}
                                      to={item?.package}
                                      target="_blank"
                                    >
                                      View PDF
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              <div className="packages-row">
                                <div className="mb-2  d-flex ">
                                  <label
                                    className="form-label d-flex align-items-center   p-1"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Adults
                                  </label>
                                  {/* <
                                className="view-details text-nowrap"
                                style={{ height: "32px" }}
                              >
                                ₹ {item?.adult}
                              </h6> */}
                                  <input
                                    type="text"
                                    className="form-control form-view"
                                    placeholder=""
                                    name="nameofguest"
                                    value={"₹" + item?.adult}
                                  />
                                </div>
                                <div className="mb-2  d-flex">
                                  <label
                                    className="form-label d-flex align-items-center   p-1"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Extra Bed
                                  </label>
                                  {/* <h6
                                className="view-details text-nowrap"
                                style={{ height: "32px" }}
                              >
                                ₹ {item?.extraBed}
                              </h6> */}
                                  <input
                                    type="text"
                                    className="form-control form-view"
                                    placeholder=""
                                    name="nameofguest"
                                    value={"₹" + item?.extraBed}
                                  />
                                </div>
                                <div className="mb-2  d-flex">
                                  <label
                                    className="form-label d-flex align-items-center   p-1"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    Child Without Bed
                                  </label>
                                  {/* <h6
                                className="view-details text-nowrap"
                                style={{ height: "32px" }}
                              >
                                ₹ {item?.childWithout}
                              </h6> */}
                                  <input
                                    type="text"
                                    className="form-control form-view"
                                    placeholder=""
                                    name="nameofguest"
                                    value={"₹" + item?.childWithout}
                                  />
                                </div>
                                <div className="mb-2 d-flex align-items-start">
                                  {/* <Link
                                to="/customizedbooking/booking"
                                className="btn pdf-btn btn-secondary btn-submit me-1 btn-sm"
                                style={{ height: "32px", lineHeight: "1" }}
                              >
                                Finalize Quotation
                              </Link> */}
                                  {
                                    item.isFinal == 2 &&
                                    <>
                                      <span
                                        className=""
                                        onClick={() =>
                                          (setisFinalPackage(true), setOffsetData(item))
                                        }
                                      >
                                        <Link
                                          // to="/booking"
                                          className="btn pdf-btn btn-secondary btn-submit me-1 btn-sm"
                                          style={{ height: "32px", lineHeight: "1", margin: "0" }}
                                        >
                                          Finalize Quotation
                                        </Link>
                                      </span>
                                      {
                                        packageList.length - 1 === index && !data?.isRework &&
                                        <a onClick={() => (setRework(true), setOffsetReworkData({ packageCustomId: item.packageCustomId, enquiryCustomId: id }))}
                                          className="btn  pdf-btn filter-btn btn-sm"
                                          style={{ height: "32px", lineHeight: "1", margin: "0" }}
                                        >
                                          Rework
                                        </a>
                                      }
                                      {
                                        packageList.length - 1 === index && data?.isRework &&
                                        <a
                                          className="btn  pdf-btn filter-btn btn-sm"
                                          style={{ height: "32px", lineHeight: "1", margin: "0" }}
                                        >
                                          Rework In Progress
                                        </a>
                                      }
                                    </>
                                  }
                                  {
                                    item.isFinal == 1 && <a onClick={() =>
                                      navigate(`/customizedbooking/booking/${id}`)
                                    }
                                      className="btn pdf-btn btn-secondary btn-submit btn-sm"
                                      style={{ height: "32px", lineHeight: "1", margin: " 0px 10px 0px 0px" }}
                                    >
                                      Finalized
                                    </a>
                                  }
                                </div>
                              </div>
                            </>
                          );
                        })}
                      <div className="mb-2 row">
                        <div className="col-lg-12 d-flex justify-content-start">
                          <Link
                            to="/customized-tour"
                            type="submit"
                            className="btn  btn-back"
                          >
                            Back
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }

    </>
  );
};
export default Customizedtourdetails;
