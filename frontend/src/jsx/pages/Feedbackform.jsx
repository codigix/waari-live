import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import ErrorMessageComponent from "../../jsx/components/Dashboard/FormErrorComponent/ErrorMessageComponent";
import { post } from "../../services/apiServices";
import * as Yup from "yup";
import { toast } from "react-toastify";

const initialValues = {
	tourName: "",
	name: "",
	email: "",
	contact: "",
	startDate: "",
	endDate: "",
	feedback: "",
};

const validationSchema = Yup.object().shape({
	tourName: Yup.string()
		.min(3, "Please enter Valid Tour Name")
		.max(50, "Please enter Valid Tour Name")
		.required("Please enter a tour name"),
	name: Yup.string()
		.min(3, "Please enter Valid Name")
		.max(50, "Please enter Valid Name")
		.required("Please enter your name"),
	email: Yup.string().email("Invalid email").required("Please enter the email"),
	contact: Yup.string()
		.matches(/^\d+$/, "Contact number must be numeric")
		.min(10, "Contact must be at least 10 digits long")
		.required("Please enter the Contact Number")
		.max(10, "Contact must be at at most 10 digits long"),
	startDate: Yup.date().required("Tour Start Date is required"),
	endDate: Yup.date().required("Tour End Date is required"),
	feedback: Yup.string()
		.min(5, "Please write at least 5 characters")
		.max(250, "Please write maximum 250 characters")
		.required("Please enter your valuable feedback"),
});

const Feedbackform = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema,
		onSubmit: async (values) => {

			try {
        setIsSubmitting(true);
        
        console.log(values);

				// post api call
				const result = await post("add-user-feedback", values);
				toast.success(
					result?.data?.message || "Feedback submitted successfully, Thanks"
				);

        formik.setValues(initialValues)
        formik.setTouched({}); // Reset touched state

				setIsSubmitting(false);
			} catch (error) {
				console.error(error);
				setIsSubmitting(false);
			}
		},
	});

	useEffect(() => {
		const textarea = document.getElementById("resizableTextarea");

		const adjustTextareaHeight = () => {
			textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
			textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
		};

		textarea.addEventListener("input", adjustTextareaHeight);

		return () => {
			// Clean up the event listener when the component unmounts
			textarea.removeEventListener("input", adjustTextareaHeight);
		};
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
    formik.handleSubmit();
    return
	};

	return (
		<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
			<div className="d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
				<div className="bg-white feedbackform">
					<h3 className="mb-3 text-center">
						<strong>Feedback Form</strong>
					</h3>
					<form
						onSubmit={handleSubmit}
						className="login-form shadow-md rounded-lg  mb-4"
					>
						<div className="form-group mb-3">
							<label className="mb-1" htmlFor="val-email">
								<strong>Tour Name <label className="error-star">*</label></strong>
							</label>
							<div>
								<input
									type="text"
									className="form-control"
									placeholder="Tour Name"
									value={formik.values.tourName}
									{...formik.getFieldProps("tourName")}
								/>
								<ErrorMessageComponent
									errors={formik.errors}
									fieldName={"tourName"}
									touched={formik.touched}
								/>
							</div>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>Name<label className="error-star">*</label></strong>
							</label>

							<input
								type="text"
								className="form-control"
								placeholder="Name"
								value={formik.values.name}
								{...formik.getFieldProps("name")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"name"}
								touched={formik.touched}
							/>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>Mail Id <label className="error-star">*</label></strong>
							</label>

							<input
								type="email"
								className="form-control"
								placeholder="Email Id"
								value={formik.values.email}
								{...formik.getFieldProps("email")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"email"}
								touched={formik.touched}
							/>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>Contact No.<label className="error-star">*</label></strong>
							</label>

							<input
								type="tel"
								className="form-control"
								placeholder="Contact Number"
								maxLength={10}
								value={formik.values.contact}
								{...formik.getFieldProps("contact")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"contact"}
								touched={formik.touched}
							/>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>Start Date<label className="error-star">*</label></strong>
							</label>

							<input
								type="date"
								className="form-control"
								placeholder="start Date"
								value={formik.values.startDate}
								{...formik.getFieldProps("startDate")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"startDate"}
								touched={formik.touched}
							/>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>End Date <label className="error-star">*</label></strong>
							</label>

							<input
								type="date"
								className="form-control"
								placeholder="End Date"
								value={formik.values.endDate}
								{...formik.getFieldProps("endDate")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"endDate"}
								touched={formik.touched}
							/>
						</div>
						<div className="form-group mb-3">
							<label className="mb-1">
								<strong>Feedback <label className="error-star">*</label></strong>
							</label>

							<textarea
								type="textarea"
								className="textarea"
								id="resizableTextarea"
								placeholder="Feedback"
								value={formik.values.feedback}
								{...formik.getFieldProps("feedback")}
							/>
							<ErrorMessageComponent
								errors={formik.errors}
								fieldName={"feedback"}
								touched={formik.touched}
							/>
						</div>
						<div className="row justify-content-center d-flex mt-3">
							<div className="col-md-4">
								<div className="text-center form-group mb-3">
									<button
										disabled={isSubmitting}
										type="submit"
										className="btn btn-primary btn-submit btn-block"
									>
										{isSubmitting ? "Submitting..." : "Submit"}
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Feedbackform;
