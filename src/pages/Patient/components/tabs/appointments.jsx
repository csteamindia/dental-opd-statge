import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageAppointmentColumns } from 'pages/Patient/tableColumns';
import { APPOINTMENT_URL, PATIENT_URL } from "helpers/url_helper"
import { showSuccessAlert } from "pages/utils/alertMessages";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Appointments = ({ patientData }) => {
    const [isForm, setIsForm] = useState(false);
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [appointment, setAppointment] = useState({ patient_id: patientData?.id });
    const [loading, setLoading] = useState(false);
    const [DDoptions, setDDOptions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, Search: '' });

    // Fetch dropdown options when form opens
    useEffect(() => {
        if (isForm) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const { success, body } = await get(`${PATIENT_URL}/options`);
                    if (success) {
                        setDDOptions(body);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isForm]);

    // Fetch appointments list on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            const { success, body } = await get(`${APPOINTMENT_URL}?patient_id=${patientData?.id}`);
            if (success) {
                setRows(body);
            }
        };
        fetchAppointments();
    }, [patientData?.id]);

    // Set default appointment_date to now when adding new appointment (form open + not editing)
    useEffect(() => {
        if (isForm && !editMode) {
            const now = new Date();
            setAppointment(prev => ({
                ...prev,
                appointment_date: now.toISOString(), // full ISO string with date and time
                patient_id: patientData?.id,
                doctor_code: null,
                chair_code: null,
                treatment_code: null,
                notification_for_patient: false,
                notification_for_doctor: false,
                notes: '',
            }));
        }
    }, [isForm, editMode, patientData?.id]);

    const handleToggle = () => {
        setIsForm(!isForm);
        if (isForm) {
            // Reset form when closing
            setAppointment({ patient_id: patientData?.id });
            setEditMode(false);
            setEditingId(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const url = editMode ? `${APPOINTMENT_URL}/${editingId}` : APPOINTMENT_URL;
        const method = editMode ? put : post;

        const { success } = await method(url, appointment);

        setLoading(false);

        if (success) {
            showSuccessAlert(editMode ? 'Appointment updated successfully!' : 'Appointment created successfully!');
            handleToggle();
            // Refresh appointments list
            const { success: refreshSuccess, body } = await get(`${APPOINTMENT_URL}?patient_id=${patientData?.id}`);
            if (refreshSuccess) setRows(body);
        }
    };

    const handleEdit = (row) => {
        setAppointment({
            ...row,
            appointment_date: row.appointment_date ? new Date(row.appointment_date).toISOString() : null,
        });
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(
            `${action} Appointment`,
            `Do you really want to ${action} this Appointment?`,
            `Yes, ${action} it!`,
            `${action}d!`,
            `Appointment has been ${action}d successfully.`
        );

        if (isConfirmed) {
            const { success } = await del(`${APPOINTMENT_URL}/${id}?sts=${sts}`);
            if (success) {
                // Refresh appointments list after delete
                const { success: refreshSuccess, body } = await get(`${APPOINTMENT_URL}?patient_id=${patientData?.id}`);
                if (refreshSuccess) setRows(body);
            }
        }
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Update' : 'Add'} Appointment </h5>
                                <button className="btn btn-danger" onClick={handleToggle}> <i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row className='mt-2'>
                                <Col>
                                    <div className="form-group">
                                        <label>Appointment Date & Time</label>
                                        <Flatpickr className="form-control d-block" value={appointment.appointment_date ? new Date(appointment.appointment_date) : null}
                                            onChange={([date]) => setAppointment(prev => ({ ...prev, appointment_date: date.toISOString(), }))}
                                            options={{ altInput: true, altFormat: "F j, Y h:i K", dateFormat: "Y-m-d H:i", enableTime: true, time_24hr: false }}
                                            isDisabled={editMode} placeholder="MM, DD, YYYY HH:MM"
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-3">
                                        <label className="control-label">Doctor</label>
                                        <Select
                                            id="doctor"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.doctors}
                                            value={DDoptions?.doctors?.find(opt => opt.value === appointment.doctor_code) || null}
                                            onChange={(selectedOption) => setAppointment(prev => ({ ...prev, doctor_code: selectedOption?.value }))}
                                            isDisabled={editMode} placeholder="Select Doctor"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-1'>
                                <Col>
                                    <div className="mb-1">
                                        <label>Chair</label>
                                        <Select
                                            id="chair"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.chairs}
                                            value={DDoptions?.chairs?.find(opt => opt.value == appointment.chair_code) || null}
                                            onChange={(selectedOption) => setAppointment(prev => ({ ...prev, chair_code: selectedOption?.value }))}
                                            isDisabled={editMode} placeholder="Select Chair"
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Treatment</label>
                                        {
                                            console.log(DDoptions?.treatments)
                                        }
                                        <Select
                                            id="treatment"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={DDoptions?.treatments}
                                            value={DDoptions?.treatments?.find(opt => opt.value == appointment.treatment_code) || null}
                                            onChange={(selectedOption) => setAppointment(prev => ({ ...prev, treatment_code: selectedOption?.value }))}
                                            isDisabled={editMode} placeholder="Select Treatment"
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="w-100">
                                        <label className="form-check-label" htmlFor="customSwitchsizemd">Notification</label>
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="form-check form-switch form-switch-md mt-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="notifPatient"
                                                                name="notification_for_patient"
                                                                checked={appointment.notification_for_patient || false}
                                                                onChange={(e) => setAppointment(prev => ({
                                                                    ...prev,
                                                                    notification_for_patient: e.target.checked,
                                                                }))}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch form-switch-md mt-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="notifDoctor"
                                                                name="notification_for_doctor"
                                                                checked={appointment.notification_for_doctor || false}
                                                                onChange={(e) => setAppointment(prev => ({
                                                                    ...prev,
                                                                    notification_for_doctor: e.target.checked,
                                                                }))}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>For Patient</td>
                                                    <td>For Doctor</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mt-2">
                                        <label>Notes</label>
                                        <textarea
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="notes"
                                            value={appointment.notes || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end mt-3 mb-1">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            disabled={loading}
                                            onClick={handleSubmit}
                                        >
                                            {loading ? 'Processing...' : <>
                                                <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'}
                                            </>}
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
            columns={ManageAppointmentColumns({ edit: handleEdit, delete: handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows?.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Appointment"
            isAdd={true}
            isTableHead={true}
            rowClasses="cursor-pointer hover:bg-gray-100"
            loading={loading}
            ssr={setPagination}
        />
    );

};

export default Appointments;
