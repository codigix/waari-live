import React, { useContext, useEffect, useState } from "react";
import Table from "../../table/VTable";

//Import Components
import { ThemeContext } from "../../../../context/ThemeContext";
import DualLine from "../charts/dualLine";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { get } from "../../../../services/apiServices";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";

const Home = () => {
  const { permissions } = useSelector((state) => state.auth);

  const [bookingSalesAmountGraphCtData, setBookingSalesAmountGraphCtData] =
    useState({
      targetArray: [],
      ctAchieveArray: [],
    });
  const [profitCountsCt, setProfitCountsCt] = useState({});

  const [salesProfitData, setSalesProfitData] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  const handlePageChange = (e, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (rowsPerPage) => {
    setPerPage(rowsPerPage);
    setPage(1);
  };

  const getBookingSalesAmountGraphCtData = async () => {
    try {
      setIsTableLoading(true)
      const result = await get(`/billing/booking-sales-amount-graph-ct`);

      setBookingSalesAmountGraphCtData(result.data);
      
      setTotalPages(result.data.lastPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const getProfitPerMonthData = async () => {
    try {
      const result = await get(`/billing/profit-ct`);
      setProfitCountsCt(result.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  const getListSalesProfit = async () => {
    try {
      const result = await get(`/billing/list-sales-profit?page=${page}&perPage=${perPage}`);
      setSalesProfitData(result.data?.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
      width: 100,
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      width: 100,
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
      width: 100,
    },
    {
      title: "Pax",
      dataIndex: "pax",
      key: "pax",
      width: 100,
    },
    {
      title: "Travel Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 100,
    },
    {
      title: "Travel End Date",
      dataIndex: "endDate",
      key: "endDate",
      width: 100,
    },
    {
      title: "Purchase",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 100,
    },
    {
      title: "Sale",
      dataIndex: "sale",
      key: "sale",
      width: 100,
    },
    // {
    //   title: "Voucher Status",
    //   dataIndex: "voucherstatus",
    //   key: "voucherstatus",
    //   width: 100,
    // },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      width: 90,
    },
    {
      title: "Profit(%)",
      dataIndex: "profitPer",
      key: "profitPer",
      width: 90,
    },
  ];

  const { changeBackground } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
  }, []);


  useEffect(() => {
    let element = document.getElementById("Dashboard");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' class to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
      }
    };
  }, []);

  useEffect(() => {
    hasComponentPermission(permissions, 24) && getListSalesProfit()
  }, [page, perPage]);


  useEffect(() => {
    hasComponentPermission(permissions, 22) && getBookingSalesAmountGraphCtData();

    hasComponentPermission(permissions, 23) &&  getProfitPerMonthData()

  }, []);

  return (
    <>
    		      <div className="row">
        {(hasComponentPermission(permissions, 22) ||
						hasComponentPermission(permissions, 23))  && 
            <>

        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div
                className="card-header"
                style={{ paddingLeft: "0", paddingTop: "0" }}
              >
                <div className="card-title h2">Customized Tour</div>
              </div>
            </div>
          </div>
        </div>
      
        </>
     }
        {hasComponentPermission(permissions, 22) && <div className="col-lg-6 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                <div className="card-title h5">Booking Sales Amount</div>
              </div>
              <DualLine
                achivedTarget={
                  bookingSalesAmountGraphCtData?.ctAchieveArray || []
                }
                actualTarget={bookingSalesAmountGraphCtData?.targetArray || []}
              />
            </div>
          </div>
        </div>}

     { hasComponentPermission(permissions, 23) &&  <div className="col-lg-6 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                <div className="card-title h5">Profit</div>
              </div>
              <div className="row mt-2 mb-2">
                <div
                  className="col-lg-6 col-sm-6 col-6  m-auto  d-flex justify-content-center text-center purple-progress"
                  style={{ flexDirection: "column" }}
                >
                  <CircularProgressbar
                    value={profitCountsCt?.profitPer || 0}
                    text={`${profitCountsCt?.profitPer || 0}%`}
                  />
                  <h6 className="mt-2">Package wise</h6>
                </div>
                <div
                  className="col-lg-6 col-sm-6 col-6  m-auto  d-flex justify-content-center text-center yellow-progress"
                  style={{ flexDirection: "column" }}
                >
                  <CircularProgressbar
                    value={profitCountsCt?.profitPerMonth || 0}
                    text={`${profitCountsCt?.profitPerMonth || 0}%`}
                  />
                  <h6 className="mt-2">Month Wise</h6>
                </div>
                <div
                  className="col-lg-6 col-sm-6 col-6  m-auto  d-flex justify-content-center text-center blue-progress"
                  style={{ flexDirection: "column" }}
                >
                  <CircularProgressbar
                    value={profitCountsCt?.profitPerQuarter || 0}
                    text={`${profitCountsCt?.profitPerQuarter || 0}%`}
                  />
                  <h6 className="mt-2">Quarter Wise</h6>
                </div>
                <div
                  className="col-lg-6 col-sm-6 col-6  m-auto  d-flex justify-content-center text-center blue-progress"
                  style={{ flexDirection: "column" }}
                >
                  <CircularProgressbar
                    value={profitCountsCt?.profitPerYear || 0}
                    text={`${profitCountsCt?.profitPerYear || 0}%`}
                  />
                  <h6 className="mt-2">Year Wise</h6>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {hasComponentPermission(permissions, 24) &&  <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="card-header p-0">
                <div className="card-title h5">Departure (month)</div>
              </div>
              <div className="mt-2 mb-2">
                <Table
                  cols={columns}
                  data={salesProfitData || []}
                  handlePageChange={handlePageChange}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  totalPages={totalPages}
                  page={page}
                  isTableLoading={isTableLoading}
                  isPagination={true}
                />
              </div>
            </div>
          </div>
        </div>}
     </div>
    </>
  );
};
export default Home;
