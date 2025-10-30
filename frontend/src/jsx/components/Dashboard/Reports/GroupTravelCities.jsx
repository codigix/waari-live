import React, { useState } from "react";
import Table from "../.././table/VTable";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import * as XLSX from "xlsx";
import Select from "react-select";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Pagination, Stack } from "@mui/material";
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

function Grouptravelcities() {
    const [selectedMonth, setSelectedMonth] = React.useState({
        value: new Date().getMonth() + 1,
        label: months.find((it) => it.value == new Date().getMonth() + 1)?.label,
    });
    const [year, setYear] = React.useState({
        value: new Date().getFullYear(),
        label: new Date().getFullYear(),
    });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        setRowsPerPage(value);
        handleRowsPerPageChange(value);
    };
    return (
        <>
            <div className="card"  style={{ marginBottom: '40px' }}>
                <div className="row page-titles mx-0 fixed-top-breadcrumb">
                       <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                        <li className="breadcrumb-item active">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/group-travel-cities">Group Travel Cities</Link>
                        </li>
                    </ol>
                </div>
            </div>
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
                                    onClick={() => (getBookingDetailsMonthWise(1), setPage(1))}
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
                        <div className="col-md-12">
                            <div className=" d-flex align-items mb-3  justify-content-end">
                                <button
                                    type="button"
                                    className="btn add-btn btn-secondary"
                                >
                                    Export to Excel
                                </button>
                            </div>
                            <div className="card-header  card-header-title p-0 mb-2"><div className="card-title h5">No. of guests travelled in Group Tour (Domestic)</div></div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-responsive-sm table-tour">
                                    <thead>
                                        <tr>
                                            <th className="" style={{ cursor: 'pointer' }}>Sr. No.<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>State (Highest to lowest)<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>April<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>May<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>June<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>July<span></span></th>
                                            <th className="" style={{ cursor: 'default' }}>August</th>
                                            <th className="" style={{ cursor: 'pointer' }}>September<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>October<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>November<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>December<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>January<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>February<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>March<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>Total<span></span></th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">1</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">Kerala</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">677</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">788</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">890</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>

                                        </tr>
                                        <tr style={{backgroundColor:"#f8f8f8"}}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center"></td>
                                            <td colSpan="13" className="px-6 py-4 whitespace-nowrap text-center" style={{ color: '#000' }}><b>Grand Total</b></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center" style={{ color: '#000' }}><b>277800</b></td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <Stack spacing={2} direction="row" className="">
                                <div className="dataTables_length">
                                    <label>
                                        <select
                                            className="page-select"
                                            value={rowsPerPage}
                                            onChange={handleChangeRowsPerPage}
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span> per page</span>
                                    </label>
                                </div>
                                <Pagination
                                    // page={page}
                                    // onChange={handlePageChange}
                                    // count={totalPages}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                    className="btn "
                                />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-header  card-header-title p-0 mb-2"><div className="card-title h5">No. of guests travelled in Group Tour (International)</div></div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-responsive-sm table-tour">
                                    <thead>
                                        <tr>
                                            <th className="" style={{ cursor: 'pointer' }}>Sr. No.<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>Country (Highest to lowest)<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>April<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>May<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>June<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>July<span></span></th>
                                            <th className="" style={{ cursor: 'default' }}>August</th>
                                            <th className="" style={{ cursor: 'pointer' }}>September<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>October<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>November<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>December<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>January<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>February<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>March<span></span></th>
                                            <th className="" style={{ cursor: 'pointer' }}>Total<span></span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">1</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">Kerala</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">677</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">788</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">890</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">897</td>

                                        </tr>
                                        <tr style={{backgroundColor:"#f8f8f8"}}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center" style={{color:"#000"}}></td>
                                            <td colSpan="13" className="px-6 py-4 whitespace-nowrap text-center" style={{color:"#000"}}><b>Grand Total</b></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center" style={{color:"#000"}}><b>277800</b></td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <Stack spacing={2} direction="row" className="">
                                <div className="dataTables_length">
                                    <label>
                                        <select
                                            className="page-select"
                                            value={rowsPerPage}
                                            onChange={handleChangeRowsPerPage}
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span> per page</span>
                                    </label>
                                </div>
                                <Pagination
                                    // page={page}
                                    // onChange={handlePageChange}
                                    // count={totalPages}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                    className="btn "
                                />
                            </Stack>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Grouptravelcities;
