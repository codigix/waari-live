import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NoImage } from "../../../utils/assetsPaths";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions } from "../../../utils/richTextEditorConfig";
import { getImageSize } from "../../../utils/index";
import axios from "axios";
import { Tooltip } from "@mui/material";

const url = import.meta.env.VITE_WAARI_BASEURL;

const requiredSizeForBannerImage = {
  width: 1080,
  height: 770,
};
const requiredSizeForHotelImage = {
  width: 500,
  height: 400,
};

const mealsList = ["Breakfast", "Lunch", "Dinner"];

const detailedItineraryObj = {
  title: "",
  distance: "",
  description: "",
  nightStayAt: "",
  mealTypeId: [],
  fromCity: "",
  toCity: "",
  approxTravelTime: "",
  bannerImage: "",
  hotelImage: "",
  grouptouritineraryimages: [
    {
      itineraryImageName: "",
      itineraryImageUrl: "",
      type: 1,
    },
  ],
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

const DetailInteniraryForm = ({
  groupTourId,
  tourdurationdays,
  toursData,
  dayDifference,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // const validationSchema = Yup.object().shape({
  //     detailIntenirary: Yup.array()
  //         .of(
  //             Yup.object().shape({
  //                 title: Yup.string().required("Location is required"),
  //                 distance: Yup.string().required("Distance is required"),
  //                 description: Yup.string().required("Description is required"),
  //                 nightStayAt: Yup.string().required("Stay at is required"),
  //                 mealTypeId: Yup.array()
  //                 .of(Yup.string())
  //                 .required("Meal Type is required")
  //                 .min(1, "At least one Meal Type is required"),
  //                 fromCity: Yup.string().required("From City is required"),
  //                 toCity: Yup.string().required("To City is required"),
  //                 approxTravelTime: Yup.string().required("Approx Travel Time is required"),
  //                 bannerImage: Yup.string()
  //                     .url("Must be a valid URL")
  //                     .required("Banner Image is required (1080 x 770 size required)"),
  //                 hotelImage: Yup.string()
  //                     .url("Must be a valid URL")
  //                     .required("Hotel Image is required (500 x 400 size required)"),
  //                 grouptouritineraryimages: Yup.array()
  //                     .of(
  //                         Yup.object().shape({
  //                             itineraryImageName: Yup.string().required(
  //                                 "Itinerary Image Name is required"
  //                             ),
  //                             itineraryImageUrl: Yup.string()
  //                                 .url("Must be a valid URL")
  //                                 .required("Itinerary Image URL is required"),
  //                             type: Yup.number()
  //                                 .oneOf([0, 1], "Type must be 0 (Place) or 1 (Hotel)")
  //                                 .required("Image type is required"),
  //                         })
  //                     )
  //                     .min(1, "At least one itinerary image is required in each list"),
  //             })
  //         )
  //         .required("Detail Itinerary is required")
  //         .min(1, "At least one itinerary is required"),
  // });
  const validationSchema = Yup.object().shape({
    detailIntenirary: Yup.array().of(
      Yup.object().shape({
        title: Yup.string(), // optional
        distance: Yup.string(), // optional
        description: Yup.string(), // optional
        nightStayAt: Yup.string(), // optional
        mealTypeId: Yup.array().of(Yup.string()), // optional
        fromCity: Yup.string(), // optional
        toCity: Yup.string(), // optional
        approxTravelTime: Yup.string(), // optional
        bannerImage: Yup.string().url("Must be a valid URL"), // optional
        hotelImage: Yup.string().url("Must be a valid URL"), // optional
        grouptouritineraryimages: Yup.array().of(
          Yup.object().shape({
            itineraryImageName: Yup.string(), // optional
            itineraryImageUrl: Yup.string().url("Must be a valid URL"), // optional
            type: Yup.number().oneOf([0, 1]), // optional
          })
        ),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      detailIntenirary: [], // This will store each day's itinerary, with images inside each day
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const detailsIternary = values.detailIntenirary.map((item, index) => {
        return {
          ...item,
          date: formatIternaryDate(toursData.startDate, index),
          grouptouritineraryimagesList: item.grouptouritineraryimages.map(
            (image) => ({
              itineraryImageName: image.itineraryImageName,
              itineraryImageUrl: image.itineraryImageUrl,
              type: image.type,
            })
          ),
        };
      });

      let data = {
        groupTourId: groupTourId,
        detailIntenirary: detailsIternary, // Contains each day's itinerary with images
      };

      try {
        setIsSubmitting(true);
        const response = await post(`add-detail-itinerary`, data);
        setIsSubmitting(false);
        toast.success(response?.data?.message);
      } catch (error) {
        setIsSubmitting(false);
        console.log(error);
      }
    },
  });

  const addDetailsItenerary = () => {
    formik.setFieldValue(
      "detailIntenirary",
      Array.from({ length: dayDifference }, () => ({
        ...detailedItineraryObj,
      }))
    );
  };

  const handleAddImage = (index) => {
    formik.setFieldValue(
      `detailIntenirary[${index}].grouptouritineraryimages`,
      [
        ...formik.values.detailIntenirary[index].grouptouritineraryimages,
        { itineraryImageName: "", itineraryImageUrl: "", type: 1 }, // default type = 1 (Hotel)
      ]
    );
  };

  const handleRemoveImage = (index, subIndex) => {
    const updatedImages = formik.values.detailIntenirary[
      index
    ].grouptouritineraryimages.filter((_, i) => i !== subIndex);
    formik.setFieldValue(
      `detailIntenirary[${index}].grouptouritineraryimages`,
      updatedImages
    );
  };

  const handleCheckboxChange = (index, mealType) => {
    formik.setFieldValue(
      `detailIntenirary[${index}].mealTypeId`,
      formik.values.detailIntenirary[index]?.mealTypeId.includes(mealType)
        ? formik.values.detailIntenirary[index].mealTypeId.filter(
            (item) => item !== mealType
          )
        : [...formik.values.detailIntenirary[index].mealTypeId, mealType]
    );
  };

  useEffect(() => {
    if (dayDifference) {
      addDetailsItenerary(dayDifference);
    }

    if (toursData?.detailedItinerary?.length && dayDifference) {
      formik.setFieldValue("detailIntenirary", toursData.detailedItinerary);
    }

    if (toursData && dayDifference) {
      // Transform the backend data to match the frontend structure
      const transformedImages = toursData.detailedItinerary.map((itinerary) => {
        // Collect images for both types (places and hotels)
        const placeImages =
          toursData.grouptouritineraryimages["0"]?.map((image) => ({
            itineraryImageName: image.itineraryImageName,
            itineraryImageUrl: image.itineraryImageUrl,
            type: image.type,
          })) || [];

        const hotelImages =
          toursData.grouptouritineraryimages["1"]?.map((image) => ({
            itineraryImageName: image.itineraryImageName,
            itineraryImageUrl: image.itineraryImageUrl,
            type: image.type,
          })) || [];

        // Combine both place and hotel images
        const allImages = [...placeImages, ...hotelImages];

        return {
          ...itinerary,
          grouptouritineraryimages: allImages,
        };
      });

      if (transformedImages.length) {
        formik.setFieldValue("detailIntenirary", transformedImages);
      }
    }
  }, [dayDifference, toursData]);

  // Helper function to validate image size
  const isValidImageSize = (size, fieldName) => {
    const { width, height } = size;

    if (fieldName === "bannerImage") {
      return (
        width === requiredSizeForBannerImage.width &&
        height === requiredSizeForBannerImage.height
      );
    } else if (fieldName === "hotelImage") {
      return (
        width === requiredSizeForHotelImage.width &&
        height === requiredSizeForHotelImage.height
      );
    } else return true;
  };

  const getFileLink = async (file, fieldName) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Perform size validation here
      const imageSize = await getImageSize(file);
      if (!isValidImageSize(imageSize, fieldName)) {
        toast.error(
          "Invalid image size. Please upload an image with given dimensions"
        );
        return;
      }

      setIsLoadingImage(true);

      const responseData = await axios.post(`${url}/image-upload`, formData);

      toast.success("File uploaded successfully");

      setIsLoadingImage(false);

      return responseData?.data?.image_url;
    } catch (error) {
      setIsLoadingImage(false);
      toast.error(error?.response?.data?.message?.toString());
      console.log(error);
    }
  };

  console.log("detaiIUternary", formik.values);
  console.log("detaiIUternaryErrors", formik.errors);

  return (
    <form className="card">
      <div className="card-body">
        <div className="row"></div>

        {tourdurationdays && tourdurationdays > 0 && (
          <div className="card">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="detailsitinerary mb-2">
                      <div
                        className="card-header  pb-2 pt-2"
                        style={{ paddingLeft: "0" }}
                      >
                        <div className="card-title h5">Detailed Itinerary</div>
                      </div>
                      {formik.values.detailIntenirary?.map((item, index) => (
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div
                                className="col-md-5"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div className="mb-0 me-2">
                                  <label
                                    style={{
                                      color: "#024670",
                                      fontWeight: "600",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Day {index + 1} :{" "}
                                  </label>{" "}
                                </div>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-md-4 col-sm-6 col-lg-3">
                                <div className="form-group">
                                  <label>Location Name</label>
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    id={`detailIntenirary-[${index}].title`}
                                    name={`detailIntenirary[${index}].title`}
                                    onChange={formik.handleChange}
                                    value={item.title}
                                  />
                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.title &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.title && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .title
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-lg-3">
                                <label>Distance</label>
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  id={`detailIntenirary[${index}].distance`}
                                  name={`detailIntenirary[${index}].distance`}
                                  onChange={formik.handleChange}
                                  value={item.distance}
                                />
                                {formik.touched.detailIntenirary?.[index]
                                  ?.distance &&
                                formik.errors.detailIntenirary?.[index]
                                  ?.distance ? (
                                  <span className="error">
                                    {
                                      formik?.errors?.detailIntenirary[index]
                                        .distance
                                    }
                                  </span>
                                ) : null}
                              </div>
                              <div className="col-md-4 col-sm-6 col-lg-32">
                                <div className="form-group">
                                  <label>
                                    From City
                                    <span className="error-star">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    id={`detailIntenirary-[${index}].fromCity`}
                                    name={`detailIntenirary[${index}].fromCity`}
                                    onChange={formik.handleChange}
                                    value={item.fromCity}
                                  />
                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.fromCity &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.fromCity && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .fromCity
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>

                              <div className="col-md-4 col-sm-6 col-lg-3">
                                <div className="form-group">
                                  <label>
                                    To City{" "}
                                    <span className="error-star">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    id={`detailIntenirary-[${index}].toCity`}
                                    name={`detailIntenirary[${index}].toCity`}
                                    onChange={formik.handleChange}
                                    value={item.toCity}
                                  />
                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.toCity &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.toCity && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .toCity
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>

                              <div className="col-md-4 col-sm-6 col-lg-3">
                                <div className="form-group">
                                  <label>
                                    Travel time (Approx.){" "}
                                    <span className="error-star">*</span>
                                  </label>

                                  <input
                                    type="time"
                                    className="form-control flight_input"
                                    id={`detailIntenirary-[${index}].approxTravelTime`}
                                    name={`detailIntenirary[${index}].approxTravelTime`}
                                    value={item.approxTravelTime}
                                    onChange={formik.handleChange}
                                  />

                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.approxTravelTime &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.approxTravelTime && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .approxTravelTime
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>

                            <div className="row mb-2">
                              <div className="col-md-6">
                                <label className="text-label">
                                  Banner Image (1080 * 770)
                                  <span className="error-star">*</span>
                                </label>
                                <div className="col-md-12">
                                  <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                    <input
                                      className="file_upload"
                                      name={`bannerImage`}
                                      accept="image/*"
                                      id="filer_input2"
                                      type="file"
                                      draggable
                                      onChange={async (e) => {
                                        const selectedFile = e.target.files[0];
                                        const fileLink = await getFileLink(
                                          selectedFile,
                                          "bannerImage"
                                        );
                                        formik.setFieldValue(
                                          `detailIntenirary[${index}].bannerImage`,
                                          fileLink
                                        );
                                        e.target.value = "";
                                      }}
                                    />
                                    <div className="Neon-input-dragDrop">
                                      {formik.values.bannerImage?.length ==
                                      0 ? (
                                        <div className="Neon-input-inner ">
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
                                            Drop files here or click to upload.
                                          </a>
                                        </div>
                                      ) : (
                                        <img
                                          src={
                                            formik.values.detailIntenirary[
                                              index
                                            ].bannerImage || NoImage
                                          }
                                          alt="frontImage"
                                          width="100%"
                                          className="neon-img"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.bannerImage &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.bannerImage && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .bannerImage
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>

                              <div className="col-md-6">
                                <label className="text-label">
                                  Hotel Image (500 * 400)
                                  <span className="error-star">*</span>
                                </label>
                                <div className="col-md-12">
                                  <div className="Neon Neon-theme-dragdropbox itinerary-img">
                                    <input
                                      className="file_upload"
                                      name={`hotelImage`}
                                      accept="image/*"
                                      id="filer_input2"
                                      type="file"
                                      draggable
                                      onChange={async (e) => {
                                        const selectedFile = e.target.files[0];
                                        const fileLink = await getFileLink(
                                          selectedFile,
                                          "hotelImage"
                                        );
                                        formik.setFieldValue(
                                          `detailIntenirary[${index}].hotelImage`,
                                          fileLink
                                        );
                                        e.target.value = "";
                                      }}
                                    />
                                    <div className="Neon-input-dragDrop">
                                      {formik.values.hotelImage?.length == 0 ? (
                                        <div className="Neon-input-inner ">
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
                                            Drop files here or click to upload.
                                          </a>
                                        </div>
                                      ) : (
                                        <img
                                          src={
                                            formik.values.detailIntenirary[
                                              index
                                            ].hotelImage || NoImage
                                          }
                                          alt="frontImage"
                                          width="100%"
                                          className="neon-img"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {formik.touched.detailIntenirary &&
                                    formik.touched.detailIntenirary[index]
                                      ?.hotelImage &&
                                    formik.errors &&
                                    formik.errors.detailIntenirary &&
                                    formik.errors.detailIntenirary[index]
                                      ?.hotelImage && (
                                      <span className="error">
                                        {
                                          formik.errors.detailIntenirary[index]
                                            .hotelImage
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <label>Description</label>

                            <ReactQuill
                              modules={{
                                toolbar: toolbarOptions,
                              }}
                              theme="snow"
                              value={item.description}
                              onChange={(data) => {
                                formik.setFieldTouched(
                                  `detailIntenirary[${index}].description`,
                                  true
                                );
                                formik.setFieldValue(
                                  `detailIntenirary[${index}].description`,
                                  data
                                );
                              }}
                            />
                            {formik.touched.detailIntenirary?.[index]
                              ?.description &&
                            formik.errors.detailIntenirary?.[index]
                              ?.description ? (
                              <span className="error">
                                {
                                  formik.errors.detailIntenirary[index]
                                    .description
                                }
                              </span>
                            ) : null}
                          </div>

                          <div className="col-md-3 mt-2">
                            <label
                              style={{
                                fontWeight: "600",
                              }}
                            >
                              Meals <span className="error">*</span>
                            </label>
                            <div className="d-flex">
                              {mealsList.map((mealType) => (
                                <label key={mealType} className="me-3">
                                  <input
                                    type="checkbox"
                                    className="me-2"
                                    value={mealType}
                                    id={`detailIntenirary-${index}-mealTypeId-${mealType}`}
                                    name={`detailIntenirary[${index}].mealTypeId`}
                                    checked={formik.values.detailIntenirary[
                                      index
                                    ]?.mealTypeId?.includes(mealType)}
                                    onChange={() =>
                                      handleCheckboxChange(index, mealType)
                                    }
                                  />
                                  {mealType}
                                </label>
                              ))}
                            </div>
                            {formik.touched.detailIntenirary?.[index]
                              ?.mealTypeId &&
                            formik.errors.detailIntenirary?.[index]
                              ?.mealTypeId ? (
                              <span className="error">
                                {
                                  formik.errors.detailIntenirary[index]
                                    .mealTypeId
                                }
                              </span>
                            ) : null}
                          </div>
                          <div className="col-md-5 mt-2">
                            <label
                              style={{
                                fontWeight: "600",
                              }}
                            >
                              Stay
                            </label>

                            <div
                              className="form-check form-check-inline d-flex"
                              style={{
                                paddingLeft: "0",
                              }}
                            >
                              <label
                                className="form-check-label me-2"
                                htmlFor="inlineCheckbox1"
                              >
                                Night Stay At
                              </label>
                              <input
                                type="text"
                                className="form-control "
                                id={`detailIntenirary[${index}].nightStayAt`}
                                name={`detailIntenirary[${index}].nightStayAt`}
                                onChange={formik.handleChange}
                                value={item.nightStayAt}
                              />
                            </div>
                            {formik.touched.detailIntenirary?.[index]
                              ?.nightStayAt &&
                            formik.errors.detailIntenirary?.[index]
                              ?.nightStayAt ? (
                              <span className="error">
                                {
                                  formik.errors.detailIntenirary[index]
                                    .nightStayAt
                                }
                              </span>
                            ) : null}
                          </div>

                          {/* Handling Images inside Each Itinerary Item */}
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
                                    Images for Day {index + 1}:
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Iterate through images for the day */}
                            {item.grouptouritineraryimages?.map(
                              (subItem, subIndex) => (
                                <div key={subIndex} className="row">
                                  {/* Experience Name Input */}
                                  <div className="col-md-4 col-sm-6 col-lg-3">
                                    <div className="form-group mb-2">
                                      <label>Experience Name</label>
                                      <input
                                        type="text"
                                        className="form-control me-2"
                                        name={`detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].itineraryImageName`}
                                        onChange={formik.handleChange}
                                        value={subItem.itineraryImageName}
                                      />
                                      {formik.touched.detailIntenirary?.[index]
                                        ?.grouptouritineraryimages?.[subIndex]
                                        ?.itineraryImageName &&
                                        formik.errors.detailIntenirary?.[index]
                                          ?.grouptouritineraryimages?.[subIndex]
                                          ?.itineraryImageName && (
                                          <span className="error">
                                            {
                                              formik.errors.detailIntenirary[
                                                index
                                              ].grouptouritineraryimages[
                                                subIndex
                                              ].itineraryImageName
                                            }
                                          </span>
                                        )}
                                    </div>
                                  </div>

                                  {/* Image Type Selector (Hotel or Place) */}
                                  <div className="flex flex-col space-y-2 col-md-4 col-sm-6 col-lg-3">
                                    <label className="font-medium text-sm text-gray-700">
                                      Image For:
                                    </label>
                                    <select
                                      name={`detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].type`}
                                      value={subItem.type}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      className="p-2 border rounded-md shadow-sm"
                                    >
                                      <option value={1}>Hotel</option>
                                      <option value={0}>Place</option>
                                    </select>
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
                                              `detailIntenirary[${index}].grouptouritineraryimages[${subIndex}].itineraryImageUrl`,
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
                                    <span className="error">
                                      {formik.errors?.detailIntenirary?.[index]
                                        ?.grouptouritineraryimages?.[subIndex]
                                        ?.itineraryImageUrl &&
                                        formik.touched?.detailIntenirary?.[
                                          index
                                        ]?.grouptouritineraryimages?.[subIndex]
                                          ?.itineraryImageUrl && (
                                          <div className="text-red-500 text-sm mt-1">
                                            {
                                              formik.errors.detailIntenirary[
                                                index
                                              ].grouptouritineraryimages[
                                                subIndex
                                              ].itineraryImageUrl
                                            }
                                          </div>
                                        )}
                                    </span>
                                  </div>
                                  <div className="col-md-12">
                                    <div className="divider"></div>
                                  </div>

                                  {/* Cancel Icon for Removing */}
                                  {formik.values.detailIntenirary[index]
                                    .grouptouritineraryimages?.length > 1 && (
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
                                  )}
                                </div>
                              )
                            )}
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

                          <div className="col-md-12">
                            <div className="divider"></div>
                          </div>
                        </div>

                        // Iternary images list
                      ))}
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

export default DetailInteniraryForm;
