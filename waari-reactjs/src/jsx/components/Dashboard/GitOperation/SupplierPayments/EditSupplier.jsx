import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import { scrollIntoViewHelper } from "../../../../utils/scrollIntoViewHelper";
import BackButton from "../../../common/BackButton";

const validationSchema = Yup.object().shape({
    supplierName: Yup.string()
        .trim()
        .required("Supplier Name is required")
        .min(2, "Supplier Name must be at least 2 characters long")
        .max(50, "Supplier Name cannot exceed 50 characters"), // Adjusted max length
    type: Yup.string()
        .trim()
        .required("Type is required")
        .min(2, "Type must be at least 2 characters long")
        .max(50, "Type cannot exceed 50 characters"), // Adjusted max length
    total: Yup.number()
        .required("Total is required")
        .positive("Total must be a positive number")
        .min(1, "Total must be at least 1"), // Enforcing positive value
    paymentDetails: Yup.array()
        .of(Yup.number().positive("Payment must be a positive number")) // Array of positive numbers
        .required("Payment Details are required")
        .min(1, "At least one payment detail is required"), // Ensures there is at least one payment detail
    balance: Yup.number()
        .required("Balance is required")
        .positive("Balance must be a positive number")
        .min(0, "Balance cannot be less than 0"), // Enforcing non-negative balance
});

const EditSupplier = ({ editId, handleSucessEdit }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            supplierName: "", // Added for supplier name
            type: "", // Added for type
            total: "", // Added for total
            paymentDetails: [""], // New array to hold payment details
            balance: "", // Added for balance
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                const result = await post(`update-gt-supplier-payments-details`, {
                    ...values,
                    supplierPaymentId: editId,
                });
                toast.success(result?.data?.message);
                handleSucessEdit(true);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    const handleAddPayment = () => {
        formik.setFieldValue("paymentDetails", [...formik.values.paymentDetails, ""]); // Add new empty payment field
    };

    const handlePaymentDetailChange = (e, index) => {
        const updatedPaymentDetails = [...formik.values.paymentDetails];
        updatedPaymentDetails[index] = e.target.value; // Update the value of the corresponding payment field
        formik.setFieldValue("paymentDetails", updatedPaymentDetails); // Set updated values in Formik state
    };

    const handleRemovePayment = (index) => {
        const updatedPaymentDetails = formik.values.paymentDetails.filter((_, i) => i !== index); // Remove the payment detail at the given index
        formik.setFieldValue("paymentDetails", updatedPaymentDetails); // Update the paymentDetails array
    };
    const getData = async () => {
        try {
            const result = await get(
                `edit-gt-supplier-payments-details?supplierPaymentId=${editId}`
            );

            // Parse paymentDetails if it's a string and set the formik values
            const data = result?.data?.data;
            if (data?.paymentDetails) {
                // Parse the paymentDetails string to an array
                data.paymentDetails = JSON.parse(data.paymentDetails);
            }

            formik.setValues(data); // Set the parsed data to formik
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, [editId]);

    useEffect(() => {
        let element = document.getElementById("git-operation-tours-list");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' className to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' className to the element when change to another page
            }
        };
    }, []);

    useEffect(() => {
        if (!formik.isSubmitting) {
            if (Object.keys(formik.errors).length) {
                scrollIntoViewHelper(formik.errors);
            }
        }
    }, [formik.isSubmitting]);

    // Auto-calculate balance
    useEffect(() => {
        const totalPayments = formik.values.paymentDetails.reduce((sum, payment) => {
            return sum + (parseFloat(payment) || 0); // Convert to number, default to 0 if invalid
        }, 0);

        const balance = (parseFloat(formik.values.total) || 0) - totalPayments;
        formik.setFieldValue("balance", balance.toFixed(2)); // Update balance field
    }, [formik.values.total, formik.values.paymentDetails]);

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header mb-2 p-0">
                                <div className="card-title h5">Edit Supplier</div>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="needs-validation">
                                <div className="row">
                                    {/* Supplier Name */}
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Supplier Name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="supplierName"
                                                name="supplierName"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.supplierName}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"supplierName"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Type<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="type"
                                                name="type"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.type}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"type"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Total Amount<span className="error-star">*</span>
                                            </label>
                                            <input
                                                id="total"
                                                name="total"
                                                type="number"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.total}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"total"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    {/* Dynamic Payment Details */}
                                    {formik.values.paymentDetails.map((payment, index) => (
                                        <div
                                            key={index}
                                            className="col-md-6 col-lg-4 col-sm-6 col-12"
                                        >
                                            <div className="row pe-3">

                                                <label>
                                                    Advance Payment {index + 1}
                                                    <span className="error-star">*</span>
                                                </label>
                                                <div className="col-11 ">
                                                    <input
                                                        id={`paymentDetails.${index}`}
                                                        name={`paymentDetails[${index}]`}
                                                        type="number"
                                                        className="form-control"
                                                        onChange={(e) =>
                                                            handlePaymentDetailChange(e, index)
                                                        }
                                                        value={
                                                            formik.values.paymentDetails[index] || ""
                                                        }
                                                    />
                                                    <ErrorMessageComponent
                                                        errors={formik.errors}
                                                        fieldName={`paymentDetails[${index}]`}
                                                        touched={formik.touched}
                                                    />
                                                </div>
                                                {formik.values.paymentDetails.length > 1 &&
                                                    index !== 0 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm col-1 "
                                                            onClick={() =>
                                                                handleRemovePayment(index)
                                                            }
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Payment Detail Button */}
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12 d-flex align-items-center justify-content-center mt-4 ">
                                        <button
                                            type="button"
                                            className="btn btn-save btn-primary "
                                            onClick={handleAddPayment}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="1em"
                                                fill="#07"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                            </svg>
                                            Add Payment
                                        </button>
                                    </div>

                                    {/* Balance */}
                                    <div className="col-md-6 col-lg-4 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>Balance</label>
                                            <input
                                                id="balance"
                                                name="balance"
                                                type="number"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.balance}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"balance"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Back and Submit buttons */}
                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <Link
                                        to={`/${"git-operation-tours-list"}`}
                                        type="button"
                                        className="btn btn-back"
                                    >
                                        Back
                                    </Link>
                                    <div className="d-flex">
                                        <button
                                            type="submit"
                                            className="btn btn-submit btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default EditSupplier;
