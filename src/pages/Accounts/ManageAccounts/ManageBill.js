import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageBankDepositColumns } from './tableColumns';
import { PATIENT_URL, DOCTOR_URL, TREATMENT_URL, BANK_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const ManageBankDeposit = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [treatments, setTreatments] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [rows1, setRows1] = useState([{ id: 1 }]);

    const fetchData = async () => {
        const { success, body } = await get(`${BANK_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    };

    useEffect(() => {
        if (isForm) {
            const fetchData = async () => {
                try {
                    const patientsRes = await get(PATIENT_URL);  // Fetch patients data
                    if (patientsRes.success) {
                        setPatients(patientsRes.body.patients);
                    }

                    const doctorsRes = await get(DOCTOR_URL);  // Fetch doctors data
                    if (doctorsRes.success) {
                        setDoctors(doctorsRes.body.items);
                    }

                    const treatmentsRes = await get(TREATMENT_URL);  // Fetch treatments data
                    if (treatmentsRes.success) {
                        setTreatments(treatmentsRes.body.items);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [isForm]);

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const url = editMode ? `${BANK_URL}/${editingId}` : BANK_URL;
        const res = await post(url, formData);

        if (res.success) {
            showSuccessAlert(editMode ? 'Bill updated successfully!' : 'Bill created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleAddRowNested = () => {
        setRows1(prev => [...prev, { id: prev.length + 1 }]);
    };

    const handleRemoveRow = (id) => {
        if (id !== 1) {
            setRows1(prev => prev.filter(row => row.id !== id));
        }
    };

    const handleFieldChange = (id, field, value) => {
        setRows1(prev =>
            prev.map(row =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-3">
                                    <h5>
                                        <i
                                            role="button"
                                            className="me-2 fas fa-arrow-left"
                                            onClick={handleToggle}
                                        />
                                        Add Bill
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="form-group mb-4">
                                        <label>Select Date</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            options={{
                                                altInput: true,
                                                altFormat: "F j, Y h:i K",
                                                dateFormat: "Y-m-d H:i",
                                                enableTime: false,
                                                time_24hr: false,
                                            }}
                                            placeholder="MM, DD, YYYY HH:MM"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <label className="control-label">
                                            Patient
                                        </label>
                                        <Select
                                            id="patient"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={patients?.map((patient) => ({
                                                value: patient.id,
                                                label: `${patient.first_name} ${patient.last_name}`,
                                            }))}
                                            onChange={(selectedOption) => {
                                                // console.log('Selected Option:', selectedOption);
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    patient_code: selectedOption?.value
                                                }));
                                            }}
                                            placeholder="Select Patient"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <label className="control-label">
                                            Doctor
                                        </label>
                                        <Select
                                            id="doctor"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={doctors.map((doctor) => ({
                                                value: doctor.code,
                                                label: doctor.name,
                                            }))}
                                            onChange={(selectedOption) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    doctor_code: selectedOption?.value,
                                                }));
                                            }}
                                            placeholder="Select Doctor"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <div className="inner-repeater mb-4">
                                {rows1.map((row, index) => (
                                    <div key={row.id} className="mb-3">
                                        <Row className="align-items-end">
                                            <Col md={3}>
                                                <label>Treatment</label>
                                                <Select
                                                    options={treatments.map(treatment => ({
                                                        value: treatment.id,
                                                        label: treatment.title,
                                                    }))}
                                                    onChange={opt => handleFieldChange(row.id, 'title', opt?.value)}
                                                    placeholder="Select Treatment"
                                                />
                                            </Col>
                                            <Col md={1}>
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                > Add Tooth
                                                    {/* <i className="mdi mdi-plus" /> */}
                                                </button>
                                            </Col>
                                            <Col md={2}>
                                                <label>Treatment</label>
                                                <Select
                                                    options={treatments.map(treatment => ({
                                                        value: treatment.id,
                                                        label: treatment.cost,
                                                    }))}
                                                    onChange={opt => handleFieldChange(row.id, 'cost', opt?.value)}
                                                    placeholder="Select Cost"
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <div>
                                                    <label>Discount</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Enter Discount"
                                                        name="discount"
                                                        value={row.discount || ''}
                                                        onChange={(e) => handleFieldChange(row.id, 'discount', e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div>
                                                    <label>Total Cost</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Total Cost"
                                                        name="totalcost"
                                                        value={row.totalcost || ''}
                                                        onChange={(e) => handleFieldChange(row.id, 'totalcost', e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={1}>
                                                <label>Notes</label>

                                            </Col>
                                            <Col md={1} className="d-flex flex-column">
                                                {index === 0 ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={handleAddRowNested}
                                                    >
                                                        <i className="mdi mdi-plus" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-danger"
                                                        type="button"
                                                        onClick={() => handleRemoveRow(row.id)}
                                                    >
                                                        <i className="mdi mdi-delete" />
                                                    </button>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </div>
                            <Row className='mt-2'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                            <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={ManageBankDepositColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="Bill"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageBankDeposit;
