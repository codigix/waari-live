import React, { useEffect, useState } from "react";
import Select from "react-select";

import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import BackButton from "../../../common/BackButton"

const ViewGrouptour = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [guestname, setGuestname] = useState('');
  const [tourTypeOptions, setTourTypeOptions] = useState([]);
  const [tourType, setTourType] = useState(null);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [destination, setDestination] = useState(null);
  const [tourName, setTourName] = useState('');
  const [bookingDateFrom, setBookingDateFrom] = useState('');
  const [bookingDateTo, setBookingDateTo] = useState('');
  const [travelDateFrom, setTravelDateFrom] = useState('');
  const [travelDateTo, setTravelDateTo] = useState('');

  const {permissions} = useSelector(state => state.auth)

  const getTourTypeList = async () => {
    try {
      const response = await get(`/tour-type-list`);
      setTourTypeOptions(response.data.data.map(m => ({
        value: m.tourTypeId,
        label: m.tourTypeName
      })))
    } catch (error) {
      console.log(error);
    }
  }

  //get destination list
  const getDestinationList = async () => {
    try {
      const response = await get(`/destination-list`);
      setDestinationOptions(response.data.data.map(m => ({
        value: m.destinationId,
        label: m.destinationName
      })))
    } catch (error) {
      console.log(error);
    }
  }

  //TABLE COLOMN
  const columns = [
    {
      title: "Enquiry Id",
      dataIndex: "uniqueEnqueryId",
      key: "uniqueEnqueryId",
      width: 40,
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      width: 120,
      sortable: true,
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      key: "phoneNo",
      width: 80,
      sortable: true,
    },
    {
      title: "Tour Type",
      dataIndex: "tourType",
      key: "tourType",
      width: 100,
    },
    {
      title: "Destination/Tour Name",
      dataIndex: "tourName",
      key: "tourName",
      width: 100,
    },
    {
      title: "pax",
      dataIndex: "pax",
      key: "pax",
      width: 80,
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 80,
    },
    {
      title: "Travel Date",
      dataIndex: "travelDate",
      key: "travelDate",
      width: 80,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 80,
    },
    {
      title: "Billing",
      render: (item) => (
        <>
          <div className="d-flex justify-content-center">
            <Link to={`/all-billing/${item.enquiryId}`} className="btn-tick">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" /></svg>
            </Link>
          </div>
        </>
      ),
      key: "billing",
      width: 80,
    },
  ];


  // for pagination start

  const [totalCount, setTotalCount] = useState(0);
  const [perPageItem, setPerPageItem] = useState(10);

  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    console.log(value);
    setPage(value);
  };

  const handleRowsPerPageChange = (perPage) => {
    setPerPageItem(perPage);
    setPage(1);
  };
  // for pagination End

  //to start booking record list
  const [data, setData] = useState([]);
  const getViewgrouplist = async () => {
    try {
      setIsLoading(true)
      const response = await get(
        `/booking-records?perPage=${perPageItem}&page=${page}&guestName=${guestname}&tourTypeId=${tourType?.value || ""}&destinationId=${destination?.value || ""}&tourName=${tourName}&bookingDateFrom=${bookingDateFrom}&bookingDateTo=${bookingDateTo}&startDate=${travelDateFrom}&endDate=${travelDateTo}`
      );
      setIsLoading(false)
      setData(response?.data?.data);
      let totalPages = response.data.total / response.data.perPage;
      setTotalCount(Math.ceil(totalPages));
      setPerPageItem(response.data.perPage);
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  useEffect(() => {
    hasComponentPermission(permissions, 94) && getTourTypeList();
    hasComponentPermission(permissions, 94) && getDestinationList();
  }, [])

  useEffect(() => {
   hasComponentPermission(permissions, 94) && getViewgrouplist();
  }, [page, perPageItem]);
  //to end booking record list
  return (
    <>
      { hasComponentPermission(permissions, 94) && <>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: '40px' }}>
          <div className="card">
            <div className="row page-titles mx-0 fixed-top-breadcrumb">
                 <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                <li className="breadcrumb-item active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/booking-record">Booking Record</Link>
                </li>
              </ol>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Guest Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="guestName"
                        onChange={(e) => setGuestname(e.target.value)}
                        value={guestname} />
                    </div>
                  </div>

                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Tour type</label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="tourType"
                        options={tourTypeOptions}
                        onChange={(e) => setTourType(e)}
                        value={tourType}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Destination</label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        options={destinationOptions}
                        name="destination"
                        onChange={(e) => setDestination(e)}
                        value={destination}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Tour Name</label>
                      <input type="text" className="form-control" 
                      onChange={ (e) => setTourName(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Booking date from</label>
                      <input type="date" className="form-control" 
                      onChange={ (e) => setBookingDateFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Booking date to</label>
                      <input type="date" className="form-control"
                      onChange={ (e) => setBookingDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Travel date from</label>
                      <input type="date" className="form-control"
                      
                      onChange={ (e) => setTravelDateFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-4">
                    <div className="mb-2">
                      <label>Travel date to</label>
                      <input type="date" className="form-control" 
                      onChange={(e) => setTravelDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary mb-2 filter-btn "
                      onClick={() => (getViewgrouplist(), setPage(1))}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <Table
                cols={columns}
                page={page}
                data={data}
                handlePageChange={handleChange}
                totalPages={totalCount}
                isTableLoading={isLoading}
                handleRowsPerPageChange={handleRowsPerPageChange}
                isPagination={true}
              />
            </div>
          </div>
        </div>
        </div>
        </>}
    </>
  );
};
export default ViewGrouptour;
