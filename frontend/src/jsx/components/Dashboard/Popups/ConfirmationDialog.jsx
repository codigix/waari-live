import React from 'react'

function ConfirmationDialog({ onClose, confirmationMsg}) {

    return (
        <div>
            <h6 className='modal-h6'>{confirmationMsg}</h6>
            <div className='d-flex justify-content-center mt-3 mb-2'>
            <button className='btn  pdf-btn filter-btn btn-sm '  style={{ height: "32px", lineHeight: "1" , margin:"0 10px 0 0"}} onClick={()=>onClose(false)}>No</button>
            <button className='btn pdf-btn  btn-submit btn-sm'  style={{ height: "32px", lineHeight: "1", margin:"0" }} onClick={()=>onClose(true)}>Yes</button>
            </div>
        </div>
    )
}

export default ConfirmationDialog