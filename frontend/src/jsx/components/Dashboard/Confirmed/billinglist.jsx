import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";
const Billinglist = () => {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [advance, setAdvance] = useState([]);
  const getbillingdetails = async () => {
    try {
      const response = await get(
        `/view-bill-group-tour?enquiryGroupId=${id}`
      );
      setData(response.data.data);
      setAdvance(response?.data?.data?.advancePayments)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getbillingdetails();
  }, []);

  console.log(data);

  // to end get customized tour details
  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    // console.log((window.location.href).split("/"))
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    // console.log(path)
    let element = document.getElementById("confirm-group-tour")
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
      <div className="row page-titles mx-0 mb-2 fixed-top-breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <BackButton />
          </li>
          <li className="breadcrumb-item active">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/confirm-group-tour">Confirmed</Link>
          </li>
          <li className="breadcrumb-item  ">
            <Link to="/view-billing">View Billing</Link>
          </li>
        </ol>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header card-header-second">
              <div className="card-title  h5">View Billing</div>
            </div>
            <div className="card-body">
              {/* <Table cols={columns} page={1} data={data} totalPages={1} isTableLoading={false} /> */}

              <div className="basic-form">
                <div className="row justify-content-end text-end d-flex">
                  <div className="col-md-12">
                    <Link
                      to="#"
                      type="submit"
                      className="btn btn-submit btn-primary"
                    >
                      Download
                    </Link>
                  </div>
                </div>
                <form>
                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Billing Name</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control col-md-6"
                        placeholder=""
                        value={data.billingName}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.billingName}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Address</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control col-md-6"
                        placeholder=""
                        value={data.address}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.address}</h6>
                      </div>
                      {/* <h6 className="view-details"></h6> */}
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Phone No.</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="tel"
                        className="form-control"
                        placeholder=""
                        value={data.phoneNumber}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.phoneNumber}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">GSTIN</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control"
                        value={data.gstIn}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.gstIn}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">PAN Number</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control"
                        value={data.panNumber}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.panNumber}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Grand Total</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control"
                        value={data.grandTotal}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.grandTotal}</h6>
                      </div>
                    </div>
                  </div>
                  {advance.map((item, index) => (
                    <div className="mb-2 row">
                      <div className="col-md-2">
                        <label className="form-label">Advance {index + 1}</label>
                      </div>
                      <div className="col-md-5">

                        <div className="view-details">
                          <h6 key={index}>{`${item.advancePayment}`}</h6>
                        </div>

                      </div>
                      <div className="col-md-5">
                        <div className="view-details">
                          <h6 key={index}>{item.status == 0 ? 'Pending' : 'Confirm'}</h6>
                        </div>
                      </div>
                      {/* <div className="col-md-4">
                        <div className="d-flex">
                            <Link to="" className="btn btn-warning pdf-btn btn-sm" style={{height:"32px", margin:"0 10px 0 0",lineHeight:"1"}}>View Details</Link>
                            <Link to="" className="btn btn-secondary pdf-btn btn-sm" style={{height:"32px", margin:"0",lineHeight:"1"}}>View Receipt</Link>
                        </div>
                      </div> */}
                    </div>
                  ))}
                  {/* <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Advance 2</label>
                    </div>
                    <div className="col-md-5">
                    <div className="view-details">
                          <h6>{data.advancePayments}</h6>
                        </div>
                    </div> */}
                  {/* <div className="col-md-4">
                        <div className="d-flex">
                            <Link to="" className="btn btn-warning pdf-btn btn-sm" style={{height:"32px", margin:"0 10px 0 0",lineHeight:"1"}}>View Details</Link>
                            <Link to="" className="btn btn-secondary pdf-btn btn-sm" style={{height:"32px", margin:"0",lineHeight:"1"}}>View Receipt</Link>
                        </div>
                      </div> */}
                  {/* </div> */}
                  {/* <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Advance 3</label>
                    </div>
                    <div className="col-md-5">
                    <div className="view-details">
                          <h6>{data.advancePayments}</h6>
                        </div>
                    </div>
                    {/* <div className="col-md-4">
                        <div className="d-flex">
                            <Link to="" className="btn btn-warning pdf-btn btn-sm" style={{height:"32px", margin:"0 10px 0 0",lineHeight:"1"}}>View Details</Link>
                            <Link to="" className="btn btn-secondary pdf-btn btn-sm" style={{height:"32px", margin:"0",lineHeight:"1"}}>View Receipt</Link>
                        </div>
                      </div> */}

                  <div className="mb-2 row">
                    <div className="col-md-2">
                      <label className="form-label">Balance</label>
                    </div>
                    <div className="col-md-5">
                      {/* <input
                        type="text"
                        className="form-control"
                        value={data.balance}
                        readOnly
                      /> */}
                      <div className="view-details">
                        <h6>{data.balance}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 row">
                    <div className="col-lg-12 d-flex justify-content-start">
                      <Link
                        to="/confirm-group-tour"
                        type="submit"
                        className="btn btn-back"
                      >
                        Back
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Billinglist;
