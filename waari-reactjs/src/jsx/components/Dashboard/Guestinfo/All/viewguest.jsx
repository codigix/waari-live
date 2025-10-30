import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../../table/VTable";
import { Tab, Nav } from 'react-bootstrap';
import { get } from "../../../../../services/apiServices";
import BackButton from "../../../common/BackButton";


const Viewguest = () => {

  const { id } = useParams();
  const tabs = ['GROUP TOUR', 'CUSTOME TOUR', 'LOYALITY POINT HISTORY']
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [guestList, setGuestList] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPageItem, setPerPageItem] = useState(10);
  const [offSetData, setOffSetData] = useState(null);
  const navigate = useNavigate()


  const getGuestList = async () => {
    try {
      setIsTableLoading(true);
      const response = await get(`guests-details?guestId=${id}&page=${page}&perPage=${perPageItem}&tab=${selectedTab == 'GROUP TOUR' ? 1 : 2}`);
      setTotalPages(response?.data?.lastPage);
      setOffSetData(response?.data)
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
      width: 100,

    },
    {
      title: "Country",
      dataIndex: "countryName",
      key: "countryName",
      width: 80,

    },

    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      width: 100,
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
      title: "Pax",
      dataIndex: "adults",
      key: "adults",
      width: 80,
    },
  ];
  const columnsLoyality = [
    {
      title: "Sr.no",
      render: (item, index) =>
        <>{page * perPageItem - perPageItem + index + 1}</>,
      key: "srno",
      width: 40,
    },
    {
      title: "Tour Name/Group Name",
      dataIndex: "tour",
      key: "tour",
      width: 100,
    },
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
      width: 100,
    },
    {
      title: "Loyality Points",
      dataIndex: "loyaltyPoint",
      key: "loyaltyPoint",
      width: 80,

    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 80,
    },
    {
      title: "Transaction Type",
      render: (item, index) => <>{item.isType == 1 ? <span className="badge light badge-warning">Debited</span> : <span className="badge light badge-success">Credited</span>}</>,
      key: "stateName",
      width: 100,
    }

  ];



  const getLoyaltyPointHistory = async () => {
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
      getLoyaltyPointHistory()
    } else {
      getGuestList()
    }
  }, [page, perPageItem, selectedTab]);



  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("all-guest-list")
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
              <Link to="/guest-list">Guest Information</Link>
            </li>
            <li className="breadcrumb-item  ">
              <a >View Guest</a>
            </li>
          </ol>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="basic-form">
            <div
              className="needs-validation">
              <div className="mb-2 row">
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Guest Name</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {offSetData?.billingName || ""}
                    </h6>
                  </div>

                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Phone No.</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {offSetData?.phoneNo || "---"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Address</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {offSetData?.address || ""}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Aadhar No</label>
                </div>
                <div className="col-md-6 " style={{ position: "relative" }}>
                  <div className="view-details">
                    <h6>
                      {offSetData?.adharNo || "--"}
                    </h6>
                    {offSetData?.adharCard && (
                      <div className="viewadhaar" >
                        <Link to={offSetData?.adharCard || "--"} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="black" height="16" width="18" viewBox="0 0 576 512"> <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg></Link>
                      </div>
                    )}
                  </div>

                </div>

              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Passport No</label>
                </div>
                <div className="col-md-6" style={{ position: "relative" }}>
                  <div className="view-details">
                    <h6>
                      {offSetData?.passportNo || "--"}
                    </h6>
                    {offSetData?.passport && (
                      <div className="viewadhaar" >
                        <Link to={offSetData?.passport || "--"
                        } target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="black" height="16" width="18" viewBox="0 0 576 512"> <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg></Link>
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">PAN Number</label>
                </div>
                <div className="col-md-6" style={{ position: "relative" }}>

                  <div className="view-details">
                    <h6>
                      {offSetData?.panNo || "--"}
                    </h6>
                    {offSetData?.pan && (
                      <div className="viewadhaar" >
                        <Link to={offSetData?.pan || "--"} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" fill="black" height="16" width="18" viewBox="0 0 576 512"> <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg></Link>
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Loyality Card Type</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {offSetData?.loyaltyCard}
                    </h6>
                  </div>

                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Loyality point</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {offSetData?.loyaltyPoint || 0}
                    </h6>
                  </div>

                </div>
              </div>

              <div className="mb-3 row mt-3">
                <div className="col-md-2">
                  <label>Destinations Visited</label>
                </div>
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
                        {
                          selectedTab === 'LOYALITY POINT HISTORY' ? (
                            <div className="mt-3">
                              <Tab.Content>
                                <Tab.Pane className="tab-pane" eventKey={selectedTab}>
                                  <Table
                                    cols={columnsLoyality}
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
                            </div>) :
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
                        }

                      </div>
                    </Tab.Container>
                  </div>
                </div>
              </div>
              <div className="mb-2 row" >
                <div className="col-lg-12 d-flex justify-content-start mt-2">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-back"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Viewguest;
