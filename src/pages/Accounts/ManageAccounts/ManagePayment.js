import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
// import { ManageAllergiesColumns } from './tableColumns';
import { BANK_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";

const ManagePayment = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${BANK_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

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
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${BANK_URL}/${editingId}` : BANK_URL;
        const res = await post(url, formData);

        if (res.success) {
            showSuccessAlert(editMode ? 'Payment updated successfully!' : 'Payment created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };


    const handleEdit = (row) => {
        setFormData({
            title: row.title,
        });
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5>
                                        <i
                                            role="button"
                                            className="me-2 fas fa-arrow-left"
                                            onClick={handleToggle}
                                        />
                                        Create Symstoms
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Title"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                            <i className=" mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'}
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
            // columns={ManageAllergiesColumns(handleEdit)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Symptoms"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );

};

export default ManagePayment;
