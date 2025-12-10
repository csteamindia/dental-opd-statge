import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageChairsColumns } from './tableColumns';
import { CHAIR_URL } from 'helpers/url_helper';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const timesSlots = [
    {label: "07:00", value: "07:00"},
    {label: "08:00", value: "08:00"},
    {label: "09:00", value: "09:00"},
    {label: "10:00", value: "10:00"},
    {label: "11:00", value: "11:00"},
    {label: "12:00", value: "12:00"},
    {label: "13:00", value: "13:00"},
    {label: "14:00", value: "14:00"},
    {label: "15:00", value: "15:00"},
    {label: "16:00", value: "16:00"},
    {label: "17:00", value: "17:00"},
    {label: "18:00", value: "18:00"},
    {label: "19:00", value: "19:00"},
    {label: "20:00", value: "20:00"},
    {label: "21:00", value: "21:00"},
    {label: "22:00", value: "22:00"},
    {label: "23:00", value: "23:00"}
]

const ManageSymstoms = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${CHAIR_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
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
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${CHAIR_URL}/${editingId}` : CHAIR_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Chair updated successfully!' : 'Chair created successfully!');
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
            fetchData();
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
        // setIsForm(false);
    };


    const handleEdit = (row) => {
        setFormData(row);
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
        setLoading(false)
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Chair`, `Do you really want to ${action} this Chair?`,
            `Yes, ${action} it!`, `${action}d!`, `Chair has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${CHAIR_URL}/${id}?sts=${sts}`);
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
                                <Row>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Chair </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                    </div>
                                    <hr />
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="title" label="Title" type="text" placeholder="Enter Title" value={formData.title} onChange={handleChange} required errorMessage="Please enter Title" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField type="select" name="start_time" label="Start Time" value={formData.start_time} onChange={handleChange} required errorMessage="Please select Start Time">
                                                <option value="">Select Start Time</option>
                                                {timesSlots.map((time) => (
                                                    <option key={time.value} value={time.value}>{time.label}</option>
                                                ))}
                                            </AvField>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="end_time" label="End Time" type="select" placeholder="Enter End Time" value={formData.end_time} onChange={handleChange} required errorMessage="Please enter End Time">
                                                <option value="">Select End Time</option>
                                                {timesSlots.map((time) => (
                                                    <option key={time.value} value={time.value}>{time.label}</option>
                                                ))}
                                            </AvField>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='mt-3'>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="cabin_no" label="Cabin No" type="text" placeholder="Enter Cabin No" value={formData.cabin_no} onChange={handleChange} required errorMessage="Please enter Cabin No" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="intervel" label="Intervel" type="text" placeholder="Enter Intervel" value={formData.intervel} onChange={handleChange} required errorMessage="Please enter Intervel" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-1">
                                            <label>Description</label>
                                            <input type="text" className="form-control" placeholder="Enter Description" name="description" value={formData.description} onChange={handleChange} />
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end mt-2">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'} </>} </button>
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
            columns={ManageChairsColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Chairs"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default ManageSymstoms;
