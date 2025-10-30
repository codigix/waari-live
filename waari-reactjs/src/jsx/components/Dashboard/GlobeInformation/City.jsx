import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import Delete from "../../../../images/delete.png";
import { NoImage } from "../../../utils/assetsPaths";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import axios from "axios";
const url = import.meta.env.VITE_WAARI_BASEURL;
import { getImageSize } from "../../../utils/index";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};
//TABLE COLOMN

const requiredSizeForBgImage = {
  width: 1880,
  height: 1253,
};

const City = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = useSelector((state) => state.auth);
  const [isUploading, setUploading] = useState(false);

  const initalValuesObj = {
    continent: "",
    country: "",
    state: "",
    city: "",
    image: "",
    description: "",
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: initalValuesObj,
    // validationSchema: Yup.object({
    //     continent: Yup.object().required("Please Select Continent"),
    //     country: Yup.object().required("Please Select Country"),
    //     // state: Yup.string(),
    //     city: Yup.string()
    //         .required("Please Enter City Name")
    //         .matches(/^[^\d]*$/, "Digits are not allowed"),
    //     image: Yup.string().required("Backround image is required (1880 x 1253 size required)"),
    //     description: Yup.string().required("Description is required"),
    // }),
    validationSchema: Yup.object({
      continent: Yup.object(), // optional
      country: Yup.object(), // optional
      // state: Yup.string(),  // keep commented if not needed
      city: Yup.string() // optional
        .matches(/^[^\d]*$/, "Digits are not allowed")
        .nullable(),
      image: Yup.string() // optional
        .nullable(),
      description: Yup.string() // optional
        .nullable(),
    }),

    onSubmit: async (values, { validateForm, resetForm }) => {
      let data = {
        continentId: values?.continent?.value,
        countryId: values?.country?.value,
        stateId: values?.state?.value,
        citiesName: values.city,
        image: values.image,
        description: values.description,
      };
      try {
        setIsLoading(true);
        const response = await post(`add-city`, data);
        hasComponentPermission(permissions, 59) && getCityList();
        setIsLoading(false);
        toast.success(response?.data?.message);
        resetForm(initalValuesObj);

        validation.setFieldValue("city", "");

        await validateForm();
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  const [continent, setContinentList] = useState([]);
  const getContinentId = async () => {
    try {
      const response = await get(`/dropdown-continents`);

      const mappedData = response.data.data.map((item) => ({
        value: item.continentId,
        label: item.continentName,
      }));
      setContinentList(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContinentId();
  }, []);

  const [country, setCountryList] = useState([]);
  const getCountryId = async (id) => {
    try {
      const response = await get(`/continent-country-list?continentId=${id}`);
      const mappedData = response.data.message.map((item) => ({
        value: item.countryId,
        label: item.countryName,
      }));
      setCountryList(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  //handle change continent

  const handleChangeContinent = (selectedOption) => {
    if (selectedOption) {
      validation.setFieldValue("continent", selectedOption);
      setCountryList([]);
      setState([]);
      getCountryId(selectedOption.value);
    }
    validation.setFieldValue("country", "");
    validation.setFieldValue("state", "");
  };
  const handleChangeCountry = (selectedOption) => {
    if (selectedOption) {
      validation.setFieldValue("country", selectedOption);
      setState([]);
      getStateId(selectedOption.value);
    }
    validation.setFieldValue("state", "");
  };

  const [state, setState] = useState([]);
  const getStateId = async (id) => {
    try {
      const response = await get(
        `/continent-country-state-list?continentId=${validation?.values?.continent?.value}&countryId=${id}`
      );

      const mappedData = response.data.message.map((item) => ({
        value: item.stateId,
        label: item.stateName,
      }));
      setState(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Sr.No.",
      render: (item, index) => (
        <>{page * perPageItem - perPageItem + (index + 1)}</>
      ),
      width: 40,
    },
    {
      title: "continental",
      dataIndex: "continentName",
      key: "continentName",
      width: 100,
    },
    {
      title: "country",
      dataIndex: "countryName",
      key: "countryName",
      width: 100,
    },
    {
      title: "State",
      dataIndex: "stateName",
      key: "stateName",
      width: 100,
    },
    {
      title: "City",
      dataIndex: "citiesName",
      key: "citiesName",
      width: 100,
    },

    hasComponentPermission(permissions, 61) ||
    hasComponentPermission(permissions, 62)
      ? {
          title: "Action",
          render: (item) => (
            <div
              className="d-flex"
              style={{ justifyContent: "center", gap: "10px" }}
            >
              {hasComponentPermission(permissions, 61) && (
                <div className="d-flex justify-content-center">
                  <span
                    className="btn-edit-user me-1"
                    onClick={() => (
                      setOpenUpdate(true),
                      validationUpdate.setFieldValue(
                        "citiesId",
                        item?.citiesId
                      ),
                      validationUpdate.setFieldValue(
                        "citiesName",
                        item?.citiesName
                      )
                    )}
                  >
                    <Tooltip title="Edit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                      >
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                      </svg>
                    </Tooltip>
                  </span>
                </div>
              )}

              {hasComponentPermission(permissions, 62) && (
                <div className="d-flex justify-content-center">
                  <Link
                    className="btn-trash"
                    onClick={() => handleOpenDelete(item?.citiesId)}
                  >
                    <Tooltip title="Delete">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                      >
                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                      </svg>
                    </Tooltip>
                  </Link>
                </div>
              )}
            </div>
          ),
          key: "action",
          width: 90,
        }
      : undefined,
  ];

  const finalColumns = columns.filter((column) => column);

  // for pagination start

  const [totalCount, setTotalCount] = useState(0);
  const [perPageItem, setPerPageItem] = useState(10);

  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (perPage) => {
    setPerPageItem(perPage);
    setPage(1);
  };

  // for pagination end

  const [cityList, setCityList] = useState([]);

  const getCityList = async () => {
    try {
      setIsLoading(true);
      const response = await get(
        `${import.meta.env.VITE_WAARI_BASEURL}/all-city-list?page=${page}&perPage=${perPageItem}`
      );
      setCityList(response?.data?.data);
      let totalPages = response.data.total / response.data.perPage;
      setTotalCount(Math.ceil(totalPages));
      setPerPageItem(response.data.perPage);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    hasComponentPermission(permissions, 59) && getCityList();
  }, [page, perPageItem]);

  // to delete record start
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState("");

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const responseData = await get(`/delete-city?citiesId=${deleteId}`);
      setOpen(false);
      getCityList();
      setIsLoading(false);
      toast.success(responseData?.data?.message);
    } catch (error) {
      setIsLoading(false);
    }
  };
  // to delete record end

  // Validate image dimensions
  const isValidImageSize = (size) => {
    const { width, height } = size;
    return (
      width === requiredSizeForBgImage.width &&
      height === requiredSizeForBgImage.height
    );
  };

  // ✅ Upload city image and get URL
  const getFileLink = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // field name must match upload.single("image")

      setUploading(true);

      const responseData = await axios.post(
        `${import.meta.env.VITE_WAARI_BASEURL}/image-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("File uploaded successfully");
      setUploading(false);

      return responseData?.data?.image_url;
    } catch (error) {
      setUploading(false);
      toast.error(error?.response?.data?.message?.toString());
      console.log(error);
    }
  };
  const editInitialValuesObj = {
    citiesId: "",
    citiesName: "",
    image: "",
    description: "",
  };

  const validationUpdate = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: editInitialValuesObj,
    validationSchema: Yup.object({
      citiesName: Yup.string()
        .required("Please Enter City Name")
        .matches(/^[^\d]*$/, "Digits are not allowed"),
      image: Yup.string().required(
        "Backround image is required (1880 x 1253 size required)"
      ),
      description: Yup.string().required("Description is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        const response = await post(`edit-city`, values);
        setIsLoading(false);
        toast.success(response?.data?.message);

        resetForm(editInitialValuesObj);

        setOpenUpdate(false);
        getCityList();
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  // to update record start
  const [openUpdate, setOpenUpdate] = React.useState(false);

  // to update record end

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };

  return (
    <section>
      {hasComponentPermission(permissions, 58) && (
        <div className="card">
          <div className="card-body">
            <form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label>
                          Continental<span className="error-star">*</span>
                        </label>
                        <Select
                          isClearable
                          styles={customStyles}
                          name="continent"
                          id="continent"
                          options={continent}
                          onChange={handleChangeContinent}
                          onBlur={validation.handleBlur}
                          value={validation.values.continent}
                        />
                        {validation.touched.continent &&
                        validation.errors.continent ? (
                          <span className="error">
                            {validation.errors.continent}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label>
                          Country<span className="error-star">*</span>
                        </label>
                        <Select
                          isClearable
                          styles={customStyles}
                          name="country"
                          id="country"
                          options={country}
                          onChange={handleChangeCountry}
                          onBlur={validation.handleBlur}
                          value={validation.values.country}
                        />
                        {validation.touched.country &&
                        validation.errors.country ? (
                          <span className="error">
                            {validation.errors.country}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label>State</label>
                        <Select
                          isClearable
                          styles={customStyles}
                          name="state"
                          id="state"
                          options={state}
                          onChange={(selectedOption) => {
                            validation.setFieldValue("state", selectedOption);
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.state}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label>
                          City<span className="error-star">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          id="city"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.city}
                        />
                        {validation.touched.city && validation.errors.city ? (
                          <span className="error">
                            {validation.errors.city}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label>
                          Description<span className="error-star">*</span>
                        </label>
                        <textarea
                          type="text"
                          className="form-control"
                          name="description"
                          id="description"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.description}
                          style={{ overflow: "hidden" }}
                        />
                        {validation.touched.description &&
                        validation.errors.description ? (
                          <span className="error">
                            {validation.errors.description}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                      <div v className="">
                        <label className="text-label">
                          Background Image (1880 * 1253)
                          <span className="error-star">*</span>
                        </label>
                        <div className="col-md-12">
                          <div className="Neon Neon-theme-dragdropbox bg-gt">
                            <input
                              className="file_upload"
                              name={`image`}
                              accept="image/*"
                              id="filer_input2"
                              type="file"
                              draggable
                              onChange={async (e) => {
                                const selectedFile = e.target.files[0];
                                const fileLink = await getFileLink(
                                  selectedFile,
                                  "image"
                                );
                                validation.setFieldValue(`image`, fileLink);
                                e.target.value = "";
                              }}
                            />
                            <div className="Neon-input-dragDrop">
                              {validation.values.image?.length == 0 ? (
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
                                  src={validation.values.image || NoImage}
                                  alt="frontImage"
                                  width="100%"
                                  className="neon-img"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <ErrorMessageComponent
                          errors={validation.errors}
                          fieldName={"image"}
                          touched={validation.touched}
                        />
                      </div>
                    </div>

                    <div className="col-md-1 col-lg-1 col-sm-6 col-12 d-flex align-items-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-submit mt-1"
                        disabled={isLoading}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {hasComponentPermission(permissions, 59) && (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <Table
                  cols={finalColumns}
                  page={page}
                  data={cityList}
                  handlePageChange={handleChange}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  totalPages={totalCount}
                  isTableLoading={isLoading}
                  isPagination={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography>
              <Link
                onClick={() => setOpen(false)}
                className="close d-flex justify-content-end text-danger"
              >
                <span>&times;</span>
              </Link>
            </Typography>
            <img
              src={Delete}
              style={{
                width: "80px",
                display: "flex",
                justifyContent: "center",
                margin: "5px auto ",
              }}
            />
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {/* <img
                src="../assets/images/delete.gif"
                width="150"
                className="mx-auto"
                alt=""
              /> */}
              <h3 className="info-text text-center mb-2">Delete</h3>
              {/* <Link
                onClick={() => setOpen(false)}
                className="text-red-500 close-btn absolute  top-0 right-2"
              >
                &times;
              </Link> */}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <p className="info  text-sm mb-2 mt-2 text-center">
                Are you sure want to delete?
              </p>
              <div className=" d-flex mx-auto  justify-content-center">
                <button
                  className="btn btn-back me-1"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="btn btn-save btn-primary"
                  disabled={isLoading}
                  onClick={(e) => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openUpdate}
        // onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openUpdate}>
          <Box sx={style}>
            <Typography>
              <Link
                onClick={() => setOpenUpdate(false)}
                className="close d-flex justify-content-end text-danger"
              >
                <span>&times;</span>
              </Link>
            </Typography>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <h3 className="info-text text-center mb-2 font-bold">Update</h3>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={validationUpdate.handleSubmit}>
                <div className="lg:mb-3 mb-3 md:mb-3 form-group">
                  <label className="font-weight-bold">City</label>
                  <input
                    type="text"
                    className="referral-input1 relative form-control"
                    placeholder="Enter City Name"
                    id="citiesName"
                    name="citiesName"
                    onChange={validationUpdate.handleChange}
                    onBlur={validationUpdate.handleBlur}
                    value={validationUpdate.values.citiesName}
                  />
                  {validationUpdate.touched.citiesName &&
                  validationUpdate.errors.citiesName ? (
                    <span className="error">
                      {validationUpdate.errors.citiesName}
                    </span>
                  ) : null}
                </div>

                <div className=" col-12">
                  <div className="mb-3">
                    <label>
                      Description<span className="error-star">*</span>
                    </label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="description"
                      id="description"
                      onChange={validationUpdate.handleChange}
                      onBlur={validationUpdate.handleBlur}
                      value={validationUpdate.values.description}
                      style={{ overflow: "hidden" }}
                    />
                    {validationUpdate.touched.description &&
                    validationUpdate.errors.description ? (
                      <span className="error">
                        {validationUpdate.errors.description}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className=" col-12">
                  <div v className="mb-3">
                    <label className="text-label">
                      Background Image (1880 * 1253)
                      <span className="error-star">*</span>
                    </label>
                    <div className="col-md-12">
                      <div className="Neon Neon-theme-dragdropbox bg-gt">
                        <input
                          className="file_upload"
                          name={`image`}
                          accept="image/*"
                          id="filer_input2"
                          type="file"
                          draggable
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            const fileLink = await getFileLink(
                              selectedFile,
                              "image"
                            );
                            validationUpdate.setFieldValue(`image`, fileLink);
                            e.target.value = "";
                          }}
                        />
                        <div className="Neon-input-dragDrop">
                          {validationUpdate.values.image?.length == 0 ? (
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
                              src={validationUpdate.values.image || NoImage}
                              alt="frontImage"
                              width="100%"
                              className="neon-img"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <ErrorMessageComponent
                      errors={validationUpdate.errors}
                      fieldName={"image"}
                      touched={validationUpdate.touched}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-submit btn-primary  d-flex items-center justify-center mx-auto"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "updating..." : "update"}
                </button>
              </form>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </section>
  );
};
export default City;
