import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManagePatientNotesColumns } from 'pages/Patient/tableColumns';
import { PATIENT_NOTES_URL, PATIENT_URL } from 'helpers/url_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";

const Notes = ({ isFormPreOpen = false, patientData }) => {
    const [isForm, setIsForm] = useState(isFormPreOpen);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({ note_date: new Date().toISOString() });
    const [doctors, setDoctors] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${PATIENT_NOTES_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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
        setFormData({ note_date: new Date().toISOString() });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...formData,
            patient_id: patientData?.id,
        };
        const res = await post(PATIENT_NOTES_URL, payload);
        if (res.success) {
            showSuccessAlert('Patient Note created successfully!');
            setIsForm(false);
            setFormData({});
            fetchData();
        }
    };

    const handleEdit = (row) => {
        setFormData(row);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Patient Note`, `Do you really want to ${action} this Patient Note?`,
            `Yes, ${action} it!`, `${action}d!`, `Patient Note has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${PATIENT_NOTES_URL}/${id}?sts=${sts}`);
            if (success) fetchData();
        }
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Patient Note </h5>
                                <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row>
                                <Col>
                                    <label>Doctor</label>
                                    <Select id="doctor" className="basic-single" isClearable={true} isSearchable={true} options={doctors}
                                        value={doctors.find((doc) => doc.value == formData.doctor_code || doc.value == patientData?.doctor)}
                                        onChange={(selectedOption) => setFormData(prev => ({ ...prev, doctor_code: selectedOption?.value || "" }))} placeholder="Select Doctor" />
                                </Col>

                                <Col>
                                    <div className="form-group mb-4">
                                        <label>Note Date</label>
                                        <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                                            value={formData.note_date ? new Date(formData.note_date) : null}
                                            onChange={(date) => { setFormData(prev => ({ ...prev, note_date: date[0]?.toISOString() })) }} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Notes</label>
                                        <input type="text" className="form-control" placeholder="Enter Notes" name="note" value={formData?.note || ''} onChange={handleChange} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col md={12}>
                                    <div className="d-flex justify-content-end mt-3 mb-1">
                                        <button className="btn btn-primary" type="submit" disabled={loading} onClick={handleSubmit}>
                                            {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> Submit </>}
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
            columns={ManagePatientNotesColumns({ edit: handleEdit, delete: handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows?.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="Patient Note's"
            isAdd={true}
            isTableHead={true}
            rowClasses="cursor-pointer hover:bg-gray-100"
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default Notes;
