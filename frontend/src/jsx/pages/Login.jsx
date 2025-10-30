import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../store/actions/authActions";
import loginbg from "../../images/pic1.png";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validation = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Please enter Email Id"),
      password: Yup.string().min(6, "Password must be at least 6 chars").required("Please enter the Password"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await axios.post(`${import.meta.env.VITE_WAARI_BASEURL}/login`, {
          email: values.email,
          password: values.password,
        });

        console.log("Response:", response);
        if (response?.data?.token) {
          dispatch(login(
            response.data.token,
            response.data.permissions,
            response.data.roleId,
            response.data.userId
          ));
          toast.success("Login successful");
          navigate("/dashboard");
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
      {/* Left Side */}
      <div className="login-aside text-center d-flex flex-column flex-row-auto">
        <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
          <div className="text-center mb-4 pt-5">
            <img src={import.meta.env.VITE_WAARI_LOGO_PATH} alt="" className="login-logo" />
          </div>
          <h3 className="mb-2">Welcome back!</h3>
        </div>
        <div className="aside-image" style={{ backgroundImage: "url(" + loginbg + ")" }}></div>
      </div>

      {/* Right Side (Form) */}
      <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
        <div className="d-flex justify-content-center h-100 align-items-center">
          <div className="authincation-content style-2">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div id="sign-in" className="auth-form form-validation">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                    }}
                    className="login-form shadow-md rounded-lg mb-4"
                  >
                    <h3 className="text-center mb-4 text-black">Sign in to your account</h3>

                    {/* Email */}
                    <div className="form-group mb-3">
                      <label><strong>Email</strong></label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Type Your Email Address"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                      />
                      {validation.touched.email && validation.errors.email && (
                        <span className="error">{validation.errors.email}</span>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group mb-3">
                      <label><strong>Password</strong></label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control"
                          placeholder="Type Your Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password}
                        />
                        <span
                          style={{ position: "absolute", right: "10px", top: "10px", cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </span>
                      </div>
                      {validation.touched.password && validation.errors.password && (
                        <span className="error">{validation.errors.password}</span>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="text-center form-group mb-3">
                      <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </button>
                    </div>
                  </form>

                  <div className="new-account mt-3 d-flex justify-content-end">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;