import React, { useState } from "react";

import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
function Alltourleadrecord() {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        setRowsPerPage(value);
        handleRowsPerPageChange(value);
      };
    return (
        <>
            <div className="card-header  card-header-title pt-0 pb-0 mb-2"><div className="card-title h5">All Tour Leads Record</div></div>

            <div className="table-responsive">
                <table className="table  table-bordered table-responsive-sm table-tour">
                    <thead>
                        <tr>
                            <th className="" style={{ width: "180px" }}>
                                Month
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                April
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                May
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                June
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                July
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                August
                            </th>
                            <th className="" colSpan="3" style={{ width: "100px" }}>
                                September
                            </th>
                            <th className="" colSpan="3" style={{ width: "120px" }}>
                                Medium wise Total
                            </th>

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-600">
                        <tr>
                            <td>Marketing Medium</td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
                            <td>
                                <b>Lds</b>
                            </td>
                            <td>
                                <b>Con</b>
                            </td>
                            <td>
                                <b>%</b>
                            </td>
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

        </>
    );
}

export default Alltourleadrecord;
