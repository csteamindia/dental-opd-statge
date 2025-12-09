import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageDentalChartColumns } from './tableColumns';
import { DENTAL_CHART_EXAMINATION_URL } from 'helpers/url_helper';
import Select from "react-select";
import { dentalChartExaminationOptions } from '../../../constants/Constrant_dropdowns'
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ManageDentalChart = () => {
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [examTitles, setExamTitles] = useState([{ title: '' }]);
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${DENTAL_CHART_EXAMINATION_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    }
    useEffect(() => fetchData(), [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({});
        setExamTitles([{ title: '' }]);
        setEditMode(false);
        setLoading(false);

    };

    const handleAddRow = () => {
        const hasEmptyTitle = examTitles.some(item => item.title.trim() === '');

        if (hasEmptyTitle) {
            alert('Please fill all existing titles before adding a new one.');
            return;
        }
        setExamTitles([...examTitles, { title: '' }]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = [...examTitles];
        updatedRows.splice(index, 1);
        setExamTitles(updatedRows);
    };

    const handleSubmit = async () => {
        const hasEmptyTitle = examTitles.some(item => item.title.trim() === '');
        if (!formData?.toothtexamination) {
            showSuccessAlert("Please select Examination Type");
            return;
        }
        if (hasEmptyTitle) {
            showSuccessAlert("Please fill all the titles before submitting.");
            return;
        }

        const payload = {
            id: formData?.id || null,
            title: formData.toothtexamination?.value,
            group: JSON.stringify(
                examTitles.map(item => ({
                    tooth: 'selected',
                    label: item.title,
                    value: item.title?.replaceAll(' ', '_').toLowerCase(),
                }))
            ),
        };

        const url = editMode ? `${DENTAL_CHART_EXAMINATION_URL}/${editingId}` : DENTAL_CHART_EXAMINATION_URL;
        const method = editMode ? put : post;

        const { success } = await method(url, payload);

        if (success) {
            showSuccessAlert(editMode ? 'Dental Chart Examination updated successfully!' : 'Dental Chart Examination created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
            setLoading(false)
        }
    };

    const handleEdit = (row) => {
        setFormData({
            id: row?.id,
            toothtexamination: dentalChartExaminationOptions.filter(v => v.value === row.title),
            group: row.group,
        });

        setExamTitles(JSON.parse(row.group)?.map(item => ({ title: item.label })));
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Dental Chart Examination`, `Do you really want to ${action} this Dental Chart Examination?`,
            `Yes, ${action} it!`, `${action}d!`, `Dental Chart Examination has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${DENTAL_CHART_EXAMINATION_URL}/${id}?sts=${sts}`);
            if (success) {
                fetchData();
            }
        }
    };

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} model={formData} >
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <Row>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Tooth Examination </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel</button>
                                    </div>
                                    <hr />
                                    <Col md={6}>
                                        <div className="mb-1">
                                            <label>Examination Type</label>
                                            <Select id="toothtexamination" className="basic-single" isClearable={true} isSearchable={true} options={dentalChartExaminationOptions}
                                                value={formData.toothtexamination} onChange={(selectedOption) => { setFormData((prev) => ({ ...prev, toothtexamination: selectedOption })) }} placeholder="Select Tooth Examination" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mt-3">
                                            <label>Examination title</label>
                                            {examTitles.map((item, index) => (
                                                <Row key={index} className="mb-2" >
                                                    <Col md={1} className="d-flex flex-column">
                                                        {(examTitles.length - 1) == index ? (
                                                            <button className="btn btn-primary" type="button" onClick={handleAddRow} > <i className="mdi mdi-plus" /> </button>
                                                        ) : (
                                                            <button className="btn btn-danger" type="button" onClick={() => handleRemoveRow(index)} > <i className="mdi mdi-delete" /> </button>
                                                        )}
                                                    </Col>
                                                    <Col md={11}>
                                                        <div className="mb-2">
                                                            <AvField name="title" type="text" placeholder="Enter Title" value={item.title} required errorMessage="Please enter Title" onChange={(e) => {
                                                                setExamTitles((prev) => {
                                                                    const updatedRows = [...prev]; updatedRows[index].title = e.target.value;
                                                                    return updatedRows;
                                                                });
                                                            }} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
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
            columns={ManageDentalChartColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rows={rows.items || []}
            rowsLength={rows?.totalItems || 0}
            rowsPerPage={pagination.limit}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Dental Chart's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default ManageDentalChart;
