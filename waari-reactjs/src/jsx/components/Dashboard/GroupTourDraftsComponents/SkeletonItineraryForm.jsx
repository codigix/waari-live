import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_WAARI_BASEURL;

const skeletonItineraryObj = {
    destination: "",
    overnightAt: "",
    hotelName: "",
    hotelAddress: "",
};

function formatIternaryDate(date, index) {
    const currentDate = new Date(date);
    currentDate.setDate(Number(currentDate.getDate()) + index); // Calculate date based on the index
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;
    return formattedDate;
}


const SkeletonIternaryForm = ({
    groupTourId,
    tourdurationdays,
    toursData,
    dayDifference,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const skeletonValidationSchema = Yup.object().shape({
        itinerarydate: Yup.array().of(
			Yup.object().shape({
				destination: Yup.string().required("Destination is required"),
				overnightAt: Yup.string().required("Overnight At is required"),
				hotelName: Yup.string().required("Hotel Name is required"),
				hotelAddress: Yup.string().required("Hotel Address is required"),
			})
		),
    });

    console.log("toursData", toursData)
    
    const formik = useFormik({
        initialValues: {
            itinerarydate: [],
        },
        validationSchema: skeletonValidationSchema,
        onSubmit: async (values) => {
            const itinerarydate = values.itinerarydate.map((item, index) => {
                return {
                    ...item,
                    date: formatIternaryDate(toursData.startDate, index),
                };
            });

            let data = {
                groupTourId: groupTourId,
                skeletonInteriory: itinerarydate,
            };
            try {
                setIsSubmitting(true);
                const response = await post(
                    `add-skeleton-details`,
                    data
                );
                setIsSubmitting(false);
                toast.success(response?.data?.message);
            } catch (error) {
                setIsSubmitting(false);
                console.log(error);
            }
        },
    });

    const addDetailsItenerary = (dayDifference) => {
        formik.setFieldValue(
            "itinerarydate",
            Array.from({ length: dayDifference }, () => ({
                ...skeletonItineraryObj,
            }))
        );
    };

    useEffect(() => {
        formik.values.itinerarydate.forEach((item, index) => {
            const textarea5 = document.getElementById(
                `itinerarydate[${index}].hotelAddress`
            );
            textarea5.addEventListener("input", function () {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
            });
        });
    }, [formik.values.itinerarydate]);


    // Initialize itinerary with data from props
    useEffect(() => {
        if (dayDifference) {
            addDetailsItenerary(dayDifference);
        }
        if (toursData?.skeletonItinerary?.length && dayDifference) {
            formik.setFieldValue("itinerarydate", toursData.skeletonItinerary);
        }
    }, [dayDifference, toursData]);

    
    console.log("formikVlues", formik.values)
    console.log("formikErrors", formik.errors)

    return (
        <form className="card">
            <div className="card-body">
                <div className="row"></div>

                {tourdurationdays &&
                    tourdurationdays > 0 && (
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="skeleton mb-2">
                                            <div
                                                className="card-header pb-2 pt-2"
                                                style={{
                                                    paddingLeft: "0px",
                                                }}
                                            >
                                                <div className="card-title h5">
                                                    Skeleton Itinerary
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered   table-responsive-sm table-tour table-gt">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "10%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Day
                                                                <span></span>
                                                            </th>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "10%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Date
                                                                <span></span>
                                                            </th>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "20%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Journey/Destination
                                                            </th>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "20%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Overnight at
                                                            </th>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "20%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Hotel Name
                                                            </th>
                                                            <th
                                                                className=""
                                                                style={{
                                                                    width: "20%",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Hotel Address
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-600">
                                                        {formik.values.itinerarydate?.map(
                                                            (item, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-6 py-2  ">
                                                                        Day{" "}
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td className="px-6 py-2  ">
                                                                        {formatIternaryDate(
                                                                            toursData
                                                                                .startDate,
                                                                            index
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-2  ">
                                                                        <input
                                                                            type="text"
                                                                            id={`itinerarydate[${index}].destination`}
                                                                            name={`itinerarydate[${index}].destination`}
                                                                            className="form-control"
                                                                            value={
                                                                                item.destination
                                                                            }
                                                                            onChange={
                                                                                formik.handleChange
                                                                            }
                                                                        />
                                                                        {formik
                                                                            .touched
                                                                            .itinerarydate &&
                                                                            formik
                                                                                .touched
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.destination &&
                                                                            formik.errors &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.destination && (
                                                                                <span className="error">
                                                                                    {
                                                                                        formik
                                                                                            .errors
                                                                                            .itinerarydate[
                                                                                            index
                                                                                        ]
                                                                                            .destination
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </td>
                                                                    <td className="px-6 py-2  ">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id={`itinerarydate[${index}].overnightAt`}
                                                                            name={`itinerarydate[${index}].overnightAt`}
                                                                            value={
                                                                                item.overnightAt
                                                                            }
                                                                            onChange={
                                                                                formik.handleChange
                                                                            }
                                                                        />
                                                                        {formik
                                                                            .touched
                                                                            .itinerarydate &&
                                                                            formik
                                                                                .touched
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.overnightAt &&
                                                                            formik.errors &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.overnightAt && (
                                                                                <span className="error">
                                                                                    {
                                                                                        formik
                                                                                            .errors
                                                                                            .itinerarydate[
                                                                                            index
                                                                                        ]
                                                                                            .overnightAt
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </td>
                                                                    <td className="px-6 py-2  ">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id={`itinerarydate[${index}].hotelName`}
                                                                            name={`itinerarydate[${index}].hotelName`}
                                                                            value={
                                                                                item.hotelName
                                                                            }
                                                                            onChange={
                                                                                formik.handleChange
                                                                            }
                                                                        />
                                                                        {formik
                                                                            .touched
                                                                            .itinerarydate &&
                                                                            formik
                                                                                .touched
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.hotelName &&
                                                                            formik.errors &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.hotelName && (
                                                                                <span className="error">
                                                                                    {
                                                                                        formik
                                                                                            .errors
                                                                                            .itinerarydate[
                                                                                            index
                                                                                        ]
                                                                                            .hotelName
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </td>
                                                                    <td className="px-6 py-2  ">
                                                                        <textarea
                                                                            type="text"
                                                                            className="textarea"
                                                                            id={`itinerarydate[${index}].hotelAddress`}
                                                                            name={`itinerarydate[${index}].hotelAddress`}
                                                                            value={
                                                                                item.hotelAddress
                                                                            }
                                                                            onChange={
                                                                                formik.handleChange
                                                                            }
                                                                        ></textarea>
                                                                        {formik
                                                                            .touched
                                                                            .itinerarydate &&
                                                                            formik
                                                                                .touched
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.hotelAddress &&
                                                                            formik.errors &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate &&
                                                                            formik
                                                                                .errors
                                                                                .itinerarydate[
                                                                                index
                                                                            ]
                                                                                ?.hotelAddress && (
                                                                                <span className="error">
                                                                                    {
                                                                                        formik
                                                                                            .errors
                                                                                            .itinerarydate[
                                                                                            index
                                                                                        ]
                                                                                            .hotelAddress
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
                            </div>
                        </div>
                    )}

                <div className="col-lg-12 d-flex justify-content-end mt-3">
                    <div className="d-flex">
                        <button
                            onClick={formik.handleSubmit}
                            type="submit"
                            className="btn btn-submit btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SkeletonIternaryForm;
