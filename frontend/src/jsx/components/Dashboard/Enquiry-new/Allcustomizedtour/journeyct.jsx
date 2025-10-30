import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../../services/apiServices";
import ErrorMessageComponent from "../../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PopupModal from "../../Popups/PopupModal";
import ConfirmationDialog from "../../Popups/ConfirmationDialog";
import { hasComponentPermission } from "../../../../auth/PrivateRoute";
import { Tooltip } from "@mui/material";
import {
    updateFamilyHeadDataCompletionStatus,
    updateIsPackageFinalized,
} from "../../../../../store/actions/groupTourAction";
import EditPackageDataPopup from "../../common/EditPackageDataPopup";

const Journeyct = ({ enquiryId }) => {
    const [isFollowupSubmitting, setIsFollowupSubmitting] = useState(false);
    const [isPackageSubmitting, setIsPackageSubmitting] = useState(false);
    const [areFamilyHeadsDataSubmitting, setAreFamilyHeadsDataSubmitting] = useState(false);

    const [countryId, setCountryId] = useState("");
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [dataToPatch, setDataToPatch] = useState(null);
    const [isEnqNonEditable, setIsEnqNonEditable] = useState(false);

    const { permissions } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const getGuestRefDropdown = async () => {
        try {
            const response = await get(`/dropdown-guest-refId`);
            const mappedData = response.data.data.map((item) => ({
                value: item.guestRefId,
                label: item.firstName + " " + item.lastName + " ( " + item.guestRefId + " ) ",
            }));
            setGuestEnquiryRef(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getGuestRefDropdown();
    }, []);

    const [destination, setDestination] = useState([]);

    const getDestinationId = async () => {
        try {
            const response = await get(`/destination-list`);

            const mappedData = response.data.data.map((item) => ({
                value: item.destinationId,
                label: item.destinationName,
            }));
            setDestination(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDestinationId();
    }, []);

    const [priority, setPrioritt] = useState([]);

    const getPrioritt = async () => {
        try {
            const response = await get(`/priority-list`);
            const mappedData = response.data.data.map((item) => ({
                value: item.priorityId,
                label: item.priorityName,
            }));
            setPrioritt(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPrioritt();
    }, []);

    const [enquiryref, setEnquiryRef] = useState([]);

    const getEnquiryRef = async () => {
        try {
            const response = await get(`/enquiry-reference-list`);
            const mappedData = response.data.data.map((item) => ({
                value: item.enquiryReferId,
                label: item.enquiryReferName,
            }));
            setEnquiryRef(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEnquiryRef();
    }, []);

    const [hotel, setHotel] = useState([]);

    const getHotel = async () => {
        try {
            const response = await get(`/dropdown-hotel-cat`);

            const mappedData = response.data.data.map((item) => ({
                value: item.hotelCatId,
                label: item.hotelCatName,
            }));
            setHotel(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHotel();
    }, []);

    const [mealplan, setMealPlan] = useState([]);

    const getMealPlanId = async () => {
        try {
            const response = await get(`/meal-plan-list`);

            const mappedData = response.data.data.map((item) => ({
                value: item.mealPlanId,
                label: item.mealPlanName,
            }));
            setMealPlan(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMealPlanId();
    }, []);

    const [namePreFix, setNamePreFix] = useState([]);

    const getPrefixDropDown = async () => {
        try {
            const response = await get(`/dd-prefix`);

            const mappedData = response.data.data.map((item) => ({
                value: item.preFixId,
                label: item.preFixName,
            }));
            setNamePreFix(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPrefixDropDown();
    }, []);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            note: dataToPatch?.notes ? dataToPatch?.notes : "",
            nextfollowup: dataToPatch?.nextFollowUp ? dataToPatch?.nextFollowUp : "",
            priority: dataToPatch?.priorityId ? dataToPatch?.priorityId : "",
            guestref: dataToPatch?.guestRefId ? dataToPatch?.guestRefId : "",
            destination: dataToPatch?.destinationId ? dataToPatch?.destinationId : "",
            enquiryref: dataToPatch?.enquiryReferId ? dataToPatch?.enquiryReferId : "",
            numberoffamilyhead: dataToPatch?.familyHeadNo ? dataToPatch?.familyHeadNo : "",
            mealplan: dataToPatch?.mealPlanId ? dataToPatch?.mealPlanId : "",
            totalextrabed: dataToPatch?.extraBed ? dataToPatch?.extraBed : "",
            totalrooms: dataToPatch?.rooms ? dataToPatch?.rooms : "",
            childrenages: dataToPatch?.age || [],
            adults: dataToPatch?.adults ? dataToPatch?.adults : "",
            child: dataToPatch?.child ? dataToPatch?.child : "",
            hotel: dataToPatch?.hotelCatId ? dataToPatch?.hotelCatId : "",
            nights: dataToPatch?.nights ? dataToPatch?.nights : "",
            days: dataToPatch?.days ? dataToPatch?.days : "",
            state: dataToPatch?.stateId ? dataToPatch?.stateId : "",
            departurecountry: dataToPatch?.countryId ? dataToPatch?.countryId : "", // It's not clear where this value comes from in your object
            contact: dataToPatch?.contact ? dataToPatch?.contact : "",

            // nameofcontact: dataToPatch?.contactName ? dataToPatch?.contactName : "",
            fullName: dataToPatch?.fullName ? dataToPatch?.fullName : "",

            nameofgroup: dataToPatch?.groupName ? dataToPatch?.groupName : "",
            tourstartdate: dataToPatch?.startDate ? dataToPatch?.startDate : "",
            tourenddate: dataToPatch?.endDate ? dataToPatch?.endDate : "",
            cities: dataToPatch?.cities
                ? cities.filter((option) => {
                      const parsedCities = JSON.parse(dataToPatch?.cities || "[]");
                      return Array.isArray(parsedCities) && parsedCities.includes(option.value);
                  })
                : [],
        },
        validationSchema: Yup.object({
            nextfollowup: Yup.string().required("Enter The Next Follow Up"),

            enquiryref: Yup.string().required("Enter The Enquiry Reference"),
            guestref: Yup.string().when("enquiryref", {
				is: (enquiryref) => enquiryref == 9,
				then: Yup.string().required("Enter the Guest Enquiry Reference"),
				otherwise: Yup.string(),
			}),
            destination: Yup.string().required("Enter The Destination"),
            departurecountry: Yup.string().required("Country is required"),
            numberoffamilyhead: Yup.string().required("Enter The Number of family Head"),
            mealplan: Yup.string().required("Enter The Meal Plan"),
            totalrooms: Yup.string().required("Enter The Total Rooms"),
            cities: Yup.array().min(1, "Select at least one city").required("Select Cities"),
            childrenages: Yup.array().when("child", {
                is: (value) => value > 0,
                then: Yup.array()
                    .of(
                        Yup.number()
                            .typeError("Age must be a number")
                            .required("Age is required")
                            .min(1, "Age must be at least 1")
                            .max(18, "Age cannot exceed 18")
                    )
                    .required("At least one child age is required"),
                else: Yup.array().notRequired(),
            }),

            adults: Yup.string().required("Enter The Passengers"),
            hotel: Yup.string().required("Enter The Hotels Category"),
            contact: Yup.string()
                .required("Enter The Contact")
                .min(10, "Enter valid number")
                .max(10, "Enter valid number"),
            // nameofcontact: Yup.string()
            // .required("Enter The Name of Contact")
            // .min(4, "Name should be atleast 4 characters."),
            fullName: Yup.string().required("Enter Full Name"),
            nameofgroup: Yup.string().required("Enter The Name of Group"),
            tourstartdate: Yup.string().required("Enter The Tour Start Date"),
            tourenddate: Yup.string().required("Enter The Tour End Date"),
        }),

        onSubmit: async (values) => {
            let data = {
                groupName: values.nameofgroup,
                fullName: values.fullName,
                destinationId: values.destination,
                contact: values.contact,
                startDate: values.tourstartdate,
                endDate: values.tourenddate,
                stateId: Number(values.state),
                nights: calcutedDays - 1,
                days: calcutedDays,
                hotelCatId: values.hotel,
                adults: values.adults,
                child: values.child,
                age: values.childrenages,
                rooms: values.totalrooms,
                extraBed: values.totalextrabed,
                mealPlanId: values.mealplan,
                familyHeadNo: values.numberoffamilyhead,
                priorityId: values.priority,
                nextFollowUp: values.nextfollowup,
                enquiryReferId: values.enquiryref,
                guestRefId: values.guestref,
                notes: values.note,
                countryId: Number(values.departurecountry),
                cities: values.cities.map((item) => item.value),
                enquiryCustomId: enquiryId,
            };

            try {
                setIsFollowupSubmitting(true);
                const response = await post(`/update-enquiry-custom-details`, data);
                setIsFollowupSubmitting(false);
                getEditData();

                familyHeadsFormik.resetForm();

                toast.success(response?.data?.message);
            } catch (error) {
                setIsFollowupSubmitting(false);
                console.log(error);
            }
        },
    });

    const [state, setDepartureState] = useState([]);

    const getDepartureStateTypeId = async () => {
        try {
            const data = {
                countryId: validation?.values?.destination == "1" ? "1" : countryId?.value,
            };
            const response = await get(`/state-list`, data);
            const mappedData = response.data.data.map((item) => ({
                value: item.stateId,
                label: item.stateName,
            }));
            setDepartureState(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDepartureStateTypeId();
    }, [countryId, validation?.values?.destination]);

    /* get city from api */

    const getCity = async () => {
        try {
            const response = await get(
                `/city-list?countryId=${validation.values.departurecountry}`
            );
            const mappedData = response.data.data.map((item) => ({
                value: item.citiesId,
                label: item.citiesName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            }));
            setCities(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCity();
    }, [
        validation.values.departurecountry,
        validation.values.state,
        validation.values.destination,
    ]);

    /* end get city from api */

    const [departureCountry, setDepartureCountry] = useState([]);
    const getDepartureCountry = async () => {
        try {
            const response = await get(`/country?destinationId=${validation?.values?.destination}`);
            const mappedData = response.data.message.map((item) => ({
                value: item.countryId,
                label: item.countryName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            }));
            setDepartureCountry(mappedData);
            if (validation.values.destination == "1") {
                validation.setFieldValue("departurecountry", mappedData[0].value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDepartureCountry();
    }, [validation?.values?.destination]);

    const [calcutedDays, setCalculatedDays] = useState(0);
    const dayNightCal = async () => {
        if (validation.values.tourstartdate && validation.values.tourenddate) {
            const startDateObj = new Date(validation.values.tourstartdate);
            const endDateObj = new Date(validation.values.tourenddate);

            const timeDifference = endDateObj - startDateObj;
            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            setCalculatedDays(daysDifference + 1);
        }
    };

    useEffect(() => {
        dayNightCal();
    }, [validation.values]);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };
    useEffect(() => {
        // While view farmer page is active, the yadi tab must also activated
        const pathArray = window.location.href.split("/");
        const path = pathArray[pathArray.length - 1];
        let element = document.getElementById("customized-tour");
        if (element) {
            element.classList.add("mm-active1"); // Add the 'active' class to the element
        }
        return () => {
            if (element) {
                element.classList.remove("mm-active1"); // remove the 'active' class to the element when change to another page
            }
        };
    }, []);

    // to select the value from input tag start

    const getDestValueFromSelect = async (value) => {
        setCountryId(value);
        validation.setFieldValue("destination", value ? value.value : "");
        validation.setFieldValue("cities", []);
        validation.setFieldValue("state", "");
        setDataToPatch((r) => ({
            ...r,
            destinationId: value.value,
            cities: "[]",
            state: "",
        }));
    };

    const getCountryValueFromSelect = async (value) => {
        setCountryId(value);
        validation.setFieldValue("departurecountry", value ? value.value : "");
        validation.setFieldValue("cities", []);
        validation.setFieldValue("state", "");
        setDataToPatch((r) => ({
            ...r,
            countryId: value.value,
            cities: "[]",
            state: "",
        }));
    };

    // to select the value from input tag end
    useEffect(() => {
        const textarea = document.getElementById("notes");

        const adjustTextareaHeight = () => {
            textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
        };

        textarea?.addEventListener("input", adjustTextareaHeight);

        return () => {
            // Clean up the event listener when the component unmounts
            textarea?.removeEventListener("input", adjustTextareaHeight);
        };
    }, []);

    //GET GUEST REFERENCE
    const [guestenquiryref, setGuestEnquiryRef] = useState([]);

    const getGuestEnquiryRef = async (selectedOption) => {
        validation.setFieldValue("enquiryref", selectedOption ? selectedOption.value : "");
        if (selectedOption.value == 9) {
            await getGuestRefDropdown();
        } else {
            validation.setFieldValue("guestref", "");
        }
    };

    const handleGuestRefChange = (selectedOption) => {
        validation.setFieldValue("guestref", selectedOption.value);
    };

    const getFamilyHeads = async () => {
        try {
            const response = await get(`/familyHead-list-ct?enquiryCustomId=${enquiryId}`);

            // set data for all fields
            const familyHeadsData = response.data.data;

            const finalData = familyHeadsData.map((fHead) => ({
                namePreFix: fHead.preFixId,
                firstName: fHead.firstName,
                lastName: fHead.lastName,
                paxPerHead: fHead.paxPerHead,
            }));

            if (familyHeadsData.length !== 0) {
                familyHeadsFormik.setFieldValue("familyHeads", finalData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const familyHeadsFormik = useFormik({
        initialValues: {
            familyHeads: [],
        },
        validationSchema: Yup.object({
            familyHeads: Yup.array().of(
                Yup.object().shape({
                    namePreFix: Yup.string().required("Prefix is Required"),
                    firstName: Yup.string().required("Enter First Name"),
                    lastName: Yup.string().required("Enter Last Name"),
                    paxPerHead: Yup.string()
                        .required("Enter Number of Pax")
                        .test({
                            name: "positiveAndAboveZero",
                            test: function (value) {
                                const floatValue = parseFloat(value);
                                return floatValue > 0; // Check if the value is positive and above 0
                            },
                            message: "Pax No. must be valid & above 0",
                        }),
                })
            ),
        }),

        onSubmit: async (values) => {
            let data = {
                enquiryCustomId: enquiryId,
                familyHead: values.familyHeads.map((fHead) => ({
                    preFixId: fHead.namePreFix,
                    firstName: fHead.firstName,
                    lastName: fHead.lastName,
                    guestId: fHead.guestId,
                    paxPerHead: fHead.paxPerHead,
                })),
            };

            try {
                setAreFamilyHeadsDataSubmitting(true);
                const response = await post(`/familyhead-details-ct`, data);

                setAreFamilyHeadsDataSubmitting(false);
                toast.success(response?.data?.message);

                dispatch(updateFamilyHeadDataCompletionStatus(true));

                navigate(`/enquiry-ct/${enquiryId}?activeTab=booking`);
            } catch (error) {
                setAreFamilyHeadsDataSubmitting(false);
                console.log(error);
            }
        },
    });

    // to get package list start
    const [packageList, setPackageList] = useState([]);

    const [isPackageFinalized, setIsPackageFinalized] = useState(false);

    const getPackageList = async () => {
        try {
            const response = await get(`package-list?enquiryCustomId=${enquiryId}`);
            setPackageList(response?.data?.data);

            response.data?.data?.map((item) => {
                if (item.isFinal == 1) {
                    setIsPackageFinalized(true);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        hasComponentPermission(permissions, 243) && getPackageList();
    }, []);

    // finalize package start
    const finalizePackage = async (values) => {
        const data = {
            packageCustomId: values.packageCustomId,
            enquiryCustomId: enquiryId,
        };
        try {
            const response = await post(`/final-package`, data);
            hasComponentPermission(permissions, 243) && getPackageList();

            dispatch(updateIsPackageFinalized(true));

            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const [isFinalPackage, setisFinalPackage] = useState(false);
    const [offsetData, setOffsetData] = useState(null);

    function handleDialogClose(isApicall) {
        if (isApicall) {
            finalizePackage(offsetData);
        }
        setisFinalPackage(false);
    }

    	// Edit Finalied Package
        const [editPackagePopup, setEditPackagePopup] = useState(false);
        const [editPackageData, setEditPackageData] = useState(null);
    
        function handleDialogClose2() {
            setEditPackagePopup(false);
        }

    //   upload thumbnail file start
    const url = import.meta.env.VITE_WAARI_BASEURL;
    const [packageUploaded, setPackageUploaded] = useState(false);
    const [isUploadingPDF, setIsUploadingPDF] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileNameToDisplay, setFileNameToDisplay] = useState("");

       const fileInputRef = useRef(null);
    
        const resetFileInput = () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Reset the file input value
            }
            setFileNameToDisplay("");
            setPackageUploaded(false);
        };
    

    const { token } = useSelector((state) => state.auth);
    const { isPackageConfirm } = useSelector((state) => state.groupTour);

    const getFileLink = async (file) => {
        try {
            setFileNameToDisplay(file?.name);
            const formData = new FormData();
            formData.append("pdf", file);
            setIsUploadingPDF(true);
            const responseData = await axios.post(
                `
          ${url}/package-upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token,
                    },
                }
            );
            toast.success("PDF Uploaded Successfully");
            setPackageUploaded(true);
            setFileName(responseData?.data?.pdf);
            setIsUploadingPDF(false);
            return responseData?.data?.pdf;
        } catch (error) {
            setIsUploadingPDF(false);
            console.log(error);
        }
    };

    //   upload thumbnail file end

    const packageValidation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            adult: "",
            extraBed: "",
            childWithout: "",
        },
        validationSchema: Yup.object({
            adult: Yup.string().required("Please Enter Amount"),
            extraBed: Yup.string().required("Please Enter Amount"),
            childWithout: Yup.string().required("Please Enter Amount"),
        }),
        onSubmit: async (values, { resetForm }) => {
            let data = {
                enquiryCustomId: enquiryId,
                package: fileName,
                adult: values.adult,
                extraBed: values.extraBed,
                childWithout: values.childWithout,
            };
            if (packageUploaded) {
                try {
                    setIsPackageSubmitting(true);
                    const response = await post(`/package-custom-tour`, data);
                    toast.success(response?.data?.message);
                    resetForm();
                    setFileNameToDisplay("");

                    setIsPackageSubmitting(false);
                    resetFileInput()
                    hasComponentPermission(permissions, 243) && getPackageList();
                } catch (error) {
                    setIsPackageSubmitting(false);
                    console.log(error);
                }
            } else {
                toast.error("Please select PDF file.");
            }
        },
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [nameOptions, setNameOptions] = useState([]);
    const [familyHeadIndex, setFamilyHeadIndex] = useState(0);

    // Simulating async data fetching (replace with actual API call)
    const fetchNameOptions = async () => {
        try {
            const response = await get(`guest-email?firstName=${searchTerm}`);
            if (response.data.data.length > 0) {
                setNameOptions(response.data.data);

                familyHeadsFormik.setFieldValue(
                    `familyHeads[${familyHeadIndex}].firstName`,
                    searchTerm
                );
            } else {
                setNameOptions([]);
                familyHeadsFormik.setFieldValue(
                    `familyHeads[${familyHeadIndex}].firstName`,
                    searchTerm
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (searchTerm.length > 2) {
            // Call the debouncedFetch function
            fetchNameOptions();
        } else {
            // Reset options when search term is less than or equal to 3 characters
            setNameOptions([]);
        }
    }, [searchTerm]);

    const handleNameChange = (selectedOption) => {
        if (selectedOption) {
            familyHeadsFormik.setFieldValue(
                `familyHeads[${familyHeadIndex}].firstName`,
                selectedOption.label
            );
            familyHeadsFormik.setFieldValue(
                `familyHeads[${familyHeadIndex}].guestId`,
                selectedOption.value
            );

            getGuestInfoByName(selectedOption.value);
        } else {
            familyHeadsFormik.setFieldValue(`familyHeads[${familyHeadIndex}].firstName`, "");
            familyHeadsFormik.setFieldValue(`familyHeads[${familyHeadIndex}].lastName`, "");
            familyHeadsFormik.setFieldValue(`familyHeads[${familyHeadIndex}].guestId`, "");
        }
    };

    //get guest info by name
    const getGuestInfoByName = async (name) => {
        try {
            const result = await get(`guest-info?guestId=${name}`);
            const { preFixId, lastName } = result.data;

            if (result.data) {
                familyHeadsFormik.setFieldValue(
                    `familyHeads[${familyHeadIndex}].namePreFix`,
                    preFixId ? preFixId : 1
                );
                familyHeadsFormik.setFieldValue(
                    `familyHeads[${familyHeadIndex}].lastName`,
                    lastName
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    //get data for edit
    const getEditData = async () => {
        try {
            const result = await get(`get-enquiry-ct?enquiryCustomId=${enquiryId}`);
            setDataToPatch(result.data);
            setCalculatedDays(result.data.days);
            setIsEnqNonEditable(result.data.isEnqNonEditable);

            let familyDetailsObj = {
                namePreFix: "",
                firstName: "",
                lastName: "",
                paxPerHead: "",
            };

            // if (Number(result.data.familyHeadNo) === 0) {
            const dataa = Array.from({ length: Number(result.data.familyHeadNo) }, () => ({
                ...familyDetailsObj,
            }));

            familyHeadsFormik.setFieldValue("familyHeads", dataa);
            getFamilyHeads();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEditData();
    }, []);

    return (
        <>
            {isFinalPackage && (
                <PopupModal open={true} onDialogClose={handleDialogClose}>
                    <ConfirmationDialog
                        onClose={handleDialogClose}
                        confirmationMsg={"Are you sure to confirm this tour ?"}
                    />
                </PopupModal>
            )}
                {editPackagePopup && (
                <PopupModal open={true} onDialogClose={handleDialogClose2}>
                    <EditPackageDataPopup
                        editPackageData={editPackageData}
                        onClose={handleDialogClose2}
                        enquiryId={enquiryId}
                        getPackageList={getPackageList}
                    />
                </PopupModal>
            )}
            <form
                className="needs-validation"
                onSubmit={(e) => {
                    e.preventDefault();
                    packageValidation.handleSubmit();
                    return false;
                }}
            >
                <div className="card">
                    <div className="card-body">
                        <div className="basic-form">
                            <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                                <div className="card-title h5">Old Packages Details</div>
                            </div>

                            <div className="row mt-3">
                                {packageList.length > 0 &&
                                hasComponentPermission(permissions, 243) ? (
                                    packageList?.map((item, index) => {
                                        return (
                                            <>
                                                <div className="col-md-6 col-lg-3 col-sm-12">
                                                    <div className="packages-details">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div
                                                                    className="mb-2 d-flex"
                                                                    style={{
                                                                        justifyContent:
                                                                            "space-between",
                                                                    }}
                                                                >
                                                                    <label
                                                                        className="form-label d-flex align-items-center p-1"
                                                                        style={{
                                                                            fontWeight: "600",
                                                                        }}
                                                                    >
                                                                        Packages Option {index + 1}
                                                                    </label>
                                                                    <Tooltip title="View PDF">
                                                                        <Link
                                                                            className="document-link ms-2 me-2"
                                                                            to={item?.package}
                                                                            target="_blank"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 512 512"
                                                                                width="1.2rem"
                                                                                height="1.1rem"
                                                                                style={{
                                                                                    fill: "#059299",
                                                                                }}
                                                                            >
                                                                                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                                                            </svg>
                                                                        </Link>
                                                                    </Tooltip>
                                                                </div>

                                                                <div className="package-form">
                                                                    <div className="form-group d-flex justify-content-between">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Adults
                                                                        </label>
                                                                        <h6 className="packages-text text-nowrap">
                                                                            ₹ {item?.adult}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="form-group d-flex justify-content-between">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Extra Bed
                                                                        </label>
                                                                        <h6 className="packages-text text-nowrap">
                                                                            ₹ {item?.extraBed}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="form-group  d-flex justify-content-between">
                                                                        <label className="form-label d-flex align-items-center   p-1">
                                                                            Child Without Bed
                                                                        </label>
                                                                        <h6 className="packages-text text-nowrap">
                                                                            ₹ {item?.childWithout}
                                                                        </h6>
                                                                    </div>

                                                                    <div className="mb-2 d-flex justify-content-end">
                                                                        {/* <Link
                                to="/customizedbooking/booking"
                                className="btn pdf-btn btn-secondary btn-submit me-1 btn-sm"
                                style={{ height: "32px", lineHeight: "1" }}
                              >
                                Finalize Quotation
                              </Link> */}
                                                                        {item.isFinal == 2 &&
                                                                            hasComponentPermission(
                                                                                permissions,
                                                                                244
                                                                            ) && (
                                                                                <>
                                                                                    <span
                                                                                        type="button"
                                                                                        className=""
                                                                                        onClick={() => (
                                                                                            setisFinalPackage(
                                                                                                true
                                                                                            ),
                                                                                            setOffsetData(
                                                                                                item
                                                                                            )
                                                                                        )}
                                                                                    >
                                                                                        <button
                                                                                            // to="/booking"
                                                                                            className="btn pdf-btn btn-secondary btn-submit me-1 btn-sm"
                                                                                            style={{
                                                                                                height: "32px",
                                                                                                lineHeight:
                                                                                                    "1",
                                                                                                margin: "0",
                                                                                            }}
                                                                                        >
                                                                                            Finalize
                                                                                            Quotation
                                                                                        </button>
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        {item.isFinal == 1 && (
                                                                           
                                                                            <div>
                                                                                 <button
                                                                                type="button"
                                                                                className="btn pdf-btn btn-secondary btn-submit btn-sm"
                                                                                style={{
                                                                                    height: "32px",
                                                                                    lineHeight: "1",
                                                                                    margin: " 0px 10px 0px 0px",
                                                                                    cursor: "default",
                                                                                }}
                                                                            >
                                                                                Finalized
                                                                            </button>
                                                                                {hasComponentPermission(
                                                                                    permissions,
                                                                                    299
                                                                                ) && 
                                                                                    <button>
                                                                                    <div className="btn-edit-user ">
                                                                                        <Tooltip
                                                                                            title="Edit"
                                                                                            onClick={() => (
                                                                                                setEditPackagePopup(
                                                                                                    true
                                                                                                ),
                                                                                                setEditPackageData(
                                                                                                    item
                                                                                                )
                                                                                            )}
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                classname="svg-edit"
                                                                                                height="1em"
                                                                                                viewBox="0 0 512 512"
                                                                                            >
                                                                                                <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                                                                                            </svg>
                                                                                        </Tooltip>
                                                                                    </div>
                                                                                </button>
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })
                                ) : (
                                    <div className="col-md-12">
                                        <div className="packages-details text-center">
                                            <p className="mb-0">No data available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {!isPackageFinalized && hasComponentPermission(permissions, 242) && (
                    <>
                        <div className="card">
                            <div className="card-body">
                                <div className="basic-form">
                                    <div className="card-header pt-0" style={{ paddingLeft: "0" }}>
                                        <div className="card-title h5">Packages Details</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="mb-2">
                                                <label className="form-label d-flex align-items-center  p-1">
                                                    Add New Packages
                                                </label>

                                                <div className="custom-file-upload">
                                                    <input
                                                        type="file"
                                                        id="file-upload"
                                                        className="file-input"
                                                        name="myfile"
                                                        onChange={async (e) => {
                                                            const selectedFile = e.target.files[0];
                                                            const fileLink = await getFileLink(
                                                                selectedFile
                                                            );
                                                        }}
                                                        hidden
                                                        ref={fileInputRef}
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="custom-file-label"
                                                    >
                                                        {isUploadingPDF
                                                            ? "Uploading PDF..."
                                                            : "  Upload PDF"}
                                                    </label>
                                                    <span id="file-chosen">
                                                        {packageUploaded && fileNameToDisplay
                                                            ? fileNameToDisplay
                                                            : " No file chosen"}
                                                    </span>
                                                </div>
                                                {/* <Link className="btn btn-warning btn-sm btn-follow pdf-btn" style={{height:"32px", margin:"0 10px 0 0"}} >Upload PDF</Link> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="package-row">
                                                <div className="mb-2 ">
                                                    <label className="form-label d-flex align-items-center  p-1">
                                                        Adults<span className="error-star">*</span>
                                                    </label>
                                                    <div
                                                        className="input-group"
                                                        style={{ gap: "7px" }}
                                                    >
                                                        <div className="input-group-addon">₹</div>
                                                        <input
                                                            type="number"
                                                            className="form-control form-view"
                                                            name="adult"
                                                            onChange={
                                                                packageValidation.handleChange
                                                            }
                                                            onBlur={packageValidation.handleBlur}
                                                            value={packageValidation.values.adult}
                                                        />
                                                    </div>
                                                    {packageValidation.touched.adult &&
                                                    packageValidation.errors.adult ? (
                                                        <span className="error">
                                                            {packageValidation.errors.adult}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mb-2  ">
                                                    <label className="form-label d-flex align-items-center p-1">
                                                        Extra Bed
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <div
                                                        className="input-group"
                                                        style={{ gap: "7px" }}
                                                    >
                                                        <div className="input-group-addon">₹</div>
                                                        <input
                                                            type="number"
                                                            className="form-control form-view"
                                                            name="extraBed"
                                                            onChange={
                                                                packageValidation.handleChange
                                                            }
                                                            onBlur={packageValidation.handleBlur}
                                                            value={
                                                                packageValidation.values.extraBed
                                                            }
                                                        />
                                                    </div>
                                                    {packageValidation.touched.extraBed &&
                                                    packageValidation.errors.extraBed ? (
                                                        <span className="error">
                                                            {packageValidation.errors.extraBed}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label d-flex align-items-center  p-1">
                                                        Child Without Bed
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <div
                                                        className="input-group"
                                                        style={{ gap: "7px" }}
                                                    >
                                                        <div className="input-group-addon">₹</div>
                                                        <input
                                                            type="number"
                                                            className="form-control form-view"
                                                            name="childWithout"
                                                            onChange={
                                                                packageValidation.handleChange
                                                            }
                                                            onBlur={packageValidation.handleBlur}
                                                            value={
                                                                packageValidation.values
                                                                    .childWithout
                                                            }
                                                        />
                                                    </div>
                                                    {packageValidation.touched.childWithout &&
                                                    packageValidation.errors.childWithout ? (
                                                        <span className="error">
                                                            {packageValidation.errors.childWithout}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mb-2" style={{ marginTop: "38px" }}>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-submit"
                                                        disabled={
                                                            isUploadingPDF || isPackageSubmitting
                                                        }
                                                    >
                                                        {isPackageSubmitting
                                                            ? "Submitting..."
                                                            : "Submit"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </form>

            {isPackageConfirm && (
                <>
                    <div className="card">
                        <div className="card-body">
                            <div className="basic-form">
                                <form
                                    className="needs-validation"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                    }}
                                >
                                    <div className="card-header" style={{ paddingLeft: "0" }}>
                                        <div className="card-title h5">Journey Details</div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-2 col-md-6">
                                            <label className="form-label">
                                                Group name<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder=""
                                                name="nameofgroup"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.nameofgroup}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.nameofgroup &&
                                            validation.errors.nameofgroup ? (
                                                <span className="error">
                                                    {validation.errors.nameofgroup}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-md-2">
                                            <label>
                                                Full Name
                                                <span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Full Name"
                                                name="fullName"
                                                value={validation.values.fullName}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            <ErrorMessageComponent
                                                errors={validation.errors}
                                                fieldName={"fullName"}
                                                touched={validation.touched}
                                                key={"fullName"}
                                            />
                                        </div>

                                        <div className="mb-2 col-md-3">
                                            <label>
                                                Contact Number<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="contact"
                                                minLength={10}
                                                maxLength={10}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.contact}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.contact &&
                                            validation.errors.contact ? (
                                                <span className="error">
                                                    {validation.errors.contact}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="card-header card-header-title">
                                            <div className="card-title h5">Tour Details</div>
                                        </div>
                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">
                                                Select Destination
                                                <span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="destination"
                                                options={destination}
                                                onChange={(e) => getDestValueFromSelect(e)}
                                                onBlur={validation.handleBlur}
                                                value={destination.find(
                                                    (option) =>
                                                        option.value ===
                                                        validation.values.destination
                                                )}
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.destination &&
                                            validation.errors.destination ? (
                                                <span className="error">
                                                    {validation.errors.destination}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">
                                                Select Country<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                id="country"
                                                name="departurecountry"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                options={departureCountry}
                                                onChange={(e) => getCountryValueFromSelect(e)}
                                                onBlur={validation.handleBlur}
                                                value={
                                                    departureCountry.find(
                                                        (option) =>
                                                            option.value ===
                                                            validation.values.departurecountry
                                                    )
                                                        ? departureCountry.find(
                                                              (option) =>
                                                                  option.value ===
                                                                  validation.values.departurecountry
                                                          )
                                                        : null
                                                }
                                                isDisabled={
                                                    validation.values.destination == "1" ||
                                                    isEnqNonEditable
                                                }
                                            />
                                            {validation.touched.departurecountry &&
                                                validation.errors.departurecountry && (
                                                    <span className="error">
                                                        {validation.errors.departurecountry}
                                                    </span>
                                                )}
                                        </div>

                                        <div className="mb-2 col-md-4">
                                            <label className="form-label">Select State</label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="state"
                                                options={state}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "state",
                                                        selectedOption.value
                                                    ); // Extract the 'value' property
                                                    setDataToPatch((r) => ({
                                                        ...r,
                                                        state: selectedOption.value,
                                                        cities: "[]",
                                                    }));
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={
                                                    state.find(
                                                        (option) =>
                                                            option.value === validation.values.state
                                                    )
                                                        ? state.find(
                                                              (option) =>
                                                                  option.value ===
                                                                  validation.values.state
                                                          )
                                                        : null
                                                }
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.state && validation.errors.state ? (
                                                <span className="error">
                                                    {validation.errors.state}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-6">
                                            <label className="form-label">
                                                Select Cities<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                isMulti
                                                styles={customStyles}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                name="cities"
                                                options={cities}
                                                onChange={(selectedOptions) =>
                                                    validation.setFieldValue(
                                                        "cities",
                                                        selectedOptions
                                                    )
                                                }
                                                onBlur={validation.handleBlur}
                                                value={validation.values.cities}
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.cities &&
                                            validation.errors.cities ? (
                                                <span className="error">
                                                    {validation.errors.cities}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>
                                                Tour Start Date<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="tourstartdate"
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.tourstartdate}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.tourstartdate &&
                                            validation.errors.tourstartdate ? (
                                                <span className="error">
                                                    {validation.errors.tourstartdate}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>
                                                Tour End Date<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="tourenddate"
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.tourenddate}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.tourenddate &&
                                            validation.errors.tourenddate ? (
                                                <span className="error">
                                                    {validation.errors.tourenddate}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-md-3">
                                            <div className="row">
                                                <div className="col-sm-6 pax-adults">
                                                    <label>
                                                        Durations(Nights)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="nights"
                                                        min={0}
                                                        className="form-control w-60"
                                                        value={
                                                            calcutedDays == 0 ? 0 : calcutedDays - 1
                                                        }
                                                        disabled={isEnqNonEditable}
                                                        style={{
                                                            backgroundColor: isEnqNonEditable
                                                                ? "#f3f3f3"
                                                                : "",
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-sm-6 pax-child">
                                                    <label>
                                                        Durations(Days)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="days"
                                                        className="form-control w-60"
                                                        value={calcutedDays == 0 ? 0 : calcutedDays}
                                                        disabled={isEnqNonEditable}
                                                        style={{
                                                            backgroundColor: isEnqNonEditable
                                                                ? "#f3f3f3"
                                                                : "",
                                                        }}
                                                        // onChange={validation.handleChange}
                                                        // onBlur={validation.handleBlur}
                                                        // value={validation.values.days}
                                                    />
                                                </div>
                                            </div>
                                            {validation.touched.duration &&
                                            validation.errors.duration ? (
                                                <span className="error">
                                                    {validation.errors.duration}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mb-2 col-md-3">
                                            <div className="row">
                                                <div className="col-sm-6 pax-adults">
                                                    <label>
                                                        Pax(Adults)
                                                        <span className="error-star">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="adults"
                                                        className="form-control w-60"
                                                        min={0}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.adults}
                                                        disabled={isEnqNonEditable}
                                                        style={{
                                                            backgroundColor: isEnqNonEditable
                                                                ? "#f3f3f3"
                                                                : "",
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-sm-6 pax-child">
                                                    <label>Pax(Childrens)</label>
                                                    <input
                                                        type="number"
                                                        name="child"
                                                        className="form-control w-60"
                                                        min={0}
                                                        //onChange={validation.handleChange}
                                                        onChange={(e) => {
                                                            validation.handleChange(e);
                                                            validation.setFieldValue(
                                                                "childrenages",
                                                                Array.from({
                                                                    length: e.target.value,
                                                                })
                                                            );
                                                        }}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.child}
                                                        disabled={isEnqNonEditable}
                                                        style={{
                                                            backgroundColor: isEnqNonEditable
                                                                ? "#f3f3f3"
                                                                : "",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {validation.touched.adults &&
                                            validation.errors.adults ? (
                                                <span className="error">
                                                    {validation.errors.adults}
                                                </span>
                                            ) : null}
                                        </div>
                                        {validation.values.childrenages &&
                                            validation.values.childrenages.length > 0 && (
                                                <div className="mb-2 col-md-6">
                                                    <label>Childrens Ages</label>
                                                    <div className="child-row">
                                                        {validation.values.childrenages.map(
                                                            (item, index) => (
                                                                <React.Fragment key={index}>
                                                                    <div className="child-input">
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            min={0}
                                                                            max={20} // Added max attribute
                                                                            name={`childrenages[${index}]`}
                                                                            onChange={
                                                                                validation.handleChange
                                                                            }
                                                                            onBlur={
                                                                                validation.handleBlur
                                                                            }
                                                                            value={item}
                                                                            disabled={
                                                                                isEnqNonEditable
                                                                            }
                                                                            style={{
                                                                                backgroundColor:
                                                                                    isEnqNonEditable
                                                                                        ? "#f3f3f3"
                                                                                        : "",
                                                                            }}
                                                                        />

                                                                        {validation.touched
                                                                            ?.childrenages &&
                                                                            validation.errors
                                                                                ?.childrenages?.[
                                                                                index
                                                                            ] && (
                                                                                <span className="error">
                                                                                    {
                                                                                        validation
                                                                                            .errors
                                                                                            ?.childrenages[
                                                                                            index
                                                                                        ]
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </React.Fragment>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        <div className="mb-2 col-md-3">
                                            <label className="form-label">
                                                {" "}
                                                Hotel Category<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                // isLoading={isLoading}
                                                // isClearable={isClearable}
                                                // isSearchable={isSearchable}
                                                name="hotel"
                                                options={hotel}
                                                // onChange={validation.handleChange}
                                                // onBlur={validation.handleBlur}
                                                // value={validation.values.hotel}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "hotel",
                                                        selectedOption ? selectedOption.value : ""
                                                    ); // Extract the 'value' property
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={hotel.find(
                                                    (option) =>
                                                        option.value === validation.values.hotel
                                                )}
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.hotel && validation.errors.hotel ? (
                                                <span className="error">
                                                    {validation.errors.hotel}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>
                                                {" "}
                                                Total rooms required
                                                <span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="totalrooms"
                                                className="form-control"
                                                min={0}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.totalrooms}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.totalrooms &&
                                            validation.errors.totalrooms ? (
                                                <span className="error">
                                                    {validation.errors.totalrooms}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>Total extra bed required</label>
                                            <input
                                                type="number"
                                                name="totalextrabed"
                                                className="form-control"
                                                min={0}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.totalextrabed}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.totalextrabed &&
                                            validation.errors.totalextrabed ? (
                                                <span className="error">
                                                    {validation.errors.totalextrabed}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label className="form-label">
                                                Meal Plan<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                // isLoading={isLoading}
                                                // isClearable={isClearable}
                                                // isSearchable={isSearchable}
                                                name="mealplan"
                                                options={mealplan}
                                                // onChange={validation.handleChange}
                                                // onBlur={validation.handleBlur}
                                                // value={validation.values.mealplan}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "mealplan",
                                                        selectedOption ? selectedOption.value : ""
                                                    ); // Extract the 'value' property
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={mealplan.find(
                                                    (option) =>
                                                        option.value === validation.values.mealplan
                                                )}
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.mealplan &&
                                            validation.errors.mealplan ? (
                                                <span className="error">
                                                    {validation.errors.mealplan}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>
                                                Number of Family Heads
                                                <span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="numberoffamilyhead"
                                                min={0}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.numberoffamilyhead}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.numberoffamilyhead &&
                                            validation.errors.numberoffamilyhead ? (
                                                <span className="error">
                                                    {validation.errors.numberoffamilyhead}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label>
                                                Reference<span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="enquiryref"
                                                options={enquiryref}
                                                onChange={(selectedOption) =>
                                                    getGuestEnquiryRef(selectedOption)
                                                }
                                                onBlur={validation.handleBlur}
                                                value={enquiryref.find(
                                                    (option) =>
                                                        option.value ===
                                                        validation.values.enquiryref
                                                )}
                                                isDisabled={isEnqNonEditable}
                                            />
                                            {validation.touched.enquiryref &&
                                            validation.errors.enquiryref ? (
                                                <span className="error">
                                                    {validation.errors.enquiryref}
                                                </span>
                                            ) : null}
                                        </div>
                                        {validation?.values?.enquiryref == 9 && (
                                            <div className="mb-2 col-md-3">
                                                <label>Guest Reference Id<span className="error-star">*</span></label>
                                                <Select
                                                    styles={customStyles}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="guestref"
                                                    options={guestenquiryref}
                                                    onChange={(selectedOption) =>
                                                        handleGuestRefChange(selectedOption)
                                                    }
                                                    onBlur={validation.handleBlur}
                                                    value={guestenquiryref.find(
                                                        (option) =>
                                                            option.value ===
                                                            validation.values.guestref
                                                    )}
                                                    isDisabled={isEnqNonEditable}
                                                />
                                                {validation.touched.guestref &&
                                                validation.errors.guestref ? (
                                                    <span className="error">
                                                        {validation.errors.guestref}
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                        <div className="mb-2 col-md-3">
                                            <label className="form-label">Priority</label>
                                            <Select
                                                styles={customStyles}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                // isLoading={isLoading}
                                                // isClearable={isClearable}
                                                // isSearchable={isSearchable}
                                                name="priority"
                                                options={priority}
                                                // onChange={validation.handleChange}
                                                // onBlur={validation.handleBlur}
                                                // value={validation.values.priority}
                                                onChange={(selectedOption) => {
                                                    validation.setFieldValue(
                                                        "priority",
                                                        selectedOption ? selectedOption.value : ""
                                                    ); // Extract the 'value' property
                                                }}
                                                onBlur={validation.handleBlur}
                                                value={priority.find(
                                                    (option) =>
                                                        option.value === validation.values.priority
                                                )}
                                                isDisabled={isEnqNonEditable}
                                            />
                                        </div>
                                        <div className="mb-2 col-md-3">
                                            <label className="form-label">
                                                Next Follow-up<span className="error-star">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="nextfollowup"
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.nextfollowup}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                            {validation.touched.nextfollowup &&
                                            validation.errors.nextfollowup ? (
                                                <span className="error">
                                                    {validation.errors.nextfollowup}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mb-2 col-md-12">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                type="text"
                                                className="textarea"
                                                id="notes"
                                                name="note"
                                                rows={2}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.note}
                                                disabled={isEnqNonEditable}
                                                style={{
                                                    backgroundColor: isEnqNonEditable
                                                        ? "#f3f3f3"
                                                        : "",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2 mt-2 row">
                                        <div className="col-lg-12 d-flex justify-content-end">
                                            {/* <Link
										to="/customized-tour"
										type="submit"
										className="btn btn-back"
									>
										Back
									</Link> */}
                                            <button
                                                type="submit"
                                                className="btn btn-submit btn-primary"
                                                disabled={isFollowupSubmitting || isEnqNonEditable}
                                            >
                                                {isFollowupSubmitting ? "Submitting" : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Family Heads Form */}
                    {familyHeadsFormik.values.familyHeads?.length > 0 && namePreFix.length > 0 && (
                        <form
                            className="needs-validation"
                            onSubmit={(e) => {
                                e.preventDefault();
                                familyHeadsFormik.handleSubmit();
                                return false;
                            }}
                        >
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-responsive-sm table-tour">
                                            <thead>
                                                <th style={{ width: "10%" }}>Sr.</th>
                                                <th style={{ width: "60%" }}>
                                                    Name of family head
                                                </th>
                                                <th style={{ width: "15%" }}>Number of pax</th>
                                                <th style={{ width: "15%" }}></th>
                                            </thead>
                                            <tbody>
                                                <>
                                                    {familyHeadsFormik.values.familyHeads?.length >
                                                        0 && namePreFix.length > 0
                                                        ? familyHeadsFormik.values?.familyHeads.map(
                                                              (familyHead, index) => (
                                                                  <tr key={index}>
                                                                      <td>{index + 1}</td>
                                                                      <td>
                                                                          <div className="family-packages">
                                                                              <div className="family-1">
                                                                                  <Select
                                                                                      styles={
                                                                                          customStyles
                                                                                      }
                                                                                      className="basic-single select-salution basic-width1"
                                                                                      classNamePrefix="select"
                                                                                      options={
                                                                                          namePreFix
                                                                                      }
                                                                                      id={`familyHeads[${index}].namePreFix`}
                                                                                      name={`familyHeads[${index}].namePreFix`}
                                                                                      onChange={(
                                                                                          selectedOption
                                                                                      ) => {
                                                                                          familyHeadsFormik.setFieldValue(
                                                                                              `familyHeads[${index}].namePreFix`,

                                                                                              selectedOption
                                                                                                  ? selectedOption.value
                                                                                                  : ""
                                                                                          );
                                                                                      }}
                                                                                      onBlur={
                                                                                          familyHeadsFormik.handleBlur
                                                                                      }
                                                                                      value={namePreFix.find(
                                                                                          (
                                                                                              option
                                                                                          ) =>
                                                                                              option.value ==
                                                                                              familyHead.namePreFix
                                                                                      )}
                                                                                  />

                                                                                  {familyHeadsFormik
                                                                                      .touched
                                                                                      .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .touched
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]
                                                                                          ?.namePreFix &&
                                                                                      familyHeadsFormik.errors &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]
                                                                                          ?.namePreFix && (
                                                                                          <span className="error error-1">
                                                                                              {
                                                                                                  familyHeadsFormik
                                                                                                      .errors
                                                                                                      .familyHeads[
                                                                                                      index
                                                                                                  ]
                                                                                                      .namePreFix
                                                                                              }
                                                                                          </span>
                                                                                      )}
                                                                              </div>

                                                                              <div className="family-2">
                                                                                  <Select
                                                                                      className="select-salution basic-width"
                                                                                      options={nameOptions.map(
                                                                                          (
                                                                                              item
                                                                                          ) => ({
                                                                                              value: item.guestId,
                                                                                              label: item.firstName,
                                                                                          })
                                                                                      )}
                                                                                      isClearable={
                                                                                          true
                                                                                      }
                                                                                      isSearchable={
                                                                                          true
                                                                                      }
                                                                                      menuPlacement="top"
                                                                                      name={`familyHeads[${index}].firstName`}
                                                                                      placeholder="First Name"
                                                                                      onInputChange={(
                                                                                          inputValue
                                                                                      ) => {
                                                                                          setSearchTerm(
                                                                                              inputValue
                                                                                          );
                                                                                          setFamilyHeadIndex(
                                                                                              index
                                                                                          );
                                                                                      }}
                                                                                      onChange={
                                                                                          handleNameChange
                                                                                      }
                                                                                      value={
                                                                                          nameOptions.find(
                                                                                              (
                                                                                                  item
                                                                                              ) =>
                                                                                                  item.firstName ==
                                                                                                  familyHead.firstName
                                                                                          )
                                                                                              ? nameOptions.find(
                                                                                                    (
                                                                                                        item
                                                                                                    ) =>
                                                                                                        item.firstName ==
                                                                                                        familyHead.firstName
                                                                                                )
                                                                                              : {
                                                                                                    value: familyHead.firstName,
                                                                                                    label: familyHead.firstName,
                                                                                                }
                                                                                      }
                                                                                  />

                                                                                  {familyHeadsFormik
                                                                                      .touched
                                                                                      .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .touched
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]
                                                                                          ?.firstName &&
                                                                                      familyHeadsFormik.errors &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]
                                                                                          ?.firstName && (
                                                                                          <span className="error error-1">
                                                                                              {
                                                                                                  familyHeadsFormik
                                                                                                      .errors
                                                                                                      .familyHeads[
                                                                                                      index
                                                                                                  ]
                                                                                                      .firstName
                                                                                              }
                                                                                          </span>
                                                                                      )}
                                                                              </div>

                                                                              <div className="family-3">
                                                                                  <input
                                                                                      type="text"
                                                                                      className="form-control"
                                                                                      name={`familyHeads[${index}].lastName`}
                                                                                      value={
                                                                                          familyHead.lastName
                                                                                      }
                                                                                      placeholder="Last Name"
                                                                                      onChange={
                                                                                          familyHeadsFormik.handleChange
                                                                                      }
                                                                                      onBlur={
                                                                                          familyHeadsFormik.handleBlur
                                                                                      }
                                                                                  />
                                                                                  {familyHeadsFormik
                                                                                      .touched
                                                                                      .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .touched
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]?.lastName &&
                                                                                      familyHeadsFormik.errors &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads &&
                                                                                      familyHeadsFormik
                                                                                          .errors
                                                                                          .familyHeads[
                                                                                          index
                                                                                      ]
                                                                                          ?.lastName && (
                                                                                          <span className="error">
                                                                                              {
                                                                                                  familyHeadsFormik
                                                                                                      .errors
                                                                                                      .familyHeads[
                                                                                                      index
                                                                                                  ]
                                                                                                      .lastName
                                                                                              }
                                                                                          </span>
                                                                                      )}
                                                                              </div>
                                                                          </div>
                                                                      </td>

                                                                      <td>
                                                                          <div
                                                                              className="col-md-12 col-12"
                                                                              style={{
                                                                                  textAlign: "left",
                                                                              }}
                                                                          >
                                                                              <input
                                                                                  placeholder="Number Of Pax"
                                                                                  type="text"
                                                                                  className="form-control"
                                                                                  name={`familyHeads[${index}].paxPerHead`}
                                                                                  value={
                                                                                      familyHead.paxPerHead
                                                                                  }
                                                                                  onChange={
                                                                                      familyHeadsFormik.handleChange
                                                                                  }
                                                                                  onBlur={
                                                                                      familyHeadsFormik.handleBlur
                                                                                  }
                                                                              />
                                                                              {familyHeadsFormik
                                                                                  .touched
                                                                                  .familyHeads &&
                                                                                  familyHeadsFormik
                                                                                      .touched
                                                                                      .familyHeads[
                                                                                      index
                                                                                  ]?.paxPerHead &&
                                                                                  familyHeadsFormik.errors &&
                                                                                  familyHeadsFormik
                                                                                      .errors
                                                                                      .familyHeads &&
                                                                                  familyHeadsFormik
                                                                                      .errors
                                                                                      .familyHeads[
                                                                                      index
                                                                                  ]?.paxPerHead && (
                                                                                      <span className="error">
                                                                                          {
                                                                                              familyHeadsFormik
                                                                                                  .errors
                                                                                                  .familyHeads[
                                                                                                  index
                                                                                              ]
                                                                                                  .paxPerHead
                                                                                          }
                                                                                      </span>
                                                                                  )}
                                                                          </div>
                                                                      </td>

                                                                      {index === 0 ? (
                                                                          <td
                                                                              rowSpan={
                                                                                  familyHeadsFormik
                                                                                      .values
                                                                                      .familyHeads
                                                                                      ?.length
                                                                              }
                                                                          >
                                                                              <button
                                                                                  type="submit"
                                                                                  disabled={
                                                                                      areFamilyHeadsDataSubmitting
                                                                                  }
                                                                                  className="btn btn-primary filter-btn mt-0"
                                                                              >
                                                                                  {areFamilyHeadsDataSubmitting
                                                                                      ? "Submitting"
                                                                                      : "Submit"}
                                                                              </button>
                                                                          </td>
                                                                      ) : (
                                                                          ""
                                                                      )}
                                                                  </tr>
                                                              )
                                                          )
                                                        : ""}
                                                </>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </>
            )}
        </>
    );
};
export default Journeyct;
