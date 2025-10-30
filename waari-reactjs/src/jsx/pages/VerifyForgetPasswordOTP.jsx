import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Image
import loginbg from "../../images/pic1.png";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyForgetPasswordOTP() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const { state } = useLocation();
    const email = state.email;

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },

        validationSchema: Yup.object({
            otp: Yup.string()
                .required("OTP is required")
                .length(6, "OTP must be 6 digits"),
            newPassword: Yup.string()
                .required("New password is required")
                .min(6, "Password must be at least 6 characters"),
            confirmPassword: Yup.string()
                .required("Please confirm your password")
                .oneOf(
                    [Yup.ref("newPassword"), null],
                    "Passwords must match"
                ),
        }),

        onSubmit: async (values) => {
            try {
                const data = {
                    email: email , // Use email from props or state
                    otp: values.otp,
                    newPassword: values.newPassword,
                };

                setIsLoading(true);
                const response = await post(`/verify-forget-password-otp`, data);

                toast.success(response.data.message);
                navigate("/login")
                // Redirect or show success confirmation
            } catch (error) {
                console.error(error?.response?.data?.message);
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
            <div className="login-aside text-center  d-flex flex-column flex-row-auto">
                <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
                    <div className="text-center mb-4 pt-5">
                        <img
                            src={import.meta.env.VITE_WAARI_LOGO_PATH}
                            alt=""
                            className="login-logo"
                        />
                    </div>
                    <h3 className="mb-2">Welcome back!</h3>
                </div>
                <div
                    className="aside-image"
                    style={{ backgroundImage: "url(" + loginbg + ")" }}
                ></div>
            </div>
            <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
                <div className="d-flex justify-content-center h-100 align-items-center">
                    <div className="authincation-content style-2">
                        <div className="row no-gutters">
                            <div className="col-xl-12 tab-content">
                                <div
                                    id="verify-otp"
                                    className="auth-form form-validation"
                                >
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                        className="login-form shadow-md rounded-lg mb-4"
                                    >
                                        <h3 className="text-center mb-4 text-black">
                                            Verify OTP & Reset Password
                                        </h3>

                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-otp"
                                            >
                                                <strong>OTP</strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="otp"
                                                className="form-control"
                                                placeholder="Enter OTP"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.otp}
                                            />
                                            {validation.touched.otp &&
                                            validation.errors.otp ? (
                                                <span className="error">
                                                    {validation.errors.otp}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-new-password"
                                            >
                                                <strong>New Password</strong>
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                className="form-control"
                                                placeholder="Enter New Password"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.newPassword}
                                            />
                                            {validation.touched.newPassword &&
                                            validation.errors.newPassword ? (
                                                <span className="error">
                                                    {validation.errors.newPassword}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="form-group mb-3">
                                            <label
                                                className="mb-1"
                                                htmlFor="val-confirm-password"
                                            >
                                                <strong>Confirm Password</strong>
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.confirmPassword}
                                            />
                                            {validation.touched.confirmPassword &&
                                            validation.errors.confirmPassword ? (
                                                <span className="error">
                                                    {validation.errors.confirmPassword}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="text-center form-group mb-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-submit btn-block"
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? "Verifying..."
                                                    : "Verify & Reset"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyForgetPasswordOTP;
