import React, { useEffect, useState } from "react";
import Select from "react-select";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../../services/apiServices";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Delete from "../../../../images/delete.png";
import * as XLSX from "xlsx";
import BackButton from "../../common/BackButton";

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

const TailorMadeToursList = () => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useSelector((state) => state.auth);

  // to delete record start
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = useState("");

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const [render, setRender] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(null);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const responseData = await get(
        `/delete-tailor-made-list?tailorMadeId=${deleteId}`
      );
      setOpen(false);
      setRender(!render);
      setIsLoading(false);

      toast.success(responseData?.data?.message);
    } catch (error) {
      setIsLoading(false);
    }
  };
  // to delete record end

  // search parameters start
  const [tourName, setTourName] = useState("");
  const [tourType, setTourType] = useState(null);
  const [travelMonth, setTravelMonth] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [departureType, setDepartureType] = useState("");
  const [city, setCity] = useState(null);
  const [tourTypeOptions, setTourTypeOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [isExporting, setIsExporting] = useState(false);

  // search parameters end
  //get tour type
  const getTourTypeList = async () => {
    try {
      const response = await get(`/tour-type-list`);
      setTourTypeOptions(
        response.data.data.map((m) => ({
          value: m.tourTypeId,
          label: m.tourTypeName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  //get city data
  const getCityList = async () => {
    try {
      const response = await get(`/city-list`);
      setCityOptions(
        response.data.data.map((m) => ({
          label: m.citiesName,
          value: m.citiesId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  //  // Function to handle download when button is clicked
  //  const handleDownload = (pdfUrl, tourName) => {
  // 	if (pdfUrl) {
  // 	  // Create a hidden anchor element
  // 	  const anchor = document.createElement('a');
  // 	  anchor.style.display = 'none';
  // 	  anchor.href = pdfUrl;
  // 	  anchor.download = `${tourName}.pdf`;
  // 	  document.body.appendChild(anchor);
  // 	  anchor.click();
  // 	  document.body.removeChild(anchor);
  // 	} else {
  // 	  console.error('PDF URL is empty');
  // 	}
  //   };

  //TABLE COLOMN
  // const exportToExcel = async (enquiryId, tourName) => {
  // 	try {
  // 		setIsExporting(true);

  // 		const response = await get(`guests-group-tour?tailorMadeId=${enquiryId}`);
  // 		const headers = [
  // 			"Sr. No.",
  // 			"familyHeadName",
  // 			"Gender",
  // 			"Contact",
  // 			"Address",
  // 			"Date of Birth",
  // 			"Aadhaar Number",
  // 		];

  // 		// Map the data to use custom headers
  // 		const mappedData = response.data?.data?.map(
  // 			(
  // 				{ familyHeadName, gender, contact, address, dob, adharNo },
  // 				index
  // 			) => ({
  // 				"Sr. No.": index + 1,
  // 				familyHeadName: familyHeadName,
  // 				Gender: gender,
  // 				Contact: contact || "-",
  // 				Address: address,
  // 				"Date of Birth": dob,
  // 				"Aadhaar Number": adharNo,
  // 			})
  // 		);

  // 		// Create a worksheet
  // 		const ws = XLSX.utils.json_to_sheet(mappedData, { header: headers });

  // 		// Create a workbook
  // 		const wb = XLSX.utils.book_new();
  // 		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 		// Save the workbook to a file
  // 		XLSX.writeFile(wb, `${tourName}.xlsx`);

  // 		setIsExporting(false);
  // 	} catch (err) {
  // 		setIsExporting(false);
  // 		console.error(err);
  // 	}
  // };

  const generatePdf = async (tourId) => {
    setIsGeneratingPdf(tourId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_WAARI_BASEURL}/generate-predeparture-pdf`,
        { groupTourId: tourId },
        { headers: { token: token } }
      );
      if (response.data.success) {
        toast.success("PDF generated successfully!");
        // Download the PDF
        if (response.data.url) {
          // Fetch the PDF as blob to force download
          const backendOrigin = import.meta.env.VITE_WAARI_BASEURL.replace(
            "/api",
            ""
          );
          const pdfUrl = `${backendOrigin}${response.data.url}`;

          fetch(pdfUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `predeparture_${tourId}.pdf`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            })
            .catch((error) => {
              console.error("Download error:", error);
              toast.error("Failed to download PDF");
            });
        }
      } else {
        toast.error(response.data.message || "Failed to generate PDF");
      }
    } catch (error) {
      toast.error(
        "Error generating PDF: " +
          (error.response?.data?.message || error.message)
      );
      console.error("PDF generation error:", error);
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  const columns = [
    {
      title: "Tour Id",
      dataIndex: "tailorMadeId",
      key: "tailorMadeId",
      width: 50,
    },
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
      width: 150,
      sortable: true,
    },
    {
      title: "Tour Code",
      dataIndex: "tourCode",
      key: "tourCode",
      width: 100,
      sortable: true,
    },
    {
      title: "Tour Type",
      dataIndex: "tourTypeName",
      key: "tourTypeName",
      width: 100,
      sortable: true,
    },

    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 70,
    },

    {
      title: "Total Seats",
      dataIndex: "totalSeats",
      key: "totalSeats",
      width: 70,
    },
    // {
    // 	title: "Seats Booked",
    // 	dataIndex: "seatsBook",
    // 	key: "seatsBook",
    // 	width: 70,
    // },
    // {
    // 	title: "Available",
    // 	dataIndex: "seatsAval",
    // 	key: "seatsAval",
    // 	width: 70,
    // },
    {
      title: "View",
      render: (item) => (
        <>
          <div className="d-flex justify-content-center">
            <span
              onClick={() =>
                navigate(`/view-tailormade-tour-details/${item.tailorMadeId}`)
              }
            >
              <Link className="btn-tick me-2">
                <Tooltip title="View">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 576 512"
                  >
                    <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                  </svg>
                </Tooltip>
              </Link>
            </span>

            {hasComponentPermission(permissions, 351) && (
              <span
                className=""
                onClick={() => {
                  navigate(`/edit-tailormade-tour/${item?.tailorMadeId}`);
                }}
              >
                <Link
                  // to="/group-edit-tour"
                  className=" btn-tick me-2"
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
              </span>
            )}

            {/* <span
							className=""
							onClick={() => navigate(`/copy-group-tour/${item?.tailorMadeId}`)}
						>
							<Link className="btn-copy me-2">
								<Tooltip title="Copy">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="1em"
										viewBox="0 0 448 512"
									>
										<path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" />
									</svg>
								</Tooltip>
							</Link>
						</span> */}

            {hasComponentPermission(permissions, 352) && (
              <Link
                className="btn-trash me-1"
                onClick={() => handleOpenDelete(item?.tailorMadeId)}
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
            )}

            {/* <button
							onClick={() => exportToExcel(item.tailorMadeId, item.tourName)}
							className="btn-tick btn-excel"
						>
							<Tooltip title="Download Booked Guests Data">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 384 512"
								>
									<path d="M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
								</svg>
							</Tooltip>
						</button> */}
          </div>
        </>
      ),
      key: "view",
      width: 150,
    },
    {
      title: "PDF",
      render: (item) => (
        <>
          <div className="d-flex justify-content-center gap-2">
            {item.pdfUrl ? (
              <a target="_blank" href={item.pdfUrl}>
                <button className="btn-tick me-2">
                  <Tooltip title="PDF">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-cloud-download"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                      <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
                    </svg>
                  </Tooltip>
                </button>
              </a>
            ) : (
              "-"
            )}

            <button
              className="btn-tick"
              onClick={() => generatePdf(item.tailorMadeId)}
              disabled={isGeneratingPdf === item.tailorMadeId}
              title="Download PDF"
            >
              {isGeneratingPdf === item.tailorMadeId ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <Tooltip title="Download PDF">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cloud-download"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                    <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
                  </svg>
                </Tooltip>
              )}
            </button>
          </div>
        </>
      ),
      key: "view",
      width: 80,
    },
  ];

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

  //to start get tour group list
  const [data, setData] = useState([]);

  // const getTailorMadeToursList = async () => {
  // 	try {
  // 		setIsLoading(true);
  // 		const response = await get(
  // 			`/view-tailor-made?perPage=${perPageItem}&page=${page}&tourName=${tourName}&tourType=${
  // 				tourType?.value || ""
  // 			}&travelMonth=${travelMonth}&totalDuration=${totalDuration}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}&departureType=${departureType}&cityId=${
  // 				city?.value || ""
  // 			}`
  // 		);
  // 		setIsLoading(false);
  // 		setData(response?.data?.data);
  // 		let totalPages = response.data.total / response.data.perPage;
  // 		setTotalCount(Math.ceil(totalPages));
  // 		setPerPageItem(response.data.perPage);
  // 	} catch (error) {
  // 		setIsLoading(false);
  // 		console.log(error);
  // 	}
  // };

  const getTailorMadeToursList = async () => {
    try {
      setIsLoading(true);

      // if you don’t have a real tailorMadeId, just send 0
      const tailorMadeId = 0;

      const response = await get(
        `/view-tailor-made?perPage=${perPageItem}&page=${page}&tourName=${tourName}&tourType=${
          tourType?.value || ""
        }&travelMonth=${travelMonth}&totalDuration=${totalDuration}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}&departureType=${departureType}&cityId=${
          city?.value || ""
        }&tailorMadeId=${tailorMadeId}` // 👈 always appended
      );

      setIsLoading(false);
      setData(response?.data?.data);

      let totalPages = response.data.total / response.data.perPage;
      setTotalCount(Math.ceil(totalPages));
      setPerPageItem(response.data.perPage);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    hasComponentPermission(permissions, 348) && getTailorMadeToursList();
  }, [page, perPageItem, render]);
  // to get the tour group list
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };
  useEffect(() => {
    getTourTypeList();
    getCityList();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-12" style={{ paddingTop: "40px" }}>
          <div className="card">
            <div className="row page-titles mx-0 fixed-top-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="javascript:void(0)">View Tour</Link>
                </li>
                <li className="breadcrumb-item  ">
                  <Link to="/tailormade-tours">Tailor Made Tours</Link>
                </li>
              </ol>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              {hasComponentPermission(permissions, 347) && (
                <div className="d-flex mb-3 justify-content-end">
                  <Link
                    to="/add-new-tailor-made"
                    className="btn  add-btn btn-secondary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      className="svg-add"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                    Add Tour
                  </Link>
                </div>
              )}
              {hasComponentPermission(permissions, 348) && (
                <form>
                  <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Tour Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          onChange={(e) => setTourName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Tour type</label>
                        <Select
                          styles={customStyles}
                          id="tours"
                          name="tours"
                          options={tourTypeOptions}
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(e) => setTourType(e)}
                          value={tourType}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Travel Month</label>
                        <input
                          type="month"
                          className="form-control"
                          placeholder="Search..."
                          onChange={(e) => setTravelMonth(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Total Duration(days)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                          onChange={(e) => setTotalDuration(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Travel Date Start From</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Search..."
                          onChange={(e) => setTravelStartDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>Travel Date End To</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Search..."
                          onChange={(e) => setTravelEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                      <div className="mb-2">
                        <label>City</label>
                        <Select
                          styles={customStyles}
                          className="basic-single"
                          classNamePrefix="select"
                          name="color"
                          options={cityOptions}
                          onChange={(e) => setCity(e)}
                          value={city}
                        />
                      </div>
                    </div>
                    <div className="col-md-1 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mb-2 filter-btn"
                        onClick={() => {
                          setPage(1);
                          getTailorMadeToursList();
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasComponentPermission(permissions, 348) && (
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <Table
                  cols={columns}
                  page={page}
                  data={data}
                  handlePageChange={handleChange}
                  totalPages={totalCount}
                  isTableLoading={isLoading}
                  handleRowsPerPageChange={handleRowsPerPageChange}
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
              <h3 className="info-text text-center mb-2">Delete</h3>
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
    </>
  );
};
export default TailorMadeToursList;
