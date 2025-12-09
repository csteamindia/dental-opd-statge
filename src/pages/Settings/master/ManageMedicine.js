import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageMedicineColumns } from './tableColumns';
import { MEDICINE_URL } from 'helpers/url_helper';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ManageMedicine = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${MEDICINE_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
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
        const url = editMode ? `${MEDICINE_URL}/${editingId}` : MEDICINE_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Medicine updated successfully!' : 'Medicine created successfully!');
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
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
        setLoading(false);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Medicine`, `Do you really want to ${action} this Medicine?`,
            `Yes, ${action} it!`, `${action}d!`, `Medicine has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${MEDICINE_URL}/${id}?sts=${sts}`);
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
                                        <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Medicines </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                    </div>
                                    <hr />
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="name" label="Medicine Name" type="text" placeholder="Enter Medicine Name" value={formData.name} onChange={handleChange} required errorMessage="Please Enter Medicine Name" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="molucule" label="Molecule" type="text" placeholder="Enter Enter Molecule" value={formData.molucule} onChange={handleChange} required errorMessage="Please Enter Molecule" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="frequent" label="Frequent" type="text" placeholder="Enter Enter Frequent" value={formData.frequent} onChange={handleChange} required errorMessage="Please Enter Frequent" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="duration" label="Duration" type="text" placeholder="Enter Enter Duration" value={formData.duration} onChange={handleChange} required errorMessage="Please Enter Duration" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="form-check form-switch form-switch-md mt-2 d-flex flex-column align-items-start">
                                            <label className="form-check-label" htmlFor="customSwitchsizemd" style={{ marginLeft: "-38px" }}> Is Favorite </label>
                                            <input type="checkbox" className="form-check-input" id="customSwitchsizemd" name="is_fevrate"
                                                checked={formData.is_fevrate} onChange={(e) => setFormData(prev => ({ ...prev, is_fevrate: e.target.checked, }))} />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="dose" label="Dose" type="text" placeholder="Enter Enter Dose" value={formData.dose} onChange={handleChange} required errorMessage="Please Enter Dose" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row >
                                    <Col>
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
            columns={ManageMedicineColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Medicines"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default ManageMedicine;
