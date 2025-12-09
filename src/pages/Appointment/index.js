import React, { useState, useEffect } from "react"
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Card, CardBody, Button, Modal } from "reactstrap"
import { APPOINTMENT_URL, PATIENT_URL } from "helpers/url_helper"
import { get, post } from "helpers/api_helper";
import { showErroeAlert, showSuccessAlert, showDeleteConfirmationWithText } from "pages/utils/alertMessages";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import Select from "react-select"
import { Link } from "react-router-dom";

// Add this style import
import 'bootstrap/dist/css/bootstrap.css';
import '@fullcalendar/react/dist/vdom';

// Add these styles
import '@fullcalendar/daygrid/main.min.css'
import '@fullcalendar/timegrid/main.min.css'

const Appointment = () => {
  const [modalLarge, setModalLarge] = useState(false)
  const [appointment, setAppointment] = useState({})
  const [DDoptions, setDDOptions] = useState([]);
  const [todoListData, setTodoListData] = useState([]);

  useEffect(() => {
    if (modalLarge) {
      const fetchData = async () => {
        try {
          const { success, body } = await get(`${PATIENT_URL}/options`);
          if (success) {
            setDDOptions(body);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [modalLarge]);

  const getTodoListData = async () => {
    const { success, body } = await get(`${APPOINTMENT_URL}/todo`);
    if (success) {
      setTodoListData(body);
    }
  }
  
  useEffect(() => {
    getTodoListData();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if(Object.keys(appointment).length >= 5){
      const res = await post(APPOINTMENT_URL, appointment);
      if (res.success) {
        showSuccessAlert('Appointment created successfully!');
        setModalLarge(false);
        setAppointment({});
        getTodoListData();
      }
    }else{
      showErroeAlert('invalid Data!');
    }
  };

  const toggleModal = () => {
    setModalLarge(!modalLarge)
  }

  const handleCancel = async (remark) => {
    const obj = {
      id: appointment.id,
      canceled_at: new Date(),
      canceled_note: remark,
      _z: appointment.patient,
    }
    const { success, data } = await post(`${APPOINTMENT_URL}/cancel`, obj);
    if (success) {
      getTodoListData(0);
      setModalLarge(false);
    }
  }

  const handleAppointment = (data) => {
    const a = data.event.extendedProps;
    if (a.is_visited == 0) {
      setAppointment({
        id: a.id,
        appointmentDate: new Date(a.appointment_date),
        patientSelected: [{ value: a.patient_id, label: `${a.patient.first_name} ${a.patient.last_name}` }],
        doctorSelected: [{ value: a.doctor.id, label: `${a.doctor.name}` }],
        patient_id: a.patient_id,
        notes: a.notes,
        patient: btoa(JSON.stringify({ appointment_date: a.appointment_date, name: `${a.patient.title} ${a.patient.first_name} ${a.patient.last_name}`, mobile: a.patient.mobile, email: a.patient.email, doctor: a.doctor.name }))
      })
      setModalLarge(!modalLarge)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Appointments | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          {/* Todo View */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Row className="mb-4">
                    <Col md={4}>
                      <h5 className="card-title">Appointments Calendar</h5>
                    </Col>
                    <Col md={8} className="text-end">
                      <Button color="primary" className="me-2" onClick={toggleModal}>
                        <i className="fas fa-plus me-2" ></i>New Appointment
                      </Button>
                      <Button color="info" className="me-2">Today</Button>
                      <Button color="secondary">Week</Button>
                    </Col>
                  </Row>
                  <FullCalendar
                    plugins={[
                      dayGridPlugin,
                      timeGridPlugin,
                      interactionPlugin,
                      listPlugin
                    ]}
                    eventClick={handleAppointment}
                    initialView="dayGridWeek"  // Changed from timeGridWeek
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'  // Changed timeGrid to dayGrid
                    }}
                    // Remove themeSystem prop
                    eventContent={(arg) => {
                      return {
                        html: arg.event.title.split('\n').join('<br />')
                      }
                    }}
                    events={todoListData}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    height="700px"
                    isHiddenDay={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    slotDuration="00:20:00"
                    allDaySlot={false}
                    nowIndicator={true}
                    stickyHeaderDates={true}
                    handleWindowResize={true}
                    businessHours={{
                      daysOfWeek: [1, 2, 3, 4, 5, 6],
                      startTime: '08:00',
                      endTime: '20:00',
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Todo View */}

          {/* Start Popup Modal */}
          <Modal size="lg" isOpen={modalLarge} toggle={toggleModal} className="custom-modal">
            <div className="modal-header">
              <h5 className="modal-title">Appointment</h5>
              <button type="button" className="btn-close" onClick={toggleModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <Row className='mt-2'>
                  <Col>
                    <div>
                      <label className="control-label">Patient</label>
                      <Select
                        id="patient"
                        className="basic-single"
                        classNamePrefix="select"
                        options={DDoptions?.patients}
                        value={appointment?.patientSelected}
                        onChange={(selectedOption) => {
                          setAppointment((prev) => ({
                            ...prev, patient_id: selectedOption?.value
                          }))
                        }}
                        placeholder="Select Patient"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <label>Appointment Date & Time</label>
                      <Flatpickr className="form-control d-block" value={appointment?.appointmentDate}
                        onChange={([date]) => setAppointment(prev => ({ ...prev, appointment_date: date.toISOString().split("T")[0], }))}
                        options={{ altInput: true, altFormat: "F j, Y h:i K", dateFormat: "Y-m-d H:i", enableTime: true, time_24hr: false }}
                        placeholder="DD, MM, YYYY HH:MM"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label className="control-label">
                        Doctor
                      </label>
                      <Select
                        id="doctor"
                        className="basic-single"
                        classNamePrefix="select"
                        options={DDoptions?.doctors}
                        value={appointment?.doctorSelected}
                        onChange={(selectedOption) => {
                          setAppointment((prev) => ({
                            ...prev,
                            doctor_code: selectedOption?.value,
                          }));
                        }}
                        placeholder="Select Doctor"
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
                        onChange={(selectedOption) => {
                          // console.log('Selected Option:', selectedOption);
                          setAppointment((prev) => ({
                            ...prev, chair_code: selectedOption?.value
                          }))
                        }}
                        placeholder="Select Chair"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-1">
                      <label>Treatment</label>
                      <Select
                        id="treatment"
                        className="basic-single"
                        classNamePrefix="select"
                        options={DDoptions?.treatments}
                        onChange={(selectedOption) => {
                          setAppointment((prev) => ({
                            ...prev,
                            treatment_code: selectedOption?.value,
                          }));
                        }}
                        placeholder="Select Treatment"
                      />
                    </div>
                  </Col>

                  <Col>
                    <div className="w-100">
                      <label className="form-check-label" htmlFor="customSwitchsizemd">Notification</label>
                      <table className="w-100">
                        <tbody>
                          <tr>
                            {/* <td>
                                <div  className="form-check form-switch form-switch-md mt-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customSwitchsizemd"
                                    name="is_fevrate"
                                    checked={appointment.notification_status || false}
                                    onChange={(e) =>
                                      setAppointment(prev => ({
                                        ...prev,
                                        notification_status: e.target.checked,
                                      }))
                                    }
                                  />
                                </div>
                              </td> */}
                            <td>
                              <div className="form-check form-switch form-switch-md mt-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customSwitchsizemd"
                                  name="is_fevrate"
                                  checked={appointment.notification_for_patient || false}
                                  onChange={(e) =>
                                    setAppointment(prev => ({
                                      ...prev,
                                      notification_for_patient: e.target.checked,
                                    }))
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <div className="form-check form-switch form-switch-md mt-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customSwitchsizemd"
                                  name="is_fevrate"
                                  checked={appointment.notification_for_doctor || false}
                                  onChange={(e) =>
                                    setAppointment(prev => ({
                                      ...prev,
                                      notification_for_doctor: e.target.checked,
                                    }))
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            {/* <td>For Status</td> */}
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

              </form>
            </div>
            <div className="modal-footer">
              {
                appointment?.id &&
                <Button color="danger" onClick={() => showDeleteConfirmationWithText(handleCancel)}>Cancel Appointment</Button>
              }
              <Button color="secondary" onClick={toggleModal}>close</Button>
              <Button color="primary" onClick={handleSubmit}>{appointment?.id ? 'Update': 'Submit'} Appointment</Button>
              {
                appointment.id && 
                <Link to={`patient?_p=${appointment.patient_id}`} className="btn btn-success" onClick={toggleModal}>View</Link>
              }
            </div>
          </Modal>
          {/* END Popup Modal */}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Appointment;
