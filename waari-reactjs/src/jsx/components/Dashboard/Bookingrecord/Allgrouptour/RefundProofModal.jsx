import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import { post } from "../../../../../services/apiServices";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import axios from "axios";
const url = import.meta.env.VITE_WAARI_BASEURL;

const initialValues = {
	refundProof: "",
};

const validationSchema = Yup.object().shape({
	refundProof: Yup.string().required("Refund Proof is required"),
});

const getFileLink = async (file) => {
	try {
		const formData = new FormData();
		formData.append("image", file);
		const responseData = await axios.post(
			`
          ${url}/image-upload`,
			formData
		);
		toast.success("File uploaded successfully");
		return responseData?.data?.image_url;
	} catch (error) {
		toast.error(error?.response?.data?.message?.toString());
		console.log(error);
	}
};

function RefundProofPopUp({ onClose, previousData }) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			// 1.get All Values and submit that to api and 2.then Close the Both PopUps and 3.then Refresh Family Members List Data
			try {
				setIsSubmitting(true);
				const data = {
					...previousData,
					refundProof: values.refundProof,
				};
				const result = await post("upload-refund-proof-gt", data);

				toast.success(result?.data?.message);

				onClose(false);

				setIsSubmitting(false);
			} catch (error) {
				setIsSubmitting(false);
				console.log(error);
			}
		},
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<h6 className="modal-h6">Upload Refund Proof</h6>
				<div>
					<div className="basic-form">
						<div className="row">
							<div className="col-md-12 mb-2">
								<div className="Neon Neon-theme-dragdropbox">
									<input
										className="file_upload"
										name={`refundProof`}
										accept="image/*"
										id="filer_input2"
										type="file"
										draggable
										onChange={async (e) => {
											const selectedFile = e.target.files[0];
											const fileLink = await getFileLink(selectedFile);
											formik.setFieldValue(`refundProof`, fileLink);
										}}
									/>
									<div className="Neon-input-dragDrop">
										{formik.values.refundProof?.length == 0 ? (
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
												src={formik.values.refundProof}
												alt="frontImage"
												width="100%"
												className="neon-img"
											/>
										)}
									</div>
								</div>
								<ErrorMessageComponent
									errors={formik.errors}
									fieldName={"refundProof"}
									touched={formik.touched}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-3 mb-2">
					<button
						className="btn  pdf-btn filter-btn btn-sm "
						style={{ height: "32px", lineHeight: "1", margin: "0 10px 0 0" }}
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
		</>
	);
}

export default RefundProofPopUp;
