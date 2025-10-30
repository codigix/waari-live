import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link } from "react-router-dom";
import Select from "react-select";
import { get, post } from "../../../../services/apiServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
import { getImageSize } from "../../../utils";
const url = import.meta.env.VITE_WAARI_BASEURL;

const requiredSizeForBgImage = {
  width: 1880,
  height: 1253,
};

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

const Sector = () => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setUploading] = useState(false);

  const initialValuesObj = {
    sectorName: "",
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: initialValuesObj,
    // validationSchema: Yup.object({
    //     sectorName: Yup.string()
    //         .required("Please Enter Sector Name")
    //         .matches(/^[^\d]*$/, "Digits are not allowed"),

    // }),
    validationSchema: Yup.object({
      sectorName: Yup.string()
        .matches(/^[^\d]*$/, "Digits are not allowed") // validation only if filled
        .nullable(), // allows empty or null
    }),

    onSubmit: async (values, { resetForm }) => {
      let data = {
        sectorName: values?.sectorName,
      };
      try {
        setIsLoading(true);
        const response = await post(`add-sectors`, data);
        hasComponentPermission(permissions, 59) && getSectorList();

        resetForm(initialValuesObj);
        setIsLoading(false);
        toast.success(response?.data?.message);
      } catch (error) {
        // toast.error(error?.response?.data?.error)
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  const { permissions } = useSelector((state) => state.auth);

  const columns = [
    {
      title: "Sr.No.",
      render: (item, index) => (
        <>{page * perPageItem - perPageItem + (index + 1)}</>
      ),
      width: 40,
    },

    {
      title: "sector",
      dataIndex: "sectorName",
      key: "sectorName",
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
                  <Link
                    className="btn-edit-user me-1"
                    onClick={() => (
                      setOpenUpdate(true),
                      validationUpdate.setFieldValue(
                        "sectorId",
                        item?.sectorId
                      ),
                      validationUpdate.setFieldValue(
                        "sectorName",
                        item?.sectorName
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
                  </Link>
                </div>
              )}

              {hasComponentPermission(permissions, 62) && (
                <div className="d-flex justify-content-center">
                  <Link
                    className="btn-trash"
                    onClick={() => handleOpenDelete(item?.sectorId)}
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

  const [sectorList, setSectorList] = useState([]);

  const getSectorList = async () => {
    try {
      setIsLoading(true);
      const response = await get(
        `/sectors-list?page=${page}&perPage=${perPageItem}`
      );
      setSectorList(response?.data?.data);
      let totalPages = response.data.total / response.data.perPage;
      setTotalCount(Math.ceil(totalPages));
      // setPerPageItem(response.data.perPage);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    hasComponentPermission(permissions, 59) && getSectorList();
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
      const responseData = await get(`/delete-sector?sectorId=${deleteId}`);
      setOpen(false);
      setIsLoading(false);
      getSectorList();
      toast.success(responseData?.data?.message);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const validationUpdate = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      sectorName: "",
      image: null,
      description: "",
    },
    validationSchema: Yup.object({
      sectorName: Yup.string()
        .required("Please Enter Sector Name")
        .matches(/^[^\d]*$/, "Digits are not allowed"),
    }),

    onSubmit: async (values, { resetForm }) => {
      let data = {
        sectorId: values.sectorId,
        sectorName: values.sectorName,
      };
      try {
        setIsLoading(true);
        const response = await post(`update-sectors`, data);
        setIsLoading(false);
        toast.success(response?.data?.message);

        resetForm({
          sectorName: "",
          image: null,
          description: "",
        });

        getSectorList();
        setOpenUpdate(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });
  console.log("errors", validationUpdate.errors);

  // to update record start
  const [openUpdate, setOpenUpdate] = React.useState(false);

  // to update record end

  return (
    <section>
      {hasComponentPermission(permissions, 58) && (
        <div className="card">
          <div className="card-body">
            <form
              className="needs-validation"
              onSubmit={validation.handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-6 col-12">
                  <div className="mb-3">
                    <label>
                      Sector Name
                      <span className="error-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="sectorName"
                      id="sectorName"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.sectorName}
                    />
                    {validation.touched.sectorName &&
                    validation.errors.sectorName ? (
                      <span className="error">
                        {validation.errors.sectorName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-4 col-lg-3 col-sm-6 col-12 d-flex align-items-center mt-1">
                  <button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={isLoading}
                  >
                    Add
                  </button>
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
                  data={sectorList}
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
              <h3 className="info-text text-center mb-2">Update</h3>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div>
                <div className="lg:mb-3 mb-3 md:mb-3 form-group">
                  <label className="text-base">Sector</label>
                  <input
                    type="text"
                    className="referral-input1 relative form-control"
                    placeholder="Enter Sector Name"
                    id="sector"
                    name="sectorName"
                    onChange={validationUpdate.handleChange}
                    value={validationUpdate.values.sectorName}
                  />
                  {validationUpdate.touched.sectorName &&
                  validationUpdate.errors.sectorName ? (
                    <span className="error">
                      {validationUpdate.errors.sectorName}
                    </span>
                  ) : null}
                </div>

                <button
                  className="btn btn-submit btn-primary  d-flex items-center mx-auto justify-center"
                  onClick={validationUpdate.handleSubmit}
                  type="button"
                  disabled={isLoading}
                >
                  {isLoading ? "updating..." : "update"}
                </button>
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </section>
  );
};
export default Sector;
