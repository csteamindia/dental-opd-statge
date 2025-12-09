import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageReferencesColumns } from './tableColumns';
import { REFERENCES_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";

const ManageCustomView = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        const { success, body } = await get(`${REFERENCES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        console.log('Submitting formData:', formData);
        const res = await post(REFERENCES_URL, formData);
        if (res.success) {
            showSuccessAlert('Treatment created successfully!');
            setIsForm(false);
            setFormData({});
        }
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
                                        Create Custom View
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

                            <Row >
                                <Col>
                                    <div className="d-flex justify-content-end mt-3 mb-1">
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
            columns={ManageReferencesColumns({}, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Custom View"
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageCustomView;
