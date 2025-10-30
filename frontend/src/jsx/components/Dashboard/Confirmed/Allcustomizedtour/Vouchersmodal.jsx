import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { post } from "../../../../../services/apiServices";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
const url = import.meta.env.VITE_WAARI_BASEURL;

function Vouchersmodal({ onClose, enquiryCustomId, voucher }) {
	const [uploadedFiles, setUploadedFiles] = useState([]); // to store the uploaded files
	const fileInputRef = useRef(null);
	const [isUploadingVouchers, setIsUploadingVouchers] = useState(false);

	const formik = useFormik({
		initialValues: {
			fileName: "",
		},
		onSubmit: async () => {
			const data = {
				file: uploadedFiles.map((item) => ({ vouchers: item.filePath })),
				voucherTypeId: voucher.voucherTypeId,
				enquiryCustomId: enquiryCustomId,
			};
			try {
				setIsUploadingVouchers(true);
				const response = await post("upload-vouchers", data);
				onClose()
				setUploadedFiles([]);
				setIsUploadingVouchers(false);
				formik.resetForm();
				toast.success(response.data.message);
				// Handle the response here
			} catch (error) {
				setIsUploadingVouchers(false);
				console.log(error);
				// Handle the error here
			}
		},
		validationSchema: Yup.object({
			fileName: Yup.string().required("Required"),
		}),
	});

	const uploadFiles = async (event) => {
		const selectedFiles = event.target.files;
		try {
		  const formData = new FormData();
	
		  for (let i = 0; i < selectedFiles.length; i++) {
			formData.append('files[]', selectedFiles[i]);
		  }
	
		  const response = await axios.post(`${url}/pdf-upload`, formData, {
			'Content-Type': 'multipart/form-data'
		  });
		  setUploadedFiles([...uploadedFiles,...response.data.data])
		  toast.success(response.data.message)
		  formik.setFieldValue('fileName', response.data.data[0].fileName)
		  // Handle the response here
		} catch (error) {
		  fileInputRef.current.value = "";
		  console.log(error);
		  // Handle the error here
		}
	  }


	//delete file on click of close button

	const handleDeleteFile = async (item, index) => {
		try {
			const response = await post("delete-pdf", { fileName: item.fileName });
			toast.success(response.data.message);

			setUploadedFiles(uploadedFiles.filter((item, i) => i !== index));
			// Handle the response here
		} catch (error) {
			console.log(error);
			// Handle the error here
		}
	};

	return (
		<>
			<form className="mt-5">
				<div className="form-group">
					<label className="form-label">{voucher?.voucherName}</label>
					<div class="Neon Neon-theme-dragdropbox">
						<input
							class="file_upload"
							id="filer_input2"
							type="file"
							onChange={uploadFiles}
							ref={fileInputRef}
							multiple
						/>
						<div class="Neon-input-dragDrop">
							<div class="Neon-input-inner ">
								<div class="Neon-input-text">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 384 512"
										className="display-4"
									>
										<path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
									</svg>
								</div>
								<a class="Neon-input-choose-btn blue">
									Drop files here or click to upload.
								</a>
							</div>
						</div>
					</div>
					<ul className="allfilerow list-styled">
						{uploadedFiles.length > 0 &&
							uploadedFiles.map((file, index) => (
								<li className="filecols">
									<div className="uploaded-file d-flex justify-content-between">
										<p className="text-center mb-0">{file.fileName}</p>
										<span onClick={() => handleDeleteFile(file, index)} className="fileclose d-flex justify-content-end text-danger cursor-pointer">
											&times;
										</span>
									</div>
								</li>
							))}
					</ul>
				</div>
				<div className="d-flex justify-content-center mt-3 mb-2">
					<button
						type="button"
						className="btn  pdf-btn filter-btn btn-sm "
						style={{ height: "32px", lineHeight: "1", margin: "0 10px 0 0" }}
						onClick={() => { onClose(false);  setUploadedFiles([])}}
					>
						Close
					</button>
					<button disabled={isUploadingVouchers} onClick={formik.handleSubmit} type="submit" className="btn btn-submit btn-primary">
						Submit
					</button>
				</div>
			</form>
		</>
	);
}

export default Vouchersmodal;
