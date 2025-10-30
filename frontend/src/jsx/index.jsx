import React, { useContext } from "react";

/// React router dom
import { Routes, Route, Outlet } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";
import FloatingAIButton from "./layouts/FloatingAIButton";
/// Dashboard
import Home from "./components/Dashboard/Home";
import Setting from "./layouts/Setting";
import { ThemeContext } from "../context/ThemeContext";

import PresaleGroupTour from "./components/Dashboard/presales/PresaleGroupTour";
import PresaleCustomizedtour from "./components/Dashboard/presales/PresaleCustomizedtour";
import AssignEnquiryGT from "./components/Dashboard/presales/AssignEnquiryGT";

import Grouptour from "./components/Dashboard/Enquiryfollowup/grouptour";
import Customizedtour from "./components/Dashboard/Enquiryfollowup/customizedtours";
import Addcustomizedtour from "./components/Dashboard/Enquiryfollowup/addcustomizedtour";
import Addgrouptourr from "./components/Dashboard/Enquiryfollowup/addgrouptour";
import Customizedtourdetails from "./components/Dashboard/Enquiryfollowup/customizedtourdetails";
import ConfirmGrouptour from "./components/Dashboard/Confirmed/confirmgrouptour";
import ConfirmCustomizedtour from "./components/Dashboard/Confirmed/confirmcustomizedtour";
import ViewGrouptour from "./components/Dashboard/Viewtour/viewgrouptour";
import ViewCustomizedtour from "./components/Dashboard/Viewtour/viewcustomizedtour";
import LostGrouptour from "./components/Dashboard/Lostenquiry/lostgrouptour";
import LostCustomizedtour from "./components/Dashboard/Lostenquiry/lostcustomizedtour";
import Bookingrecord from "./components/Dashboard/Bookingrecord/bookingrecord";
import Allbilling from "./components/Dashboard/Billing/allbilling";
import PaymentCustomizedtour from "./components/Dashboard/Payment/paymentcustomizedtour";
import PaymentGrouptour from "./components/Dashboard/Payment/paymentgrouptour";
import Booking from "./components/Dashboard/Booking/Booking";
import Customizedbooking from "./components/Dashboard/Customizedbooking/Booking";
import Addguest from "./components/Dashboard/Guestinfo/addguest";
import Viewguest from "./components/Dashboard/Guestinfo/viewguest";
import Guestlist from "./components/Dashboard/Guestinfo/guestlist";
import AllGuestList from "./components/Dashboard/Guestinfo/All/AllGuestList";
import Viewtourdetails from "./components/Dashboard/Viewtour/viewtourdetails";
import Billinglist from "./components/Dashboard/Confirmed/billinglist";
import Billingdetails from "./components/Dashboard/Confirmed/billingdetails";
import Guestdetails from "./components/Dashboard/Customizedbooking/guestdetails";
import Paymentdetails from "./components/Dashboard/Customizedbooking/paymentdetails";
import Discountdetails from "./components/Dashboard/Customizedbooking/discountdetails";
import Loyalty from "./components/Dashboard/Loyalty/loyalty";
import AllLoyalty from "./components/Dashboard/Loyalty/AllLoyalty";
import Issusecard from "./components/Dashboard/Loyalty/issusecard";
import Chart from "./components/Dashboard/charts/index";
import Invoice from "./components/Dashboard/Billing/invoice";
import Receipt from "./components/Dashboard/Billing/Receipt";
import ReceiptCt from "./components/Dashboard/Billing/ReceiptCt";
import EditCustomizeTour from "./components/Dashboard/Enquiryfollowup/EditCustomizeTour";
import BookingRecordCustomizeTours from "./components/Dashboard/Bookingrecord/BookingRecordCustomizeTours";
// import ViewVouchers from "./components/Dashboard/Bookingrecord/ViewVouchers";
import AllBillingCustomizeTour from "./components/Dashboard/Billing/AllBillingCustomizeTour";
import InvoiceCustomizeTour from "./components/Dashboard/Billing/InvoiceCustomizeTour";
import ViewCustomizedTourDetails from "./components/Dashboard/Viewtour/ViewCustomizedTourDetails";
import CommisionReport from "./components/Dashboard/Reports/CommisionReport";
import CustomizedMonthWiseProfit from "./components/Dashboard/Reports/CustomizedMonthWiseProfit";
import LoyaltyProgramReport from "./components/Dashboard/Reports/LoyaltyProgramReport";
import Profile from "./components/Dashboard/Profile/Profile";
import RolesList from "./components/Dashboard/RolesAndPermissions/RolesList";
import AddRoles from "./components/Dashboard/RolesAndPermissions/AddRoles";
import EditRoles from "./components/Dashboard/RolesAndPermissions/EditRoles";
import AddAffiliator from "./components/Dashboard/Affiliator/AddAffiliator";
import Coupon from "./components/Dashboard/Affiliator/Coupon";
import UserList from "./components/Dashboard/User/UserList";
import Adduser from "./components/Dashboard/User/Adduser";
import Edituser from "./components/Dashboard/User/Edituser";
import Viewuser from "./components/Dashboard/User/Viewuser";
import AccessDenied from "./auth/AccessDenied";
import AddGuestNewForm from "./components/Dashboard/Guestinfo/AddGuestNewForm";
import EditGuestNewForm from "./components/Dashboard/Guestinfo/EditGuestNewForm";

import AllAddGuestNewForm from "./components/Dashboard/Guestinfo/All/AddGuestNewForm";
import AllEditGuestNewForm from "./components/Dashboard/Guestinfo/All/EditGuestNewForm";
import AllViewguest from "./components/Dashboard/Guestinfo/All/viewguest";

import AddNewGroupTour from "./components/Dashboard/Viewtour/AddNewGroupTour";
import EditGroupTour from "./components/Dashboard/Viewtour/EditGroupTour";
import CopyGroupTour from "./components/Dashboard/Viewtour/CopyGroupTour";
import Packages from "./components/Dashboard/GlobeInformation/Packages";
import Salestarget from "./components/Dashboard/SalesTarget/salestarget";
import SetSalestarget from "./components/Dashboard/SalesTarget/setsalestarget";

import CouponList from "./components/Dashboard/CouponManagement/CouponList";
import AddCoupon from "./components/Dashboard/CouponManagement/AddCoupon";
import EditCoupon from "./components/Dashboard/CouponManagement/EditCoupon";
import ViewCoupon from "./components/Dashboard/CouponManagement/ViewCoupon";

import BillingGrouptour from "./components/Dashboard/Billing-Details/grouptour";
import BillingCustomizedtour from "./components/Dashboard/Billing-Details/customizedtour";
import BillingDetailgrouptour from "./components/Dashboard/Billing-Details/Details/grouptour";
import BillingDetailcustomizedtour from "./components/Dashboard/Billing-Details//Details/customizedtour";

import NewGrouptour from "./components/Dashboard/Enquiry-new/grouptour/grouptour";
import NewCustomizedtour from "./components/Dashboard/Enquiry-new/customizedtour/customizedtour";
import AddEnquiryGit from "./components/Dashboard/Enquiry-new/grouptour/AddEnquiryGT";
import Enquirydetailsgit from "./components/Dashboard/Enquiry-new/grouptour/enquirydetail";
import Enquiry from "./components/Dashboard/Enquiry-new/grouptour/enquiry";
import Enquiryct from "./components/Dashboard/Enquiry-new/customizedtour/enquiryct";

// All Ongoing Enquiries
import AllNewGrouptour from "./components/Dashboard/Enquiry-new/Allgrouptour/grouptour";
import AllNewCustomizedtour from "./components/Dashboard/Enquiry-new/Allcustomizedtour/customizedtour";

import AllEnquiry from "./components/Dashboard/Enquiry-new/Allgrouptour/enquiry";
import AllEnquiryct from "./components/Dashboard/Enquiry-new/Allcustomizedtour/enquiryct";

// new imports for confirm tabbed layout

// for gt
import NewConfirmGrouptour from "./components/Dashboard/Confirmed/grouptour/grouptour";
import NewConfirmGrouptourTabs from "./components/Dashboard/Confirmed/grouptour/enquiry";

import AllNewConfirmGrouptour from "./components/Dashboard/Confirmed/Allgrouptour/grouptour";
import AllNewConfirmGrouptourTabs from "./components/Dashboard/Confirmed/Allgrouptour/enquiry";

//  for ct
import NewConfirmCustomtour from "./components/Dashboard/Confirmed/customizedtour/customizedtour";
import NewConfirmCustomtourTabs from "./components/Dashboard/Confirmed/customizedtour/enquiryct";

import AllNewConfirmCustomtour from "./components/Dashboard/Confirmed/Allcustomizedtour/customizedtour";
import AllNewConfirmCustomtourTabs from "./components/Dashboard/Confirmed/Allcustomizedtour/enquiryct";

// new imports for booked tabbed layout

// for GT
import NewBookingGrouptour from "./components/Dashboard/Bookingrecord/grouptour/grouptour";
import NewBookingGrouptourTabs from "./components/Dashboard/Bookingrecord/grouptour/enquiry";

import AllNewBookingGrouptour from "./components/Dashboard/Bookingrecord/Allgrouptour/grouptour";
import AllNewBookingGrouptourTabs from "./components/Dashboard/Bookingrecord/Allgrouptour/enquiry";

// for CT
import NewBookingCustomtour from "./components/Dashboard/Bookingrecord/customizedtour/customizedtour";
import NewBookingCustomtourTabs from "./components/Dashboard/Bookingrecord/customizedtour/enquiryct";

import AllNewBookingCustomtour from "./components/Dashboard/Bookingrecord/Allcustomizedtour/customizedtour";
import AllNewBookingCustomtourTabs from "./components/Dashboard/Bookingrecord/Allcustomizedtour/enquiryct";

// all lost GT And CT
import AllLostGrouptour from "./components/Dashboard/Lostenquiry/Alllostgrouptour";
import AllLostCustomizedtour from "./components/Dashboard/Lostenquiry/Alllostcustomizedtour";

import ViewVouchers from "./components/Dashboard/Bookingrecord/customizedtour/ViewVouchers";

// New Routes Future tour enquiry
import AllFutureEnquiries from "./components/Dashboard/FutureTourEnquiry/AllFutureEnquiries";
import MyFutureEnquiries from "./components/Dashboard/FutureTourEnquiry/MyFutureEnquiries";
import AddFutureEnquiries from "./components/Dashboard/FutureTourEnquiry/AddFutureEnquiries";
import AddcustomizedtourNew from "./components/Dashboard/Enquiry-new/customizedtour/AddCustomizedTourNew";
import AffiliatorInfluencersList from "./components/Dashboard/Affiliator/AffiliatorInfluencersList";
import EditAffiliator from "./components/Dashboard/Affiliator/EditAffiliator";
import ViewAffiliator from "./components/Dashboard/Affiliator/ViewAffiliator";
import Feedbackform from "./pages/Feedbackform";
import Feedbacklist from "./components/Dashboard/Feedback/Feedbacklist";
import Monthwiseprofit from "./components/Dashboard/Reports/MonthWiseProfit";
import Grouptourprofit from "./components/Dashboard/Reports/GroupTourProfilt";
import Customizedguesttravel from "./components/Dashboard/Reports/CustomizedGuestTravel";
import Groupguesttravel from "./components/Dashboard/Reports/GroupGuestTravel";
import Customizedtravelcities from "./components/Dashboard/Reports/CustomizedTravelCities";
import Grouptravelcities from "./components/Dashboard/Reports/GroupTravelCities";
import Couponreport from "./components/Dashboard/Reports/Coupon";
import Waariselect from "./components/Dashboard/Reports/Waariselect";
import Marketreport from "./components/Dashboard/Reports/Market";
import TeamList from "./components/Dashboard/TeamManagement/TeamList";
import AddTeam from "./components/Dashboard/TeamManagement/AddTeam";
import EditTeam from "./components/Dashboard/TeamManagement/EditTeam";
import UnderTeamLeadSalesList from "./components/Dashboard/TeamManagement/UnderTeamLeadSalesList";
import UnderTeamLeadSalesData from "./components/Dashboard/TeamManagement/UnderTeamLeadSalesData";
import Seatavailable from "./components/Dashboard/Seatavailable/seatavailable";

import ReviewsList from "./components/Dashboard/Review/ReviewsList";
import AddReview from "./components/Dashboard/Review/AddReview";
import EditReview from "./components/Dashboard/Review/EditReview";
import ViewReview from "./components/Dashboard/Review/ViewReview";
import HomeFiveSectionsList from "./components/Dashboard/WebsiteHomeFiveSection/HomeFiveSectionsList";
import EditTopFive from "./components/Dashboard/WebsiteHomeFiveSection/EditTopFive";
import TourTypeList from "./components/Dashboard/TourType/TourTypeList";
import EditTourType from "./components/Dashboard/TourType/EditTourType";
import AddTourType from "./components/Dashboard/TourType/AddTourType";
import AddNewTailorMadeJourney from "./components/Dashboard/TailorMade/AddNewTailorMadeJourney";
import TailorMadeToursList from "./components/Dashboard/TailorMade/TailorMadeToursList";
import EditTailorMadeJourney from "./components/Dashboard/TailorMade/EditTailorMadeJourney";
import ViewTailorMadeTourDetails from "./components/Dashboard/TailorMade/ViewTailorMadeTourDetails";
import GroupTourDraftForm from "./components/Dashboard/Viewtour/GroupTourDraftForm";
import DraftGroupTourList from "./components/Dashboard/Viewtour/DraftGroupTourList";
import AllGuestsSearch from "./components/Dashboard/Guestinfo/All/AllGuestsSearch";
import SearchGuestsGT from "./components/Dashboard/Confirmed/grouptour/SearchGuestsGT";
import SearchGuestsCT from "./components/Dashboard/Confirmed/grouptour/SearchGuestsCT";
import SearchAllGuestsGT from "./components/Dashboard/Confirmed/grouptour/SearchAllGuestsGT";
import SearchAllGuestsCT from "./components/Dashboard/Confirmed/grouptour/SearchAllGuestsCT";
import GroupTourGuestsdetails from "./components/Dashboard/Enquiry-new/grouptour/GroupTourGuestsDetails";
import GroupTourAllGuestsdetails from "./components/Dashboard/Enquiry-new/grouptour/GroupTourAllGuestsDetails";
import CustomTourGuestsdetails from "./components/Dashboard/Enquiry-new/grouptour/CustomTourGuestsDetails";
import CustomTourAllGuestsdetails from "./components/Dashboard/Enquiry-new/grouptour/CustomTourAllGuestsDetails";
import WebisteEnquiries from "./components/Dashboard/WebisteEnquiries/WebisteEnquiries";
import WebsiteHomePageTours from "./components/Dashboard/WebsiteHomePageTours/WebsiteHomePageTours";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyForgetPasswordOTP from "./pages/VerifyForgetPasswordOTP";
import AssigncustomizedtourNew from "./components/Dashboard/presales/AssignCustomizedTourNew";
import SalesOfficeList from "./components/Dashboard/SalesOffice/SalesOfficeList";
import AddSalesOffice from "./components/Dashboard/SalesOffice/AddSalesOffice";
import EditSalesOffice from "./components/Dashboard/SalesOffice/EditSalesOffice";
import OperationManagement from "./components/Dashboard/Enquiry-new/CustomOperationManagent/OperationManagement";
import OperatorCustomTours from "./components/Dashboard/Enquiry-new/CustomOperationManagent/OperatorCustomTours";
import AllOperatorCustomTours from "./components/Dashboard/Enquiry-new/CustomOperationManagent/AllOperatorCustomTours";
import GitOperationToursList from "./components/Dashboard/GitOperation/GitOperationToursList";
import GitOperationTabs from "./components/Dashboard/GitOperation/GitOperationTabs";
import AddSupplier from "./components/Dashboard/GitOperation/SupplierPayments/AddSupplier";
import EditSupplier from "./components/Dashboard/GitOperation/SupplierPayments/EditSupplier";
import AddMiscFiles from "./components/Dashboard/GitOperation/MiscFiles/AddMiscFiles";
import EditMiscFiles from "./components/Dashboard/GitOperation/MiscFiles/EditMiscFiles";
import AllMiscFiles from "./components/Dashboard/GitOperation/MiscFiles/AllMiscFilesList";
import AllSupplierPaymentsList from "./components/Dashboard/GitOperation/SupplierPayments/AllSupplierPaymentsList";
import AllOperationManagement from "./components/Dashboard/Enquiry-new/CustomOperationManagent/AllOperationManagement";

const Markup = () => {
  const allroutes = [
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    { url: "group-tour", component: <Grouptour /> },
    { url: "customized-tour", component: <Customizedtour /> },
    { url: "add-customized-tour", component: <Addcustomizedtour /> },

    // may be this page is unused
    { url: "add-group-tour", component: <Addgrouptourr /> },
    {
      url: "customized-tour-details/:id",
      component: <Customizedtourdetails />,
    },

    { url: "add-new-group-tour", component: <AddNewGroupTour /> },
    { url: "edit-group-tour/:id", component: <EditGroupTour /> },
    { url: "copy-group-tour/:id", component: <CopyGroupTour /> },

    { url: "confirm-group-tour", component: <ConfirmGrouptour /> },

    { url: "confirm-customized-tour", component: <ConfirmCustomizedtour /> },
    { url: "confirm-grouptour", component: <ConfirmGrouptour /> },

    { url: "confirm-customizedtour", component: <ConfirmCustomizedtour /> },

    { url: "View-group-tour", component: <ViewGrouptour /> },
    { url: "view-draft-grouptours-list", component: <DraftGroupTourList /> },
    { url: "View-customized-tour", component: <ViewCustomizedtour /> },

    { url: "git-operation-tours-list", component: <GitOperationToursList /> },
    { url: "git-operation-tabs/:id", component: <GitOperationTabs /> },

    { url: "lost-grouptour", component: <LostGrouptour /> },
    { url: "lost-customizedtour", component: <LostCustomizedtour /> },

    { url: "booking-record-grouptour", component: <Bookingrecord /> },
    {
      url: "booking-record-customizetour",
      component: <BookingRecordCustomizeTours />,
    },
    { url: "all-billing/:id", component: <Allbilling /> },

    { url: "payment-group-tour/:id", component: <PaymentGrouptour /> },
    {
      url: "payment-customized-tour/:id/:idPayment",
      component: <PaymentCustomizedtour />,
    },

    {
      url: "all-billing-ct/:id/:idPayment",
      component: <AllBillingCustomizeTour />,
    },
    { url: "booking/:id", component: <Booking /> },
    { url: "/customizedbooking/booking/:id", component: <Customizedbooking /> },
    { url: "group-tour-new", component: <NewGrouptour /> },
    { url: "customized-tour-new", component: <NewCustomizedtour /> },
    { url: "operator-custom-tours", component: <OperatorCustomTours /> },
    { url: "all-operator-custom-tours", component: <AllOperatorCustomTours /> },
    { url: "add-customized-tour-new", component: <AddcustomizedtourNew /> },

    { url: "add-enquiry-git", component: <AddEnquiryGit /> },
    { url: "Enquiry-Details-git", component: <Enquirydetailsgit /> },
    { url: "enquiry/:id", component: <Enquiry /> },
    { url: "enquiry-ct/:id", component: <Enquiryct /> },
    { url: "operation-management/:id", component: <OperationManagement /> },
    {
      url: "all-operation-management/:id",
      component: <AllOperationManagement />,
    },
    // Old Routes and I think Unused code also but not sure
    { url: "add-guest", component: <Addguest /> },
    // { url: "edit-guest/:id", component: <Editguest /> },

    // New Route for Guest CRUD
    { url: "guest-list", component: <Guestlist /> },
    { url: "add-new-guest", component: <AddGuestNewForm /> },
    { url: "edit-guest-new/:id", component: <EditGuestNewForm /> },
    { url: "view-guest/:id", component: <Viewguest /> },

    { url: "all-guest-list", component: <AllGuestList /> },
    { url: "all-guests-search", component: <AllGuestsSearch /> },
    { url: "all-add-new-guest", component: <AllAddGuestNewForm /> },
    { url: "all-edit-guest-new/:id", component: <AllEditGuestNewForm /> },
    { url: "all-view-guest/:id", component: <AllViewguest /> },

    { url: "view-tour-details/:id", component: <Viewtourdetails /> },
    { url: "view-billing", component: <Billinglist /> },
    { url: "view-billing-details", component: <Billingdetails /> },
    { url: "guest-details/:id", component: <Guestdetails /> },
    { url: "payment-details/:id", component: <Paymentdetails /> },
    { url: "discount-details/:id", component: <Discountdetails /> },
    { url: "loyalty", component: <Loyalty /> },
    { url: "all-loyalty", component: <AllLoyalty /> },
    { url: "issuse-card", component: <Issusecard /> },
    { url: "view-loyalty/:id", component: <Viewguest /> },
    { url: "chart", component: <Chart /> },
    { url: "invoice/:id", component: <Invoice /> },
    { url: "invoice-ct/:id/:idPayment", component: <InvoiceCustomizeTour /> },
    { url: "receipt/:id/:idPayment", component: <Receipt /> },
    { url: "receipt-ct/:id/:idPayment", component: <ReceiptCt /> },
    { url: "edit-ct/:id", component: <EditCustomizeTour /> },
    { url: "view-vouchers/:id", component: <ViewVouchers /> },
    {
      url: "view-customized-tour-details/:id",
      component: <ViewCustomizedTourDetails />,
    },

    // Reports
    { url: "view-commision-reports/", component: <CommisionReport /> },
    {
      url: "customized-monthwise-profit",
      component: <CustomizedMonthWiseProfit />,
    },
    { url: "loyalty-program-report", component: <LoyaltyProgramReport /> },

    { url: "profile/", component: <Profile /> },

    // Affiliates and Influencers Routes
    { url: "affiliator-influencers", component: <AffiliatorInfluencersList /> },
    { url: "add-affiliator", component: <AddAffiliator /> },
    { url: "edit-affiliator/:id", component: <EditAffiliator /> },
    { url: "view-affiliator/:id", component: <ViewAffiliator /> },

    // {url:"coupon", component:<Coupon/>},
    { url: "add-user", component: <Adduser /> },
    { url: "edit-user/:userId", component: <Edituser /> },
    { url: "view-user/:userId", component: <Viewuser /> },
    { url: "users-list", component: <UserList /> },

    // roles and permissions
    { url: "role-list", component: <RolesList /> },
    { url: "add-roles", component: <AddRoles /> },
    { url: "edit-roles/:id", component: <EditRoles /> },
    { url: "add-roles", component: <AddRoles /> },
    { url: "/access-denied", component: <AccessDenied /> },

    { url: "globe-information", component: <Packages /> },
    { url: "sales-target", component: <Salestarget /> },
    { url: "/set-sales-target/:id", component: <SetSalestarget /> },

    // Coupons
    { url: "coupon-list", component: <CouponList /> },
    { url: "add-coupon", component: <AddCoupon /> },
    { url: "edit-coupon/:id", component: <EditCoupon /> },
    { url: "view-coupon/:id", component: <ViewCoupon /> },

    { url: "billing-group-tour", component: <BillingGrouptour /> },
    { url: "billing-customized-tour", component: <BillingCustomizedtour /> },
    {
      url: "/details/group-tour/:id/:idPayment/:familyHeadGtId",
      component: <BillingDetailgrouptour />,
    },
    {
      url: "/details/customized-tour/:id/:idPayment",
      component: <BillingDetailcustomizedtour />,
    },

    // New Routes for Confimed Enquiry in Tabbed Layout
    { url: "confirm-group-tour-new", component: <NewConfirmGrouptour /> },
    {
      url: "confirm-enquiry/:enquiryId/:familyHeadGtId",
      component: <NewConfirmGrouptourTabs />,
    },

    { url: "confirm-custom-tour-new", component: <NewConfirmCustomtour /> },
    {
      url: "confirm-custom-enquiry/:id/",
      component: <NewConfirmCustomtourTabs />,
    },

    // New Routes for Booked Enquiry in Tabbed Layout
    { url: "booking-group-tour-new", component: <NewBookingGrouptour /> },
    {
      url: "booking-enquiry/:enquiryId/:familyHeadGtId",
      component: <NewBookingGrouptourTabs />,
    },

    { url: "booking-custom-tour-new", component: <NewBookingCustomtour /> },
    {
      url: "booking-custom-enquiry/:id/",
      component: <NewBookingCustomtourTabs />,
    },

    // for all
    {
      url: "all-booking-group-tour-new",
      component: <AllNewBookingGrouptour />,
    },
    {
      url: "all-booking-enquiry/:enquiryId/:familyHeadGtId",
      component: <AllNewBookingGrouptourTabs />,
    },

    {
      url: "all-booking-custom-tour-new",
      component: <AllNewBookingCustomtour />,
    },
    {
      url: "all-booking-custom-enquiry/:id/",
      component: <AllNewBookingCustomtourTabs />,
    },

    // Future Tour Enquiry Routes
    { url: "all-future-tour-enquiries", component: <AllFutureEnquiries /> },
    { url: "my-future-tour-enquiries", component: <MyFutureEnquiries /> },
    { url: "add-future-tour-enquiries", component: <AddFutureEnquiries /> },
    // { url: "feedback-form", component: <Feedbackform /> },
    { url: "feedback-list", component: <Feedbacklist /> },
    { url: "monthwise-profit", component: <Monthwiseprofit /> },
    { url: "grouptour-profit", component: <Grouptourprofit /> },
    { url: "customized-guest-travel", component: <Customizedguesttravel /> },
    { url: "group-guest-travel", component: <Groupguesttravel /> },
    { url: "group-travel-cities", component: <Grouptravelcities /> },
    { url: "customized-travel-cities", component: <Customizedtravelcities /> },
    { url: "coupon-report", component: <Couponreport /> },
    { url: "waari-select", component: <Waariselect /> },
    { url: "market", component: <Marketreport /> },
    // <Route path="/Feedbackform" element={<Feedbackform />} />

    // all ongoing group tour

    { url: "all-group-tour-new", component: <AllNewGrouptour /> },
    { url: "all-customized-tour-new", component: <AllNewCustomizedtour /> },

    { url: "all-enquiry/:id", component: <AllEnquiry /> },
    { url: "all-enquiry-ct/:id", component: <AllEnquiryct /> },

    // presale and assign enquiry routes
    { url: "presale-group-tour-new", component: <PresaleGroupTour /> },
    { url: "/assign-gt-enquiry/:id", component: <AssignEnquiryGT /> },
    {
      url: "presale-customized-tour-new",
      component: <PresaleCustomizedtour />,
    },
    { url: "/assign-ct-enquiry/:id", component: <AssigncustomizedtourNew /> },

    // all confirmed
    {
      url: "all-confirm-group-tour-new",
      component: <AllNewConfirmGrouptour />,
    },
    {
      url: "all-confirm-enquiry/:enquiryId/:familyHeadGtId",
      component: <AllNewConfirmGrouptourTabs />,
    },

    {
      url: "all-confirm-custom-tour-new",
      component: <AllNewConfirmCustomtour />,
    },
    {
      url: "all-confirm-custom-enquiry/:id/",
      component: <AllNewConfirmCustomtourTabs />,
    },

    // All Lost Enquries
    { url: "all-lost-grouptour", component: <AllLostGrouptour /> },
    { url: "all-lost-customizedtour", component: <AllLostCustomizedtour /> },

    // Teams
    { url: "teams-list", component: <TeamList /> },
    { url: "add-team", component: <AddTeam /> },
    { url: "edit-team/:id", component: <EditTeam /> },

    {
      url: "under-team-lead-sales-list",
      component: <UnderTeamLeadSalesList />,
    },
    {
      url: "under-team-lead-sales-data/:id",
      component: <UnderTeamLeadSalesData />,
    },
    { url: "/seatavailable", component: <Seatavailable /> },

    { url: "add-review", component: <AddReview /> },
    { url: "edit-review/:id", component: <EditReview /> },
    { url: "view-review/:id", component: <ViewReview /> },
    { url: "reviews-list", component: <ReviewsList /> },

    { url: "home-five-sections-list", component: <HomeFiveSectionsList /> },
    { url: "edit-top-five/:id", component: <EditTopFive /> },
    { url: "tour-type-list", component: <TourTypeList /> },
    { url: "add-tour-type", component: <AddTourType /> },
    { url: "edit-tour-type/:id", component: <EditTourType /> },

    { url: "sales-offices-list", component: <SalesOfficeList /> },
    { url: "add-sales-office", component: <AddSalesOffice /> },
    { url: "edit-sales-office/:id", component: <EditSalesOffice /> },

    { url: "tailormade-tours", component: <TailorMadeToursList /> },
    { url: "add-new-tailor-made", component: <AddNewTailorMadeJourney /> },
    { url: "edit-tailormade-tour/:id", component: <EditTailorMadeJourney /> },
    {
      url: "view-tailormade-tour-details/:id",
      component: <ViewTailorMadeTourDetails />,
    },
    // { url: "copy-group-tour/:id", component: <CopyGroupTour /> },

    { url: "group-tour-draft/:id", component: <GroupTourDraftForm /> },
    { url: "search-group-tour-guests", component: <SearchGuestsGT /> },
    { url: "search-custom-tour-guests", component: <SearchGuestsCT /> },
    { url: "search-group-tour-all-guests", component: <SearchAllGuestsGT /> },
    { url: "search-custom-tour-all-guests", component: <SearchAllGuestsCT /> },

    {
      url: "group-tour-guests-details/:enquiryId/:familyHeadGtId",
      component: <GroupTourGuestsdetails />,
    },
    {
      url: "group-tour-all-guests-details/:enquiryId/:familyHeadGtId",
      component: <GroupTourAllGuestsdetails />,
    },

    {
      url: "custom-tour-guests-details/:enquiryId/:familyHeadGtId",
      component: <CustomTourGuestsdetails />,
    },
    {
      url: "custom-tour-all-guests-details/:enquiryId/:familyHeadGtId",
      component: <CustomTourAllGuestsdetails />,
    },
    { url: "website-enquiries", component: <WebisteEnquiries /> },
    {
      url: "website-homepage-tours-manage",
      component: <WebsiteHomePageTours />,
    },

    { url: "forgot-password", component: <ForgotPassword /> },
    {
      url: "/verify-forget-password-otp",
      component: <VerifyForgetPasswordOTP />,
    },
  ];

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
      </Routes>
      <Setting />
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const { menuToggle, sidebariconHover } = useContext(ThemeContext);
  return (
    <div
      id="main-wrapper"
      className={`show ${sidebariconHover ? "iconhover-toggle" : ""} ${
        menuToggle ? "menu-toggle" : ""
      }`}
    >
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer />
      <FloatingAIButton />
    </div>
  );
}
export default Markup;
