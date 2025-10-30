import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ErrorMessageComponent from "../../../components/Dashboard/FormErrorComponent/ErrorMessageComponent";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import Select from "@mui/material/Select";
import { FormControl, MenuItem } from "@mui/material";



const customStyles = {
	control: (provided, state) => ({
		...provided,
		height: "34px", // Adjust the height to your preference
	}),
};

const initialValues = {
	userId: "",
};

const validationSchema = Yup.object().shape({
	userId: Yup.string().required("Select Sales Agent is required"),
});

function AssignToPopUp({ onClose, selectedTab, selectedEnquiryId }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [salesAgentsList, setSalesAgentsList] = useState([]);


	const fieldKey = selectedTab === "gt" ? "enquiryGroupId" : "enquiryCustomId";

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// 1.get All Values and submit that to api and 2.then Close the Both PopUps and 3.then Refresh Family Members List Data
			try {
				setIsSubmitting(true);
				const data = {
					userId: values.userId,
					[fieldKey]: selectedEnquiryId,
				};
				const result = await post("assign-to-" + selectedTab, data);

				toast.success(result?.data?.message);

				onClose(false);

				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	const getSalesAgentsDropDown = async () => {
		try {
			const response = await get(`sales-under-team-lead`);

			const transformData = response?.data?.data?.map((agent) => ({
				label: agent.userName,
				value: agent.userId,
			}));

			setSalesAgentsList(transformData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getSalesAgentsDropDown();
	}, []);

	console.log("dropdown", salesAgentsList);

	return (
		<>
			<div className="assignpopup">
				<div className="row">
					<div className="col-md-12">
						<form onSubmit={formik.handleSubmit}>
							<h6 className="modal-h6" style={{ marginTop: "0" }}>Credit Note</h6>

							<div className="form-group mb-4"  >
								<label className="form-label">
									Assign Enquiry To
									<span className="error-star">*</span>
								</label>

								{/* <Select
										styles={customStyles}
										maxMenuHeight={500}
										
										className="basic-single select-salution1"
										classNamePrefix="select"
										options={salesAgentsList}
										value={salesAgentsList.find(
											(option) => option.value === formik.values.userId
										)}
										onChange={(selectedOption) => {
											formik.setFieldValue(
												"userId",
												selectedOption ? selectedOption.value : ""
											);
										}}
										onBlur={formik.handleBlur}

									/> */}
								<div>
									<FormControl fullWidth>

										<Select
											id="demo-dialog-select"
											className="material-select"
											// value={salesAgentsList.find(option => option.value === formik.values.userId)}
											value={formik.values.userId || (salesAgentsList.length > 0 ? salesAgentsList[0].value : '0')}
											onChange={(event) => {
												formik.setFieldValue('userId', event.target.value || '');
											}}
											onBlur={formik.handleBlur}
											>
											{/* <MenuItem value=""  >
												Select
											</MenuItem> */}
											{salesAgentsList.map((option) => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<ErrorMessageComponent
										errors={formik.errors}
										fieldName={"userId"}
										touched={formik.touched}
										key={"userId"}
									/>
								</div>
							</div>

							<div className="d-flex justify-content-center mt-3 mb-2">
								<button
									className="btn  pdf-btn filter-btn btn-sm "
									style={{

										margin: "0 10px 0 0",
									}}
									onClick={() => onClose(false)}
								>
									Close
								</button>
								<button
									type="submit"
									className="btn btn-submit btn-primary"
									disabled={isSubmitting}
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default AssignToPopUp;
