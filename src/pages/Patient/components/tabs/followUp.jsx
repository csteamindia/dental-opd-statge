import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManagePatientFollowUpColumns } from 'pages/Patient/tableColumns';
import { PATIENT_FOLLOWUP_URL } from 'helpers/url_helper';
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const PatientFollowUp = ({ isFormPreOpen = false, patientData }) => {
    const [isForm, setIsForm] = useState(isFormPreOpen);
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({ followup_date: new Date().toISOString(), added_by: "1" });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${PATIENT_FOLLOWUP_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({ followup_date: new Date().toISOString(), added_by: "1" })
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
        const res = await post(PATIENT_FOLLOWUP_URL, payload);
        if (res.success) {
            showSuccessAlert('Patient Follow Up created successfully!');
            setIsForm(false);
            setFormData({});
            fetchData();
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the required fields.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Patient Follow Up`, `Do you really want to ${action} this Patient Follow Up?`,
            `Yes, ${action} it!`, `${action}d!`, `Patient Follow Up has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${PATIENT_FOLLOWUP_URL}/${id}?sts=${sts}`);
            if (success) fetchData();
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
                                    <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> Add Patient Follow Up </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
                                </div>
                                <hr />
                                <Row>
                                    <Col >
                                        <div className="form-group mb-4">
                                            <label>Follow Up Date</label>
                                            <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                                                value={formData.followup_date ? new Date(formData.followup_date) : null}
                                                onChange={(date) => { setFormData(prev => ({ ...prev, followup_date: date[0]?.toISOString() })) }} />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='mt-2'>
                                            <AvField name="remark" label="Follow Up Reason" type="text" placeholder="Enter Follow Up Reason" value={formData.remark} onChange={handleChange} required errorMessage="Please enter Follow Up Reason" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="mb-1">
                                            <label>Notes</label>
                                            <input type="text" className="form-control" placeholder="Enter Notes" name="note" value={formData?.note} onChange={handleChange} />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> Submit</>}
                                            </button>
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
            columns={ManagePatientFollowUpColumns({ edit: handleEdit, delete: handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows?.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="Patient Follow Ups"
            isAdd={true}
            isTableHead={true}
            rowClasses="cursor-pointer hover:bg-gray-100"
            loading={loading}
            ssr={setPagination}
        />
    );

};

export default PatientFollowUp;
