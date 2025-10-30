import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_WAARI_BASEURL;

const initalRoomSharingPriceValues = [
    {
        roomShareId: 1,
        roomShareName: "Adult Single Sharing",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 2,
        roomShareName: "Adult Double Sharing",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 3,
        roomShareName: "Adult Triple Sharing",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 4,
        roomShareName: "Child with Mattress (5-11)",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 5,
        roomShareName: "Child without Mattress (5-11)",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 6,
        roomShareName: "Child (2-4)",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 7,
        roomShareName: "Infant",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
    {
        roomShareId: 8,
        roomShareName: "Adult Quad Sharing",
        tourPrice: "",
        offerPrice: "",
        commissionPrice: "",
    },
];

const AddTourPriceDetailsForm = ({ groupTourId, toursData }) => {
    const skeletonValidationSchema = Yup.object().shape({
        roomsharingprice: Yup.array().of(
            Yup.object().shape({
                tourPrice: Yup.number().min(0).required("Tour Price is required"),
                offerPrice: Yup.number().min(0).required("Offer Price is required"),
                commissionPrice: Yup.number().required("Commision is required"),
            })
        )
    });

    const formik = useFormik({
        initialValues: {
            roomsharingprice: initalRoomSharingPriceValues,
        },
        validationSchema: skeletonValidationSchema,
        onSubmit: async (values, { setSubmitting }) => {

            let data = {
                groupTourId: groupTourId,
				roomsharingprice: values.roomsharingprice,
            };
            try {
                setSubmitting(true);
                const response = await post(`add-group-tour-price`, data);
                toast.success(response?.data?.message);
            } catch (error) {
                console.log(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
			if (toursData && toursData.tourPrice.length) {
                formik.setFieldValue("roomsharingprice", toursData.tourPrice);
            }

    }, [toursData])
    
    return (
        <form className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <div className="tourprice mb-2">
                            <div
                                className="card-header pb-2 pt-2"
                                style={{ paddingLeft: "0px" }}
                            >
                                <div className="card-title h5">
                                    Tour price and discounts
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-bordered table-responsive-sm table-tour table-gt">
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    width: "200px",
                                                    cursor: "default",
                                                }}
                                            >
                                                Room Sharing
                                            </th>
                                            <th
                                                style={{
                                                    width: "100px",
                                                    cursor: "default",
                                                }}
                                            >
                                                Tour Price
                                            </th>
                                            <th
                                                style={{
                                                    width: "100px",
                                                    cursor: "default",
                                                }}
                                            >
                                                Offer Price
                                            </th>
                                            <th
                                                style={{
                                                    width: "100px",
                                                    cursor: "default",
                                                }}
                                            >
                                                Sales Commision
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600">
                                        {formik.values.roomsharingprice.map(
                                            (room, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-2">
                                                        {room.roomShareName}
                                                    </td>
                                                    <td className="px-6 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            id={`roomsharingprice[${index}].tourPrice`}
                                                            name={`roomsharingprice[${index}].tourPrice`}
                                                            className="form-control"
                                                            value={
                                                                room.tourPrice
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                        />
                                                        {formik.touched
                                                            .roomsharingprice &&
                                                            formik.touched
                                                                .roomsharingprice[
                                                                index
                                                            ]?.tourPrice &&
                                                            formik.errors &&
                                                            formik.errors
                                                                .roomsharingprice &&
                                                            formik.errors
                                                                .roomsharingprice[
                                                                index
                                                            ]?.tourPrice && (
                                                                <span className="error">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .roomsharingprice[
                                                                            index
                                                                        ]
                                                                            .tourPrice
                                                                    }
                                                                </span>
                                                            )}
                                                    </td>
                                                    <td className="px-6 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            id={`roomsharingprice[${index}].offerPrice`}
                                                            name={`roomsharingprice[${index}].offerPrice`}
                                                            className="form-control"
                                                            value={
                                                                room.offerPrice
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                        />
                                                        {formik.touched
                                                            .roomsharingprice &&
                                                            formik.touched
                                                                .roomsharingprice[
                                                                index
                                                            ]?.offerPrice &&
                                                            formik.errors &&
                                                            formik.errors
                                                                .roomsharingprice &&
                                                            formik.errors
                                                                .roomsharingprice[
                                                                index
                                                            ]?.offerPrice && (
                                                                <span className="error">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .roomsharingprice[
                                                                            index
                                                                        ]
                                                                            .offerPrice
                                                                    }
                                                                </span>
                                                            )}
                                                    </td>
                                                    <td className="px-6 py-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            id={`roomsharingprice[${index}].commissionPrice`}
                                                            name={`roomsharingprice[${index}].commissionPrice`}
                                                            className="form-control"
                                                            value={
                                                                room.commissionPrice
                                                            }
                                                            onChange={
                                                                formik.handleChange
                                                            }
                                                        />
                                                        {formik.touched
                                                            .roomsharingprice &&
                                                            formik.touched
                                                                .roomsharingprice[
                                                                index
                                                            ]
                                                                ?.commissionPrice &&
                                                            formik.errors &&
                                                            formik.errors
                                                                .roomsharingprice &&
                                                            formik.errors
                                                                .roomsharingprice[
                                                                index
                                                            ]
                                                                ?.commissionPrice && (
                                                                <span className="error">
                                                                    {
                                                                        formik
                                                                            .errors
                                                                            .roomsharingprice[
                                                                            index
                                                                        ]
                                                                            .commissionPrice
                                                                    }
                                                                </span>
                                                            )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 d-flex justify-content-end mt-3">
                    <div className="d-flex">
                        <button
                            onClick={formik.handleSubmit}
                            type="submit"
                            className="btn btn-submit btn-primary"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddTourPriceDetailsForm;
