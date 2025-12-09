import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageBankColumns } from './tableColumns';
import { BANK_URL } from 'helpers/url_helper';
import Select from 'react-select'
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ManageBankAccount = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${BANK_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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
        const url = editMode ? `${BANK_URL}/${editingId}` : BANK_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Bank updated successfully!' : 'Bank created successfully!');
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
            fetchData();
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Bank`, `Do you really want to ${action} this Bank?`,
            `Yes, ${action} it!`, `${action}d!`, `Bank has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${BANK_URL}/${id}?sts=${sts}`);
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
                                        <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Bank </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                    </div>
                                    <hr />
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="bank_name" label="Bank Name" type="text" placeholder="Enter Bank Name" value={formData.bank_name} onChange={handleChange} required errorMessage="Please enter Bank Name" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="ac_no" label="Account Number" type="text" placeholder="Enter Account Number" value={formData.ac_no} onChange={handleChange} required errorMessage="Please enter Account Number" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="ifsc_code" label="IFSC Code" type="text" placeholder="Enter IFSC Code" value={formData.ifsc_code} onChange={handleChange} required errorMessage="Please enter IFSC Code" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="branch" label="Branch Name" type="text" placeholder="Enter Branch Name" value={formData.branch} onChange={handleChange} required errorMessage="Please enter Branch Name" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="addrress" label="Bank Addrress" type="text" placeholder="Enter Bank Addrress" value={formData.addrress} onChange={handleChange} required errorMessage="Please enter Bank Addrress" />
                                        </div>
                                    </Col>
                                    {/* <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="ac_type" label="Account Type" type="text" placeholder="Enter Account Type" value={formData.ac_type} onChange={handleChange} required errorMessage="Please enter Account Type" />
                                        </div>
                                    </Col> */}
                                    <Col>
                                        <div className="mb-1">
                                            <label>Status</label>
                                            <Select className="basic-single" classNamePrefix="select" name="status"
                                                isClearable={true}
                                                options={[{ value: "saving", label: "Savings Account" }, { value: "current", label: "Current Account" }]}
                                                value={formData.ac_type ? { value: formData.ac_type, label: formData.ac_type } : []}
                                                onChange={(selected) => setFormData((prev) => ({ ...prev, ac_type: selected ? selected.value : "" }))} placeholder="Select Status" />
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
            columns={ManageBankColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Bank's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default ManageBankAccount;
