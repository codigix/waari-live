import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import "react-phone-number-input/style.css";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import "react-toastify/dist/ReactToastify.css";
import { scrollIntoViewHelper } from "../../../utils/scrollIntoViewHelper";
import BackButton from "../../common/BackButton";
import Select from "react-select";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: "34px", // Adjust the height to your preference
    }),
};

const validationSchema = Yup.object().shape({
    groupTourIds: Yup.array().required(
        "Please Select Group tours to display on website homepage is required"
    ),
});

const WebsiteHomePageTours = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [preselectedTourIds, setPreselectedTourIds] = useState([]);
    const [toursDropdown, setToursDropdown] = useState([]);
    const { permissions} = useSelector(state => state.auth)

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            groupTourIds: [],
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const data = {
                    groupTourIds: values.groupTourIds.map(item => item.value),
                };
                const result = await post(`add-home-page-journey`, data);
                toast.success(result?.data?.message);
                navigate("/website-homepage-tours-manage");
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    //handle country change
    const handleSelect = (val) => {
        formik.setFieldValue("groupTourIds", val);
    };

    console.log("groupTourIds", formik.values.groupTourIds)
    
    const getPreSelectedHomeTours = async () => {
        try {
            const result = await get(`get-home-page-journey`);

            const transformedData = result.data.data.map(item => item.groupTourId);

            setPreselectedTourIds(transformedData);
        } catch (error) {
            console.log(error);
        }
    };

    console.log("preselectedTourIds", preselectedTourIds)
    
    const fetchToursDropdown = async () => {
        try {
            const result = await get(`group-tour-list-dropdown`);

            const transformedData = result.data.data.map((tour) => ({
                value: tour.groupTourId,
                label: tour.tourName,
            }));

            setToursDropdown(transformedData);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (!formik.isSubmitting) {
            if (Object.keys(formik.errors).length) {
                scrollIntoViewHelper(formik.errors);
            }
        }
    }, [formik.isSubmitting]);

    useEffect(() => {
       hasComponentPermission(permissions, 308) && getPreSelectedHomeTours();
        fetchToursDropdown();
    }, []);

        // Set preselected values when the component mounts
        useEffect(() => {
            const preselectedTours = toursDropdown.filter((tour) =>
                preselectedTourIds.includes(tour.value)
            );
    
            // debugger
            formik.setFieldValue("groupTourIds", preselectedTours);
        }, [preselectedTourIds, toursDropdown]);
    

        if ( !hasComponentPermission(permissions, 308) ) return <h2 className="centered-message">
        You do not have permission for this page
    </h2>
        
    return (
        <>
            <div className="row">
                <div className="col-lg-12" style={{ paddingTop: '40px' }}>
                    <div className="card">
                        <div className="row page-titles mx-0 fixed-top-breadcrumb">
                            <ol className="breadcrumb">
                            
                                <li className="breadcrumb-item active">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/website-homepage-tours-manage">
                                        Homepage Tours Listing
                                    </Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to="javascript:void(0)">Manage Website Homepage</Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div className="card-header mb-2 p-0">
                                <div className="card-title h5">Update Homepage Tours</div>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="needs-validation">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 col-lg-10 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Tours
                                                <span className="error-star">*</span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                isMulti
                                                id="groupTourIds"
                                                name="groupTourIds"
                                                className="basic-multi-select w-full"
                                                classNamePrefix="select"
                                                options={toursDropdown}
                                                onChange={handleSelect}
                                                value={formik.values.groupTourIds}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"groupTourIds"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <div className="d-flex">
                                        <button
                                            type="submit"
                                            className="btn btn-submit btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Updating..." : "Update"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default WebsiteHomePageTours;
