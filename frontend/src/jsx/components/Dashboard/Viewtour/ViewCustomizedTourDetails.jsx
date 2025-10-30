
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";
const ViewCustomizedTourDetails = () => {
  const { id } = useParams()
  //to start get customized tour details
  const [data, setData] = useState(null);
  const [age, setAge] = useState([]);
  const [cities, setCities] = useState([]);
  const getCustomizeddetails = async () => {
    try {
      const response = await get(`/enquiry-ct?enquiryCustomId=${id}`);
      setData(response?.data);
      setAge(JSON.parse(response?.data?.age || "[]"));
      setCities(response?.data?.cities);
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
      const pp = response?.data?.data.map((item) => item.isFinal === 1 ? item : null).filter((item) => item !== null);

      setPackageList(pp)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPackageList();
  }, []);
  // to get package list end

  // to end get customized tour details
  useEffect(() => {

    let element = document.getElementById("View-customized-tour");
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
                    <Link to="/View-customized-tour">Enquiry follow-up</Link>
                  </li>
                  <li className="breadcrumb-item  ">
                    <Link to="javascript:void(0)">Details</Link>
                  </li>
                </ol>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="basic-form">
                  <form>
                    <div className="card-header mb-2 pt-0" style={{ paddingLeft: "0" }}>
                      <div className="card-title h5">Personal Details</div>
                    </div>
                    <div className="row">
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label className="form-label">Name of Group</label>
                        <div className="view-details">
                          <h6>{data?.groupName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label className="form-label">Name of Contact</label>
                        <div className="view-details">
                          <h6>{data?.contactName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label className="form-label">Select Destination</label>
                        <div className="view-details">
                          <h6>{data?.destinationName}</h6>
                        </div>
                      </div>

                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Contact</label>
                        <div className="view-details">
                          <h6>{data?.contact}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>mail</label>
                        <div className="view-details">
                          <h6>{data?.mailId}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
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
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
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
                      </div>{
                        age.length > 0 &&
                        <div className="mb-2 col-md-6 col-lg-6 col-12 col-sm-6">
                          <label>Ages</label>
                          <div className="child-row">
                            {age.map((item, index) => (
                              <div className="view-details me-1">
                                <h6 key={index}>{`${item}`}</h6>
                              </div>
                            ))}

                          </div>
                        </div>
                      }
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Country Name</label>
                        <div className="view-details">
                          <h6>{data?.countryName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>State Name</label>
                        <div className="view-details">
                          <h6>{data?.stateName}</h6>
                        </div>
                      </div>
                      <div className="col-md-9 col-lg-9 col-12 col-sm-12 mb-2">
                        <div className="form-group">
                          <label className="text-label">Cities</label>
                          <div className="view-details">
                            <ul className="view-ul">
                              {
                                cities?.map((c) =>
                                  <li>
                                    <h6>{c.citiesName}</h6>
                                  </li>
                                )
                              }

                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Tour start date</label>
                        <div className="view-details">
                          <h6>{data?.startDate}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Tour end date</label>
                        <div className="view-details">
                          <h6>{data?.endDate}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>No. of family Heads</label>
                        <div className="view-details">
                          <h6>{data?.familyHeadNo}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Total Rooms Required</label>
                        <div className="view-details">
                          <h6>{data?.rooms}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Total Extra Bed Required</label>
                        <div className="view-details">
                          <h6>{data?.extraBed}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>meal plan</label>
                        <div className="view-details">
                          <h6>{data?.mealPlanName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Hotel Category</label>
                        <div className="view-details">
                          <h6>{data?.hotelCatName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Reference</label>
                        <div className="view-details">
                          <h6>{data?.enquiryReferName}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
                        <label>Guest Reference Id<span className="error-star">*</span></label>
                        <div className="view-details">
                          <h6>{data?.guestRefId}</h6>
                        </div>
                      </div>
                      <div className="mb-2 col-md-4 col-lg-3 col-12 col-sm-6">
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
                                    Packages Option
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

                                <input
                                  type="text"
                                  className="form-control form-view"
                                  placeholder=""
                                  name="nameofguest"
                                  disabled
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

                                <input
                                  type="text"
                                  className="form-control form-view"
                                  placeholder=""
                                  name="nameofguest"
                                  disabled
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

                                <input
                                  type="text"
                                  className="form-control form-view"
                                  placeholder=""
                                  name="nameofguest"
                                  disabled
                                  value={"₹" + item?.childWithout}
                                />
                              </div>
                            </div>
                          </>
                        );
                      })}
                    <div className="mb-2 row">
                      <div className="col-lg-12 d-flex justify-content-start">
                        <Link
                          to="/customized-tour"
                          type="button"
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
export default ViewCustomizedTourDetails;
