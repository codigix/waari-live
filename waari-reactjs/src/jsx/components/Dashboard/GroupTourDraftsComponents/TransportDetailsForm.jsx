import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
const url = import.meta.env.VITE_WAARI_BASEURL;

const TransportDetailsForm = ({
  groupTourId,
  toursData,
  destinationId,
  departureTypeId,
}) => {
  //   const skeletonValidationSchema = Yup.object().shape({
  //     flights: Yup.array().when("departure", {
  //       is: (departure) => departureTypeId == "1",
  //       then: Yup.array().of(
  //         Yup.object().shape({
  //           flight: Yup.string(),
  //           airline: Yup.string(),
  //           class: Yup.string(),
  //           from: Yup.string(),
  //           fromDate: Yup.string(),
  //           fromTime: Yup.string(),
  //           to: Yup.string(),
  //           toDate: Yup.string(),
  //           toTime: Yup.string(),
  //           weight: Yup.string(),
  //         })
  //       ),
  //       otherwise: Yup.array().of(
  //         Yup.object().shape({
  //           flight: Yup.string().required("Flight is required"),
  //           airline: Yup.string().required("Airline is required"),
  //           class: Yup.string().required("Class is required"),
  //           from: Yup.string()
  //             .required("From is required")
  //             .matches(
  //               /^[a-zA-Z\s]+$/,
  //               "From must contain only letters and spaces"
  //             ),
  //           fromDate: Yup.string().required("From Date is required"),
  //           fromTime: Yup.string().required("From Time is required"),
  //           to: Yup.string()
  //             .required("To is required")
  //             .matches(
  //               /^[a-zA-Z\s]+$/,
  //               "To must contain only letters and spaces"
  //             ),
  //           toDate: Yup.string().required("To Date is required"),
  //           toTime: Yup.string().required("To Time is required"),
  //           weight: Yup.string().required("Weight is required"),
  //         })
  //       ),
  //     }),
  //     trains: Yup.array().of(
  //       Yup.object().shape({
  //         trainNo: Yup.string().required("Train Number is required"),
  //         trainName: Yup.string().required("Train Name is required"),
  //         from: Yup.string()
  //           .required("From is required")
  //           .matches(
  //             /^[a-zA-Z\s]+$/,
  //             "From must contain only letters and spaces"
  //           ),
  //         fromDate: Yup.string().required("From Date is required"),
  //         fromTime: Yup.string().required("From Time is required"),
  //         to: Yup.string()
  //           .required("To is required")
  //           .matches(/^[a-zA-Z\s]+$/, "To must contain only letters and spaces"),
  //         toDate: Yup.string().required("To Date is required"),
  //         toTime: Yup.string().required("To Time is required"),
  //       })
  //     ),

  //     visaDocuments: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Visa Documents"),
  //       otherwise: Yup.string(),
  //     }),

  //     visaFee: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Visa Fees"),
  //       otherwise: Yup.string(),
  //     }),

  //     visaInstruction: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Visa Instructions"),
  //       otherwise: Yup.string(),
  //     }),

  //     visaAlerts: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Visa Alerts"),
  //       otherwise: Yup.string(),
  //     }),

  //     insuranceDetails: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Insurance Details"),
  //       otherwise: Yup.string(),
  //     }),

  //     euroTrainDetails: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The Euro Train Details"),
  //       otherwise: Yup.string(),
  //     }),

  //     nriOriForDetails: Yup.string().when("destination", {
  //       is: (destination) => destinationId == "2",
  //       then: Yup.string().required("Enter The NRI/OCI/Foreign Details"),
  //       otherwise: Yup.string(),
  //     }),
  //     startCity: Yup.string().required("Enter The Start City"),
  //     pickUpMeetTime: Yup.string().required("Enter the Pickup Meet Time"),
  //     endCity: Yup.string().required("Enter The End City"),
  //     dropOffPoint: Yup.string().required("Enter the Dropoff Point"),
  //     pickUpMeet: Yup.string().required("Enter The PickUp Meet"),
  //     arriveBefore: Yup.string().required("Enter the Arrive Before"),
  //     dropOffTime: Yup.string().required("Enter The DropOff Time"),
  //     bookAfter: Yup.string().required("Enter the Book After"),
  //   });

  const skeletonValidationSchema = Yup.object().shape({
    flights: Yup.array().of(
      Yup.object().shape({
        flight: Yup.string().nullable(),
        airline: Yup.string().nullable(),
        class: Yup.string().nullable(),
        from: Yup.string().nullable(),
        fromDate: Yup.string().nullable(),
        fromTime: Yup.string().nullable(),
        to: Yup.string().nullable(),
        toDate: Yup.string().nullable(),
        toTime: Yup.string().nullable(),
        weight: Yup.string().nullable(),
      })
    ),

    trains: Yup.array().of(
      Yup.object().shape({
        trainNo: Yup.string().nullable(),
        trainName: Yup.string().nullable(),
        from: Yup.string().nullable(),
        fromDate: Yup.string().nullable(),
        fromTime: Yup.string().nullable(),
        to: Yup.string().nullable(),
        toDate: Yup.string().nullable(),
        toTime: Yup.string().nullable(),
      })
    ),

    visaDocuments: Yup.string().nullable(),
    visaFee: Yup.string().nullable(),
    visaInstruction: Yup.string().nullable(),
    visaAlerts: Yup.string().nullable(),
    insuranceDetails: Yup.string().nullable(),
    euroTrainDetails: Yup.string().nullable(),
    nriOriForDetails: Yup.string().nullable(),

    startCity: Yup.string().nullable(),
    pickUpMeetTime: Yup.string().nullable(),
    endCity: Yup.string().nullable(),
    dropOffPoint: Yup.string().nullable(),
    pickUpMeet: Yup.string().nullable(),
    arriveBefore: Yup.string().nullable(),
    dropOffTime: Yup.string().nullable(),
    bookAfter: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      flights: [
        {
          journey: "Onward",
          flight: "",
          airline: "",
          class: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
          weight: "",
        },
        {
          journey: "Return",
          flight: "",
          airline: "",
          class: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
          weight: "",
        },
      ],
      trains: [
        {
          journey: "Onwards",
          trainNo: "",
          trainName: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
        },
        {
          journey: "Returns",
          trainNo: "",
          trainName: "",
          from: "",
          fromDate: "",
          fromTime: "",
          to: "",
          toDate: "",
          toTime: "",
        },
      ],

      visaDocuments: "",
      visaFee: "",
      visaInstruction: "",
      visaAlerts: "",
      insuranceDetails: "",
      euroTrainDetails: "",
      nriOriForDetails: "",

      startCity: "",
      pickUpMeetTime: "",
      endCity: "",
      dropOffPoint: "",
      pickUpMeet: "",
      arriveBefore: "",
      dropOffTime: "",
      bookAfter: "",
    },
    validationSchema: skeletonValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const newObject = {
        startCity: values.startCity,
        pickUpMeet: values.pickUpMeet,
        pickUpMeetTime: values.pickUpMeetTime,
        arriveBefore: values.arriveBefore,
        endCity: values.endCity,
        dropOffPoint: values.dropOffPoint,
        dropOffTime: values.dropOffTime,
        bookAfter: values.bookAfter,
      };

      const updatedArray = [newObject];

      let data = {
        groupTourId: groupTourId,
        traindetails: values.trains,
        flightdetails: departureTypeId == "1" ? [] : values.flights,
        d2dtime: updatedArray,
        visaDocuments: values.visaDocuments,
        visaFee: values.visaFee,
        visaInstruction: values.visaInstruction,
        visaAlerts: values.visaAlerts,
        insuranceDetails: values.insuranceDetails,
        euroTrainDetails: values.euroTrainDetails,
        nriOriForDetails: values.nriOriForDetails,
      };
      try {
        setSubmitting(true);
        const response = await post(`add-travel-details`, data);
        toast.success(response?.data?.message);
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  console.log("departureTypeId", departureTypeId);

  useEffect(() => {
    if (toursData) {
      if (toursData.flightDetails?.length)
        formik.setFieldValue("flights", toursData.flightDetails);
      if (toursData.trainDetails?.length)
        formik.setFieldValue("trains", toursData.trainDetails);

      if (toursData.dtod?.length) {
        formik.setFieldValue("startCity", toursData.dtod[0].startCity || "");
        formik.setFieldValue(
          "pickUpMeetTime",
          toursData.dtod[0].pickUpMeetTime || ""
        );
        formik.setFieldValue("endCity", toursData.dtod[0].endCity || "");
        formik.setFieldValue(
          "dropOffPoint",
          toursData.dtod[0].dropOffPoint || ""
        );
        formik.setFieldValue("pickUpMeet", toursData.dtod[0].pickUpMeet || "");
        formik.setFieldValue(
          "arriveBefore",
          toursData.dtod[0].arriveBefore || ""
        );
        formik.setFieldValue(
          "dropOffTime",
          toursData.dtod[0].dropOffTime || ""
        );
        formik.setFieldValue("bookAfter", toursData.dtod[0].bookAfter || "");
      }

      formik.setFieldValue("visaDocuments", toursData.visaDocuments || "");
      formik.setFieldValue("visaFee", toursData.visaFee || "");
      formik.setFieldValue("visaInstruction", toursData.visaInstruction || "");
      formik.setFieldValue("visaAlerts", toursData.visaAlerts || "");
      formik.setFieldValue(
        "insuranceDetails",
        toursData.insuranceDetails || ""
      );
      formik.setFieldValue(
        "euroTrainDetails",
        toursData.euroTrainDetails || ""
      );
      formik.setFieldValue(
        "nriOriForDetails",
        toursData.nriOriForDetails || ""
      );
    }
  }, [toursData]);

  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);

  return (
    <form>
      {formik.values.tourdurationdays && formik.values.tourdurationdays > 0 && (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="detailsitinerary mb-2">
                  <div
                    className="card-header pb-2 pt-2"
                    style={{ paddingLeft: "0" }}
                  >
                    <div className="card-title h5">
                      Website Detailed Itinerary Images
                    </div>
                  </div>
                  {formik.values.grouptouritineraryimages?.map(
                    (item, index) => (
                      <div key={index} className="mb-2 row">
                        <div className="col-md-12">
                          <div className="row mb-3">
                            <div
                              className="col-md-5"
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div className="mb-0">
                                <label
                                  style={{
                                    color: "#024670",
                                    fontWeight: "600",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Day {index + 1}:
                                </label>
                              </div>
                            </div>
                          </div>
                          {item.grouptouritineraryimagesList?.map(
                            (subItem, subIndex) => (
                              <div key={subIndex} className="row">
                                <div className="col-md-4 col-sm-6 col-lg-3">
                                  <div className="form-group mb-2">
                                    <label>Experience Name</label>
                                    <input
                                      type="text"
                                      className="form-control me-2"
                                      name={`grouptouritineraryimages[${index}].grouptouritineraryimagesList[${subIndex}].itineraryImageName`}
                                      onChange={formik.handleChange}
                                      value={subItem.itineraryImageName}
                                    />
                                    {formik.touched.grouptouritineraryimages &&
                                      formik.touched.grouptouritineraryimages[
                                        index
                                      ]?.grouptouritineraryimagesList &&
                                      formik.touched.grouptouritineraryimages[
                                        index
                                      ].grouptouritineraryimagesList[subIndex]
                                        ?.itineraryImageName &&
                                      formik.errors.grouptouritineraryimages &&
                                      formik.errors.grouptouritineraryimages[
                                        index
                                      ]?.grouptouritineraryimagesList &&
                                      formik.errors.grouptouritineraryimages[
                                        index
                                      ].grouptouritineraryimagesList[subIndex]
                                        ?.itineraryImageName && (
                                        <span className="error">
                                          {
                                            formik.errors
                                              .grouptouritineraryimages[index]
                                              .grouptouritineraryimagesList[
                                              subIndex
                                            ].itineraryImageName
                                          }
                                        </span>
                                      )}
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-2 col-md-4 col-sm-6 col-lg-3">
                                  <label className="font-medium text-sm text-gray-700">
                                    Image For:
                                  </label>
                                  <select
                                    name={`grouptouritineraryimages[${index}].grouptouritineraryimagesList[${subIndex}].type`}
                                    value={subItem.type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="p-2 border rounded-md shadow-sm"
                                  >
                                    <option value={1}>Hotel</option>
                                    <option value={0}>Place</option>
                                  </select>
                                  {formik.errors.grouptouritineraryimages &&
                                  formik.errors.grouptouritineraryimages[
                                    index
                                  ] &&
                                  formik.errors.grouptouritineraryimages[index]
                                    .grouptouritineraryimagesList &&
                                  formik.errors.grouptouritineraryimages[index]
                                    .grouptouritineraryimagesList[subIndex] &&
                                  formik.errors.grouptouritineraryimages[index]
                                    .grouptouritineraryimagesList[subIndex]
                                    .type ? (
                                    <div className="text-red-500 text-sm mt-1">
                                      {
                                        formik.errors.grouptouritineraryimages[
                                          index
                                        ].grouptouritineraryimagesList[subIndex]
                                          .type
                                      }
                                    </div>
                                  ) : null}
                                </div>
                                <div className="col-md-6">
                                  <label className="text-label">
                                    Experience Image{" "}
                                    <span className="error-star">*</span>
                                  </label>
                                  <div className="col-md-12">
                                    <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                      <input
                                        className="file_upload"
                                        accept="image/*"
                                        type="file"
                                        onChange={async (e) => {
                                          const selectedFile =
                                            e.target.files[0];
                                          const fileLink = await getFileLink(
                                            selectedFile,
                                            "itineraryImageUrl"
                                          );
                                          formik.setFieldValue(
                                            `grouptouritineraryimages[${index}].grouptouritineraryimagesList[${subIndex}].itineraryImageUrl`,
                                            fileLink
                                          );
                                          e.target.value = "";
                                        }}
                                      />
                                      <div className="Neon-input-dragDrop">
                                        {subItem.itineraryImageUrl ? (
                                          <img
                                            src={
                                              subItem.itineraryImageUrl ||
                                              NoImage
                                            }
                                            alt="frontImage"
                                            width="100%"
                                            className="neon-img"
                                          />
                                        ) : (
                                          <div className="Neon-input-inner">
                                            <div className="Neon-input-text">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 384 512"
                                                className="display-4"
                                              >
                                                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
                                              </svg>
                                            </div>
                                            <a className="Neon-input-choose-btn blue">
                                              Drop files here or click to
                                              upload.
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="divider"></div>
                                </div>

                                {/* Cancel Icon for Removing */}
                                <div className="col-md-12 text-end">
                                  <Tooltip title="Delete">
                                    <button
                                      type="button"
                                      className="btn btn-trash bg-yellow"
                                      onClick={() =>
                                        handleRemoveImage(index, subIndex)
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 448 512"
                                        aria-label="Delete"
                                        className=""
                                        data-mui-internal-clone-element="true"
                                      >
                                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                                      </svg>
                                    </button>
                                  </Tooltip>
                                </div>
                              </div>
                            )
                          )}
                          {/* Add More Icon */}
                          <div className="col-md-12 text-end">
                            <Tooltip title="Add">
                              <button
                                type="button"
                                className="btn btn-save btn-primary mt-5"
                                onClick={() => handleAddImage(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="1em"
                                  fill="#07"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {destinationId == "2" && (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="skeleton mb-2">
                  <div
                    className="card-header  pb-2 pt-2"
                    style={{ paddingLeft: "0" }}
                  >
                    <div className="card-title h5">Visa Details</div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label>
                        Visa Document Required
                        <span className="error-star">*</span>
                      </label>
                      <div className="">
                        <input
                          className="form-control"
                          type="text"
                          id="visaDocuments"
                          name="visaDocuments"
                          onChange={formik.handleChange}
                          value={formik.values.visaDocuments}
                        />
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"visaDocuments"}
                          touched={formik.touched}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        Visa Fees
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="visaFee"
                        name="visaFee"
                        onChange={formik.handleChange}
                        value={formik.values.visaFee}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"visaFee"}
                        touched={formik.touched}
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        Visa Instructions
                        <span className="error-star">*</span>
                      </label>
                      <textarea
                        type="text"
                        className="textarea"
                        id="visaInstruction"
                        name="visaInstruction"
                        onChange={formik.handleChange}
                        value={formik.values.visaInstruction}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"visaInstruction"}
                        touched={formik.touched}
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        Visa Alerts
                        <span className="error-star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="visaAlerts"
                        name="visaAlerts"
                        onChange={formik.handleChange}
                        value={formik.values.visaAlerts}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"visaAlerts"}
                        touched={formik.touched}
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        Insurance Details
                        <span className="error-star">*</span>
                      </label>
                      <div className="">
                        <input
                          className="form-control"
                          type="text"
                          id="insuranceDetails"
                          name="insuranceDetails"
                          onChange={formik.handleChange}
                          value={formik.values.insuranceDetails}
                        />
                        <ErrorMessageComponent
                          errors={formik.errors}
                          fieldName={"insuranceDetails"}
                          touched={formik.touched}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        Euro Start Train Details
                        <span className="error-star">*</span>
                      </label>
                      <textarea
                        type="text"
                        className="textarea"
                        id="euroTrainDetails"
                        name="euroTrainDetails"
                        onChange={formik.handleChange}
                        value={formik.values.euroTrainDetails}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"euroTrainDetails"}
                        touched={formik.touched}
                      />
                    </div>

                    <div className="col-md-6 mb-2">
                      <label>
                        NRI/OCI/Foreign Details
                        <span className="error-star">*</span>
                      </label>
                      <textarea
                        type="text"
                        className="textarea"
                        id="nriOriForDetails"
                        name="nriOriForDetails"
                        onChange={formik.handleChange}
                        value={formik.values.nriOriForDetails}
                      />
                      <ErrorMessageComponent
                        errors={formik.errors}
                        fieldName={"nriOriForDetails"}
                        touched={formik.touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {departureTypeId != "1" && (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="skeleton mb-2">
                  <div
                    className="card-header pb-2 pt-2"
                    style={{ paddingLeft: "0px" }}
                  >
                    <div className="card-title h5">Flight Details</div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-responsive-sm table-tour table-gt">
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Journey <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "10%",
                            }}
                          >
                            Flight No. <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Airlines <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Class <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            From <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Date <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Time <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "10%",
                            }}
                          >
                            To <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Date <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Time <span className="error-star">*</span>
                          </th>
                          <th
                            style={{
                              width: "8%",
                            }}
                          >
                            Weight <span className="error-star">*</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        {formik.values.flights.map((flight, index) => (
                          <tr key={index}>
                            <td>{flight.journey}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].flight`}
                                name={`flights[${index}].flight`}
                                value={flight.flight}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.flight &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.flight && (
                                  <span className="error">
                                    {formik.errors.flights[index].flight}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].airline`}
                                name={`flights[${index}].airline`}
                                value={flight.airline}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.airline &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.airline && (
                                  <span className="error">
                                    {formik.errors.flights[index].airline}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].class`}
                                name={`flights[${index}].class`}
                                value={flight.class}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.class &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.class && (
                                  <span className="error">
                                    {formik.errors.flights[index].class}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].from`}
                                name={`flights[${index}].from`}
                                value={flight.from}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.from &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.from && (
                                  <span className="error">
                                    {formik.errors.flights[index].from}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control flight_input"
                                id={`flights[${index}].fromDate`}
                                name={`flights[${index}].fromDate`}
                                value={flight.fromDate}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.fromDate &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.fromDate && (
                                  <span className="error">
                                    {formik.errors.flights[index].fromDate}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control flight_input"
                                id={`flights[${index}].fromTime`}
                                name={`flights[${index}].fromTime`}
                                value={flight.fromTime}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.fromTime &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.fromTime && (
                                  <span className="error">
                                    {formik.errors.flights[index].fromTime}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].to`}
                                name={`flights[${index}].to`}
                                value={flight.to}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.to &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.to && (
                                  <span className="error">
                                    {formik.errors.flights[index].to}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control flight_input"
                                id={`flights[${index}].toDate`}
                                name={`flights[${index}].toDate`}
                                value={flight.toDate}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.toDate &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.toDate && (
                                  <span className="error">
                                    {formik.errors.flights[index].toDate}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control flight_input"
                                id={`flights[${index}].toTime`}
                                name={`flights[${index}].toTime`}
                                value={flight.toTime}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.toTime &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.toTime && (
                                  <span className="error">
                                    {formik.errors.flights[index].toTime}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control flight_input"
                                id={`flights[${index}].weight`}
                                name={`flights[${index}].weight`}
                                value={flight.weight}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.flights &&
                                formik.touched.flights[index]?.weight &&
                                formik.errors &&
                                formik.errors.flights &&
                                formik.errors.flights[index]?.weight && (
                                  <span className="error">
                                    {formik.errors.flights[index].weight}
                                  </span>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        // formik.values.departure && formik.values.departureTypeId != "2" &&
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="skeleton mb-2">
                  <div
                    className="card-header pb-2 pt-2"
                    style={{ paddingLeft: "0px" }}
                  >
                    <div className="card-title h5">Train Details</div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-responsive-sm table-tour table-gt">
                      <thead>
                        <tr>
                          <th style={{ width: "8%" }}>
                            Journey <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "11%" }}>
                            Train No. <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "12%" }}>
                            Train Name <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "12%" }}>
                            From <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "10%" }}>
                            Date <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "10%" }}>
                            Time <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "12%" }}>
                            To <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "10%" }}>
                            Date <span className="error-star">*</span>
                          </th>
                          <th style={{ width: "10%" }}>
                            Time <span className="error-star">*</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        {formik.values.trains.map((train, index) => (
                          <tr key={index}>
                            <td>{train.journey}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                id={`trains[${index}].trainNo`}
                                name={`trains[${index}].trainNo`}
                                value={train.trainNo}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.trainNo &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.trainNo && (
                                  <span className="error">
                                    {formik.errors.trains[index].trainNo}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                id={`trains[${index}].trainName`}
                                name={`trains[${index}].trainName`}
                                value={train.trainName}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.trainName &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.trainName && (
                                  <span className="error">
                                    {formik.errors.trains[index].trainName}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                id={`trains[${index}].from`}
                                name={`trains[${index}].from`}
                                value={train.from}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.from &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.from && (
                                  <span className="error">
                                    {formik.errors.trains[index].from}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                id={`trains[${index}].fromDate`}
                                name={`trains[${index}].fromDate`}
                                value={train.fromDate}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.fromDate &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.fromDate && (
                                  <span className="error">
                                    {formik.errors.trains[index].fromDate}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control"
                                id={`trains[${index}].fromTime`}
                                name={`trains[${index}].fromTime`}
                                value={train.fromTime}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.fromTime &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.fromTime && (
                                  <span className="error">
                                    {formik.errors.trains[index].fromTime}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                id={`trains[${index}].to`}
                                name={`trains[${index}].to`}
                                value={train.to}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.to &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.to && (
                                  <span className="error">
                                    {formik.errors.trains[index].to}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                id={`trains[${index}].toDate`}
                                name={`trains[${index}].toDate`}
                                value={train.toDate}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.toDate &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.toDate && (
                                  <span className="error">
                                    {formik.errors.trains[index].toDate}
                                  </span>
                                )}
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control"
                                id={`trains[${index}].toTime`}
                                name={`trains[${index}].toTime`}
                                value={train.toTime}
                                onChange={formik.handleChange}
                              />
                              {formik.touched.trains &&
                                formik.touched.trains[index]?.toTime &&
                                formik.errors &&
                                formik.errors.trains &&
                                formik.errors.trains[index]?.toTime && (
                                  <span className="error">
                                    {formik.errors.trains[index].toTime}
                                  </span>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="skeleton mb-2">
                {/* <h6 className="pb-2">Suggested Timing for D2D Guests</h6> */}
                <div
                  className="card-header  pb-2 pt-2"
                  style={{ paddingLeft: "0" }}
                >
                  <div className="card-title h5">
                    Suggested Timing for D2D Guests
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table header-border  table-bordered table-responsive-sm table-tour table-tour1 table-gt">
                    <thead>
                      <tr>
                        <th
                          className=""
                          style={{
                            width: "20px",
                            cursor: "default",
                          }}
                        >
                          Arrival Details
                        </th>
                        <th
                          className=""
                          style={{
                            width: "20px",
                            cursor: "default",
                          }}
                        >
                          Arrival
                        </th>
                        <th
                          className=""
                          style={{
                            width: "20px",
                            cursor: "default",
                          }}
                        >
                          Departure Details
                        </th>
                        <th
                          className=""
                          style={{
                            width: "20px",
                            cursor: "default",
                          }}
                        >
                          Departure
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Tour Start City
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="text"
                            className="form-control"
                            id="startCity"
                            name="startCity"
                            onChange={formik.handleChange}
                            value={formik.values.startCity}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"startCity"}
                            touched={formik.touched}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Tour End City
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="text"
                            className="form-control"
                            id="endCity"
                            name="endCity"
                            onChange={formik.handleChange}
                            value={formik.values.endCity}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"endCity"}
                            touched={formik.touched}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Pick-up/Meeting point
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="text"
                            className="form-control"
                            id="pickUpMeet"
                            name="pickUpMeet"
                            onChange={formik.handleChange}
                            value={formik.values.pickUpMeet}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"pickUpMeet"}
                            touched={formik.touched}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Drop-off point
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="text"
                            className="form-control"
                            id="dropOffPoint"
                            name="dropOffPoint"
                            onChange={formik.handleChange}
                            value={formik.values.dropOffPoint}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"dropOffPoint"}
                            touched={formik.touched}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Pick-up/Meeting time
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="time"
                            className="form-control"
                            id="pickUpMeetTime"
                            name="pickUpMeetTime"
                            onChange={formik.handleChange}
                            value={formik.values.pickUpMeetTime}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"pickUpMeetTime"}
                            touched={formik.touched}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Drop-off time
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="time"
                            className="form-control"
                            id="dropOffTime"
                            name="dropOffTime"
                            onChange={formik.handleChange}
                            value={formik.values.dropOffTime}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"dropOffTime"}
                            touched={formik.touched}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Arrive before
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="time"
                            className="form-control"
                            id="arriveBefore"
                            name="arriveBefore"
                            onChange={formik.handleChange}
                            value={formik.values.arriveBefore}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"arriveBefore"}
                            touched={formik.touched}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          Book flight/train after
                          <span className="error-star">*</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap ">
                          <input
                            type="time"
                            className="form-control"
                            id="bookAfter"
                            name="bookAfter"
                            onChange={formik.handleChange}
                            value={formik.values.bookAfter}
                          />
                          <ErrorMessageComponent
                            errors={formik.errors}
                            fieldName={"bookAfter"}
                            touched={formik.touched}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
    </form>
  );
};

export default TransportDetailsForm;
