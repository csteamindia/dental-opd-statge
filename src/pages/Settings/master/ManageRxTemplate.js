import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { del, get, post, put } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageRXTemplatetColumns } from './tableColumns';
import { RX_TEMPLATES_URL, PATIENT_URL } from 'helpers/url_helper';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Select from "react-select";
import Addrows from 'pages/utils/incrementalRows';

const ManageRxTemplate = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${RX_TEMPLATES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    };

    useEffect(fetchData, [pagination]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors`);
        if (success) {
            setDoctors(body);
        }
    };

    useEffect(() => getExtraData(), [])

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        setFormData({});
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const url = editMode ? `${RX_TEMPLATES_URL}/${editingId}` : RX_TEMPLATES_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'RX Template updated successfully!' : 'RX Template created successfully!');
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
            fetchData(); // Refresh list
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
        // setIsForm(false);
    };

    const handleMultiRowData = (data) => {
        if (data?.length > 0) {
            setFormData((prev) => ({
                ...prev, medicins: JSON.stringify(data),
            }))
        }
    }

    const handleEdit = (row) => {
        setFormData(row);
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
        setLoading(false);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} this RX Template`, `Do you really want to ${action} this RX Template?`,
            `Yes, ${action} it!`, `${action}d!`, `RX Template has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${RX_TEMPLATES_URL}/${id}?sts=${sts}`);
            if (success) {
                fetchData();
            }
        }
    };

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData} >
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {`${editMode ? 'Update' : 'Create'}`} Rx Template </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                </div>
                                <hr />
                                <Row>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="title" label="Enter Rx Template" type="text" placeholder="Enter Rx Template" value={formData.title} onChange={handleChange} required errorMessage="Please enter Rx Template" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <label>Doctor</label>
                                        <Select id="doctor" className="basic-single" isClearable={true} isSearchable={true} options={doctors} isDisabled={editMode} value={doctors.find(option => option.value === formData.doctor_code)}
                                            onChange={(selectedOption) => setFormData(prev => ({ ...prev, doctor_code: selectedOption ? selectedOption.value : '' }))}
                                            placeholder="Select Doctor" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mt-2'>
                                        <div className="mb-4 bg-light p-3 rounded">
                                            <CardTitle tag="h2" className="mb-3 mt-2" style={{ fontSize: "20px" }}>
                                                Medication
                                            </CardTitle>
                                            <Addrows editModa={editMode} editData={editMode ? JSON.parse(formData?.medicins) : []} callback={handleMultiRowData} isDisabled={editMode} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="note" label="Enter Notes" type="text" placeholder="Enter Notes" value={formData.note} onChange={handleChange} required errorMessage="Please enter Notes" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'} </>} </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </AvForm>

        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={ManageRXTemplatetColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Rx Template's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default ManageRxTemplate;
