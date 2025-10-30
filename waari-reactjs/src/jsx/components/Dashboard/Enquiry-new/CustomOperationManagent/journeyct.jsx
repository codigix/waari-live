import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PopupModal from "../../Popups/PopupModal";
import ConfirmationDialog from "../../Popups/ConfirmationDialog";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import { updateIsPackageFinalized } from "../../../../../store/actions/groupTourAction";
import EditPackageDataPopup from "../../common/EditPackageDataPopup";

const Journeyct = ({ enquiryId }) => {
    const [isFollowupSubmitting, setIsFollowupSubmitting] = useState(false);
    const [isPackageSubmitting, setIsPackageSubmitting] = useState(false);
    const [areFamilyHeadsDataSubmitting, setAreFamilyHeadsDataSubmitting] = useState(false);

    const { permissions } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };
    useEffect(() => {
        // While view farmer page is active, the yadi tab must also activated
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        let element = document.getElementById("operator-custom-tours");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' class to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
            }
        };
    }, []);

    // to get package list start
    const [packageList, setPackageList] = useState([]);

    const [isPackageFinalized, setIsPackageFinalized] = useState(false);

    const getPackageList = async () => {
        try {
            const response = await get(`package-list?enquiryCustomId=${enquiryId}`);
            setPackageList(response?.data?.data);

            response.data?.data?.map((item) => {
                if (item.isFinal == 1) {
                    setIsPackageFinalized(true);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (hasComponentPermission(permissions, 365) || hasComponentPermission(permissions, 366)) &&
            getPackageList();
    }, []);

    // finalize package start
    const finalizePackage = async (values) => {
        const data = {
            packageCustomId: values.packageCustomId,
            enquiryCustomId: enquiryId,
        };
        try {
            const response = await post(`/final-package`, data);
            (hasComponentPermission(permissions, 365) ||
                hasComponentPermission(permissions, 366)) &&
                getPackageList();

            dispatch(updateIsPackageFinalized(true));

            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const [isFinalPackage, setisFinalPackage] = useState(false);
    const [offsetData, setOffsetData] = useState(null);

    function handleDialogClose(isApicall) {
        if (isApicall) {
            finalizePackage(offsetData);
        }
        setisFinalPackage(false);
    }

    // Edit Finalied Package
    const [editPackagePopup, setEditPackagePopup] = useState(false);
    const [editPackageData, setEditPackageData] = useState(null);

    function handleDialogClose2() {
        setEditPackagePopup(false);
    }

    //   upload thumbnail file start
    const url = import.meta.env.VITE_WAARI_BASEURL;
    const [packageUploaded, setPackageUploaded] = useState(false);
    const [isUploadingPDF, setIsUploadingPDF] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileNameToDisplay, setFileNameToDisplay] = useState("");
    const { token } = useSelector((state) => state.auth);

    const getFileLink = async (file) => {
        try {
            setFileNameToDisplay(file?.name);
            const formData = new FormData();
            formData.append("pdf", file);
            setIsUploadingPDF(true);
            const responseData = await axios.post(
                `
          ${url}/package-upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token,
                    },
                }
            );
            toast.success("PDF Uploaded Successfully");
            setPackageUploaded(true);
            setFileName(responseData?.data?.pdf);
            setIsUploadingPDF(false);
            return responseData?.data?.pdf;
        } catch (error) {
            setIsUploadingPDF(false);
            console.log(error);
        }
    };

    //   upload thumbnail file end

    const packageValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            adult: "",
            extraBed: "",
            childWithout: "",
        },
        validationSchema: Yup.object({
            adult: Yup.string().required("Please Enter Amount"),
            extraBed: Yup.string().required("Please Enter Amount"),
            childWithout: Yup.string().required("Please Enter Amount"),
        }),
        onSubmit: async (values, { resetForm }) => {
            let data = {
                enquiryCustomId: enquiryId,
                package: fileName,
                adult: values.adult,
                extraBed: values.extraBed,
                childWithout: values.childWithout,
            };
            if (packageUploaded) {
                try {
                    setIsPackageSubmitting(true);
                    const response = await post(`/package-custom-tour`, data);
                    toast.success(response?.data?.message);
                    resetForm();
                    setIsPackageSubmitting(false);
                    (hasComponentPermission(permissions, 365) ||
                        hasComponentPermission(permissions, 366)) &&
                        getPackageList();
                } catch (error) {
                    setIsPackageSubmitting(false);
                    console.log(error);
                }
            } else {
                toast.error("Please select PDF file.");
            }
        },
    });

    return (
        <>
            {isFinalPackage && (
                <PopupModal open={true} onDialogClose={handleDialogClose}>
                    <ConfirmationDialog
                        onClose={handleDialogClose}
                        confirmationMsg={"Are you sure to confirm this tour ?"}
                    />
                </PopupModal>
            )}
            {editPackagePopup && (
                <PopupModal open={true} onDialogClose={handleDialogClose2}>
                    <EditPackageDataPopup
                        editPackageData={editPackageData}
                        onClose={handleDialogClose2}
                        enquiryId={enquiryId}
                        getPackageList={getPackageList}
                    />
                </PopupModal>
            )}
            <form
                className="needs-validation"
                onSubmit={(e) => {
                    e.preventDefault();
                    packageValidation.handleSubmit();
                    return false;
                }}
            >
                <div className="card">
                    <div className="card-body">
                        <div className="basic-form">
                            <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                                <div className="card-title h5">Old Packages Details</div>
                            </div>

                            <div className="row mt-3 ">
                                {packageList.length > 0 &&
                                (hasComponentPermission(permissions, 365) ||
                                    hasComponentPermission(permissions, 366)) ? (
                                    packageList?.map((item, index) => {
                                        return (
                                            <>
                                                <div className="col-md-6 col-lg-3 col-sm-12 ">
                                                    <div className="packages-details">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div
                                                                    className="mb-2 d-flex"
                                                                    style={{
                                                                        justifyContent:
                                                                            "space-between",
                                                                    }}
                                                                >
                                                                    <label
                                                                        className="form-label d-flex align-items-center p-1"
                                                                        style={{
                                                                            fontWeight: "600",
                                                                        }}
                                                                    >
                                                                        Packages Option {index + 1}
                                                                    </label>
                                                                    <Tooltip title="View PDF">
                                                                        <Link
                                                                            className="document-link ms-2 me-2"
                                                                            to={item?.package}
                                                                            target="_blank"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 512 512"
                                                                                width="1.2rem"
                                                                                height="1.1rem"
                                                                                style={{
                                                                                    fill: "#059299",
                                                                                }}
                                                                            >
                                                                                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                                                            </svg>
                                                                        </Link>
                                                                    </Tooltip>
                                                                </div>

                                                                <div className="package-form">
                                                                    <div className="form-group  d-flex justify-content-between">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Adults
                                                                        </label>
                                                                        <h6 className="packages-text text-nowrap">
                                                                            ₹ {item?.adult}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="form-group d-flex justify-content-between ">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Extra Bed
                                                                        </label>
                                                                        <h6 className="packages-text text-nowrap">
                                                                            ₹ {item?.extraBed}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="form-group  d-flex justify-content-between">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Child Without Bed
                                                                        </label>
                                                                        <h6 className=" packages-text text-nowrap">
                                                                            ₹ {item?.childWithout}
                                                                        </h6>
                                                                    </div>

                                                                    <div className="mb-2 d-flex justify-content-end">
                                                                        {item.isFinal == 2 &&
                                                                            (hasComponentPermission(
                                                                                permissions,
                                                                                365
                                                                            ) ||
                                                                                hasComponentPermission(
                                                                                    permissions,
                                                                                    366
                                                                                )) && (
                                                                                <>
                                                                                    <span
                                                                                        className=""
                                                                                        onClick={() => (
                                                                                            setisFinalPackage(
                                                                                                true
                                                                                            ),
                                                                                            setOffsetData(
                                                                                                item
                                                                                            )
                                                                                        )}
                                                                                    >
                                                                                        <button
                                                                                            type="button"
                                                                                            // to="/booking"
                                                                                            className="btn pdf-btn btn-secondary btn-submit me-1 btn-sm"
                                                                                            style={{
                                                                                                height: "32px",
                                                                                                lineHeight:
                                                                                                    "1",
                                                                                                margin: "0",
                                                                                            }}
                                                                                        >
                                                                                            Finalize
                                                                                            Quotation
                                                                                        </button>
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        {item.isFinal == 1 && (
                                                                            <div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn pdf-btn btn-secondary btn-submit btn-sm"
                                                                                    style={{
                                                                                        height: "32px",
                                                                                        lineHeight:
                                                                                            "1",
                                                                                        margin: " 0px 10px 0px 0px",
                                                                                        cursor: "default",
                                                                                    }}
                                                                                >
                                                                                    Finalized
                                                                                </button>
                                                                                {(hasComponentPermission(
                                                                                    permissions,
                                                                                    365
                                                                                ) ||
                                                                                    hasComponentPermission(
                                                                                        permissions,
                                                                                        366
                                                                                    )) && (
                                                                                    <button>
                                                                                        <div className="btn-edit-user ">
                                                                                            <Tooltip
                                                                                                title="Edit"
                                                                                                onClick={() => (
                                                                                                    setEditPackagePopup(
                                                                                                        true
                                                                                                    ),
                                                                                                    setEditPackageData(
                                                                                                        item
                                                                                                    )
                                                                                                )}
                                                                                            >
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    classname="svg-edit"
                                                                                                    height="1em"
                                                                                                    viewBox="0 0 512 512"
                                                                                                >
                                                                                                    <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                                                                                                </svg>
                                                                                            </Tooltip>
                                                                                        </div>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })
                                ) : (
                                    <div className="col-md-12">
                                        <div className="packages-details text-center">
                                            <p className="mb-0">No data available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {!isPackageFinalized &&
                    (hasComponentPermission(permissions, 365) ||
                        hasComponentPermission(permissions, 366)) && (
                        <>
                            <div className="card">
                                <div className="card-body">
                                    <div className="basic-form">
                                        <div
                                            className="card-header pt-0"
                                            style={{ paddingLeft: "0" }}
                                        >
                                            <div className="card-title h5">Packages Details</div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-2">
                                                    <label className="form-label d-flex align-items-center  p-1">
                                                        Add New Packages
                                                    </label>

                                                    <div className="custom-file-upload">
                                                        <input
                                                            type="file"
                                                            id="file-upload"
                                                            className="file-input"
                                                            name="myfile"
                                                            onChange={async (e) => {
                                                                const selectedFile =
                                                                    e.target.files[0];
                                                                const fileLink = await getFileLink(
                                                                    selectedFile
                                                                );
                                                            }}
                                                            hidden
                                                        />
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="custom-file-label"
                                                        >
                                                            {isUploadingPDF
                                                                ? "Uploading PDF..."
                                                                : "  Upload PDF"}
                                                        </label>
                                                        <span id="file-chosen">
                                                            {packageUploaded && fileNameToDisplay
                                                                ? fileNameToDisplay
                                                                : " No file chosen"}
                                                        </span>
                                                    </div>
                                                    {/* <Link className="btn btn-warning btn-sm btn-follow pdf-btn" style={{height:"32px", margin:"0 10px 0 0"}} >Upload PDF</Link> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="package-row">
                                                    <div className="mb-2 ">
                                                        <label className="form-label d-flex align-items-center  p-1">
                                                            Adults
                                                            <span className="error-star">*</span>
                                                        </label>
                                                        <div
                                                            className="input-group"
                                                            style={{ gap: "7px" }}
                                                        >
                                                            <div className="input-group-addon">
                                                                ₹
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="form-control form-view"
                                                                name="adult"
                                                                onChange={
                                                                    packageValidation.handleChange
                                                                }
                                                                onBlur={
                                                                    packageValidation.handleBlur
                                                                }
                                                                value={
                                                                    packageValidation.values.adult
                                                                }
                                                            />
                                                        </div>
                                                        {packageValidation.touched.adult &&
                                                        packageValidation.errors.adult ? (
                                                            <span className="error">
                                                                {packageValidation.errors.adult}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-2  ">
                                                        <label className="form-label d-flex align-items-center p-1">
                                                            Extra Bed
                                                            <span className="error-star">*</span>
                                                        </label>
                                                        <div
                                                            className="input-group"
                                                            style={{ gap: "7px" }}
                                                        >
                                                            <div className="input-group-addon">
                                                                ₹
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="form-control form-view"
                                                                name="extraBed"
                                                                onChange={
                                                                    packageValidation.handleChange
                                                                }
                                                                onBlur={
                                                                    packageValidation.handleBlur
                                                                }
                                                                value={
                                                                    packageValidation.values
                                                                        .extraBed
                                                                }
                                                            />
                                                        </div>
                                                        {packageValidation.touched.extraBed &&
                                                        packageValidation.errors.extraBed ? (
                                                            <span className="error">
                                                                {packageValidation.errors.extraBed}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="form-label d-flex align-items-center  p-1">
                                                            Child Without Bed
                                                            <span className="error-star">*</span>
                                                        </label>
                                                        <div
                                                            className="input-group"
                                                            style={{ gap: "7px" }}
                                                        >
                                                            <div className="input-group-addon">
                                                                ₹
                                                            </div>
                                                            <input
                                                                type="number"
                                                                className="form-control form-view"
                                                                name="childWithout"
                                                                onChange={
                                                                    packageValidation.handleChange
                                                                }
                                                                onBlur={
                                                                    packageValidation.handleBlur
                                                                }
                                                                value={
                                                                    packageValidation.values
                                                                        .childWithout
                                                                }
                                                            />
                                                        </div>
                                                        {packageValidation.touched.childWithout &&
                                                        packageValidation.errors.childWithout ? (
                                                            <span className="error">
                                                                {
                                                                    packageValidation.errors
                                                                        .childWithout
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div
                                                        className="mb-2"
                                                        style={{ marginTop: "38px" }}
                                                    >
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-submit"
                                                            disabled={
                                                                isUploadingPDF ||
                                                                isPackageSubmitting
                                                            }
                                                        >
                                                            {isPackageSubmitting
                                                                ? "Submitting..."
                                                                : "Submit"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
            </form>
        </>
    );
};
export default Journeyct;
