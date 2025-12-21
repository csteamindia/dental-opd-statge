import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button, Modal } from "reactstrap";
import Datatables from "pages/utils/table/datatable";
import { post, get, put, del } from "helpers/api_helper";
import { EXAMINATIONS_URL, EXAMINATIONS_OPTIONS_URL, PATIENT_URL } from "helpers/url_helper";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import Select from "react-select";
import { ManageExaminationsColumns } from "pages/Patient/tableColumns";
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";

const Examinations = ({ patientData }) => {
  const [rows, setRows] = useState([]);
  const [options, setOptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isForm, setIsForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString(),
    complaints: [],
    diagnosis: []
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      patient_id: patientData?.id || null,
      doctor_code: patientData?.doctor || null
    }));
  }, [patientData]);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false);
  const [addOptionType, setAddOptionType] = useState(null);
  const [newOptionvalue, setNewOptionvalue] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

  const fetchData = async () => {
    setLoading(true);
    const { success, body } = await get(`${EXAMINATIONS_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
    if (success) {
      setRows(body);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  const getOptions = async () => {
    const [doctorRes, examOptionsRes] = await Promise.all([
      get(`${PATIENT_URL}/options?_type=doctors&optionType=1`),
      get(EXAMINATIONS_OPTIONS_URL)
    ]);

    if (doctorRes.success) setDoctors(doctorRes.body);
    if (examOptionsRes.success) setOptions(examOptionsRes.body);
  };

  useEffect(() => {
    getOptions();
    fetchData();
  }, []);

  const handleToggle = () => setIsForm(!isForm);

  const handleAddOption = async () => {
    const obj = {
      type: addOptionType,
      title: newOptionvalue,
    };

    const { success, body } = await post(EXAMINATIONS_OPTIONS_URL, obj);

    if (success) {
      const key = addOptionType === 1 ? 'complaints' : 'diagnosis';
      setOptions((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { value: body.id, label: body.title }],
      }));

      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], { value: body.id, label: body.title }],
      }));

      setNewOptionvalue('');
    }
  };

  const handleSubmit = async () => {
    const obj = {
      examination_date: formData?.date,
      doctor: formData?.doctor_code,
      tooth: JSON.stringify({
        complaint: formData?.complaints,
        diagnosis: formData?.diagnosis,
      }),
      patient_id: patientData?.id,
      remark: formData?.remark,
    };

    const url = editMode ? `${EXAMINATIONS_URL}/${editingId}` : EXAMINATIONS_URL;
    const method = editMode ? put : post;

    const { success } = await method(url, obj);

    if (success) {
      showSuccessAlert(editMode ? "Examination updated successfully!" : "Examination created successfully!");
      handleToggle();
      fetchData();
      setFormData({});
      setEditMode(false);
      setEditingId(null);
      setIsAddOptionModalOpen(false);
    }
  };

  const safeParse = (s) => {
    try {
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  };

  const handleEdit = (row) => {
    const rowTooth = safeParse(row?.tooth);
    const prevTooth = safeParse(formData?.tooth); 

    setFormData((prev) => ({
      ...prev,
      ...row,
      complaints: rowTooth.complaint || "",
      diagnosis: rowTooth.diagnosis ?? prevTooth.diagnosis ?? ""
    }));

    setEditingId(row.id);
    setEditMode(true);
    setIsForm(true);
  };
  

  const handleDelete = async (id, sts) => {
    const action = sts === 1 ? 'Restore' : 'Delete';

    const { isConfirmed } = await showConfirmAlert(`${action} Examination`, `Do you really want to ${action} this Examination?`,
      `Yes, ${action} it!`, `${action}d!`, `Examination has been ${action}d successfully.`);

    if (isConfirmed) {
      const { success } = await del(`${EXAMINATIONS_URL}/${id}?sts=${sts}`);
      if (success) fetchData();
    }
  };

  if (isForm) {
    return (
      <>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-2">
                  <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} />  {editMode ? "Edit" : "Add"} Examination   </h5>
                  <button className="btn btn-danger" onClick={handleToggle}>  <i className="mdi mdi-close noti-icon" /> Cancel </button>
                </div>
                <hr />
                <Row>
                  <Col md={4}>
                    <label>Doctor</label>
                    <Select className="basic-single" isClearable={true} isSearchable={true} options={doctors}
                      value={doctors?.find((doc) => doc.value == formData?.doctor_code)}
                      onChange={(selected) => setFormData((prev) => ({ ...prev, doctor_code: selected?.value || null }))}
                      isDisabled={editMode} placeholder="Select Doctor" />
                  </Col>
                  <Col md={4}>
                    <label>Select Date</label>
                    <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                      value={formData?.date || formData?.examination_date} onChange={(date) => setFormData((prev) => ({ ...prev, date: date[0]?.toISOString() }))} />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={8}>
                    <label>Chief Complaints</label>
                    <Select isMulti={true} isClearable={true} isSearchable={true} options={options?.complaints}
                      onChange={(e) => setFormData((p) => ({ ...p, complaints: e }))} value={formData?.complaints } placeholder="Select Complaints" />
                  </Col>
                  {
                    console.log()
                  }
                  <Col md={2}>
                    <Button color="primary" className="w-50" style={{ marginTop: "31px" }} onClick={() => { setAddOptionType(1); setIsAddOptionModalOpen(true); }} >
                      <i className="mdi mdi-plus" /> </Button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={8}>
                    <label>Diagnosis Type</label>
                    <Select isMulti={true} isClearable={true} isSearchable={true} options={options?.diagnosis}
                      onChange={(e) => setFormData((p) => ({ ...p, diagnosis: e }))} value={formData?.diagnosis} placeholder="Select Diagnosis" />
                  </Col>
                  <Col md={2}>
                    <Button color="primary" className="w-50" style={{ marginTop: "31px" }} onClick={() => { setAddOptionType(2); setIsAddOptionModalOpen(true) }} >
                      <i className="mdi mdi-plus" /> </Button>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <label>Note</label>
                    <input type="text" className="form-control" value={formData?.remark} onChange={(e) => setFormData((p) => ({ ...p, remark: e.target.value }))}
                      placeholder="Enter Notes" />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col className="text-end">
                    <Button color="success" onClick={handleSubmit}> Submit </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Option Modal */}
        <Modal size="lg" isOpen={isAddOptionModalOpen} toggle={() => setIsAddOptionModalOpen(false)}>
          <div className="modal-header">
            <h5 className="modal-title">Add {addOptionType === 1 ? "Complaints" : "Diagnosis"}</h5>
            <button type="button" className="btn-close" onClick={() => setIsAddOptionModalOpen(false)} />
          </div>
          <div className="modal-body">
            <Row className="align-items-center">
              <Col md={10}>
                <input type="text" className="form-control" placeholder="Add Option" value={newOptionvalue} onChange={(e) => setNewOptionvalue(e.target.value)} />
              </Col>
              <Col md={2}>
                <Button color="primary" className="w-100" onClick={handleAddOption}> Add </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <label>{addOptionType === 1 ? "Complaints" : "Diagnosis"}</label>
                <Select isMulti={true} isClearable={true} isSearchable={true}
                  options={options[addOptionType === 1 ? "complaints" : "diagnosis"]}
                  onChange={(e) => setFormData((p) => ({ ...p, [addOptionType === 1 ? "complaints" : "diagnosis"]: e, }))}
                  value={formData[addOptionType === 1 ? "complaints" : "diagnosis"]} placeholder="Select" />
              </Col>
            </Row>
          </div>
          <div className="modal-footer mt-3">
            <Button className="btn btn-danger" onClick={() => setIsAddOptionModalOpen(false)}> Close </Button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Datatables
      isSearch={true}
      columns={ManageExaminationsColumns({ edit: handleEdit, delete: handleDelete }, pagination)}
      showTableOnly={true}
      rowsLength={rows?.totalItems || 0}
      rows={rows.items || []}
      keyField={"id"}
      handleAddButton={handleToggle}
      title="All Examination's"
      isAdd={true}
      isTableHead={true}
      loading={loading}
      ssr={setPagination}
    />
  );
};

export default Examinations;
