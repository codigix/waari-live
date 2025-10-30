import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import PopupModal from "../../Popups/PopupModal";
import CancelEnquiryModal from "./CancelEnquiryModal";

const Canceltourform = () => {

    const [isUserExist, setUserIsExist] = useState(false);
    const [cancelEnquiry, setCancelEnquiry] = useState(false);

    const handleDialogClose = () => {
        setCancelEnquiry(false);
    };

    const status = [
        { value: '1', label: 'Initaited' },
        { value: '2', label: 'Completed' },
    ]
    const optedfor = [
        { value: '1', label: 'Refund' },
        { value: '2', label: 'Credit Note' },
    ]
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: "34px", // Adjust the height to your preference
        }),
    };
    return (
        <>
            {cancelEnquiry && (
                <PopupModal open={true} onDialogClose={handleDialogClose}>
                    <CancelEnquiryModal
                        onClose={handleDialogClose}
                    />
                </PopupModal>
            )}
            <section>

                <div className="card-header card-header-second p-0">
                    <div className="card-title h5">Name</div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <div className="row mb-2">
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <label className="form-label">
                                    Rishikesh Musmade
                                </label>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <button className="btn btn-back" onClick={() => {
                                    setCancelEnquiry(true);
                                }}>Cancel Tour</button>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <label className="form-label cancel-tour">
                                    Rishikesh Musmade
                                </label>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <button className="btn btn-back">Cancel Tour</button>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <label className="form-label">
                                    Rishikesh Musmade
                                </label>
                            </div>
                            <div className="col-md-6 col-sm-6 col-lg-6 col-12">
                                <button className="btn btn-back">Cancel Tour</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <form>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card-header card-header-second mb-2 mt-2 p-0">
                                <div className="card-title h5">Cancellation Details</div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Name of guest<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Reason for Cancellation:<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Cancellation Charges<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Refund Amount<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Opted for:<span className="error-star">*</span>
                                </label>
                                <Select
                                    styles={customStyles}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="tourname"
                                    options={optedfor}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Status<span className="error-star">*</span>
                                </label>
                                <Select
                                    styles={customStyles}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="tourname"
                                    options={status}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card-header card-header-second mb-2 mt-2 p-0">
                                <div className="card-title h5">Details of Refund</div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Account Name<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Account Number<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Bank<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Branch<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    IFSC Code<span className="error-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactno"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 mt-4 row d-flex justify-content-center">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-md-6 col-lg-4 col-sm-6 col-12 mx-auto mb-2 justify-content-center d-flex">
                                    <button
                                        type="submit"
                                        className="btn btn-submit btn-primary">
                                        Upload Refund Proof (Accounts)
                                    </button>
                                </div>
                                <div className="col-md-6 col-lg-4 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex">
                                    <button
                                        type="submit"
                                        className="btn add-btn btn-secondary"
                                    >
                                        View Refund Proof (Sales)
                                    </button>
                                </div>
                                <div className="col-md-6 col-lg-3 col-sm-6 col-12  mx-auto mb-2 justify-content-center d-flex ">
                                    <button
                                        type="submit"
                                        className="btn btn-back"
                                    >
                                        View Credit Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </section>
        </>
    )
}
export default Canceltourform;