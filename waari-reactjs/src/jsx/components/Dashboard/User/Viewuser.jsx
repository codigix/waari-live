import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import Table from "../../../components/table/VTable";
import Select from "react-select";
import BackButton from "../../common/BackButton";

const establishmentOption = [
  { value: "1", label: "Proprietorship " },
  { value: "2", label: " Partnership" },
  { value: "3", label: "LLP" },
  { value: "4", label: "Pvt. Ltd." },
];

const ViewUser = () => {
  const { userId } = useParams(); // this will fetch userId from the URL
  console.log("userId:", userId);
  const [userData, setUserData] = useState({});

  // Fetch single user's partner data
  const getUser = async (userId) => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");

      const response = await get(`/view-users-data`, {
        headers: { token },
        params: { userId }, // pass as query param
      });

      const data = response?.data?.data || {};

      const establishmentTypeOption = establishmentOption.find(
        (item) => item.value == data.establishmentTypeId
      );

      setUserData({
        ...data,
        establishmentTypeId: establishmentTypeOption
          ? establishmentTypeOption.label
          : "",
      });

      if (formik) {
        formik.setValues({
          userName: data.userName || "",
          email: data.email || "",
          contact: data.contact || "",
          roleId: roleOptions.find((o) => o.value == data.roleId) || null,
          positionId:
            positionOptions.find((o) => o.value == data.positionId) || null,
          departmentId:
            departmentOptions.find((o) => o.value == data.departmentId) || null,
          sectorId: sectorOptions.find((o) => o.value == data.sectorId) || null,
          address: data.address || "",
          gender: data.gender || "",
          status: Boolean(data.status),
          establishmentName: data.establishmentName || "",
          establishmentTypeId: establishmentTypeOption || null,
          adharNo: data.adharNo || "",
          adharCard: data.adharCard || "",
          pan: data.pan || "",
          panNo: data.panNo || "",
          city: data.city || "",
          pincode: data.pincode || "",
          state: data.state || "",
          alternatePhone: data.alternatePhone || "",
          shopAct: data.shopAct || "",
          accName: data.accName || "",
          accNo: data.accNo || "",
          bankName: data.bankName || "",
          branch: data.branch || "",
          ifsc: data.ifsc || "",
          cheque: data.cheque || "",
          logo: data.logo || "",
        });
      }
    } catch (error) {
      setUserData({});
      console.error("Error fetching user:", error);
    }
  };

  // Call in useEffect using userId from URL
  useEffect(() => {
    getUser(userId);
  }, [userId]);

  useEffect(() => {
    let element = document.getElementById("users-list");
    if (element) {
      element.classList.add("mm-active1"); // Add the 'active' className to the element
    }
    return () => {
      if (element) {
        element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
      }
    };
  }, []);

  return (
    <>
      <div className="card" style={{ marginBottom: "40px" }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <BackButton />
            </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/users-list">Users Information</Link>
            </li>
            <li className="breadcrumb-item  ">
              <Link to="javascript:void(0)">View Users</Link>
            </li>
          </ol>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="card-header pt-2 mb-2" style={{ paddingLeft: "0" }}>
            <div className="card-title h5">View User</div>
          </div>
          <div className="basic-form">
            <form className="needs-validation">
              <div className="mb-2 row">
                {/* <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Users ID.</label>
                </div>
                <div className="col-md-6">
                  <div className="view-details">
                    <h6>
                      {userData?.userId || "---"}
                    </h6>
                  </div>
                </div>
                </div> */}

                <div className="mb-2 col-lg-3 col-sm-6 col-md-3 col-12">
                  <label className="form-label">Users Name</label>
                  <div className="view-details">
                    <h6>{userData?.userName || ""}</h6>
                  </div>
                </div>
                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Phone No.</label>
                  <div className="view-details">
                    <h6>{userData?.contact || "---"}</h6>
                  </div>
                </div>
                <div className="mb-2  col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Email Id</label>
                  <div className="view-details">
                    <h6>{userData?.email || "--"}</h6>
                  </div>
                </div>
                <div className="mb-2  col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Gender</label>
                  <div className="view-details">
                    <h6>{userData?.gender || ""}</h6>
                  </div>
                </div>
                <div className=" col-lg-6 col-sm-6 col-md-6 col-12">
                  <label className="form-label">Address</label>
                  <div className="view-details">
                    <h6>{userData?.address || ""}</h6>
                  </div>
                </div>

                <div className=" col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Role</label>
                  <div className="view-details">
                    <h6>{userData?.roleName || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Status</label>
                  <div className="view-details">
                    <h6>{userData?.status ? "Active" : "Inactive"}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Establishment Name</label>
                  <div className="view-details">
                    <h6>{userData?.establishmentName || ""}</h6>
                  </div>
                </div>

                <div className="mb-2  col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Establishment Type</label>
                  <div className="view-details">
                    <h6>{userData?.establishmentTypeId || ""}</h6>
                  </div>
                </div>

                <div className="mb-2  col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Aadhaar No</label>
                  <div className="view-details">
                    <h6>{userData?.adharNo || ""}</h6>
                  </div>
                </div>

                <div className="mb-2  col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Pan No</label>
                  <div className="view-details view-img">
                    <h6>{userData?.panNo || ""}</h6>
                  </div>
                </div>
                <div className="mb-2  col-lg-6 col-sm-12 col-md-12 col-12">
                  <label className="form-label">Aadhaar Card</label>
                  <div className="view-details view-img">
                    <img src={userData?.adharCard || ""} alt="" />
                  </div>
                </div>

                <div className="mb-2  col-lg-6 col-sm-6 col-md-12 col-12">
                  <label className="form-label">Pan Card</label>
                  <div className="view-details view-img">
                    <img src={userData?.pan || ""} alt="" />
                  </div>
                </div>

                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">City</label>
                  <div className="view-details">
                    <h6>{userData?.city || ""}</h6>
                  </div>
                </div>
                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">State</label>
                  <div className="view-details">
                    <h6>{userData?.state || ""}</h6>
                  </div>
                </div>
                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Pin Code</label>
                  <div className="view-details">
                    <h6>{userData?.pincode || ""}</h6>
                  </div>
                </div>
                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Alternate Phone</label>
                  <div className="view-details">
                    <h6>{userData?.alternatePhone || "--"}</h6>
                  </div>
                </div>
                <div className="mb-2 col-lg-3 col-sm-6 col-md-4 col-12">
                  <label className="form-label">A/C Name</label>
                  <div className="view-details">
                    <h6>{userData?.accName || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-3 col-sm-6 col-md-3 col-12">
                  <label className="form-label">A/C No</label>
                  <div className="view-details">
                    <h6>{userData?.accNo || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-2 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Bank Name</label>
                  <div className="view-details">
                    <h6>{userData?.bankName || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-2 col-sm-6 col-md-4 col-12">
                  <label className="form-label">Branch</label>
                  <div className="view-details">
                    <h6>{userData?.branch || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-2 col-sm-6 col-md-4 col-12">
                  <label className="form-label">IFSC</label>
                  <div className="view-details">
                    <h6>{userData?.ifsc || ""}</h6>
                  </div>
                </div>

                <div className="mb-2 col-lg-6 col-sm-12 col-md-12 col-12">
                  <label className="form-label">Cheque</label>
                  <div className="view-details view-img">
                    <img src={userData?.cheque || ""} alt="" />
                  </div>
                </div>
                <div className="mb-2 col-lg-6 col-sm-12 col-md-12 col-12">
                  <label className="form-label">Shop Act</label>
                  <div className="view-details view-img">
                    <img src={userData?.shopAct || ""} alt="" />
                  </div>
                </div>
                <div className="mb-2 col-lg-6 col-sm-12 col-md-12 col-12">
                  <label className="form-label">Logo</label>
                  <div className="view-details view-img">
                    <img src={userData?.logo || ""} height={"100px"} alt="" />
                  </div>
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-lg-12 d-flex justify-content-start mt-2">
                  <Link to="/users-list" type="submit" className="btn btn-back">
                    Back
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ViewUser;
