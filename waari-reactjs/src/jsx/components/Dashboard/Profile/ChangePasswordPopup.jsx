import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { post } from "../../../../services/apiServices";
import ErrorMessageComponent from "../FormErrorComponent/ErrorMessageComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// validation rules
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Please enter your Current password")
    .min(6, "Password should be atleast 6 characters."),
  newPassword: Yup.string()
    .min(6, "Length of the password should be atleast 6 digits")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/,
      "Password must contain at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character"
    )
    .required("Please enter the Password"),
  confirmPassword: Yup.string()
  .required("Please confirm password")
  .oneOf([Yup.ref('newPassword'), null], 'New Password and Confirm Password must match'),
});

function ChangePasswordPopup({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const data = {
          password: values.password,
          newPassword: values.newPassword,
        };
        const result = await post("sales-reset-password", data);
        localStorage.removeItem("token")
        localStorage.removeItem("permissions")
        localStorage.removeItem("roleId")
        localStorage.removeItem("userId")
        
        navigate('/login');

        setTimeout(() => {
          toast.success(result?.data?.message + " Please Login with your new password")
        }, 100)
        onClose(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  // this is warn user from changing page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "You have unsaved changes. Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
        return false;
      }}
      style={{ width: "30vw" }}
    >
    <h6 className="modal-h6">Reset Password</h6>
      <div>
       
            <div>
              <div className="col-md-6 w-100">
                <div className="mb-2 w-100">
                  <label>
                    Old Password<span className="error-star">*</span>
                  </label>
                  <div className="d-flex" style={{position:"relative"}}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control w-100"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    {showPassword ? (
                      <div
                        style={{ marginLeft: "10px" }}
                        className="eye-icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i className="bi bi-eye-slash-fill"></i>
                      </div>
                    ) : (
                      <div
                        style={{ marginLeft: "10px" }}
                        className="eye-icon"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </div>
                    )}
                  </div>
                  <ErrorMessageComponent
                    errors={formik.errors}
                    fieldName={"password"}
                    touched={formik.touched}
                  />
                </div>
              </div>

              <div className="col-md-6 w-100">
                <div className="mb-2 w-100">
                  <label>
                    New Password<span className="error-star">*</span>
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control w-100"
                    onChange={formik.handleChange}
                    value={formik.values.newPassword}
                  />
                  <ErrorMessageComponent
                    errors={formik.errors}
                    fieldName={"newPassword"}
                    touched={formik.touched}
                  />
                </div>
              </div>

              <div className="col-md-6 w-100">
                <div className="mb-2 w-100">
                  <label>
                    Confirm Password<span className="error-star">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control w-100"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                  <ErrorMessageComponent
                    errors={formik.errors}
                    fieldName={"confirmPassword"}
                    touched={formik.touched}
                  />
                </div>
              </div>
            </div>
          </div>
        
      <div className="d-flex justify-content-center mt-3 mb-2">
        <div className="d-flex" >
          <button
            type="submit"
            className="btn btn-submit btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChangePasswordPopup;
