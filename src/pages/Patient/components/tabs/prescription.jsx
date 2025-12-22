import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, CardBody, CardTitle, Modal } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManagePrescriptionColumns } from 'pages/Patient/tableColumns';
import { PRESCRIPTION_URL, PATIENT_URL } from 'helpers/url_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Addrows from 'pages/utils/incrementalRows';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { getZoneDateTime } from 'pages/utils/timezone';

const Prescription = ({ patientData }) => {
    const componentRef = useRef();
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ date: new Date().toISOString(), patient_id: patientData?.id });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);
    const [medicineData, setMedicineData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${PRESCRIPTION_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
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
    }, [])

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        setFormData({ patient_id: patientData?.id, date: new Date().toISOString() });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMultiRowData = (data) => {
        setFormData(prev => ({
            ...prev,
            medicine: JSON.stringify(data),
        }));
    }

    const handleSubmit = async () => {
        // console.log("formData before submit:", formData);
        const url = editMode ? `${PRESCRIPTION_URL}/${editingId}` : PRESCRIPTION_URL;
        const method = editMode ? put : post;

        const { success } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Prescription updated successfully!' : 'Prescription created successfully!');
            handleToggle();
            fetchData();
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the required fields.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Prescription`, `Do you really want to ${action} this Prescription?`,
            `Yes, ${action} it!`, `${action}d!`, `Prescription has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${PRESCRIPTION_URL}/${id}?sts=${sts}`);
            if (success)
                fetchData();
        }
    };

    const handleDataView = (data) => {
         setViewData(data);
        const me = JSON.parse(data.medicine);
        setMedicineData(me)
        console.log(me)
    }

    const handlePrint =() => {
        console.log(componentRef)
        // content: () => componentRef.current,
    }

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Create'} Prescription </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                                </div>
                                <hr />
                                <Row>
                                    <Col md={4}>
                                        <label>Select Date</label>
                                        <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                                            value={formData.date ? new Date(formData.date) : null}
                                            onChange={(date) => { setFormData(prev => ({ ...prev, date: date[0]?.toISOString() })) }} />
                                    </Col>
                                    <Col md={4}>
                                        <label>Doctor</label>
                                        <Select id="doctor" className="basic-single"
                                            isClearable={true} isSearchable={true} options={doctors}
                                            value={doctors.find((doc) => doc.value === formData.doctor_code)}
                                            onChange={(selectedOption) => { setFormData(prev => ({ ...prev, doctor_code: selectedOption?.value || "" })); }}
                                            isDisabled={editMode} placeholder="Select Doctor" />
                                    </Col>
                                    <Col md={4}>
                                        <div className='mb-3'>
                                            <AvField name="title" label="Prescription Template" type="text" placeholder="Enter Prescription Template" value={formData?.title} onChange={handleChange} required errorMessage="Please enter Prescription Template" />
                                        </div>
                                    </Col>
                                </Row>
                                <div className="mb-4 bg-light p-3 rounded">
                                    <CardTitle tag="h2" className="mb-3 mt-2" style={{ fontSize: "20px" }}> Medication </CardTitle> <Addrows callback={handleMultiRowData} tData={formData?.medicine ? JSON.parse(formData?.medicine): null}/>
                                </div>
                                <Row>
                                    <Col>
                                        <div className="mb-1">
                                            <label>Note</label>
                                            <input type="text" className="form-control" placeholder="Enter Notes" name="note" value={formData?.note} onChange={handleChange} />
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
        <>
            <Datatables
                isSearch={true}
                columns={ManagePrescriptionColumns({ view: handleDataView, edit: handleEdit, delete: handleDelete }, pagination)}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows.items || []}
                keyField={'id'}
                handleAddButton={handleToggle}
                title="All Prescription's"
                isAdd={true}
                isTableHead={true}
                loading={loading}
                ssr={setPagination}
            />

            {
                viewData && 
                <Modal size="lg" isOpen={true} toggle={() => setViewData(null)} className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">Prescription</h5>
                        <button type="button" className="btn btn-primary me-2" onClick={handlePrint}>
                            <i className="mdi mdi-printer" /> Print
                        </button>
                        <button type="button" className="btn-close" onClick={() => setViewData(null)}></button>
                    </div>
                    <div className="modal-body" ref={componentRef}>
                        <Row>
                            <Col>
                                <h1>Dr.{viewData?.doctor?.name}</h1>
                                <p>{viewData?.doctor?.email}<br />{viewData?.clinic?.clinic_name} <br />{viewData?.clinic?.address}, {viewData?.clinic?.city}, {viewData?.clinic?.state}, <br />{viewData?.clinic?.country} - {viewData?.clinic?.zip_code}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr><th>Date:</th><td>{getZoneDateTime(viewData?.date).format('DD-MMM, YYYY')}</td></tr>
                                        <tr><th>Patient Name:</th><td>John Doe</td></tr>
                                        <tr><th>Case No:</th><td>P-7890</td></tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='text-center'>
                                <h4>Prescription</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <table className='table table-bordered w-100'>
                                    <tbody>
                                        {viewData.medicine && medicineData.map((v, i) => (
                                            <React.Fragment key={`MNSN_${i}`}>
                                                {/* Medicine Name */}
                                                <tr>
                                                    <th colSpan={3}>
                                                    <h3 className="mb-0">{v?.medicine?.label}</h3>
                                                    </th>
                                                </tr>

                                                {/* Dosage, Frequency, Duration */}
                                                <tr>
                                                    <td colSpan={3} className="p-0">
                                                    <table className='table mb-0'>
                                                        <thead>
                                                        <tr>
                                                            <th>Dosage</th>
                                                            <th>Frequent</th>
                                                            <th>Duration</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td>{v?.dose?.label}</td>
                                                            <td>{v?.frequent?.label}</td>
                                                            <td>{v?.duration?.label}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    </td>
                                                </tr>

                                                {/* Instructions row */}
                                                <tr>
                                                    <td colSpan={3}><b>Instructions:</b></td>
                                                </tr>
                                                {/* Spacer row */}
                                                <tr>
                                                    <td colSpan={3} style={{ height: "15px", border: "none" }}></td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <b>Additional Notes:{viewData?.note}</b>
                            </Col>
                        </Row>
                        <hr />
                        <Row className='mt-5 pt-4 mb-5 pb-4'>
                            <Col className='text-end'>
                                <b>________________________</b><br />
                                <b>Dr.{viewData?.doctor?.name}</b>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            }
        </>
    );
};

export default Prescription;
