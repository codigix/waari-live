import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { get } from "../../../../services/apiServices";
const Tourdetails = ({
  moveToStep,
  updateData,
  enquiryId,
  enquiryGrpData,
  sharedData,
}) => {

  // to get the data start
  const [tourData, setTourData] = useState("");

  const getData = async () => {
    try {
      const response = await get(`/enqGroup-details?enquiryGroupId=${enquiryId}`);
      setTourData(response?.data);
      enquiryGrpData(response?.data);
      if(sharedData){
        validation.setFieldValue("timeofarrival", sharedData?.timeofarrival ? sharedData?.timeofarrival : "");
        validation.setFieldValue("pax", sharedData?.pax ? sharedData?.pax :response?.data?.paxNo);
      }
        validation.setFieldValue("tournames", response?.data.tourName);
        validation.setFieldValue("tourcode", response?.data.tourCode);
        validation.setFieldValue("guesttype", {value:response?.data.departureType,label:response?.data.departureName});
        validation.setFieldValue("referenceguestid", response?.data.guestRef);
      getVehicleType(response?.data.departureType)
      getDepartureType(response?.data?.destinationId);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  // to get the data ends
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tournames: "",
      tourcode: "",
      guesttype: "",
      vehicletype: "",
      timeofarrival: "",
      pax: "",
      referenceguestid: "",
    },
    validationSchema: Yup.object({
      tournames: Yup.string().required("Enter The Tour Name"),
      tourcode: Yup.string().required("Enter The Tour Code"),
      vehicletype: Yup.object().required("Enter The Vehicle Type"),
      timeofarrival: Yup.string().required("Enter The Time of Arrival"),
      pax: Yup.string().required("Enter The Pax"),
      // referenceguestid: Yup.string().required("Enter The Reference Guest Id"),
    }),

    onSubmit: async (values) => {
      updateData(values);
      moveToStep();
    },
  });

  const [vehicletype, setVehicleType] = useState([]);

  const getVehicleType = async (departureType) => {
    try {
      const response = await get(`/dropdowbTravelMode?departureTypeId=${departureType}`);
       if(departureType==1){
         const mappedData = response.data.data.map((item) => ({
           value: item.travelId,
           label: item.traveModeName,
         }));
         setVehicleType(mappedData);
         validation.setFieldValue("vehicletype", {value:sharedData?.vehicletype ? sharedData.vehicletype?.value : response.data.data[0].travelId,label: sharedData?.vehicletype?sharedData?.vehicletype?.label :response.data.data[0].traveModeName});
       }else{
        validation.setFieldValue("vehicletype", {value:sharedData?.vehicletype ? sharedData.vehicletype?.value : response.data.data[0].travelId,label: sharedData?.vehicletype?sharedData?.vehicletype?.label :response.data.data[0].traveModeName});
       }
    } catch (error) {
      console.log(error);
    }
  };

  const [departurType, setDepartureType] = useState([]);
  const getDepartureType = async (destinationId) => {
    try {
      const response = await get(`/departure-type-list?destinationId=${destinationId}`);
      const mappedData = response.data.data.map((item) => ({
        value: item.departureTypeId,
        label: item.departureName,
      }));
      setDepartureType(mappedData);
    } catch (error) {
      console.log(error);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "34px", // Adjust the height to your preference
    }),
  };
  return (
    <section>
      <form
        className="needs-validation"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <div className="row">
          <div className="col-lg-6 mb-2">
            <div className="form-group">
              <label className="text-label">Tour Name<span className="error-star">*</span></label>
              <input
                type="text"
                name="tournames"
                className="form-control"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.tournames}
                autoComplete="true"
                disabled
              />

            </div>
          </div>
          <div className="col-lg-6 mb-2">
            <div className="form-group">
              <label className="text-label">Tour Code<span className="error-star">*</span></label>
              <input
                type="text"
                className="form-control"
                name="tourcode"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.tourcode}
                autoComplete="true"
                disabled
              />

            </div>
          </div>
          <div className="col-lg-6 mb-2">
            <div className="form-group">
              <label className="text-label">Departure Type<span className="error-star">*</span></label>
              <Select
                styles={customStyles}
                className="basic-single"
                classNamePrefix="select"
                name="guesttype"
                options={departurType}
                isDisabled
                value={validation.values.guesttype}
              />
              {validation.touched.guesttype && validation.errors.guesttype ? (
                <span className="error">{validation.errors.guesttype}</span>
              ) : null}
            </div>
          </div>

          <div className="col-lg-6 mb-2">
            <div className="form-group">
              <label className="text-label">Mode of Travel(D2D guest)<span className="error-star">*</span></label>
              <Select
                styles={customStyles}
                className="basic-single"
                classNamePrefix="select"
                name="vehicletype"
                options={vehicletype}
                onChange={(selectedOption) => {
                  validation.setFieldValue(
                    "vehicletype",
                    selectedOption
                  ); // Extract the 'value' property
                }}
                onBlur={validation.handleBlur}
                isDisabled={validation.values.guesttype?.value!= 1}
                value={
                  validation.values.vehicletype
                }
              />
              {validation.touched.vehicletype &&
                validation.errors.vehicletype ? (
                <span className="error">{validation.errors.vehicletype}</span>
              ) : null}
            </div>
          </div>
          <div className="col-lg-3 mb-2">
            <div className="form-group">
              <label className="text-label">
                Time of arrival at meeting point<span className="error-star">*</span>
              </label>
              <input
                type="time"
                name="timeofarrival"
                className="form-control"
                required
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.timeofarrival}
              />
              {validation.touched.timeofarrival &&
                validation.errors.timeofarrival ? (
                <span className="error">{validation.errors.timeofarrival}</span>
              ) : null}
            </div>
          </div>
          <div className="col-lg-3 mb-2">
            <div className="form-group">
              <label className="text-label">Number of Pax(Max 6)<span className="error-star">*</span></label>
              <input
                type="number"
                name="pax"
                max={6}
                min={1}
                className="form-control"
                required
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                // value={validation.values.pax}
                value={
                  validation.values ? validation.values.pax : tourData?.paxNo
                }
              />
              {validation.touched.pax && validation.errors.pax ? (
                <span className="error">{validation.errors.pax}</span>
              ) : null}
            </div>
          </div>
          {
            validation.values.referenceguestid &&
            <div className="col-lg-6 mb-2">
              <div className="form-group">
                <label className="text-label">Reference Guest ID</label>
                <input
                  type="text"
                  name="referenceguestid"
                  className="form-control"
                  autoComplete="true"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  // value={validation.values.referenceguestid}
                  value={tourData?.guestRef}
                />
                {validation.touched.referenceguestid &&
                  validation.errors.referenceguestid ? (
                  <span className="error">
                    {validation.errors.referenceguestid}
                  </span>
                ) : null}
              </div>
            </div>
          }

          <div className="text-end d-flex justify-content-between toolbar toolbar-bottom p-2">
            <Link
              to="/group-tour"
              type="submit"
              className="btn btn-back"
            >
              Back
            </Link>
            <button
              className="btn btn-primary sw-btn-next btn-submit"
              onClick={() => {
                console.log("Clicked")
                // moveToStep()
              }}
              type="submit"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Tourdetails;
