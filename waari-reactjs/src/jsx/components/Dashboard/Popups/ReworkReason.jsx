import React, { useEffect } from 'react'
import { post } from '../../../../services/apiServices'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as Yup from "yup";
function ReworkReason({ data ,onClose}) {

  const validation = useFormik({
    initialValues: {
      reworkDescription: ""
    },
    validationSchema:Yup.object( {
      reworkDescription: Yup.string().required("this field is required."),
    }),
    onSubmit: async (values) => {
      try {
        const result = await post(`rework-plan`, { ...values, ...data })
        toast.success(result.data.message)
        onClose(true)
      } catch (error) {
        console.log(error);
      }
    }
  })
  useEffect(() => {
    
    const textarea5 = document.getElementById('descriptionId');
    textarea5 && textarea5.addEventListener("input", function () {
      this.style.height = "auto"; // Reset height to auto
      this.style.height = this.scrollHeight + "px"; // Set height to scrollHeight
    });
 
}, []);
  return (
    <div className='mt-3 '>
      <form onSubmit={validation.handleSubmit}>
        <div className='form-group mb-2'>
          <label>Description</label>
          <textarea name="reworkDescription" className='textarea'  id="descriptionId" onChange={validation.handleChange} onBlur={validation.handleBlur} cols="50">
          </textarea>
          {
            validation.errors && validation.touched.reworkDescription && <span className='error'>{validation.errors.reworkDescription}</span>
          }
        </div>
        <div>
          <button type='submit' disabled={validation.isSubmitting} className='btn pdf-btn  btn-submit btn-sm' style={{ height: "32px", lineHeight: "1", margin: "0" }} >{validation.isSubmitting ? "Submitting...":"Submit"}</button>
        </div>
      </form>
    </div>
  )
}

export default ReworkReason