import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const TourGuestDetails = ({ tourId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { permissions } = useSelector((state) => state.auth);

    // for pagination start
    const [data, setData] = useState([]);
    const [tourDetails, setTourDetails] = useState({});

    const [totalCount, setTotalCount] = useState(0);
    const [perPageItem, setPerPageItem] = useState(10);

    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleRowsPerPageChange = (perPage) => {
        setPerPageItem(perPage);
        setPage(1);
    };

    //to start get tour group list

    const columns = [
        {
            title: "Sr. No",
            render: (item, index) => <> {index + 1} </>,
            key: "srno",
            width: 8,
        },
        {
            title: "Name of Guest",
            dataIndex: "firstName",
            key: "firstName",
            width: 120,
            render: (item) => (
                <>
                    {item.firstName} {item.lastName}
                </>
            ),
        },
    ];

    const getViewgrouplist = async () => {
        try {
            setIsLoading(true);
            const response = await get(`/get-gt-guest-details?groupTourId=${tourId}`);
            const data = response.data;

            setIsLoading(false);
            setTourDetails({
                tourName: data.tourName,
                tourCode: data.tourCode,
            });
            setData(data?.data);
            let totalPages = response.data.total / response.data.perPage;
            setTotalCount(Math.ceil(totalPages));
            setPerPageItem(response.data.perPage);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        hasComponentPermission(permissions, 320) && getViewgrouplist();
    }, [page, perPageItem]);
    // to get the tour group list

    return (
        <>
         <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Tour Name</th>
                                            <th className="text-center">Tour Code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="font-weight-bold">
                                                {tourDetails.tourName}
                                            </td>
                                            <td>{tourDetails.tourCode}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

            {hasComponentPermission(permissions, 320) && (
                <div className=" mt-5">
                    <table className="table table-bordered">
                        <thead className="bg-gray-200">
                            <tr>
                                <th>Sr.No.</th>
                                <th>Family Head</th>
                                <th>Guest Name</th>
                                <th>Aadhar Number</th>
                                <th>PAN Number</th>
                                <th>Passport Number</th>
                                <th>Passport Issue Date</th>
                                <th>Passport Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ||
                            !data.some((family) => family.guestdetail.length > 0) ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                data.map((family, index) => {
                                    const numberOfGuests = family.guestdetail.length;
                                    return family.guestdetail.map((guest, guestIndex) => {
                                        return (
                                            <tr key={guest.groupGuestDetailId} className="bg-white">
                                                {/* Show Family Head Index only for the first guest in the family */}
                                                {guestIndex === 0 && (
                                                    <td
                                                        rowSpan={numberOfGuests}
                                                        className="align-middle px-4 py-2"
                                                    >
                                                        {index + 1}
                                                    </td>
                                                )}

                                                {/* Show Family Head Name and Number of Guests only for the first guest in the family */}
                                                {guestIndex === 0 && (
                                                    <td
                                                        rowSpan={numberOfGuests}
                                                        className="align-middle px-4 py-2"
                                                    >
                                                        {family.familyheadfirstName}{" "}
                                                        {family.familyheadlastName} (
                                                        {numberOfGuests} Guests)
                                                    </td>
                                                )}

                                                {/* Guest details for each individual guest */}
                                                <td className="px-4 py-2">
                                                    {guest.firstName} {guest.lastName}
                                                </td>
                                                <td className="px-4 py-2">{guest.adharNo}</td>
                                                <td className="px-4 py-2">
                                                    {guest.panNo || "N/A"}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {guest.passportNo || "N/A"}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {guest.passport_issue_date || "N/A"}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {guest.passport_expiry_date || "N/A"}
                                                </td>
                                            </tr>
                                        );
                                    });
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};
export default TourGuestDetails;
