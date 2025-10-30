import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import ErrorMessageComponent from "../../Dashboard/FormErrorComponent/ErrorMessageComponent";
import { toast } from "react-toastify";
import { get, post } from "../../../../services/apiServices";
import BackButton from "../../common/BackButton";
const url = import.meta.env.VITE_WAARI_BASEURL;

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: "34px", // Adjust the height to your preference
    }),
};

// Validation Rules
const validationSchema = Yup.object().shape({
    teamName: Yup.string().required("Name is required"),
    userId: Yup.string().required("Team Leader is required"),
    assignAgents: Yup.array()
        .nullable()
        .required("Assign Sales Agents is required"),
});

function EditTeam() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    // this hook is for form validation
    const formik = useFormik({
        initialValues: {
            teamName: "",
            userId: "",
            assignAgents: [],
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                const data = {
                    id,
                    teamName: values.teamName,
                    userId: values.userId,
                    assignAgents: values.assignAgents.map((item) => item.value),
                };

                const result = await post("update-lead-data", data);
                toast.success(result?.data?.message);

                navigate("/teams-list");
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        },
    });

    const [teamLeaders, setTeamLeaders] = useState([]);
    const [users, setUsers] = useState([]);

    const getUsersDropDown = async () => {
        try {
            const response = await get(`/dd-all-users`);

            const mappedData = response.data.data.map((item) => ({
                value: item.userId,
                label: item.userName,
            }));
            setTeamLeaders(mappedData);
            setUsers(mappedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsersDropDown();
    }, []);
    console.log(formik.values);

    const handleAssignAgentsChange = (val) => {
        formik.setFieldValue("assignAgents", val);
    };

    // get team deatils for editing
    const getTeamDetails = async () => {
        try {
            const result = await get(`view-lead-data?id=${id}`);
            const { leadName, leadId, assignAgent } = result?.data?.data;

            formik.setFieldValue("teamName", leadName);
            formik.setFieldValue("userId", leadId);
            formik.setFieldValue(
                "assignAgents",
                assignAgent?.map((agent) => ({
                    value: agent.userId,
                    label: agent.userName,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTeamDetails();
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-lg-12" style={{ paddingTop: '40px' }}>
                    <div className="card">
                        <div className="row page-titles mx-0 fixed-top-breadcrumb">
                               <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
                                <li className="breadcrumb-item active">
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/teams-list">
                                        Team Information
                                    </Link>
                                </li>
                                <li className="breadcrumb-item  ">
                                    <Link to={"/edit-team/" + id}>
                                        Edit Team
                                    </Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    {/* form for above filed */}
                    <div className="card">
                        <div className="card-body">
                            <div
                                className="card-header mb-2 pt-0"
                                style={{ paddingLeft: "0" }}
                            >
                                <div className="card-title h5">Edit Team</div>
                            </div>

                            <form
                                onSubmit={formik.handleSubmit}
                                className="needs-validation"
                            >
                                <div className="row">
                                    <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Team Name
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="teamName"
                                                name="teamName"
                                                type="text"
                                                className="form-control"
                                                value={formik.values.teamName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"teamName"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4 col-lg-3 col-sm-6 col-12">
                                        <label className="form-label">
                                            Team Leader
                                            <span className="error-star">
                                                *
                                            </span>
                                        </label>
                                        <Select
                                            styles={customStyles}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="userId"
                                            options={teamLeaders}
                                            onChange={(selectedOption) => {
                                                formik.setFieldValue(
                                                    "userId",
                                                    selectedOption
                                                        ? selectedOption.value
                                                        : ""
                                                );
                                                setUsers(
                                                    teamLeaders.filter(
                                                        (user) =>
                                                            user.value !==
                                                            selectedOption.value
                                                    )
                                                );
                                                formik.setFieldValue(
                                                    "assignAgents",
                                                    formik.values.assignAgents.filter(
                                                        (prev) =>
                                                            prev.value !==
                                                            selectedOption.value
                                                    )
                                                );
                                            }}
                                            onBlur={formik.handleBlur}
                                            value={teamLeaders.find(
                                                (option) =>
                                                    option.value ===
                                                    formik.values.userId
                                            )}
                                        />
                                        <ErrorMessageComponent
                                            errors={formik.errors}
                                            fieldName={"userId"}
                                            touched={formik.touched}
                                            key={"userId"}
                                        />
                                    </div>

                                    <div className="col-lg-6 col-md-8 col-sm-12 col-12">
                                        <div className="mb-2">
                                            <label>
                                                Assign Sales Agents
                                                <span className="error-star">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                styles={customStyles}
                                                isMulti
                                                id="assignAgents"
                                                name="assignAgents"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                options={users}
                                                onChange={
                                                    handleAssignAgentsChange
                                                }
                                                value={
                                                    formik.values.assignAgents
                                                }
                                            />
                                            <ErrorMessageComponent
                                                errors={formik.errors}
                                                fieldName={"assignAgents"}
                                                touched={formik.touched}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 d-flex justify-content-between mt-3">
                                    <Link
                                        to="/teams-list"
                                        type="submit"
                                        className="btn btn-back"
                                    >
                                        Back
                                    </Link>
                                    <div className="d-flex">
                                        <button
                                            type="submit"
                                            className="btn btn-submit btn-primary"
                                        >
                                            {isLoading
                                                ? "Submitting..."
                                                : "Submit"}
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
}

export default EditTeam;
