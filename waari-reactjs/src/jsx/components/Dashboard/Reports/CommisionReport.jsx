import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Table from "../../../components/table/VTable";
import Select from "react-select";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux"
import BackButton from "../../common/BackButton";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "34px", // Adjust the height to your preference
  }),
};

// its dynamic year array from current year

const yearArray = () => {
  let year = new Date().getFullYear();
  let yearArray = [];
  for (let i = 2023; i <= year; i++) {
    yearArray.push({ value: i, label: i });
  }
  return yearArray;
};

const months = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const CommisionReport = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { permissions } = useSelector((state) => state.auth);

  const columns = [
    {
      title: "Sr. No.",
      render: (_, index) => page * rowsPerPage - rowsPerPage + index + 1,
      key: "srNo",
      sortable: true,
    },
    { title: "Enquiry Id", dataIndex: "enquiryId", key: "enquiryId", sortable: true },
    { title: "Guest Name", dataIndex: "guestName", key: "guestName", sortable: true },
    { title: "Inr Cost", dataIndex: "inrCost", key: "inrCost", sortable: true },
    { title: "Total Cost", dataIndex: "totalCost", key: "totalCost", sortable: true },
    { title: "Commission", dataIndex: "commission", key: "commission", sortable: true },
  ];

  // Fetch commission report
  const getSalesReportDetailsMonthWise = async (currentPage = page) => {
    setIsTableLoading(true);
    try {
      const response = await get(
        `get-commission-report?page=${currentPage}&perPage=${rowsPerPage}&year=${year}&month=${selectedMonth}`
      );

      setData(response.data.data);
      setTotalPages(response.data.lastPage);
    } catch (err) {
      console.error("Error fetching commission report:", err);
    } finally {
      setIsTableLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  // Fetch data whenever dependencies change
  useEffect(() => {
    if (permissions?.length && hasComponentPermission(permissions, 79)) {
      getSalesReportDetailsMonthWise();
    }
  }, [page, rowsPerPage, selectedMonth, year, permissions]);
  return (
    <>
      {hasComponentPermission(permissions, 79) &&
        <div>
          <div className="card"  style={{ marginBottom: '40px' }}>
            <div className="row page-titles mx-0 fixed-top-breadcrumb">
              <ol className="breadcrumb">
               
                <li className="breadcrumb-item active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/view-commision-reports">Sales Report</Link>
                </li>
              </ol>
            </div>
          </div>
          <div>
            <>
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="mb-3">
                          <label>Month</label>
                          <Select
                            styles={customStyles}
                            className="basic-single"
                            classNamePrefix="select"
                            name="year"
                            options={months}
                            onChange={(e) => setSelectedMonth(e)}
                            value={selectedMonth}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="mb-3">
                          <label>Year</label>
                          <Select
                            styles={customStyles}
                            className="basic-single"
                            classNamePrefix="select"
                            name="year"
                            options={yearArray()}
                            onChange={(e) => setYear(e)}
                            value={year}
                          />
                        </div>
                      </div>

                      <div className="col-md-3 d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-primary filter-btn"
                          onClick={() => (
                            getSalesReportDetailsMonthWise(1), setPage(1)
                          )}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    {/* <div className="col-md-12 d-flex align-items mb-3  justify-content-end">
              <button
                type="button"
                className="btn btn-primary filter-btn"
                onClick={() => exportToExcel()}
              >
                {isExporting ? "Exporting..." : "Export to Excel"}
              </button>
            </div> */}
                    <Table
                      cols={columns}
                      data={data}
                      page={page}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                      isPagination={true}
                      isTableLoading={isTableLoading}
                      handleRowsPerPageChange={handleRowsPerPageChange}
                    />
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>}
    </>
  );
};

export default CommisionReport;
