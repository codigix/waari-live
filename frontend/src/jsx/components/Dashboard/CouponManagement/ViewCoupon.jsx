import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Table from "../../table/VTable";
import { Tab, Nav } from 'react-bootstrap';
import BackButton from "../../common/BackButton";

const ViewCoupon = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState({});
  const tabs = ['GROUP TOUR', 'CUSTOM TOUR']
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [guestList, setGuestList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPageItem, setPerPageItem] = useState(10);


  // For fetching view single guest 
  const getGuest = async () => {
    try {
      const response = await get(`coupon-data?couponId=${id}`);
      setCoupon(response?.data?.data);
    } catch (error) {
      setCoupon({});
      console.log(error);
    }
  }


  useEffect(() => {
    getGuest()
  }, []);


  // Get Coupon Statistics for coupon usage (for group tour and customized tour)
  const getGuestList = async () => {
    try {
      setIsTableLoading(true);
      // const response = await get(`guests-details?guestId=${id}&page=${page}&perPage=${perPageItem}&tab=${selectedTab == 'GROUP TOUR' ? 1 : 2}`);
      const response = await get(`coupon-users-list-${selectedTab == 'GROUP TOUR' ? "group-tour" : "custom-tour"}?couponId=${id}&page=${page}&perPage=${perPageItem}`);
      setTotalPages(response?.data?.lastPage);
      // setOffSetData(response?.data?.data)
      setGuestList(response?.data?.data);
      setPerPageItem(response?.data?.perPage);
      setIsTableLoading(false);
    } catch (error) {
      setGuestList([]);
      setIsTableLoading(false);
      console.log(error);
    }
  }
  //HANDLE PAGE CHANGE
  const handlePageChange = (e, page) => {
    setPage(page);
  };

  //handleRowsPerPageChange
  const handleRowsPerPageChange = (perPage) => {
    setPerPageItem(perPage);
    setPage(1);
  };

  const columns = [
    {
      title: "Sr.no",
      render: (item, index) =>
        <>{page * perPageItem - perPageItem + index + 1}</>,
      key: "srno",
      width: 40,
    },
    {
      title: "Tour Name/Group Name",
      dataIndex: "tourName",
      key: "tourName",
      width: 80,

    },
    {
      title: "Tour Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 80,
    },
    {
      title: "Tour End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 80,
    },
    {
      title: "Date of Usage",
      dataIndex: "usageDate",
      key: "usageDate",
      width: 80,

    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
      width: 80,
    },
    {
      title: "Guest Id",
      dataIndex: "guestId",
      key: "guestId",
      width: 80,
    },
    {
      title: "Guest Name",
      dataIndex: "userName",
      key: "userName",
      width: 80,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: 80,
    },
    {
      title: "Destination",
      dataIndex: "destinationId",
      key: "destinationId",
      width: 80,
    },
  ];



  const getLoaylityPointHistory = async () => {
    try {
      setIsTableLoading(true);
      const response = await get(`loyality-point-history?guestId=${id}&page=${page}&perPage=${perPageItem}`);
      setTotalPages(response?.data?.lastPage);
      setGuestList(response?.data?.data);
      setPerPageItem(response?.data?.perPage);
      setIsTableLoading(false);
    } catch (error) {
      setGuestList([]);
      setIsTableLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (selectedTab == 'LOYALITY POINT HISTORY') {
      getLoaylityPointHistory()
    } else {
      getGuestList()
    }
  }, [page, perPageItem, selectedTab]);



  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("guest-list")
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
      <div className="card"  style={{ marginBottom: '40px' }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb" >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <BackButton />
            </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/coupon-list">Coupon Information</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="javascript:void(0)">View Coupon</Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            <form
              className="needs-validation">
              <div className="mb-2 row">


                {/* <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Coupon ID.</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {coupon?.userId || "---"}
                    </h6>
                  </div>
                </div>
                </div> */}

                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">
                  <label className="form-label">Coupon Name</label>
                  <div className="view-details">
                    <h6>
                      {coupon?.couponName || ""}
                    </h6>
                  </div>
                </div>


                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">
                  <label className="form-label">Validity From</label>
                  <div className="view-details">
                    <h6>
                      {coupon?.fromDate || "--"}
                    </h6>
                  </div>

                </div>

                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">
                  <label className="form-label">Validity To</label>
                  <div className="view-details">
                    <h6>
                      {coupon?.toDate || ""}
                    </h6>
                  </div>
                </div>

                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">

                  <label className="form-label">Coupon For</label>
                  <div className="view-details">
                    <h6>
                      {coupon?.isType == 1 ?
                        "For All Users" : coupon?.isType == 2 ? "For New Users" : "-----"}
                    </h6>
                  </div>
                </div>

                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">
                  <label className="form-label">Discount Type</label>
                  <div className="view-details">
                    <h6>
                      {coupon?.discountType == 1 ?
                        "Fixed" : coupon?.discountType == 2 ? "Percentage" : "---"}
                    </h6>
                  </div>
                </div>

                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">

                  <label className="form-label">Discount Amount</label>

                  <div className="view-details">
                    <h6>
                      {coupon?.discountValue || ""}
                    </h6>
                  </div>
                </div>

                {
                  coupon.discountType == 2 && (
                    <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">

                      <label className="form-label">Max Discount</label>

                      <div className="view-details">
                        <h6>
                          {coupon.maxDiscount || ""}
                        </h6>
                      </div>
                    </div>

                  )
                }


                <div className="mb-2 col-md-4 col-lg-3 col-sm-6 col-12">

                  <label className="form-label">Status</label>


                  <div className="view-details">
                    <h6>
                      {coupon?.status ? "Active" : "Inactive"}
                    </h6>
                    {coupon?.pan && (
                      <div className="viewadhaar" >
                        <Link to={coupon?.pan || "--"} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="black" height="16" width="18" viewBox="0 0 576 512"> <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg></Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coupon Statistics */}
              <div className="card-header mb-2 pt-0" style={{ paddingLeft: "0" }}>
                <div className="card-title h5">Destinations Visited</div>
              </div>
              <div className="mb-3 row">
                <div className="col-md-12">
                  <div className="tabs">
                    <Tab.Container defaultActiveKey={tabs[0]}>
                      <div className="card">
                        <div className="card-action coin-tabs">
                          <Nav as="ul" className="nav nav-tabs" >
                            {
                              tabs.map((tab, index) => (
                                <Nav.Item as="li" className="nav-item" key={index}>
                                  <Nav.Link eventKey={tab} onClick={() => setSelectedTab(tab)}>{tab}</Nav.Link>
                                </Nav.Item>
                              ))
                            }
                          </Nav>
                        </div>

                        <div className="mt-3">
                          <Tab.Content>
                            <Tab.Pane className="tab-pane" eventKey={selectedTab}>
                              <Table
                                cols={columns}
                                page={page}
                                data={guestList}
                                totalPages={totalPages}
                                isTableLoading={isTableLoading}
                                isPagination={true}
                                handlePageChange={handlePageChange}
                                handleRowsPerPageChange={handleRowsPerPageChange}
                              />
                            </Tab.Pane>
                          </Tab.Content>
                        </div>

                      </div>
                    </Tab.Container>
                  </div>
                </div>
              </div>


              <div className="mb-2 row" >
                <div className="col-lg-12 d-flex justify-content-start mt-2">
                  <Link
                    to="/coupon-list"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ViewCoupon;
