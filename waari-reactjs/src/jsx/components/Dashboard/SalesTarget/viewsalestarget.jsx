import React, { useEffect, useState } from "react";
import Table from "../../table/VTable";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { get, post } from "../../../../services/apiServices";
import { toast } from "react-toastify";
import { hasComponentPermission } from "../../../auth/PrivateRoute";
import { useSelector } from "react-redux";

const validationSchema1 = Yup.object().shape({
  groupTourTargets1: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  groupTourTargets2: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  groupTourTargets3: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  groupTourTargets4: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  )

});
const validationSchema2 = Yup.object().shape({
  customizedTourTargets1: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  customizedTourTargets2: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  customizedTourTargets3: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
  customizedTourTargets4: Yup.array().of(
    Yup.object().shape({
      target: Yup.number().required("Target is required"),
    })
  ),
});

const SetSalestarget = ({ year }) => {

  const { id } = useParams()
  const [btnTextCt,setbtnTextCt] = useState({text:'Update',isUpdate:false})
  const [btnTextGt, setbtnTextGt] = useState({ text: 'Update', isUpdate: false })
	const { permissions } = useSelector((state) => state.auth);
  
  const getSalesData = async () => {
    try {
      const result = await get(`view-sales-target?userId=${id}&yearId=${year}`)
      if (result.data.salesDataGt.length > 0) {
        formik.setFieldValue(`groupTourTargets1[0].target`, result.data.salesDataGt[0].target)
        formik.setFieldValue(`groupTourTargets1[1].target`, result.data.salesDataGt[1].target)
        formik.setFieldValue(`groupTourTargets1[2].target`, result.data.salesDataGt[2].target)
        formik.setFieldValue(`groupTourTargets2[0].target`, result.data.salesDataGt[3].target)
        formik.setFieldValue(`groupTourTargets2[1].target`, result.data.salesDataGt[4].target)
        formik.setFieldValue(`groupTourTargets2[2].target`, result.data.salesDataGt[5].target)
        formik.setFieldValue(`groupTourTargets3[0].target`, result.data.salesDataGt[6].target)
        formik.setFieldValue(`groupTourTargets3[1].target`, result.data.salesDataGt[7].target)
        formik.setFieldValue(`groupTourTargets3[2].target`, result.data.salesDataGt[8].target)
        formik.setFieldValue(`groupTourTargets4[0].target`, result.data.salesDataGt[9].target)
        formik.setFieldValue(`groupTourTargets4[1].target`, result.data.salesDataGt[10].target)
        formik.setFieldValue(`groupTourTargets4[2].target`, result.data.salesDataGt[11].target)
      }

      if (result.data.salesDataCt.length > 0) {
        formik1.setFieldValue(`customizedTourTargets1[0].target`, result.data.salesDataCt[0].target)
        formik1.setFieldValue(`customizedTourTargets1[1].target`, result.data.salesDataCt[1].target)
        formik1.setFieldValue(`customizedTourTargets1[2].target`, result.data.salesDataCt[2].target)
        formik1.setFieldValue(`customizedTourTargets2[0].target`, result.data.salesDataCt[3].target)
        formik1.setFieldValue(`customizedTourTargets2[1].target`, result.data.salesDataCt[4].target)
        formik1.setFieldValue(`customizedTourTargets2[2].target`, result.data.salesDataCt[5].target)
        formik1.setFieldValue(`customizedTourTargets3[0].target`, result.data.salesDataCt[6].target)
        formik1.setFieldValue(`customizedTourTargets3[1].target`, result.data.salesDataCt[7].target)
        formik1.setFieldValue(`customizedTourTargets3[2].target`, result.data.salesDataCt[8].target)
        formik1.setFieldValue(`customizedTourTargets4[0].target`, result.data.salesDataCt[9].target)
        formik1.setFieldValue(`customizedTourTargets4[1].target`, result.data.salesDataCt[10].target)
        formik1.setFieldValue(`customizedTourTargets4[2].target`, result.data.salesDataCt[11].target)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const formik = useFormik({
    initialValues: {
      groupTourTargets1: [
        { monthId: 1, month: "January", target: 0 },
        { monthId: 2, month: "February", target: 0 },
        { monthId: 3, month: "March", target: 0 },
        { month: "Quarter 1", target: 0 },
      ],
      groupTourTargets2: [
        { monthId: 4, month: "April", target: 0 },
        { monthId: 5, month: "May", target: 0 },
        { monthId: 6, month: "June", target: 0 },
        { month: "Quarter 2", target: 0 },
      ],
      groupTourTargets3: [
        { monthId: 7, month: "July", target: 0 },
        { monthId: 8, month: "August", target: 0 },
        { monthId: 9, month: "September", target: 0 },
        { month: "Quarter 3", target: 0 },
      ],
      groupTourTargets4: [
        { monthId: 10, month: "October", target: 0 },
        { monthId: 11, month: "November", target: 0 },
        { monthId: 12, month: "December", target: 0 },
        { month: "Quarter 4", target: 0 },
      ]
    },
    validationSchema: validationSchema1,
    onSubmit: async (values) => {
      // Handle form submission
      const g1 = values.groupTourTargets1.slice(0, -1);
      const g2 = values.groupTourTargets2.slice(0, -1);
      const g3 = values.groupTourTargets3.slice(0, -1);
      const g4 = values.groupTourTargets4.slice(0, -1);

      // Concatenate arrays without the last element
      const allGroupTourTargets = [].concat(g1, g2, g3, g4);

      try {
        setbtnTextGt({text:'Updating...',isUpdate:true})
        const result = await post('sales-target', {
          targetArray: allGroupTourTargets,
          yearId: year,
          tourType: 1,
          userId: id
        })
       setbtnTextGt({text:'Update',isUpdate:false})
        toast.success(result.data.message)
      } catch (error) {
       setbtnTextGt({text:'Update',isUpdate:false})
        console.log(error);
      }
    },
  });

  const formik1 = useFormik({
    initialValues: {
      customizedTourTargets1: [
        { monthId: 1, month: "January", target: 0 },
        { monthId: 2, month: "February", target: 0 },
        { monthId: 3, month: "March", target: 0 },
        { month: "Quarter 1", target: 0 },
      ],
      customizedTourTargets2: [
        { monthId: 4, month: "April", target: 0 },
        { monthId: 5, month: "May", target: 0 },
        { monthId: 6, month: "June", target: 0 },
        { month: "Quarter 2", target: 0 },
      ],
      customizedTourTargets3: [
        { monthId: 7, month: "July", target: 0 },
        { monthId: 8, month: "August", target: 0 },
        { monthId: 9, month: "September", target: 0 },
        { month: "Quarter 3", target: 0 },
      ],
      customizedTourTargets4: [
        { monthId: 10, month: "October", target: 0 },
        { monthId: 11, month: "November", target: 0 },
        { monthId: 12, month: "December", target: 0 },
        { month: "Quarter 4", target: 0 },
      ]
    },
    validationSchema: validationSchema2,
    onSubmit: async (values) => {
      // Handle form submission
      const g1 = values.customizedTourTargets1.slice(0, -1);
      const g2 = values.customizedTourTargets2.slice(0, -1);
      const g3 = values.customizedTourTargets3.slice(0, -1);
      const g4 = values.customizedTourTargets4.slice(0, -1);

      // Concatenate arrays without the last element
      const allCustomizedTourTargets = [].concat(g1, g2, g3, g4);
      try {
        setbtnTextCt({text:'Updating...',isUpdate:true})
        const result = await post('sales-target', {
          targetArray: allCustomizedTourTargets,
          yearId: year,
          tourType: 2,
          userId: id
        })
        setbtnTextCt({text:'Update',isUpdate:false})
        toast.success(result.data.message)
      } catch (error) {
        setbtnTextCt({text:'Update',isUpdate:false})
        console.log(error);
      }
    },
  });



  const columns_GT1 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`groupTourTargets1[${index}].target`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.groupTourTargets1[index].target}
            disabled={index == 3}
          />
          {formik.touched &&
            formik.errors &&
            formik.errors.groupTourTargets1 &&
            formik.errors.groupTourTargets1[index] &&
            formik.errors.groupTourTargets1[index].target && (
              <span className="error">{formik.errors.groupTourTargets1[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_GT2 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`groupTourTargets2[${index}].target`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.groupTourTargets2[index].target}
            disabled={index == 3}
          />
          {formik.touched &&
            formik.errors &&
            formik.errors.groupTourTargets2 &&
            formik.errors.groupTourTargets2[index] &&
            formik.errors.groupTourTargets2[index].target && (
              <span className="error">{formik.errors.groupTourTargets2[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_GT3 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`groupTourTargets3[${index}].target`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.groupTourTargets3[index].target}
            disabled={index == 3}
          />
          {formik.touched &&
            formik.errors &&
            formik.errors.groupTourTargets3 &&
            formik.errors.groupTourTargets3[index] &&
            formik.errors.groupTourTargets3[index].target && (
              <span className="error">{formik.errors.groupTourTargets3[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_GT4 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`groupTourTargets4[${index}].target`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.groupTourTargets4[index].target}
            disabled={index == 3}
          />
          {formik.touched &&
            formik.errors &&
            formik.errors.groupTourTargets4 &&
            formik.errors.groupTourTargets4[index] &&
            formik.errors.groupTourTargets4[index].target && (
              <span className="error">{formik.errors.groupTourTargets4[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];

  const columns_CT1 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`customizedTourTargets1[${index}].target`}
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            disabled={index == 3}
            value={formik1.values.customizedTourTargets1[index].target}
          />
          {formik1.touched &&
            formik1.errors &&
            formik1.errors.customizedTourTargets1 &&
            formik1.errors.customizedTourTargets1[index] &&
            formik1.errors.customizedTourTargets1[index].target && (
              <span className="error">{formik1.errors.customizedTourTargets1[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_CT2 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`customizedTourTargets2[${index}].target`}
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            disabled={index == 3}
            value={formik1.values.customizedTourTargets2[index].target}
          />
          {formik1.touched &&
            formik1.errors &&
            formik1.errors.customizedTourTargets2 &&
            formik1.errors.customizedTourTargets2[index] &&
            formik1.errors.customizedTourTargets2[index].target && (
              <span className="error">{formik1.errors.customizedTourTargets2[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_CT3 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`customizedTourTargets3[${index}].target`}
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            disabled={index == 3}
            value={formik1.values.customizedTourTargets3[index].target}
          />
          {formik1.touched &&
            formik1.errors &&
            formik1.errors.customizedTourTargets3 &&
            formik1.errors.customizedTourTargets3[index] &&
            formik1.errors.customizedTourTargets3[index].target && (
              <span className="error">{formik1.errors.customizedTourTargets3[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];
  const columns_CT4 = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 200,
    },
    {
      title: "target",
      render: (item, index) => (
        <>
          <input type="number"
            className="form-control"
            name={`customizedTourTargets4[${index}].target`}
            onChange={formik1.handleChange}
            onBlur={formik1.handleBlur}
            disabled={index == 3}
            value={formik1.values.customizedTourTargets4[index].target}
          />
          {formik1.touched &&
            formik1.errors &&
            formik1.errors.customizedTourTargets4 &&
            formik1.errors.customizedTourTargets4[index] &&
            formik1.errors.customizedTourTargets4[index].target && (
              <span className="error">{formik1.errors.customizedTourTargets4[index].target}</span>
            )}
        </>
      ),
      dataIndex: "target",
      key: "target",
      width: 600,
    },
  ];


  useEffect(() => {
    const targets1 = formik.values.groupTourTargets1.slice(0, 3); // Get the first three months
    const total1 = targets1.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik.setFieldValue('groupTourTargets1[3].target', total1.toString());

    const targets2 = formik.values.groupTourTargets2.slice(0, 3); // Get the first three months
    const total2 = targets2.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik.setFieldValue('groupTourTargets2[3].target', total2.toString());

    const targets3 = formik.values.groupTourTargets3.slice(0, 3); // Get the first three months
    const total3 = targets3.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik.setFieldValue('groupTourTargets3[3].target', total3.toString());

    const targets4 = formik.values.groupTourTargets4.slice(0, 3); // Get the first three months
    const total4 = targets4.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik.setFieldValue('groupTourTargets4[3].target', total4.toString());

  }, [formik.values.groupTourTargets1, formik.values.groupTourTargets2, formik.values.groupTourTargets3, formik.values.groupTourTargets4]);

  useEffect(() => {
    const targets1 = formik1.values.customizedTourTargets1.slice(0, 3); // Get the first three months
    const total1 = targets1.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik1.setFieldValue('customizedTourTargets1[3].target', total1.toString());

    const targets2 = formik1.values.customizedTourTargets2.slice(0, 3); // Get the first three months
    const total2 = targets2.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik1.setFieldValue('customizedTourTargets2[3].target', total2.toString());

    const targets3 = formik1.values.customizedTourTargets3.slice(0, 3); // Get the first three months
    const total3 = targets3.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik1.setFieldValue('customizedTourTargets3[3].target', total3.toString());

    const targets4 = formik1.values.customizedTourTargets4.slice(0, 3); // Get the first three months
    const total4 = targets4.reduce((acc, curr) => acc + parseFloat(curr.target, 10) || 0, 0);
    formik1.setFieldValue('customizedTourTargets4[3].target', total4.toString());

  }, [formik1.values.customizedTourTargets1, formik1.values.customizedTourTargets2, formik1.values.customizedTourTargets3, formik1.values.customizedTourTargets4]);

  useEffect(() => {
    getSalesData()
  }, [])
  return (
    <>
      <div className="row">
        <div className="col-lg-12">

          <div className="card">
            <div className="card-body">
              <div className="row">
              {hasComponentPermission(permissions,116 ) &&  <div className="col-md-12 col-lg-6 col-sm-12 col-12">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card-header sales-header mb-2">
                          <div className="card-title h5">Target(Group Tour)</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12 sales_tables">
                          <Table
                            cols={columns_GT1}
                            page={1}
                            data={formik.values.groupTourTargets1}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_GT2}
                            page={1}
                            data={formik.values.groupTourTargets2}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_GT3}
                            page={1}
                            data={formik.values.groupTourTargets3}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_GT4}
                            page={1}
                            data={formik.values.groupTourTargets4}
                            totalPages={1}
                            isTableLoading={false}
                          />
                        </div>
                      </div>
                      <div className="mb-2  mt-2 row">
                        <div className="col-lg-12 d-flex justify-content-end">
                          <button type="submit" className="btn btn-submit btn-primary" disabled={btnTextGt.isUpdate}>
                            {btnTextGt.text}
                          </button>
                        </div>
                      </div>

                    </div>
                  </form>
                </div>}

                {hasComponentPermission(permissions, 117) && <div className="col-md-12 col-lg-6 col-sm-12 col-12">
                  <form onSubmit={formik1.handleSubmit}>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="card-header sales-header mb-2">
                          <div className="card-title h5 ">Target(Customized Tour)</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12 sales_tables">
                          <Table
                            cols={columns_CT1}
                            page={1}
                            data={formik1.values.customizedTourTargets1}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_CT2}
                            page={1}
                            data={formik1.values.customizedTourTargets2}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_CT3}
                            page={1}
                            data={formik1.values.customizedTourTargets3}
                            totalPages={1}
                            isTableLoading={false}
                          />
                          <Table
                            cols={columns_CT4}
                            page={1}
                            data={formik1.values.customizedTourTargets4}
                            totalPages={1}
                            isTableLoading={false}
                          />
                        </div>
                      </div>
                      <div className="mb-2  mt-2 row">
                        <div className="col-lg-12 d-flex justify-content-end">
                          <button type="submit" className="btn btn-submit btn-primary" disabled={btnTextCt.isUpdate}>
                            {btnTextCt.text}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};
export default SetSalestarget;
