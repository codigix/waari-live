import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { post } from "../../../../services/apiServices";
import axios from "axios";
import { useSelector } from "react-redux";
import { hasComponentPermission } from "../../../auth/PrivateRoute";

function EditPackageDataPopup({
    editPackageData,
    onClose,
    enquiryId,
    getPackageList,
}) {
    const { token, permissions } = useSelector((state) => state.auth);
    const [isPackageSubmitting, setIsPackageSubmitting] = useState(false);


    //   upload thumbnail file start
    const url = import.meta.env.VITE_WAARI_BASEURL;
    const [isUploadingPDF, setIsUploadingPDF] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileNameToDisplay, setFileNameToDisplay] = useState("");


    const packageValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            adult: editPackageData?.adult || "",
            extraBed: editPackageData?.extraBed,
            childWithout: editPackageData?.childWithout,
        },
        validationSchema: Yup.object({
            adult: Yup.string().required("Please Enter Amount"),
            extraBed: Yup.string().required("Please Enter Amount"),
            childWithout: Yup.string().required("Please Enter Amount"),
        }),
        onSubmit: async (values, { resetForm }) => {
            let data = {
                enquiryCustomId: enquiryId,
                packageCustomId: editPackageData.packageCustomId,
                package: fileName || editPackageData.package,
                adult: values.adult,
                extraBed: values.extraBed,
                childWithout: values.childWithout,
            };
            try {
                setIsPackageSubmitting(true);
                const response = await post(`/update-package-data`, data);
                toast.success(response?.data?.message);
                onClose();
                resetForm();
                setIsPackageSubmitting(false);
                (hasComponentPermission(permissions, 365)  || hasComponentPermission(permissions, 366)) && getPackageList();
            } catch (error) {
                setIsPackageSubmitting(false);
                console.log(error);
            }
        },
    });

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
            setFileName(responseData?.data?.pdf);
            setIsUploadingPDF(false);
            return responseData?.data?.pdf;
        } catch (error) {
            setIsUploadingPDF(false);
            console.log(error);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <form
                    className="basic-form needs-validation"
                    onSubmit={(e) => {
                        e.preventDefault();
                        packageValidation.handleSubmit();
                        return false;
                    }}
                >
                    <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                        <div className="card-title h5">Edit Packages Details</div>
                        <button
                            onClick={() => onClose()}
                            type="button"
                            className="border p-2 font-bold text-red"
                        >
                            X
                        </button>
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
                                            const selectedFile = e.target.files[0];
                                            const fileLink = await getFileLink(selectedFile);
                                        }}
                                        hidden
                                    />
                                    <label htmlFor="file-upload" className="custom-file-label">
                                        {isUploadingPDF ? "Uploading PDF..." : "  Upload PDF"}
                                    </label>
                                    <span id="file-chosen">
                                        {fileNameToDisplay ? fileNameToDisplay : " No file chosen"}
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
                                        Adults<span className="error-star">*</span>
                                    </label>
                                    <div className="input-group" style={{ gap: "7px" }}>
                                        <div className="input-group-addon">₹</div>
                                        <input
                                            type="number"
                                            className="form-control form-view"
                                            name="adult"
                                            onChange={packageValidation.handleChange}
                                            onBlur={packageValidation.handleBlur}
                                            value={packageValidation.values.adult}
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
                                    <div className="input-group" style={{ gap: "7px" }}>
                                        <div className="input-group-addon">₹</div>
                                        <input
                                            type="number"
                                            className="form-control form-view"
                                            name="extraBed"
                                            onChange={packageValidation.handleChange}
                                            onBlur={packageValidation.handleBlur}
                                            value={packageValidation.values.extraBed}
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
                                    <div className="input-group" style={{ gap: "7px" }}>
                                        <div className="input-group-addon">₹</div>
                                        <input
                                            type="number"
                                            className="form-control form-view"
                                            name="childWithout"
                                            onChange={packageValidation.handleChange}
                                            onBlur={packageValidation.handleBlur}
                                            value={packageValidation.values.childWithout}
                                        />
                                    </div>
                                    {packageValidation.touched.childWithout &&
                                    packageValidation.errors.childWithout ? (
                                        <span className="error">
                                            {packageValidation.errors.childWithout}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="mb-2" style={{ marginTop: "38px" }}>
                                <div className="col-lg-12 d-flex justify-content-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-submit"
                                        disabled={isUploadingPDF || isPackageSubmitting}
                                    >
                                        {isPackageSubmitting ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPackageDataPopup;
