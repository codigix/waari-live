import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { checkAutoLogin } from "./services/AuthService";
import { ToastContainer } from "react-toastify";
import Index from "./jsx";
import "./css/style.css";
import Feedbackform from "./jsx/pages/Feedbackform";
import { get } from "./services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { login, setPermissions } from "./store/actions/authActions";
import OTPVerify from "./jsx/pages/OTPVerify";
import ForgotPassword from "./jsx/pages/ForgotPassword";
import VerifyForgetPasswordOTP from "./jsx/pages/VerifyForgetPasswordOTP";


const Login = lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
	});
});

function App() {
	const navigate = useNavigate();

	const { pathname } = useLocation();

	const dispatch = useDispatch();
	const { token } = useSelector(state => state.auth)

	useEffect(() => {
		if (!pathname.includes("feedback-form") && !pathname.includes("verify-otp")) {
			checkAutoLogin(navigate);
		}
	}, []);

	useEffect(() => {
		const fetchPermissions = async () => {
			try {
				const roleId = localStorage.getItem("roleId"); // stored earlier
				console.log("roleId", roleId);
				const response = await get(`/role/test-permission/${roleId}`);
				console.log("permissions", response.data.permissions);

				dispatch(setPermissions(response?.data?.permissions));
			} catch (error) {
				console.log(error);
			}
		};

		if (token) {
			fetchPermissions();
		}
	}, [token, dispatch]);

	const routeblog = (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/verify-otp" element={<OTPVerify />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/verify-forget-password-otp" element={<VerifyForgetPasswordOTP />} />
			<Route path="/feedback-form" element={<Feedbackform />} />
		</Routes>
	);

	if (localStorage.getItem("token")) {
		return (
			<>
				<Index />
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					closeButton={
						<button
							style={{
								width: "30px",
								backgroundColor: "inherit",
								border: "none",
								color: "white",
							}}
						>
							X
						</button>
					}
				/>
			</>
		);
	} else {
		return (
			<div className="vh-100">
				<Suspense
					fallback={
						<div id="preloader">
							<div className="sk-three-bounce">
								<div className="sk-child sk-bounce1"></div>
								<div className="sk-child sk-bounce2"></div>
								<div className="sk-child sk-bounce3"></div>
							</div>
						</div>
					}
				>
					{routeblog}
					<ToastContainer
						position="bottom-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="colored"
						closeButton={
							<button
								style={{
									width: "30px",
									backgroundColor: "inherit",
									border: "none",
									color: "white",
								}}
							>
								X
							</button>
						}
					/>
				</Suspense>
			</div>
		);
	}
}

export default App;
