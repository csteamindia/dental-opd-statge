import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useHistory } from "react-router-dom";
import moment from "moment";

import WhatsappNotification from "./notification/whatsapp";
import SmsNotification from "./notification/sms";
import { APPOINTMENT_URL } from "helpers/url_helper";
import { post, get } from "helpers/api_helper";

const PatientProfile = ({ data = null, configData = null, callback = () => {}, appId = "" }) => {
  const history = useHistory();
  const [patientData, setPatientData] = useState(data);
  const [appData, setAppData] = useState(null);
  const [notificationModal, setNotificationModal] = useState(null);
  const storageKey = `appointment_start_${appId}`;

  const [startTime, setStartTime] = useState(localStorage.getItem(storageKey) || null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timer, setTimer] = useState(null);

  // Initialize elapsed time if appointment already started
  useEffect(() => {
    if (startTime) {
      const start = moment(startTime);
      setElapsedSeconds(moment().diff(start, "seconds"));

      const interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      setTimer(interval);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  // ---------------- START / END APPOINTMENT ----------------
  const handleStart = async () => {
    try {
      const { success, body } = await post(`${APPOINTMENT_URL}/starttime/${appId}`);
      if (!success) return console.error("Failed to start appointment:", body.message);

      const startTimestamp = body.startTime || moment().toISOString();
      localStorage.setItem(storageKey, startTimestamp);
      setStartTime(startTimestamp);

      const interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
      setTimer(interval);
    } catch (err) {
      console.error("Error starting appointment:", err);
    }
  };

  const handleEnd = async () => {
    try {
      const { success, body } = await post(`${APPOINTMENT_URL}/endtime/${appId}`);
      if (!success) return console.error("Failed to end appointment:", body.message);

      if (timer) clearInterval(timer);
      localStorage.removeItem(storageKey);
      setStartTime(null);
      setElapsedSeconds(0);

      console.log("Appointment ended:", body.message);
    } catch (err) {
      console.error("Error ending appointment:", err);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // ---------------- FETCH APPOINTMENT DATA ----------------
  const getAppointmentData = async () => {
    const { success, body } = await get(`${APPOINTMENT_URL}/getappdata?appid=${appId}`);
    if (success) setAppData(body);
  };

  useEffect(getAppointmentData, [appId]);

  // ---------------- HANDLERS ----------------
  const handleNotificationModal = (type) => setNotificationModal(type);

  const handleTabOpen = (tab) => {
    history.push({ pathname: "/patient", search: `?_p=${patientData?.id}&_t=${tab}` });
  };

  // ---------------- SESSION OPTIONS ----------------
  let options = null;
  if (sessionStorage.hasOwnProperty("options")) {
    options = JSON.parse(sessionStorage.getItem("options"));
  }

  // ---------------- RENDER ----------------
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              {/* PROFILE SECTION */}
              <div className="col-lg-3">
                <div className="d-flex">
                  {configData?.user?.config?.profile_pic && (
                    <div className="flex-shrink-0 me-3">
                      <img
                        src={patientData?.profile_pic ? `http://localhost:4017/${patientData.profile_pic}` : "/images/default-avatar.png"}
                        alt="Profile"
                        className="avatar-md rounded img-thumbnail"
                      />
                    </div>
                  )}
                  <div className="flex-grow-1 align-self-center text-muted">
                    <h5 className="mb-1">{`${patientData?.title} ${patientData?.first_name} ${patientData?.last_name}`}</h5>
                    <p className="mb-1">{`Case #${patientData?.case_no}`}</p>
                    <p className="mb-1">{`${patientData?.gender} | Age: ${patientData?.age} years`}</p>
                    <p className="mb-0">{`${patientData?.mobile} | ${patientData?.email}`}</p>
                  </div>
                </div>

                {/* NOTIFICATION BUTTONS */}
                <div className="mt-2">
                  {configData?.user?.config?.whastsapp && (
                    <button onClick={() => handleNotificationModal(1)} className="me-2 btn btn-outline-primary text-start">
                      <i className="bx bxl-whatsapp" /> Whatsapp
                    </button>
                  )}
                  {configData?.user?.config?.email && (
                    <button onClick={() => handleNotificationModal(3)} className="btn btn-outline-primary text-start">
                      <i className="bx bx-envelope" /> e-Mail
                    </button>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="col-lg-2">
                <div className="flex-grow-1 align-self-center">
                  {configData?.user?.config?.summary && (
                    <button
                      className="btn btn-outline-primary w-100 mb-1 text-start"
                      onClick={() => window.open(`/patinet/summary/${patientData?.id}`)}
                    >
                      <i className="bx bx-printer p-1" /> Patient Summary
                    </button>
                  )}
                  <button onClick={() => handleTabOpen("Investigations")} className="btn btn-outline-primary w-100 mb-1 text-start">
                    <i className="fas fa-file-prescription p-1" /> Add investigation
                  </button>
                  {configData?.user?.config?.covid_19 && (
                    <div className="d-flex justify-content-between mb-2">
                      <button className="btn btn-outline-primary w-100 text-start">
                        <i className="bx bx-envelope p-1" /> Covid-19 Consent
                      </button>
                    </div>
                  )}
                  <button onClick={() => handleTabOpen("Notes")} className="btn btn-outline-primary w-100 mb-1 text-start">
                    <i className="fas fa-file-alt p-1" /> Add Note
                  </button>
                </div>
              </div>

              {/* FOLLOW-UP & ALLERGIES / TIMER */}
              <div className="col-lg-7">
                <Row>
                  {configData?.user?.config?.follow_up && (
                    <Col lg={3}>
                      <button onClick={() => handleTabOpen("Followup")} className="btn btn-outline-primary w-100 mb-1 text-start">
                        <i className="fas fa-plus p-1" /> Add Follow-Up
                      </button>
                    </Col>
                  )}

                  {configData?.user?.config?.allergies && patientData?.allergies && (
                    <Col lg={6}>
                      {JSON.parse(patientData.allergies)?.length > 0 && (
                        <div className="border border-danger p-1 pt-2">
                          <div className="text-center">
                            <b className="text-danger blink-texth">
                              {JSON.parse(patientData.allergies)
                                .map(v => options?.allergies?.find(opt => opt.value === v)?.label)
                                .filter(Boolean)
                                .join(", ")}
                            </b>
                          </div>
                        </div>
                      )}

                      {appData && (
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th>Appointment</th>
                              <th>{moment(appData?.appointment_date).format("HH:mm")}</th>
                            </tr>
                            <tr>
                              <th>Reported</th>
                              <th>{moment(appData?.reporting_time).format("HH:mm")}</th>
                            </tr>
                            <tr>
                              <td colSpan={2} className="text-center">
                                {startTime ? (
                                  <button
                                    className="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2"
                                    onClick={handleEnd}
                                  >
                                    <i className="fas fa-stop-circle"></i>
                                    End ({formatTime()})
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-success w-100 d-flex justify-content-center align-items-center gap-2"
                                    onClick={handleStart}
                                  >
                                    <i className="fas fa-play-circle"></i>
                                    Start
                                  </button>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </Col>
                  )}
                </Row>

                {/* BILLING INFO */}
                {configData?.user?.config?.billing_info && (
                  <Row className="mt-2">
                    <Col lg={4}>
                      <div className="alert alert-warning d-none d-lg-block">Billed Amount: <b>₹ 1000</b></div>
                      <div className="alert alert-success d-none d-lg-block">Billed Balance: <b>₹ 1000</b></div>
                    </Col>
                    <Col lg={8}>
                      <div className="text-center">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Treatment Cost</th>
                              <th>Paid</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1000</td>
                              <td>0</td>
                              <td>1000</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notificationModal === 1 && <WhatsappNotification mobile={patientData?.mobile} open callback={() => setNotificationModal(null)} />}
      {notificationModal === 2 && <SmsNotification mobile={patientData?.mobile} open callback={() => setNotificationModal(null)} />}
    </div>
  );
};

export default PatientProfile;
