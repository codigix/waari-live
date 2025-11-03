import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, post } from "../../../../../services/apiServices";

const Arrivaldetails = ({ familyHead, enquiryId }) => {
	// to get the data start
	const [tourData, setTourData] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// to get the data ends
	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			preFixName: "",
			firstName: "",
			lastName: "",
			tourName: "",
			tourCode: "",
			departureType: "",
			vehicletype: "",
			arrivalTime: "",
			paxNo: "",
			referenceguestid: "",
		},
		validationSchema: Yup.object({
			firstName: Yup.string().required("Enter First Name"),
			lastName: Yup.string().required("Enter Last Name"),

			tourName: Yup.string().required("Enter The Tour Name"),
			tourCode: Yup.string().required("Enter The Tour Code"),
			vehicletype: Yup.object().required("Enter The Vehicle Type"),
			arrivalTime: Yup.string().required("Enter The Time of Arrival"),
			paxNo: Yup.string().required("Enter The Number of paxNo"),
			// referenceguestid: Yup.string().required("Enter The Reference Guest Id"),
		}),

		onSubmit: async (values) => {
			let data = {
				enquiryGroupId: enquiryId,
				familyHeadGtId: familyHead.familyHeadGtId,

				departureTypeId: values.departureType.value,
				travelId: values.vehicletype.value,
				arrivalTime: values.arrivalTime,
				paxNo: values.paxNo,
			};

			// if (Number(values.adults) + Number(values.childs) <= 6) {
			try {
				setIsLoading(true);
				const response = await post(`/arrival-details-gt`, data);
				setIsLoading(false);
				toast.success(response?.data?.message);
				navigate("/group-tour");
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
			// } else {
			// 	toast.error("paxNo size cannot be more then 6 people");
			// }
		},
	});

	const [departureType, setDepartureType] = useState([]);

	const getDepartureType = async (destinationId) => {
		try {
			const response = await get(
				`/departure-type-list?destinationId=${destinationId}`
			);
			const mappedData = response.data.data.map((item) => ({
				value: item.departureTypeId,
				label: item.departureName,
			}));
			setDepartureType(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	// const departureType = [
	// 	{ value: "1", label: "D2D" },
	// 	{ value: "2", label: "Air" },
	// 	{ value: "3", label: "Flight" },
	// ];
	// const modeoftravel = [
	// 	{ value: "1", label: "Train" },
	// 	{ value: "2", label: "Air" },
	// 	{ value: "3", label: "Flight" },
	// ];

	const [vehicletype, setVehicleType] = useState([]);

	const getVehicleType = async (departureType) => {
		try {
			const response = await get(
				`/dropdowbTravelMode?departureTypeId=${departureType}`
			);
			const mappedData = response.data.data.map((item) => ({
				value: item.travelId,
				label: item.traveModeName,
			}));
			setVehicleType(mappedData);
			// if (departureType == 1) {
			// 	const mappedData = response.data.data.map((item) => ({
			// 		value: item.travelId,
			// 		label: item.travelModeName,
			// 	}));
			// 	setVehicleType(mappedData);
			// 	validation.setFieldValue("vehicletype", {
			// 		value: response.data.data[0].travelId,
			// 		label: response.data.data[0].travelModeName,
			// 	});
			// } else {
			// 	validation.setFieldValue("vehicletype", {
			// 		value: response.data.data[0].travelId,
			// 		label: response.data.data[0].travelModeName,
			// 	});
			// }
		} catch (error) {
			console.log(error);
		}
	};


	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};

	useEffect(() => {
		getFamilyHeadDetails();
	}, []);

	const getFamilyHeadDetails = async () => {
		try {
			setIsLoading(true);
			const response = await get(
				`/get-enquiry-familyHeadGt?familyHeadGtId=${familyHead.familyHeadGtId}&enquiryGroupId=${enquiryId}`
			);

			validation.setFieldValue("preFixName", response.data.preFixName);
			validation.setFieldValue("firstName", response.data.firstName);
			validation.setFieldValue("lastName", response.data.lastName);
			validation.setFieldValue("tourName", response.data.tourName);
			validation.setFieldValue("tourCode", response.data.tourCode);

			validation.setFieldValue("departureType", {
				value: response?.data.departureType,
				label: response?.data.departureName,
			});

			getVehicleType(response?.data.departureType);
			getDepartureType(response?.data?.destinationId);

			validation.setFieldValue("paxNo", response.data.paxPerHead);
			validation.setFieldValue("arrivalTime", response.data.arrivalTime || "");

			validation.setFieldValue("vehicletype", {
				value: response.data.travelId,
				label: response.data.travelModeName,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};


	return (
		<>
			<div className="basic-form">
				<form
					className="needs-validation"
					onSubmit={(e) => {
						e.preventDefault();
						validation.handleSubmit();
						return false;
					}}
				>
					<div className="row">
						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								Name Prefix<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								name="preFixName"
								value={validation.values.preFixName}
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								disabled
								style={{ backgroundColor: "#f3f3f3" }}
							/>
						</div>

						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								First Name of Family head<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								name="firstName"
								value={validation.values.firstName}
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								disabled
								style={{ backgroundColor: "#f3f3f3" }}
							/>
						</div>
						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								Last Name<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								name="lastName"
								value={validation.values.lastName}
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								disabled
								style={{ backgroundColor: "#f3f3f3" }}
							/>
						</div>

						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								Tour Name<span className="error-star">*</span>
							</label>
							<input
								type="text"
								className="form-control"
								name="tourName"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.tourName}
								disabled
								style={{ backgroundColor: "#f3f3f3" }}
							/>
							{validation.touched.tourName && validation.errors.tourName ? (
								<span className="error">{validation.errors.tourName}</span>
							) : null}
						</div>
						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								Tour code<span className="error-star">*</span>
							</label>
							<input
								type="tel"
								className="form-control"
								name="tourCode"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.tourCode}
								disabled
								style={{ backgroundColor: "#f3f3f3" }}
							/>
							{validation.touched.tourCode && validation.errors.tourCode ? (
								<span className="error">{validation.errors.tourCode}</span>
							) : null}
						</div>
						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label>
								Departure type<span className="error-star">*</span>
							</label>
							<Select
								styles={customStyles}
								className="basic-single"
								classnamePreFix="select"
								name="departureType"
								options={departureType}
								value={validation.values.departureType}
								isDisabled
							/>
							{validation.touched.departureType &&
							validation.errors.departureType ? (
								<span className="error">{validation.errors.departureType}</span>
							) : null}
						</div>

						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<div className="form-group">
								<label className="text-label">
									Mode of Travel(D2D guest)<span className="error-star">*</span>
								</label>
								<Select
									styles={customStyles}
									className="basic-single"
									classnamePreFix="select"
									name="vehicletype"
									options={vehicletype}
									onChange={(selectedOption) => {
										validation.setFieldValue("vehicletype", selectedOption); // Extract the 'value' property
									}}
									onBlur={validation.handleBlur}
									isDisabled
									value={validation.values.vehicletype}
								/>
								{validation.touched.vehicletype &&
								validation.errors.vehicletype ? (
									<span className="error">{validation.errors.vehicletype}</span>
								) : null}
							</div>
						</div>
						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<label className="form-label">
								Time of arrival at meeting point
								<span className="error-star">*</span>
							</label>
							<input
								type="time"
								className="form-control"
								name="arrivalTime"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.arrivalTime}
								disabled
							/>
						</div>

						<div className="mb-2 col-lg-3 col-md-6 col-sm-6 col-xs-6">
							<div className="form-group">
								<label className="text-label">
									Number of Pax(Max 6)<span className="error-star">*</span>
								</label>
								<input
									type="number"
									name="paxNo"
									max={6}
									min={1}
									className="form-control"
									required
									onChange={validation.handleChange}
									onBlur={validation.handleBlur}
									value={validation.values.paxNo}
									style={{ backgroundColor: "#f3f3f3" }}
									disabled
								/>
								{validation.touched.paxNo && validation.errors.paxNo ? (
									<span className="error">{validation.errors.paxNo}</span>
								) : null}
							</div>
						</div>
					</div>
					{/* <div className="mb-2 mt-2 row">
						<div className="col-lg-12 d-flex justify-content-between">
							<Link to="/group-tour-new" className="btn btn-back">
								Back
							</Link>
							<button type="submit" className="btn btn-submit btn-primary">
								Save
							</button>
						</div>
					</div> */}
				</form>
			</div>
		</>
	);
};
export default Arrivaldetails;
