import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { get, post } from "../../../../../services/apiServices";
import axios from "axios";
import { toast } from "react-toastify";
import { ToWords } from "to-words";
import { NoImage } from "../../../../utils/assetsPaths";

const Payment = ({ enquiryId, familyHead, totalData, moveToStep4 }) => {
	// to- words
	const toWords = new ToWords({
		localeCode: "en-IN",
		converterOptions: {
			currency: true,
			ignoreDecimal: false,
			ignoreZeroCurrency: false,
			doNotAddOnly: false,
			currencyOptions: {
				// can be used to override defaults for the selected locale
				name: "Rupee",
				plural: "Rupees",
				symbol: "₹",
				fractionalUnit: {
					name: "Paisa",
					plural: "Paise",
					symbol: "",
				},
			},
		},
	});

	// end to words
	const [sameBillingName, setSameBillingName] = useState(false);
	const [sameAddress, setSameAddress] = useState("");
	const [sameContact, setSameContact] = useState("");

	const [grandTotal, setgrandTotal] = useState("");

	const navigate = useNavigate();

	const showSameBillingName = async (event) => {
		if (event.target.checked) {
			validation.setFieldValue("billingname", familyHead.familyHeadName);
		} else {
			validation.setFieldValue("billingname", "");
		}
		setSameBillingName(!sameBillingName);
	};
	const showSameAddress = async (event) => {
		if (event.target.checked) {
			validation.setFieldValue("address", familyHead.address);
		} else {
			validation.setFieldValue("address", "");
		}
		setSameAddress(!sameAddress);
	};
	const showSameContact = async (event) => {
		if (event.target.checked) {
			validation.setFieldValue("phoneno", familyHead.contact);
		} else {
			validation.setFieldValue("phoneno", "");
		}
		setSameContact(!sameContact);
	};

	const [isLoading, setIsLoading] = useState(false);
	const [paymentMode, setPaymentMode] = useState([]);

	const getPaymentModeId = async () => {
		try {
			const response = await get(`/payment-mode-list`);

			const mappedData = response.data.data.map((item) => ({
				value: item.paymentModeId,
				label: item.paymentModeName,
			}));
			setPaymentMode(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPaymentModeId();
	}, []);

	const getPaymentDetails = async () => {
		try {
			const response = await get(
				`/get-payment-calculation-gt?familyHeadGtId=${familyHead.familyHeadGtId}&enquiryGroupId=${enquiryId}`
			);

			const data = response.data?.data;

			// set data for all fields

			validation.setFieldValue(
				"totaltourprice",
				Math.ceil(data.grandTotal) || ""
			);
			validation.setFieldValue("advanced", data.advancePayment || "");
			validation.setFieldValue("billingname", data.billingName || "");
			validation.setFieldValue("address", data.address || "");
			validation.setFieldValue("phoneno", data.phoneNo || "");
			validation.setFieldValue("gstin", data.gstin || "");
			validation.setFieldValue("pan", data.panNo || "");
			validation.setFieldValue("paymentmode", data.paymentModeId || "");
			validation.setFieldValue("onlinemode", data.onlineTypeId || "");
			
			validation.setFieldValue("cardType", data.cardTypeId || "");


			validation.setFieldValue("bankname", data.bankName || "");
			validation.setFieldValue("chequeno", data.chequeNo || "");
			validation.setFieldValue("dateofpayment", data.paymentDate || "");
			validation.setFieldValue("transactionid", data.transactionId || "");
			validation.setFieldValue("proof", data.transactionProof || "");
			// validation.setFieldValue("balance", data.balance || "");
			// validation.setFieldValue("amount", data.amount || "");

			setgrandTotal(data.grandTotal);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getPaymentDetails();
	}, []);

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

	const [onlinemode, setOnlineMode] = useState([]);
	const getOnlineModeId = async () => {
		try {
			const response = await get(`/online-type-list`);

			const mappedData = response.data.data.map((item) => ({
				value: item.onlineTypeId,
				label: item.onlineTypeName,
			}));
			setOnlineMode(mappedData);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getOnlineModeId();
	}, []);

	const [cardTypeDropDown, setCardTypeDropDown] = useState([]);
    const getCardTypeDropDownList = async () => {
        try {
            const response = await get(`/card-type-list`);

            const mappedData = response.data.data.map((item) => ({
                value: item.cardTypeId,
                label: item.cardTypeName,
            }));
            setCardTypeDropDown(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCardTypeDropDownList();
    }, []);


	// file upload start
	const url = import.meta.env.VITE_WAARI_BASEURL;

	// file upload end

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
	const validation = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,

		initialValues: {
			totaltourprice: "",
			advanced: "",
			billingname: familyHead.familyHeadName,
			address: familyHead.address,
			phoneno: familyHead.contact,
			gstin: "",
			pan: "",
			paymentmode: "",
			onlinemode: "",
			
			cardType: "", // Debit or Credit Card Type
			

			bankname: "",
			chequeno: "",
			dateofpayment: "",
			transactionid: "",
			proof: "",
			balance: "",
			amount: "",
		},
		validationSchema: Yup.object({
			pan: Yup.string()
				.min(10, "Pan card number must be at least 10 characters long")
				.max(10, "Pan card number must be at atmost 10 characters long")
				.required("Enter the Pan Number"),
			totaltourprice: Yup.string().required("Enter the Grand Total Price"),
			advanced: Yup.string().required("Enter the Advance Payment"),
			billingname: Yup.string().required("Enter the Name"),
			address: Yup.string().required("Enter the Address"),
			phoneno: Yup.string()
				.min(10, "Phone number must be at least 10 digits long")
				.max(10, "Phone number must be at atmost 10 digits long"),
			paymentmode: Yup.string().required("Select Payment Mode"),
			onlinemode: Yup.string().when("paymentmode", {
				is: (mode) => mode == 1, // Apply validation when paymentMode is 'online'
				then: Yup.string().required("Select The Online Mode"),
				otherwise: Yup.string(),
			}),

						
            // New Validations for Card Type
            cardType: Yup.string().when("paymentmode", {
                is: (mode) => mode == 4, // Apply validation when paymentMode is 'Cards'
                then: Yup.string().required("Select The Card Type"),
                otherwise: Yup.string(),
            }),

			bankname: Yup.string().when("paymentmode", {
				is: (mode) => mode == 2, // Apply validation when paymentMode is 'online'
				then: Yup.string().required("Enter The Bank Name"),
				otherwise: Yup.string(),
			}),
			transactionid: Yup.string().when("paymentmode", {
				is: (mode) => mode == 1, // Apply validation when paymentMode is 'online'
				then: Yup.string().required("Enter The Transaction Id"),
				otherwise: Yup.string(),
			}),
			chequeno: Yup.string().when("paymentmode", {
				is: (mode) => mode == 2, // Apply validation when paymentMode is not 'online'
				then: Yup.string().required("Enter The Cheque No."),
				otherwise: Yup.string(),
			}),
			proof: Yup.string().required("Upload Transaction Proof"),

			dateofpayment: Yup.string().required("Enter the Date of Payment"),
		}),

		onSubmit: async (values) => {
			let data = {
				enquiryGroupId: enquiryId,
				familyHeadGtId: familyHead.familyHeadGtId,

				billingName: values?.billingname,
				address: values?.address,
				phoneNo: values?.phoneno,
				gstin: values?.gstin,
				panNo: values?.pan,
				advancePayment: values?.advanced,
				paymentModeId: values?.paymentmode,
				onlineTypeId: values?.onlinemode,

				
				cardTypeId: values?.cardType,

				bankName: values?.bankname,
				chequeNo: values?.chequeno,
				paymentDate: values?.dateofpayment,
				transactionId: values?.transactionid,
				transactionProof: values?.proof,
			};
			try {
				setIsLoading(true);
				const response = await post(`/payment-calculation-gt`, data);
				toast.success(response?.data?.message);
				navigate("/group-tour");
				setIsLoading(false);
				console.log(
					"data from payment Details last step of enquiry complete",
					data
				);
			} catch (error) {
				setIsLoading(false);
				console.log(error);
			}
		},
	});

	// to-words in amount
	const amountInWords = validation.values.advanced
		? toWords.convert(validation.values.advanced, { currency: true })
		: "-";

	const customStyles = {
		control: (provided, state) => ({
			...provided,
			height: "34px", // Adjust the height to your preference
		}),
	};
	return (
		<section>
			<form
				className="needs-validation pt-2"
				onSubmit={(e) => {
					e.preventDefault();
					validation.handleSubmit();
					return false;
				}}
			>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Grand Total Tour Price<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<input
							type="text"
							name="totaltourprice"
							className="form-control grand-price"
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							value={grandTotal}
							disabled
						/>
						{validation.touched.totaltourprice &&
						validation.errors.totaltourprice ? (
							<span className="error">{validation.errors.totaltourprice}</span>
						) : null}
					</div>
				</div>

				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Billing Name<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<input
							type="text"
							name="billingname"
							className="form-control"
							required
							onChange={sameBillingName ? null : validation.handleChange}
							onBlur={sameBillingName ? null : validation.handleBlur}
							value={
								sameBillingName
									? familyHead.familyHeadName
									: validation.values.billingname
							}
							disabled
						/>
						{validation.touched.billingname && validation.errors.billingname ? (
							<span className="error">{validation.errors.billingname}</span>
						) : null}
					</div>
					<div className="col-sm-4">
						<div className="form-check mb-2">
							<input
								onChange={showSameBillingName}
								type="checkbox"
								className="form-check-input"
								id="check1"
								value=""
								disabled
							/>
							<label className="form-check-label" htmlFor="check1">
								Same as family head
							</label>
						</div>
					</div>
				</div>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Address<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<textarea
							type="text"
							name="address"
							className="textarea"
							onChange={sameAddress ? null : validation.handleChange}
							onBlur={sameAddress ? null : validation.handleBlur}
							value={
								sameAddress ? familyHead.address : validation.values.address
							}
							id="resizableTextarea"
							disabled
						/>
						{validation.touched.address && validation.errors.address ? (
							<span className="error">{validation.errors.address}</span>
						) : null}
					</div>
					<div className="col-sm-4">
						<div className="form-check mb-2">
							<input
								onChange={showSameAddress}
								type="checkbox"
								className="form-check-input"
								id="check2"
								value=""
								disabled
							/>
							<label className="form-check-label" htmlFor="check2">
								Same as family head
							</label>
						</div>
					</div>
				</div>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">Phone number</label>
					</div>
					<div className="col-md-6">
						<input
							type="number"
							name="phoneno"
							minLength={10}
							maxLength={10}
							className="form-control"
							onChange={sameContact ? null : validation.handleChange}
							onBlur={sameContact ? null : validation.handleBlur}
							value={
								sameContact ? familyHead.contact : validation.values.phoneno
							}
							disabled
						/>
					</div>
					<div className="col-sm-4">
						<div className="form-check mb-2">
							<input
								onChange={showSameContact}
								type="checkbox"
								className="form-check-input"
								id="check3"
								value=""
								disabled
							/>
							<label className="form-check-label" htmlFor="check3">
								Same as family head
							</label>
						</div>
					</div>
				</div>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">GSTIN</label>
					</div>
					<div className="col-md-6">
						<input
							type="text"
							name="gstin"
							className="form-control"
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							value={validation.values.gstin}
							disabled
						/>
						{validation.touched.gstin && validation.errors.gstin ? (
							<span className="error">{validation.errors.gstin}</span>
						) : null}
					</div>
				</div>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">PAN number</label>
					</div>
					<div className="col-md-6">
						<input
							type="text"
							name="pan"
							className="form-control"
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							value={validation.values.pan}
							disabled
						/>
						{validation.touched.pan && validation.errors.pan ? (
							<span className="error">{validation.errors.pan}</span>
						) : null}
					</div>
				</div>
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Payment mode<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<Select
							styles={customStyles}
							className="basic-single"
							classNamePrefix="select"
							// isLoading={isLoading}
							// isClearable={isClearable}
							// isSearchable={isSearchable}
							name="paymentmode"
							options={paymentMode}
							// onChange={validation.handleChange}
							// onBlur={validation.handleBlur}
							// value={validation.values.paymentmode}
							isDisabled
							onChange={(selectedOption) => {
								validation.setFieldValue(
									"paymentmode",
									selectedOption ? selectedOption.value : ""
								); // Extract the 'value' property
								validation.setFieldValue("proof", "");
								validation.setFieldValue("onlinemode", "");
								validation.setFieldValue("bankname", "");
								validation.setFieldValue("chequeno", "");
								validation.setFieldValue("transactionid", "");
							}}
							onBlur={validation.handleBlur}
							value={paymentMode.find(
								(option) => option.value === validation.values.paymentmode
							)}
						/>
						{validation.touched.paymentmode && validation.errors.paymentmode ? (
							<span className="error">{validation.errors.paymentmode}</span>
						) : null}
					</div>
				</div>
				{validation.values.paymentmode == 1 && (
					<div className="row mb-2 form-group">
						<div className="col-md-2">
							<label className="text-label">
								Online Transaction<span className="error-star">*</span>
							</label>
						</div>
						<div className="col-md-6">
							<Select
								isDisabled
								styles={customStyles}
								className="basic-single"
								classNamePrefix="select"
								// isLoading={isLoading}
								// isClearable={isClearable}
								// isSearchable={isSearchable}
								name="onlinemode"
								options={onlinemode}
								// onChange={validation.handleChange}
								// onBlur={validation.handleBlur}
								// value={validation.values.onlinemode}
								onChange={(selectedOption) => {
									validation.setFieldValue(
										"onlinemode",
										selectedOption ? selectedOption.value : ""
									); // Extract the 'value' property
								}}
								onBlur={validation.handleBlur}
								value={onlinemode.find(
									(option) => option.value === validation.values.onlinemode
								)}
							/>
							{validation.touched.onlinemode && validation.errors.onlinemode ? (
								<span className="error">{validation.errors.onlinemode}</span>
							) : null}
						</div>
					</div>
				)}

				
{validation.values.paymentmode == 4 && (
                    <div className="row mb-2 form-group">
                        <div className="col-md-2">
                            <label className="text-label">
                                Card Type<span className="error-star">*</span>
                            </label>
                        </div>
                        <div className="col-md-6">
                            <Select
                                styles={customStyles}
                                className="basic-single"
                                classNamePrefix="select"
                                name="cardType"
                                options={cardTypeDropDown}
                                onChange={(selectedOption) => {
                                    validation.setFieldValue(
                                        "cardType",
                                        selectedOption ? selectedOption.value : ""
                                    ); // Extract the 'value' property
                                }}
                                onBlur={validation.handleBlur}
                                value={cardTypeDropDown.find(
                                    (option) => option.value === validation.values.cardType
                                )}
                            />
                            {validation.touched.cardType && validation.errors.cardType ? (
                                <span className="error">{validation.errors.cardType}</span>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* ---------------------------------------------------- When Selected Credit or Debit Card - Then Shows Card Fields */}



				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Advance payment<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<input
							disabled
							type="number"
							name="advanced"
							className="form-control"
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							value={validation.values.advanced}
						/>
						{validation.touched.advanced && validation.errors.advanced ? (
							<span className="error">{validation.errors.advanced}</span>
						) : null}
					</div>
				</div>

				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">Amount(In words)</label>
					</div>
					<div className="col-md-6">
						<input
							type="text"
							name="amount"
							className="form-control"
							value={amountInWords}
							disabled
						/>
					</div>
				</div>
				{validation.values.paymentmode == 2 && (
					<div className="row mb-2 form-group">
						<div className="col-md-2">
							<label className="text-label">
								Bank Name<span className="error-star">*</span>
							</label>
						</div>
						<div className="col-md-6">
							<input
								disabled
								type="text"
								name="bankname"
								className="form-control"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.bankname}
							/>
							{validation.touched.bankname && validation.errors.bankname ? (
								<span className="error">{validation.errors.bankname}</span>
							) : null}
						</div>
					</div>
				)}

				{validation.values.paymentmode == 2 && (
					<div className="row mb-2 form-group">
						<div className="col-md-2">
							<label className="text-label">
								Cheque Number<span className="error-star">*</span>
							</label>
						</div>
						<div className="col-md-6">
							<input
								disabled
								type="text"
								name="chequeno"
								className="form-control"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.chequeno}
							/>
							{validation.touched.chequeno && validation.errors.chequeno ? (
								<span className="error">{validation.errors.chequeno}</span>
							) : null}
						</div>
					</div>
				)}
				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Date of payment<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<input
							disabled
							type="date"
							name="dateofpayment"
							className="form-control"
							onChange={validation.handleChange}
							onBlur={validation.handleBlur}
							value={validation.values.dateofpayment}
						/>
						{validation.touched.dateofpayment &&
						validation.errors.dateofpayment ? (
							<span className="error">{validation.errors.dateofpayment}</span>
						) : null}
					</div>
				</div>
				{validation.values.paymentmode == 1 && (
					<div className="row mb-2 form-group">
						<div className="col-md-2">
							<label className="text-label">
								Transaction ID<span className="error-star">*</span>
							</label>
						</div>
						<div className="col-md-6">
							<input
								disabled
								type="text"
								name="transactionid"
								className="form-control"
								onChange={validation.handleChange}
								onBlur={validation.handleBlur}
								value={validation.values.transactionid}
							/>
							{validation.touched.transactionid &&
							validation.errors.transactionid ? (
								<span className="error">{validation.errors.transactionid}</span>
							) : null}
						</div>
					</div>
				)}

				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">
							Transaction Proof<span className="error-star">*</span>
						</label>
					</div>
					<div className="col-md-6">
						<div className="Neon Neon-theme-dragdropbox cheque-upload">
							<input
								disabled
								className="file_upload"
								name={`proof`}
								accept="image/*"
								id="filer_input2"
								type="file"
								draggable
								onChange={async (e) => {
									const selectedFile = e.target.files[0];
									const fileLink = await getFileLink(selectedFile);
									validation.setFieldValue(`proof`, fileLink);
									e.target.value = "";
								}}
							/>
							<div className="Neon-input-dragDrop">
								{validation.values.proof?.length == 0 ? (
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
										src={validation.values.proof || NoImage}
										alt="frontImage"
										width="100%"
										className="neon-img"
									/>
								)}
							</div>
						</div>
						{validation.touched.proof && validation.errors.proof ? (
							<span className="error">{validation.errors.proof}</span>
						) : null}
					</div>
				</div>

				<div className="row mb-2 form-group">
					<div className="col-md-2">
						<label className="text-label">Balance</label>
					</div>
					<div className="col-md-6">
						<input
							disabled
							type="text"
							name="balance"
							className="form-control balance-input"
							// onChange={validation.handleChange}
							// onBlur={validation.handleBlur}
							onChange={null}
							onBlur={null}
							value={Number(grandTotal) - Number(validation.values.advanced)}
						/>
						{validation.touched.balance && validation.errors.balance ? (
							<span className="error">{validation.errors.balance}</span>
						) : null}
					</div>
				</div>
			</form>
		</section>
	);
};

export default Payment;
