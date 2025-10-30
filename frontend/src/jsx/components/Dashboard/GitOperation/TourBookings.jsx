import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { get } from "../../../../services/apiServices";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const TourBookings = ({ tourId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { permissions } = useSelector((state) => state.auth);

    // Function to generate dynamic payment columns
    const generatePaymentColumns = (data) => {
        // Get the maximum number of payments across all rows
        const maxPayments = Math.max(...data.map((item) => item.paymentdetail?.length || 0));

        // Create dynamic columns for each payment
        return Array.from({ length: maxPayments }, (_, index) => ({
            title: `Adv${index + 1}`, // Dynamic column header
            render: (item) =>
                item.paymentdetail?.[index]
                    ? parseFloat(item.paymentdetail[index].advancePayment).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                      })
                    : "-", // Show "-" if no payment detail exists for this column
            key: `adv${index + 1}`,
            width: 100,
        }));
    };

    // for pagination start
    const [data, setData] = useState([]);
    const [lastRowData, setLastRowData] = useState({});
    const [roomsDetails, setRoomsDetails] = useState([]);
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
            render: (item, index) => <> {data.length == index ? "Total" : index + 1} </>,
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
        {
            title: "Total Price",
            render: (item) => {
                // Check if it's the totals row to display a text string
                if (item.isTotalRow) {
                    return <>Total Pax Confirmed</>; // Display string for the totals row
                } else {
                    // Otherwise, display the total price as a formatted number
                    return (
                        <>
                            {item.tourPrice
                                ? parseFloat(item.tourPrice).toLocaleString("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                  })
                                : "-"}
                        </>
                    );
                }
            },
            key: "tourPrice",
            width: 120,
        },

        {
            title: "Discount",
            render: (item) => {
                // If it's the totals row, display the discount value as a number without currency formatting
                if (item.isTotalRow) {
                    return <>{lastRowData.totalPax || "-"}</>; // Show additionalDis as text (it could be a "0" or empty string)
                } else {
                    // Apply currency formatting for non-totals rows
                    return (
                        <>
                            {item.coupondiscountValue
                                ? parseFloat(item.coupondiscountValue).toLocaleString("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                  })
                                : "-"}
                        </>
                    );
                }
            },
            key: "coupondiscountValue",
            width: 120,
        },
        {
            title: "Coupon Applied",
            dataIndex: "couponName",
            key: "couponName",
            width: 120,
        },
        {
            title: "Loyalty Points Discount",
            dataIndex: "points",
            key: "points",
            width: 120,
        },
        {
            title: "Total Discount",
            render: (item) => (
                <>
                    {item.additionalDis
                        ? parseFloat(item.additionalDis).toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                          })
                        : "-"}{" "}
                </>
            ),
            width: 120,
        },
        {
            title: "Discounted Price",
            render: (item) => (
                <>
                    {item.discountPrice
                        ? parseFloat(item.discountPrice).toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                          })
                        : "-"}{" "}
                </>
            ),
            width: 120,
        },
        {
            title: "GST",
            dataIndex: "gst",
            key: "gst",
            width: 150,
            sortable: true,
        },
        {
            title: "TCS",
            dataIndex: "tcs",
            key: "tcs",
            width: 150,
            sortable: true,
        },
        {
            title: "Total",
            render: (item) => (
                <>
                    {item.grandTotal
                        ? parseFloat(item.grandTotal).toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                          })
                        : "-"}{" "}
                </>
            ),
            width: 120,
        },

        ...generatePaymentColumns(data),
        {
            title: "Balance",
            render: (item) => (
                <>
                    {parseFloat(item.balance).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                    })}
                </>
            ),
            key: "balance",
            width: 120,
        },

        {
            title: "Confirmed By",
            dataIndex: "userName",
            key: "userName",
            width: 120,
        },
    ];

    const mergedColumns = [...columns];

    const finalData = lastRowData
        ? [
              ...data,
              {
                  key: "totals",
                  isTotalRow: true,
                  guestName: "Total", // Name column, you can leave it empty or put "Total"
                  balance: lastRowData.totalBalance, // Balance related column
                  additionalDis: lastRowData.totalDiscount == 0 ? "0" : "", // Discount column
                  totalPrice: "Total Pax Confirmed", // Discounted price
                  gst: lastRowData.totalGST, // GST
                  totalPax: "", // Total pax
                  couponName: "", // Empty or null
                  points: "", // Empty or null
                  discountPrice: lastRowData.totalDiscountedPrice, // Empty or null
                  grandTotal: "", // Empty or null
                  groupName: "", // Empty or null
                  userName: "", // Empty or null
                  coupondiscountValue: lastRowData.totalPax,
              },
          ]
        : data;

    const getViewgrouplist = async () => {
        try {
            setIsLoading(true);
            const response = await get(`/get-gt-bookings?groupTourId=${tourId}`);
            const data = response.data;

            setTourDetails({
                tourName: data.tourName,
                tourCode: data.tourCode,
            });
            setIsLoading(false);
            setData(data?.data);
            setRoomsDetails(data?.roomDetails);
            setLastRowData({
                totalBalance: data?.totalBalance,
                totalDiscount: data?.totalDiscount,
                totalDiscountedPrice: data?.totalDiscountedPrice,
                totalGST: data?.totalGST,
                totalPax: data?.totalPax,
            });
            let totalPages = response.data.total / response.data.perPage;
            setTotalCount(Math.ceil(totalPages));
            setPerPageItem(response.data.perPage);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        hasComponentPermission(permissions, 319) && getViewgrouplist();
    }, [page, perPageItem]);
    // to get the tour group list

    return (
        <>
            {hasComponentPermission(permissions, 319) && (
                <div className="row">
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
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Room Share Name</th>
                                            <th className="text-center">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomsDetails.map((room, index) => (
                                            <tr key={index}>
                                                <td className="font-weight-bold">
                                                    {room.roomShareName}
                                                </td>
                                                <td>
                                                    {parseFloat(room.totalAmount).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            style: "currency",
                                                            currency: "INR",
                                                        }
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <Table
                                    rowClassName={(record) =>
                                        record.isTotalRow ? "total-row" : ""
                                    }
                                    cols={mergedColumns}
                                    page={page}
                                    data={finalData}
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
            )}
        </>
    );
};
export default TourBookings;
