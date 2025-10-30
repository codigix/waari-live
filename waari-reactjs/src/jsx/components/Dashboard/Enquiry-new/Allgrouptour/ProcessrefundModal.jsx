import React, {  useState } from "react";
import PopupModal from "../../Popups/PopupModal";
import CreditnoteModal from "./CreditnoteModal"
function ProcessrefundModal({ onClose }) {
   
    const [Creditnote, SetCreditnote] = useState(false);
    const handleDialogClose = () => {
        SetCreditnote(false);
    };
 
    return (
        <>
         {Creditnote && (
            <PopupModal className="creditmodal" open={true} onDialogClose={handleDialogClose}>
                <CreditnoteModal
                    onClose={handleDialogClose}
                />
            </PopupModal>
        )} 
        <div>
            <h6 className="modal-h6">Process Refund</h6>
            <div>

                <div className="basic-form">
    
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <label className="form-label">
                            Account Name<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label">
                            Account Number:<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2" >
                            <label className="form-label">
                            Bank:<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2" >
                            <label className="form-label">
                            Branch:<span className="error-star">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactno"
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-4 mb-2" >
                            <label className="form-label">
                            IFSC Code:<span className="error-star">*</span>
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
                    className="btn btn-submit btn-primary"   onClick={() => {
                        SetCreditnote(true);
                    }} >
                    Submit
                </button>

            </div>
        </div>
        </>
    );
}

export default ProcessrefundModal;


