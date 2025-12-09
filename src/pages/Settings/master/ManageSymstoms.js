import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageAllergiesColumns } from './tableColumns';
import { ALLERGIES_URL } from 'helpers/url_helper';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ManageSymstoms = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        const { success, body } = await get(`${ALLERGIES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setLoading(true);
            setRows(body);
            setLoading(false);
        }
    }

    useEffect(fetchData, [pagination]);

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
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${ALLERGIES_URL}/${editingId}` : ALLERGIES_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Symptom updated successfully!' : 'Symptom created successfully!');
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

    const handleEdit = (row) => {
        setFormData(row);
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
        setLoading(false);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} this Symptom`, `Do you really want to ${action} this Symptom?`,
            `Yes, ${action} it!`, `${action}d!`, `Symptom has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${ALLERGIES_URL}/${id}?sts=${sts}`);
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
                                        <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Create Symstoms </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                    </div>
                                    <hr />
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="title" label="Symptom / Title" type="text" placeholder="Enter Symptom" value={formData.title} onChange={handleChange} required errorMessage="Please enter Symptom" />
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
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
            columns={ManageAllergiesColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Symptom's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );

};

export default ManageSymstoms;
