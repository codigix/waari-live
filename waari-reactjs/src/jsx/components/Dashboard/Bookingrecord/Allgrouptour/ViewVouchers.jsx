
import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import BackButton from "../../../common/BackButton";
const ViewVouchers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    // for pagination start
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
    //to start booking record list
    const [data, setData] = useState([]);
    const getVoucherList = async () => {
        try {
            setIsLoading(true)
            const response = await get(`/view-vouchers?enquiryCustomId=${id}&perPage=${perPageItem}&page=${page}`);
            setIsLoading(false)
            setData(response?.data?.data);
            setTotalCount(response?.data?.lastPage);
            setPerPageItem(response.data.perPage);
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    };
    //TABLE COLOMN
    const columns = [
        {
            title: "Loyalty Card",
            render: (rowData) => rowData?.cardId == 1 ? 'Silver' : rowData?.cardId == 2 ? 'Gold' : rowData?.cardId == 3 ? 'Platinum' :'Diamond',
            key: "cardNo",
            width: 40,
        },
        {
            title: "Vouchers",
            render: (rowData) => (<>
                <div className="d-flex justify-content-center">
                    <a href={rowData?.vouchers} className="btn-tick" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                            <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" /></svg>
                    </a>
                </div>
            </>),
            key: "vouchers",
            width: 40,
        },
    ];
    useEffect(() => {
        getVoucherList();
    }, [page, perPageItem]);
    useEffect(() => {
		// While view farmer page is active, the yadi tab must also activated
		const pathArray = (window.location.href).split("/")
		const path = pathArray[pathArray.length - 1]
		let element = document.getElementById("booking-group-tour-new")
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
            <div className="row">
                <div className="col-lg-12"  style={{ paddingTop: '40px' }}>
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
                                    <Link to="javascript:void(0)">Booking Records</Link>
                                </li>
                            </ol>
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
        </>
    );
};
export default ViewVouchers;



