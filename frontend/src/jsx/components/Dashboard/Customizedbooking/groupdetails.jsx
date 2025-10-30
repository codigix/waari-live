import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../../../services/apiServices";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { removeFormData } from "../../../../store/actions/FormAction";
import { ErrorComponentArray } from "../FormErrorComponent/ErrorComponentArray";

const Groupdetails = ({ dataToFill, enqCustomId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [noOfFamilyHeads, setnoOfFamilyHeads] = useState(0)
  //get enquiry data
  const getEnqueryData = async () => {
    try {
      const result = await get(`booking-guest-info?enquiryCustomId=${enqCustomId}`);
      const apiData = result.data.data.map((entry) => ({
        familyHeadName: entry.familyHeadName,
        paxPerHead: entry.paxPerHead,
        enquiryDetailCustomId: entry.enquiryDetailCustomId,
        status: entry.status,
        guestId: entry.guestId ? entry.guestId : null
      }));
      setnoOfFamilyHeads(result.data.count)
      const numberOfEmptyEntries = Math.max(0, result.data.count - apiData.length);
      validation.setValues({
        dataList: [...apiData, ...Array.from({ length: numberOfEmptyEntries }, () => ({
          familyHeadName: "",
          paxPerHead: "",
          enquiryDetailCustomId: null,
          status: 0,
          guestId: null
        }))]
      });
    } catch (error) {
      console.log(error);
    }
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      dataList: []
    },
    validationSchema: Yup.object().shape({
      dataList: Yup.array().of(
        Yup.object().shape({
          familyHeadName: Yup.string()
          .min(4, "Name should be atleast 4 characters.")
          .required('Enter the Name of Family Head'),
          paxPerHead: Yup.string()
					.required("Enter Number of Pax")
					.test({
						name: "positiveAndAboveZero",
						test: function (value) {
							const floatValue = parseFloat(value);
							return floatValue > 0; // Check if the value is positive and above 0
						},
						message: "Pax No. must be valid & above 0",
					}),
        })
      ),
    }),

    onSubmit: async (values) => {
    },
  });


  //get data from name

  const [searchTerm, setSearchTerm] = useState({ txt: '', index: 0 });
  const [nameOptions, setNameOptions] = useState([]);

  // Simulating async data fetching (replace with actual API call)
  const fetchNameOptions = async () => {
    try {
      const response = await get(`guest-email?guestName=${searchTerm.txt}`);
      if (response.data.data.length > 0) {
        setNameOptions(response.data.data);
        validation.setFieldValue(`dataList[${searchTerm.index}].familyHeadName`, searchTerm.txt);
      } else {
        validation.setFieldValue(`dataList[${searchTerm.index}].familyHeadName`, searchTerm.txt);
        validation.setFieldValue(`dataList[${searchTerm.index}].guestId`, null);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (searchTerm.txt.length > 2) {
      // Call the debouncedFetch function
      fetchNameOptions();
    } else {
      // Reset options when search term is less than or equal to 3 characters
      setNameOptions([]);
    }

  }, [searchTerm.txt]);

  const handleNameChange = (selectedOption, index) => {
    if (selectedOption) {
      validation.setFieldValue(`dataList[${index}].familyHeadName`, selectedOption.label);
      validation.setFieldValue(`dataList[${index}].guestId`, selectedOption.value);
    } else {
      validation.setFieldValue(`dataList[${index}].familyHeadName`, searchTerm.txt)
      validation.setFieldValue(`dataList[${index}].guestId`, null);
    }
  };

  //get guest info by name
  // const getGuestInfoByName = async (name) => {
  //   try {
  //     const result = await get(`guest-info?guestId=${name}`)
  //     const { phone, email } = result.data
  //     if (result.data) {
  //       validation.setFieldValue('email', email)
  //       validation.setFieldValue('contact', phone)
  //       validation.setFieldValue('enquiryref', 8)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const columns = [
    {
      title: "Name of Family Head",
      dataIndex: "namefamilyhead",
      width: 150,
      render: (item, index) => (
        <>
       
          <Select
            options={nameOptions.map(item => ({ value: item.guestId, label: item.guestName }))}
            isClearable
            isSearchable
            className="basic-single select-family"
            classNamePrefix="select"
            onInputChange={(inputValue) => setSearchTerm({ txt: inputValue, index: index })}
            onChange={(e) => handleNameChange(e, index)}
            value={
              nameOptions.find(item => item.guestName == validation.values.dataList[index].familyHeadName)
                ? nameOptions.find(item => item.guestName == validation.values.dataList[index].familyHeadName)
                : { value: validation.values.dataList[index].familyHeadName, label: validation.values.dataList[index].familyHeadName }
            }
          />
          <ErrorComponentArray errors={validation.errors.dataList} index={index} key={'familyHeadName'} touched={validation.touched.dataList} fieldName={'familyHeadName'} />
        
        </>
      ),
    },
    {
      title: "Number of Pax",
      dataIndex: "noofpax",
      key: "noofpax",
      width: 100,
      render: (item, index) => (
        <>
          <input
            type="number"
            min={0}
            className="form-control"
            id={`dataList[${index}].paxPerHead`}
            name={`dataList[${index}].paxPerHead`}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.dataList[index]?.paxPerHead || ""}
          />
          <ErrorComponentArray errors={validation.errors.dataList} index={index} key={'paxPerHead'} touched={validation.touched.dataList} fieldName={'paxPerHead'} />
        </>
      ),
    },

    {
      title: "Form",
      render: (item, index) => (
        <>
          {
            item.status == 0 ?
              <span
                className=""
                onClick={() => handleRowSubmit(index)}
              >
                <Link
                  className="btn-link tooltip1"

                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512" className="edit-btn">
                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                  </svg>
                  {/* Booking Form */}
                  <span className="tooltiptext">Booking Form</span>
                </Link>
              </span> : '---'
          }
        </>
      ),
      key: "save",
      width: 100,
    },
    {
      title: "Status",
      render: (item) => (
        <>
          {
              item.status == 0 ? <span className="badge badge-warning">Pending</span> :
                <span className="badge badge-success">Done</span>
          }
        </>
      ),
      key: "Status",
      width: 100,
    },
  ];

  //handle row submit 
  const handleRowSubmit = async (index) => {
    const data = {
      enquiryCustomId: enqCustomId,
      enquiryDetailCustomId: validation?.values?.dataList[index].enquiryDetailCustomId,
      familyHeadName: validation?.values?.dataList[index].familyHeadName,
      paxPerHead: validation?.values?.dataList[index].paxPerHead,
      guestId: validation?.values?.dataList[index].guestId
    };
    if (data.familyHeadName.length == 0 || data.paxPerHead == 0) return toast.error('Please fill the field')
    try {
      const response = await post(`/enquiry-custom-tour-details`, data);
    
      const { guestId, enquiryDetailCustomId, destinationId,loyaltyPoints } = response.data
      dispatch(removeFormData())
      navigate(`/guest-details/${enqCustomId}?name=${data.familyHeadName}&guestId=${guestId}&destinationId=${destinationId}&enquiryDetailCustomId=${enquiryDetailCustomId}&guests=${validation?.values?.dataList[index].paxPerHead}&loyaltyPoints=${loyaltyPoints || 0}`);
    } catch (error) {
      console.error(error);
    }
  };

  //handle family head 
  const handleUpdateFamilyHead = async () => {
    try {
      const result = await post('update-custom-family-head-count', { noOfFamilyHeads, enquiryCustomId: enqCustomId })
      toast.success(result.data.message)
      getEnqueryData()
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // While view farmer page is active, the yadi tab must also activated
    const pathArray = (window.location.href).split("/")
    const path = pathArray[pathArray.length - 1]
    let element = document.getElementById("customized-tour")
    if (element) {
      element.classList.add("mm-active1") // Add the 'active' class to the element
    }
    getEnqueryData()

    return () => {
      if (element) {
        element.classList.remove("mm-active1") // remove the 'active' class to the element when change to another page
      }
    }
  }, [])



  return (
    <section>
      <div className="row">
        <div className="col-lg-8 mb-2">
          <div className="form-group">
            <label className="text-label">Group Name<span className="error-star">*</span></label>
            <input
              type="text"
              name="group_name"
              className="form-control"
              value={dataToFill?.groupName}
            />
          </div>
        </div>
        <div className="col-lg-4 mb-2">
          <div className="form-group">
            <label className="text-label">Contact Number <span className="error-star">*</span></label>
            <input
              type="number"
              className="form-control"
              //  required
              value={dataToFill?.contact}
            />
          </div>
        </div>
        <div className="col-lg-4 mb-2">
          <div className="form-group">
            <label className="text-label">Destination <span className="error-star">*</span></label>
            <input
              type="text"
              className="form-control"
              value={dataToFill?.destinationName}
            />
          </div>
        </div>
        <div className="mb-2 col-md-4">
          <div className="row">
            <div className="col-sm-6 pax-adults">
              <label>Durations(Nights) <span className="error-star">*</span></label>
              <input
                type="text"
                className="form-control w-60"
                value={dataToFill?.nights}
              />
            </div>
            <div className="col-sm-6 pax-child">
              <label>Durations(Days) <span className="error-star">*</span></label>
              <input
                type="text"
                className="form-control w-60"
                value={dataToFill?.days}
              />
            </div>
          </div>
        </div>
        <div className="mb-2 col-md-4">
          <div className="row">
            <div className="col-sm-6 pax-adults">
              <label>Pax(Adults) <span className="error-star">*</span></label>
              <input
                type="text"
                className="form-control w-60"
                value={dataToFill?.adults}
              />
            </div>
            <div className="col-sm-6 pax-child">
              <label>Pax(Childrens)</label>
              <input
                type="text"
                className="form-control w-60"
                value={dataToFill?.child}
              />
            </div>
          </div>
        </div>
        <div className="mb-2 col-md-4">
          <label>No. of family Heads <span className="error-star">*</span></label>
          <input
            type="number"
            className="form-control"
            value={noOfFamilyHeads}
            disabled={false}
            onChange={(e) => setnoOfFamilyHeads(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <div className="form-group">
            <label className="text-label">Reference Guest Id</label>
            <input
              type="text"
              className="form-control"
              value={dataToFill?.guestRefId}
            />
          </div>
        </div>
        <div className="col-md-3 mb-2 d-flex align-items-end ">
          <div className="form-group">
            <button
              style={{ margin: "0" }}
              type="text"
              className="btn  pdf-btn btn-save btn-sm"
              onClick={() => handleUpdateFamilyHead()}
            >update data</button>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="row">
        <form
          className="needs-validation"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <div className="col-lg-12 mb-2">
            <Table
              cols={columns}
              page={1}
              data={validation.values.dataList}
              totalPages={1}
              isTableLoading={false}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Groupdetails;
