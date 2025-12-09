import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageInvestigationColumns } from 'pages/Patient/tableColumns';
import { INVESTIONGATIONS_URL, PATIENT_URL } from 'helpers/url_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const auscultation_options = [
    {value:"Normal", label: "Normal"},
    {value:"Murmur", label: "Murmur"},
    {value:"Gallop", label: "Gallop"},
    {value:"Rub", label: "Rub"}
]

const Investigations = ({ isFormPreOpen = false, patientData }) => {
    const [isForm, setIsForm] = useState(isFormPreOpen);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ date: new Date().toISOString() });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    useEffect(() => {
        if(patientData)
            setFormData(prev => ({
                ...prev,
                patient_id: patientData?.id || null,
                doctor_code: patientData?.doctor || null,
            }));
    }, [patientData]);

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${INVESTIONGATIONS_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors&optionType=1`);
        if (success) {
            setDoctors(body);
        }
    };

    useEffect(() => {
        getExtraData();
    }, []);

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        setFormData({ date: new Date().toISOString(), patient_id: patientData?.id, doctor_code: patientData?.doctor });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // console.log("formData before submit:", formData);
        const url = editMode ? `${INVESTIONGATIONS_URL}/${editingId}` : INVESTIONGATIONS_URL;
        const method = editMode ? put : post;

        const { success } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Investigation updated successfully!' : 'Investigation created successfully!');
            handleToggle();
            fetchData();
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the required fields.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'Restore' : 'Delete';

        const { isConfirmed } = await showConfirmAlert(`${action} Investigation`, `Do you really want to ${action} this Investigation?`,
            `Yes, ${action} it!`, `${action}d!`, `Investigation has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${INVESTIONGATIONS_URL}/${id}?sts=${sts}`);
            if (success)
                fetchData();
        }
    };

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Investigation </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                </div>
                                <hr />
                                <Row className='mb-2'>
                                    <Col md={4}>
                                        <label>Select Date</label>
                                        <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                                            value={formData.date ? new Date(formData.date) : null}
                                            onChange={(date) => { setFormData(prev => ({ ...prev, date: date[0]?.toISOString() })) }} />
                                    </Col>
                                    <Col md={4}>
                                        <label>Doctor { formData?.doctor_code }</label>
                                        <Select id="doctor" className="basic-single"
                                            isClearable={true} isSearchable={true} options={doctors}
                                            value={doctors.filter(v => v.value == formData?.doctor_code)}
                                            onChange={(selectedOption) => { setFormData(prev => ({ ...prev, doctor_code: selectedOption?.value || "" })); }}
                                            isDisabled={editMode} placeholder="Select Doctor" />
                                    </Col>
                                </Row>

                                <Row className='mb-2'>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="temperature" label="Temperature" type="number" placeholder="Enter Temperature" value={formData.temperature} onChange={handleChange} required errorMessage="Temperature must be a number" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="blood_pressure" label="Blood Pressure" type="number" placeholder="Enter Blood Pressure" value={formData.blood_pressure} onChange={handleChange} required errorMessage="Blood Pressure must be a number" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="blood_sugar" label="Blood Sugar" type="number" placeholder="Enter Blood Sugar" value={formData.blood_sugar} onChange={handleChange} required errorMessage="Blood Sugar must be a number" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="auscultation" label="Auscultation" type="hidden" placeholder="Enter Auscultation" value={formData.auscultation} required errorMessage="Please enter Auscultation" />
                                            <Select
                                                options={auscultation_options}
                                                value={auscultation_options?.filter( e => e.value == formData.auscultation)}
                                                onChange={ e => {
                                                    setFormData(prev => ({...prev, auscultation: e.value}))
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="note" label="Note" type="text" placeholder="Enter Note" value={formData.note} onChange={handleChange} errorMessage="Please enter Note" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='mt-4'>
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                                {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'} </>}
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </AvForm >
        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={ManageInvestigationColumns({ edit: handleEdit, delete: handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Investigation's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default Investigations;
