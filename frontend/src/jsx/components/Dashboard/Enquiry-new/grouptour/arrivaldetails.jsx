import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, post } from "../../../../../services/apiServices";

const Arrivaldetails = ({ familyHead, enquiryId, callbackOnSuccess, redirectForwandOnSuccess }) => {
	// to get the data start
	const [tourData, setTourData] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [alreadyAddedArrivalData, setAlreadyAddedArrivalData] = useState(true);

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
				setIsSubmitting(true);
				const response = await post(`/arrival-details-gt`, data);
				callbackOnSuccess(redirectForwandOnSuccess)
				setIsSubmitting(false);
				toast.success(response?.data?.message);

			} catch (error) {
				setIsSubmitting(false);
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

			if (departureType == 1) {
				const mappedData = response.data.data.map((item) => ({
					value: item.travelId,
					label: item.traveModeName,
				}));
				setVehicleType(mappedData);
				// validation.setFieldValue("vehicletype", {
				// 	value: response.data.data[0].travelId,
				// 	label: response.data.data[0].traveModeName,
				// });
			} else {
				validation.setFieldValue("vehicletype", {
					value: response.data.data[0].travelId,
					label: response.data.data[0].traveModeName,
				});
			}
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

			setAlreadyAddedArrivalData(response?.data?.arrivalTime?.length)

			if (response.data.travelModeName) {
				validation.setFieldValue("vehicletype", {
					value: response.data.travelId,
					label: response.data.travelModeName,
				});
			} 
			
			
		} catch (error) {
			console.log(error);
		} 
	};


	return (
		<>
			<div className="basic-form pt-2">
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
									isDisabled={validation.values.departureType?.value != 1}
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
							/>
								{validation.touched.arrivalTime && validation.errors.arrivalTime ? (
								<span className="error">{validation.errors.arrivalTime}</span>
							) : null}
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
					<div className="mb-2 mt-2 row">
						<div className="col-lg-12 d-flex justify-content-end">
							{/* <Link to="/group-tour-new" className="btn btn-back">
								Back
							</Link> */}
							{alreadyAddedArrivalData ? "" : <button type="submit" className="btn btn-submit btn-primary" disabled={isSubmitting}>
							{ isSubmitting ?"Saving..." : "Save"}
							</button>}
						</div>
					</div>
				</form>
			</div>
		</>
	);
};
export default Arrivaldetails;
