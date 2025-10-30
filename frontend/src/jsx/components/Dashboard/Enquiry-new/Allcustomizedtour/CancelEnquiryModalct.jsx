import React, { useState } from "react";
import PopupModal from "../../Popups/PopupModal";
import ProcessrefundModal from "./ProcessrefundModalct"
function CancelEnquiryModalct({ onClose }) {


    const [Processrefund, SetProcessRefund] = useState(false);
    const handleDialogClose = () => {
        SetProcessRefund(false);
    };

    return (
        <>
        {Processrefund && (
            <PopupModal open={true} onDialogClose={handleDialogClose}>
                <ProcessrefundModal
                    onClose={handleDialogClose}
                />
            </PopupModal>
        )}
        <div>
            <h6 className="modal-h6">Cancel Tour</h6>
            <div>

                <div className="basic-form">
                    <div>
                        <h6 style={{ fontSize: "20px" }}>Are you sure you want to cancel the following guests?</h6>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-6">
                            <label className="form-label cancel-tour">
                                Rishikesh Musmade
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 mb-2">
                            <label className="form-label">
                                Reason for Cancellation<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label">
                                Cancellation Charges:<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2" >
                            <label className="form-label">
                                Refund Amount:<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
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
                    className="btn btn-submit btn-primary"  onClick={() => {
                        SetProcessRefund(true);
                    }}>
                    Submit
                </button>

            </div>
        </div>
        </>
    );
}

export default CancelEnquiryModalct;


