import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import BackButton from "../../common/BackButton";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};
const Salestarget = () => {


  const [totalCount, setTotalCount] = useState(0);
  const [perPageItem, setPerPageItem] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [salesListData, setSalesListData] = useState([]);
  const { permissions } = useSelector((state) => state.auth);

  const [guestName , setGuestName] = useState("");

  //handle to get sales listing
  const getSalesListing = async () => {
    try {
      setIsLoading(true)
      const result = await get(`sales-listing?page=${page}&perPage=${perPageItem}&guestName=${guestName}`)
      setSalesListData(result.data.data)
      setTotalCount(result.data.lastPage)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }

  //TABLE COLOMN
  const columns = [
    {
      title: "Sr.No.",
      render: (item, index) => (
        <>{page * perPageItem - perPageItem + (index + 1)}</>
      ),
      width: 50,
    },
    {
      title: "Guest Name",
      dataIndex: "userName",
      width: 150,
      sortable: true,
    },
    {
      title: "Contact",
      render: (item) => <>
        {
          item.contact || "--"
        }
      </>,
      key: "contact",
      width: 80,
      sortable: true,
    },

    {
      title: "Address",
      render: (item) => <>
        {
          <Tooltip title={item.address} arrow>
            <p className="truncate">
              {!!item.address ? item.address : "-"}
            </p>
          </Tooltip>
        }
      </>,
      key: "address",
      width: 100,
    },
    // {
    //   title: "Target(Sales Amt)",
    //   dataIndex: "salesamt",
    //   key: "salesamt",
    //   width: 80,
    // },
    // {
    //   title: "Target(No. of Guest)",
    //   dataIndex: "noofguest",
    //   key: "noofguest",
    //   width: 80,
    // },

    {
      title: "Action",
      render: (item) => (
        <>
          <div className="d-flex justify-content-center">
            <Link
              to={`/set-sales-target/${item.userId}`}
              className="btn-tick me-2"
            >
              <Tooltip title="View">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
              </svg>
              </Tooltip>
            </Link>

          </div>
        </>
      ),
      width: 90,
    },
  ];



  // for pagination start

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (perPage) => {
    setPerPageItem(perPage);
    setPage(1);
  };

  useEffect(() => {
    hasComponentPermission(permissions, 115) && getSalesListing()
  }, [page, perPageItem])

  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    // console.log((window.location.href).split("/"))
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    // console.log(path)
    let element = document.getElementById("group-tour")
    // console.log(element)
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
      {
        hasComponentPermission(permissions, 115) && <>
          <div className="row">
            <div className="col-lg-12" style={{ paddingTop: '40px' }}>
              <div className="card">
                <div className="row page-titles mx-0 fixed-top-breadcrumb">
                     <ol className="breadcrumb">
                     
                    <li className="breadcrumb-item active">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item  ">
                      <Link to="/sales-target">Sales Target</Link>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="card">

                <div className="card-body">
                  {/* <form> */}
                  <div className="row">
                    <div className="col-md-3">
                      <div className="mb-3">
                        <label>Guest Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-3 d-flex align-items-center">
                      <button
                        onClick={() => getSalesListing()}
                        className="btn btn-primary filter-btn"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                  {/* </form> */}
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
                    data={salesListData}
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

        </>
      }
    </>
  );
};
export default Salestarget;
