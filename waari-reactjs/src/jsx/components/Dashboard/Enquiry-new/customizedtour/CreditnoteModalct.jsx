import React, { useEffect } from "react";

function CreditnoteModalct({ onClose }) {
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
    return (
        <>

            <div>
                <h6 className="modal-h6">Credit Note</h6>
                <div>

                    <div className="basic-form">

                        <div className="row">
                            <div className="col-md-12 mb-2">
                                <label className="form-label">
                                    Make Credit Note:<span className="error-star">*</span>
                                </label>
                                <textarea
                                    className="textarea"
                                    id="resizableTextarea"
                                    name="callSummary"
                                    rows="3"
                                ></textarea>
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
                        className="btn btn-submit btn-primary" >
                        Submit
                    </button>

                </div>
            </div>
        </>
    );
}

export default CreditnoteModalct;


