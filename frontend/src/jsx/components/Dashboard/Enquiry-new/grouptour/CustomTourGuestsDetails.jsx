import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { get, post } from "../../../../../services/apiServices";
import Select from "react-select";
import { NoImage } from "../../../../utils/assetsPaths";
import { useParams } from "react-router-dom";
const url = import.meta.env.VITE_WAARI_BASEURL;

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: "34px", // Adjust the height to your preference
    }),
};

const initialValuesObject = {
    guestId: "",
    preFixId: "",
    firstName: "",
    lastName: "",
    address: "",
    adharCard: "",
    adharNo: "",
    contact: "",
    dob: "",
    gender: "",
    mailId: "",
    marriageDate: "",
    pan: "",
    panNo: "",
    passport: "",
    passportNo: "",
    roomShareId: "",
    guestId: null,
};

// need to have -

const CustomTourGuestsdetails = () => {
    // to get the no of iteration start
    const [romesharing, setRomeSharing] = useState([]);
    const { enquiryId, familyHeadGtId } = useParams();

    const getRoomSharing = async () => {
        try {
            const response = await get(`/dropdownRoomPrice?enquiryGroupId=${enquiryId}`);

            const mappedData = response.data.data.map((item) => ({
                value: item.roomShareId,
                label: item.roomShareName,
                price: item.offerPrice,
            }));
            setRomeSharing(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRoomSharing();
    }, []);

    const setGuestDetailsValues = (element, index) => {
        const fields = [
            "guestId",
            "preFixId",
            "firstName",
            "lastName",
            "address",
            "adharCard",
            "adharNo",
            "contact",
            "dob",
            "gender",
            "mailId",
            "marriageDate",
            "pan",
            "panNo",
            "passport",
            "passportNo",
            "roomShareId",
            "guestId",
            "destinationId"
        ];

        fields.forEach((field) => {
            validation.setFieldValue(`guestDetails[${index}].${field}`, element?.[field] ?? "");
        });
    };

    useEffect(() => {
        const getGuestsDetails = async () => {
            const response = await get(
                `/get-guest-details-ct?enquiryDetailCustomId=${familyHeadGtId}&enquiryCustomId=${enquiryId}`
            );

            return response.data?.data;
        };

        const fetchData = async () => {
            let guestDetails = await getGuestsDetails();

            if (guestDetails?.length > 0) {
                guestDetails[0].preFixId = guestDetails[0]?.preFixId;
            }

            if (guestDetails?.length > 0) {
                guestDetails.forEach((element, index) => {
                    setGuestDetailsValues(element, index);
                });
            } else {
                getDataFromGuestId();
            }
        };

        fetchData();
    }, []);

    const createInitialValues = (length) => {
        const initialValues = {
            guestid: "",
            guestDetails: Array.from({ length }, () => ({ ...initialValuesObject })),
        };

        return initialValues;
    };

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: createInitialValues(1),
    });

    // to show billing name as head of family start
    const [showIndex, setShowIndex] = useState([]);

    //get data from email

    const [nameOptions, setNameOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ txt: "", index: 0 });
    // Simulating async data fetching (replace with actual API call)
    const fetchNameOptions = async () => {
        try {
            const response = await get(`guest-email?firstName=${searchTerm.txt}`);
            if (response.data.data.length > 0) {
                setNameOptions(response.data.data);
                validation.setFieldValue(
                    `guestDetails[${searchTerm.index}].firstName`,
                    searchTerm.txt
                );
            } else {
                validation.setFieldValue(
                    `guestDetails[${searchTerm.index}].firstName`,
                    searchTerm.txt
                );
                // validation.setFieldValue(
                // 	`guestDetails[${searchTerm.index}].lastName`,
                // 	searchTerm.txt
                // );
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (searchTerm.txt.length > 2) {
            // Call the debouncedFetch function

            fetchNameOptions();
        } else {
            // Reset options when search term is less than or equal to 3 characters
            setNameOptions([]);
        }
    }, [searchTerm.txt]);

    const [preFixId, setpreFixId] = useState([]);

    const getPrefixDropDown = async () => {
        try {
            const response = await get(`/dd-prefix`);

            const mappedData = response.data.data.map((item) => ({
                value: item.preFixId,
                label: item.preFixName,
            }));
            setpreFixId(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPrefixDropDown();
    }, []);

    useEffect(() => {
        // console.log(window.location.href.split("/"));
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        // console.log(path);
        let element = document.getElementById("search-custom-tour-guests");
        // console.log(element);
        if (element) {
            element.classList.add("mm-active1");
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1");
            }
        };
    }, []);

    console.log("guestDetails[index]?.destinationId", validation.values.guestDetails)

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
                <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                    <div className="card-title h5">Guest 1 (Family head)</div>
                </div>

                {validation.values.guestDetails &&
                    validation.values.guestDetails.map((item, index) => {
                        return (
                            <>
                                {index == 0 ? null : (
                                    <div
                                        className="card-header"
                                        style={{ paddingLeft: "0.7rem", marginBottom: "0.1rem" }}
                                    >
                                        <div className="card-title h5">Guest {index + 1}</div>
                                    </div>
                                )}

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            GuestID<span className="error-star">*</span>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={`guestDetails[${index}].guestId`}
                                            value={validation.values.guestDetails[index]?.guestId}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Name Prefix<span className="error-star">*</span>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <Select
                                            isDisabled
                                            styles={customStyles}
                                            className="basic-single"
                                            classpreFixId="select"
                                            options={preFixId}
                                            onChange={(selectedOption) => {
                                                validation.setFieldValue(
                                                    `guestDetails[${index}].preFixId`,
                                                    selectedOption ? selectedOption.value : ""
                                                );
                                            }}
                                            onBlur={validation.handleBlur}
                                            value={preFixId.find(
                                                (option) =>
                                                    option.value ===
                                                    validation.values.guestDetails[index]?.preFixId
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            first Name<span className="error-star">*</span>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <Select
                                            options={nameOptions.map((item) => ({
                                                value: item.guestId,
                                                label: item.firstName,
                                            }))}
                                            isDisabled
                                            isClearable
                                            isSearchable
                                            value={
                                                nameOptions.find(
                                                    (item) =>
                                                        item.firstName ==
                                                        validation.values.guestDetails[index]
                                                            .firstName
                                                )
                                                    ? nameOptions.find(
                                                          (item) =>
                                                              item.firstName ==
                                                              validation.values.guestDetails[index]
                                                                  .firstName
                                                      )
                                                    : {
                                                          value: validation.values.guestDetails[
                                                              index
                                                          ].firstName,
                                                          label: validation.values.guestDetails[
                                                              index
                                                          ].firstName,
                                                      }
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Last Name<span className="error-star">*</span>
                                        </label>
                                    </div>

                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name={`guestDetails[${index}].lastName`}
                                            value={validation.values.guestDetails[index]?.lastName}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Gender<span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex">
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={`guestDetails[${index}].gender`}
                                                        value="male"
                                                        checked={
                                                            validation.values.guestDetails[index]
                                                                ?.gender === "male"
                                                        }
                                                        disabled
                                                    />
                                                    Male
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <label className="form-check-label">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={`guestDetails[${index}].gender`}
                                                        value="female"
                                                        checked={
                                                            validation.values.guestDetails[index]
                                                                ?.gender === "female"
                                                        }
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        disabled
                                                    />
                                                    Female
                                                </label>
                                            </div>
                                            <div className="form-check disabled">
                                                <label className="form-check-label">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name={`guestDetails[${index}].gender`}
                                                        value="others"
                                                        checked={
                                                            validation.values.guestDetails[index]
                                                                ?.gender === "others"
                                                        }
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        disabled
                                                    />
                                                    Others
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Contact Number <span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            minLength={10}
                                            maxLength={10}
                                            id={`guestDetails[${index}].contact`}
                                            name={`guestDetails[${index}].contact`}
                                            value={validation.values.guestDetails[index]?.contact}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Mail Id<span className="error-star"></span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`guestDetails[${index}].mailId`}
                                            name={`guestDetails[${index}].mailId`}
                                            value={validation.values.guestDetails[index]?.mailId}
                                            disabled
                                        />
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
                                            className="textarea"
                                            id={`guestDetails[${index}].address`}
                                            name={`guestDetails[${index}].address`}
                                            value={
                                                showIndex[index]
                                                    ? validation.values.guestDetails[0]?.address
                                                    : validation.values.guestDetails[index]?.address
                                            }
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Date of birth<span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="date"
                                            className="form-control"
                                            max={new Date().toISOString().split("T")[0]}
                                            id={`guestDetails[${index}].dob`}
                                            name={`guestDetails[${index}].dob`}
                                            value={validation.values.guestDetails[index]?.dob}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">Date of marriage</label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id={`guestDetails[${index}].marriageDate`}
                                            name={`guestDetails[${index}].marriageDate`}
                                            onChange={(e) => {
                                                validation.handleChange(e);
                                            }}
                                            value={
                                                validation.values.guestDetails[index]
                                                    ?.marriageDate || ""
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Room Sharing Type<span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            id={`guestDetails`}
                                            name={`guestDetails[${index}].roomShareId`}
                                            className="form-control"
                                            value={
                                                validation.values.guestDetails[index]?.roomShareId
                                            }
                                        >
                                            <option value="" label="Select" />
                                            {romesharing?.map((cat, index) => (
                                                <option key={cat.value + index} value={cat.value}>
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Upload Aadhar Card<span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="Neon Neon-theme-dragdropbox">
                                            <input
                                                className="file_upload"
                                                name={`guestDetails[${index}].adharCard`}
                                                accept="image/*"
                                                id="filer_input2"
                                                type="file"
                                                draggable
                                                disabled
                                            />
                                            <div className="Neon-input-dragDrop">
                                                {validation.values.guestDetails.length > 0 &&
                                                validation.values.guestDetails[index]?.adharCard
                                                    ?.length == 0 ? (
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
                                                        src={
                                                            validation.values.guestDetails[index]
                                                                ?.adharCard || NoImage
                                                        }
                                                        alt="frontImage"
                                                        width="100%"
                                                        className="neon-img"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2 form-group">
                                    <div className="col-md-2">
                                        <label className="text-label">
                                            Aadhar Number<span className="error-star">*</span>
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            minLength={12}
                                            maxLength={12}
                                            id={`guestDetails[${index}].adharNo`}
                                            name={`guestDetails[${index}].adharNo`}
                                            value={validation.values.guestDetails[index]?.adharNo}
                                            disabled
                                        />
                                    </div>
                                </div>
                                {item.destinationId == 2 && (
                                    <>
                                        <div className="row mb-2 form-group">
                                            <div className="col-md-2">
                                                <label className="text-label">
                                                    Upload Passport
                                                    <span className="error-star">*</span>
                                                </label>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="Neon Neon-theme-dragdropbox">
                                                    <input
                                                        className="file_upload"
                                                        name={`guestDetails[${index}].passport`}
                                                        accept="image/*"
                                                        id="filer_input2"
                                                        type="file"
                                                        draggable
                                                        disabled
                                                    />
                                                    <div className="Neon-input-dragDrop">
                                                        {validation.values.guestDetails.length >
                                                            0 &&
                                                        validation.values.guestDetails[index]
                                                            ?.passport?.length == 0 ? (
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
                                                                    Drop files here or click to
                                                                    upload.
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={
                                                                    validation.values.guestDetails[
                                                                        index
                                                                    ]?.passport || NoImage
                                                                }
                                                                alt="frontImage"
                                                                width="100%"
                                                                className="neon-img"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                      { item.passportNo.length > 0 ? <div className="row mb-2 form-group">
                                            <div className="col-md-2">
                                                <label className="text-label">
                                                    Passport Number
                                                </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`guestDetails[${index}].passportNo`}
                                                    name={`guestDetails[${index}].passportNo`}
                                                    onChange={(e) => {
                                                        validation.handleChange(e);
                                                    }}
                                                    onBlur={validation.handleBlur}
                                                    value={
                                                        validation.values.guestDetails[index]
                                                            ?.passportNo
                                                    }
                                                />
                                            </div>
                                        </div> : ""}
                                    </>
                                )}
                                {validation.values.guestDetails[index]?.pan.length ? (
                                    <div className="row mb-2 form-group">
                                        <div className="col-md-2">
                                            <label className="text-label">Upload PAN</label>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="Neon Neon-theme-dragdropbox">
                                                <input
                                                    className="file_upload"
                                                    name={`guestDetails[${index}].pan`}
                                                    accept="image/*"
                                                    id="filer_input2"
                                                    type="file"
                                                    disabled
                                                />
                                                <div className="Neon-input-dragDrop">
                                                    {validation.values.guestDetails.length > 0 &&
                                                    validation.values.guestDetails[index]?.pan
                                                        ?.length == 0 ? (
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
                                                            src={
                                                                validation.values.guestDetails[
                                                                    index
                                                                ]?.pan || NoImage
                                                            }
                                                            alt="frontImage"
                                                            width="100%"
                                                            className="neon-img"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                {validation.values.guestDetails[index]?.panNo.length ? (
                                    <div className="row mb-2 form-group">
                                        <div className="col-md-2">
                                            <label className="text-label">PAN Number</label>
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`guestDetails[${index}].panNo`}
                                                name={`guestDetails[${index}].panNo`}
                                                value={validation.values.guestDetails[index]?.panNo}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}

                                <div className="divider divider-last"></div>
                            </>
                        );
                    })}
            </form>
        </section>
    );
};

export default CustomTourGuestsdetails;
