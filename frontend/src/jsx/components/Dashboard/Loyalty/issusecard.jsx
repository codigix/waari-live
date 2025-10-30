import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import BackButton from "../../common/BackButton";
const Issusecard = () => {
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    useEffect(() => {
        const textarea = document.getElementById('resizableTextarea');
        
        const adjustTextareaHeight = () => {
          textarea.style.height = 'auto'; // Reset height to auto to get the actual scroll height
          textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
        };
    
        textarea.addEventListener('input', adjustTextareaHeight);
    
        return () => {
          // Clean up the event listener when the component unmounts
          textarea.removeEventListener('input', adjustTextareaHeight);
        };
      }, []);
      const customStyles = {
        control: (provided, state) => ({
          ...provided,
          height: "34px", // Adjust the height to your preference
        }),
      };
      const cardtype = [{
        value: "1", label: "Gold" 
      },
      {
        value: "2", label: "Silver" 
      },
      {
        value: "3", label: "Diamond" 
      }
    ]
    const guestwelcome = [{
        value: "1", label: "Welcome" 
      },
      {
        value: "2", label: "Loyal" 
      },
    
    ]
    useEffect(() => {
      // While view farmer page is active, the yadi tab must also activated
      // console.log((window.location.href).split("/"))
      const pathArray = (window.location.href).split("/") 
      const path = pathArray[pathArray.length-1]
      // console.log(path)
      let element = document.getElementById("loyalty")
      // console.log(element)
      if (element) {
        element.classList.add("mm-active1") // Add the 'active' class to the element
      }
      return () => {
        if (element) {
          element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
        }
      }
    }, [])
  return (
    <>
      <div className="card"  style={{ marginBottom: '40px' }}>
        <div className="row page-titles mx-0 fixed-top-breadcrumb">
             <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <BackButton />
                        </li>
            <li className="breadcrumb-item active">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">
                  <Link to="/loyalty">Loyalty</Link>
                </li>
            <li className="breadcrumb-item  ">
              <Link to="/issuse-card">Issuse-Card</Link>
            </li>
          </ol>
        </div>
        </div>
        <div className="card">
        <div className="card-body">
          <div className="basic-form">
            <form
              className="needs-validation"
               >
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Type of guest<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                <Select
                styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
         
                  name="paymentMode"
                  options={guestwelcome}
                />
              </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Name<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    name="name"
                 />
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Address<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                <textarea
                      type="text"
                      name="address"
                      className="textarea"
                     id="resizableTextarea"
                    />
                
                </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Contact Number <span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="tel"
                    className="form-control"
                    placeholder=""
                    name="contact"
                   
                  />
                
                </div>
              </div>

              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Card Type<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                <Select
                styles={customStyles}
                  className="basic-single"
                  classNamePrefix="select"
                 name="paymentMode"
                  options={cardtype}
                />
                 </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Price<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                   />
                 </div>
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">GST<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="gst"
                  />
               </div>
               </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Total<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="total"
                  />
              </div>
               
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Payment type<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="total"
                  />
              </div>
               
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Transaction ID<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="total"
                  />
              </div>
               
              </div>
              <div className="mb-2 row">
                <div className="col-md-2">
                  <label className="form-label">Upload Transaction Proof<span className="error-star">*</span></label>
                </div>
                <div className="col-md-6">
                  <input
                    type="file"
                    className="form-control"
                    name="uploadfrom"
                  />
              </div>
              </div>
         <div className="mb-2 row">
                <div className="col-lg-12 d-flex justify-content-between mt-2">
                  <Link
                    to="/loyalty"
                    type="submit"
                    className="btn btn-back"
                  >
                    Back
                  </Link>
                  <button type="submit" className="btn  btn-submit btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Issusecard;
