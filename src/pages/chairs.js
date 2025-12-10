import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Container, Modal, Row, Col, Button } from "reactstrap";
import { get, post, del } from "helpers/api_helper";
import { APPOINTMENT_URL, PATIENT_URL, CHAIR_URL } from "helpers/url_helper";
import { showErroeAlert, showSuccessAlert, showDeleteConfirmationWithText } from "pages/utils/alertMessages";
import Select from "react-select";
import { Link } from "react-router-dom";
import moment from "moment";
import LiveClock from "./utils/liveClock";
import chair_bg from '../assets/images/chair_dental.png'

const hours = [ "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00", ];

const WelcomeChairScreen = () => {
    const [cabins, setCabins] = useState([]);
    const [rows, setRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [DDoptions, setDDOptions] = useState([]);
    const [appointment, setAppointment] = useState({});
    const [tableData, setTableData] = useState(null);
    const [todoListData, setTodoListData] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());

    const [selectedTime, setSelectedTime ] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${CHAIR_URL}`);
        if (success) {
            setRows(body);
            setCabins(body?.items.map(row => row.id));
        }
    };

    const getTodoListData = async () => {
        const { success, body } = await get(`${APPOINTMENT_URL}/todo?flag=c`);
        if (success) setTodoListData(body);
    };

    useEffect(() => {
        if (isModalOpen) {
            (async () => {
                const { success, body } = await get(`${PATIENT_URL}/options`);
                if (success) setDDOptions(body);
            })();
        }
    }, [isModalOpen]);

    useEffect(() => {
        fetchData();
        getTodoListData();
    }, []);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleSubmit = async () => {
        delete appointment?.chairdata;

        if (Object.keys(appointment).length >= 5) {
            const res = await post(APPOINTMENT_URL, appointment);
            if (res.success) {
                showSuccessAlert("Appointment created successfully!");
                setIsModalOpen(false);
                setAppointment({});
                getTodoListData();
            }
        } else showErroeAlert("Invalid Data!");
    };

    const handleModalForBookSlot = (data, hour, index) => {
        const date = moment(dateTime).format("YYYY-MM-DD");
        setAppointment({
            ...appointment,
            appointment_date: `${date} ${hour}`,
            chairdata: data,
            chair_code: data?.cabinNo,
            index_position: index,
        });
        setIsModalOpen(true);
    };

    // Convert "HH:mm:ss" → seconds
    const toSeconds = (t) => {
        if (!t) return 0;
        const [h, m, s] = t.split(":").map(Number);
        return h * 3600 + m * 60 + (s || 0);
    };

    const generateSlots = (startTime, endTime, intervalMin) => {
        const format = "HH:mm:ss";

        let start = moment(startTime, format);
        const end = moment(endTime, format);

        const slots = [];

        while (start < end) {
            const s = start.format(format);
            const e = moment(start).add(intervalMin, "minutes").format(format);

            slots.push({
                start_time: s,
                end_time: e
            });

            start = moment(start).add(intervalMin, "minutes");
        }

        return slots;
    };

    // filterTime format → "HH:mm:ss" or "HH:mm"
    const renderTableData = (filterTime = null) => {
        const filterSeconds = filterTime ? toSeconds(filterTime) : null;

        return cabins.map((cabinNo) => {
            const chair = rows?.items?.find(r => r.id == cabinNo);
            if (!chair) return null;

            let slots = generateSlots(
                chair.start_time,
                chair.end_time,
                chair.intervel
            );

            // 🔥 Apply time filter if provided
            if (filterSeconds !== null) {
                slots = slots.filter(slot => {
                    const s = toSeconds(slot.start_time);
                    const e = toSeconds(slot.end_time);

                    return filterSeconds >= s && filterSeconds <= e;
                });
            }

            return {
                cabinNo,
                title: chair.title,
                slots
            };
        });
    };

    useEffect(() => {
        setTableData(renderTableData(selectedTime));
    }, [cabins, rows, hours, selectedTime]);

    const handleCancelBooking = (id) => {
        showDeleteConfirmationWithText(async (note) => {
            await del(`${APPOINTMENT_URL}/${id}?note=${note}`);
            getTodoListData();
        }, "Reason for canceling this appointment");
    };

    const handleModifyBooking = (bookingData, cabin) => {
        const date = moment(bookingData?.start).format("YYYY-MM-DD");
        const hour = moment(bookingData?.start).format("HH:mm");

        const selectedDoc = DDoptions?.doctors?.filter(
            v => bookingData?.doctor?.code == v.value
        );

        setAppointment({
            id: bookingData?.id,
            chairdata: cabin,
            treatment_code: bookingData?.tretment_code,
            notes: bookingData?.notes,
            patient_id: bookingData?.patient_id,
            appointment_date: `${date} ${hour}`,
            chair_code: bookingData?.chair_code,
            index_position: bookingData?.index_position,
            doctorSelected: selectedDoc,
            doctor_code: bookingData?.doctor?.code,
        });

        setIsModalOpen(true);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Chairs | {process.env.REACT_APP_TITLE}</title>
                </MetaTags>

                <Container fluid>
                    {/* Header */}
                    <div className="p-2 mb-3 d-flex justify-content-between align-items-center bg-light border">
                        <Link to="/patients" className="btn btn-primary">
                            <i className="fas fa-plus me-2" /> New Patient
                        </Link>
                        <h3 className="text-primary">
                            <LiveClock />
                        </h3>
                    </div>

                    {/* Hour Filter */}
                    <div className="d-flex gap-2 overflow-auto mb-3 pb-2">
                        {hours.map(h => (
                            <span
                                key={h}
                                onClick={() => setSelectedTime (h)}
                                className={`px-3 py-2 rounded fw-bold cursor-pointer shadow-sm 
                                    ${selectedTime === h ? "bg-primary text-white" : "bg-light"}`}
                            >
                                {h}
                            </span>
                        ))}

                        {/* Reset */}
                        <span
                            onClick={() => setSelectedTime (null)}
                            className="px-3 py-2 bg-secondary text-white rounded fw-bold cursor-pointer shadow-sm"
                        >
                            All
                        </span>
                    </div>

                    <div className="row">
                        {tableData?.map((chair, i) => (
                            chair.slots.length ? (
                            <div key={i} className="col-6" style={{ overflow: "hidden" }}>
                                <div className="card p-3 mb-3 position-relative" style={{ overflow: "hidden" }}>
                                <h5 className="mb-3">{chair.title}</h5>

                                <div className="d-flex gap-3 flex-wrap">
                                    {chair.slots.map((slot, index) => {
                                    const display = `${slot.start_time} - ${slot.end_time}`;
                                    

                                    const bookedItem = todoListData?.filter(v => v.canceled_at == 'Invalid date')?.find(
                                        (v) => v.index_position == `${i}${index}`
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="shadow-sm border rounded p-3 bg-white"
                                            style={{ width: "200px" }}
                                            >
                                            
                                            {
                                                !bookedItem ? <>
                                                    <b>{display}</b>

                                                    <button
                                                        className="btn btn-primary btn-sm mt-2 w-100"
                                                        onClick={() =>
                                                            handleModalForBookSlot(chair, slot.start_time, `${i}${index}`)
                                                        }
                                                    >
                                                        Book
                                                    </button>
                                                </> : <>
                                                    <div className="mb-2">
                                                        <div className="fw-bold">Case No: {bookedItem.patient?.case_no ?? "—"}</div>
                                                        <div>Patient: {bookedItem.patient?.first_name}{" "}{bookedItem.patient?.last_name}</div>
                                                        <div>Patient: {bookedItem.patient?.mobile}</div>
                                                    </div>
                                                    <div className="d-flex gap-2 w-100">
                                                        <Link to='#' className="btn btn-warning text-white flex-grow-1" title="modify" onClick={() => handleModifyBooking(bookedItem, chair)}>
                                                            <i className="bx bxs-analyse"></i>
                                                        </Link>
                                                        <Link to={`patient?_p=${bookedItem.patient_id}`} className="btn btn-info text-white flex-grow-1" title="view" onClick={toggleModal}>
                                                            <i className="fas fa-eye"></i>
                                                        </Link>
                                                        <Link to={`patient?_p=${bookedItem.patient_id}`} className="btn btn-success text-white flex-grow-1" title="notify" onClick={toggleModal}>
                                                            <i className="fab fa-whatsapp"></i>
                                                        </Link>
                                                    </div>
                                                </>
                                            }

                                            {
                                                // bookedItem ? 
                                                // <Link to={`#`} className="btn btn-close btn-danger text-white" title="Cancel" onClick={() => handleCancelBooking(bookedItem.id)}/>: ''
                                            }
                                        </div>
                                    );
                                    })}
                                </div>

                                {/* Background image at bottom-right */}
                                <img
                                    src={chair_bg}
                                    style={{
                                    position: "absolute",
                                    right: "10px",
                                    bottom: "10px",
                                    width: "120px",
                                    opacity: 0.15,
                                    pointerEvents: "none"
                                    }}
                                    alt=""
                                />
                                </div>
                            </div>
                            ) : null
                        ))}
                        </div>
                </Container>

                {/* Appointment Modal */}
                <Modal size="lg" isOpen={isModalOpen} toggle={toggleModal}>
                    <div className="modal-header">
                        <h5 className="modal-title">Appointment</h5>
                        <button className="btn-close" onClick={toggleModal}></button>
                    </div>

                    <div className="modal-body">
                        <b>Time:</b> {appointment?.appointment_date} <br />
                        <b>Cabin:</b> {appointment?.chairdata?.title}
                        <form>
                            <Row className="mt-3">
                                <Col>
                                    <label>Patient</label>
                                    <Select
                                        options={DDoptions?.patients}
                                        value={
                                            DDoptions?.patients?.find(
                                                v =>
                                                    v.value ==
                                                    appointment?.patient_id
                                            ) || null
                                        }
                                        onChange={(x) =>
                                            setAppointment({
                                                ...appointment,
                                                patient_id: x?.value,
                                            })
                                        }
                                    />
                                </Col>
                                <Col>
                                    <label>Doctor</label>
                                    <Select
                                        options={DDoptions?.doctors}
                                        value={
                                            DDoptions?.doctors?.find(
                                                v =>
                                                    v.value ==
                                                    appointment?.doctor_code
                                            ) || null
                                        }
                                        onChange={(x) =>
                                            setAppointment({
                                                ...appointment,
                                                doctor_code: x?.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col>
                                    <label>Treatment</label>
                                    <Select
                                        options={DDoptions?.treatments}
                                        value={
                                            DDoptions?.treatments?.find(
                                                v =>
                                                    v.value ==
                                                    appointment?.treatment_code
                                            ) || null
                                        }
                                        onChange={(x) =>
                                            setAppointment({
                                                ...appointment,
                                                treatment_code: x?.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                <Col>
                                    <label>Notes</label>
                                    <textarea
                                        className="form-control"
                                        value={appointment?.notes ?? ""}
                                        onChange={(e) =>
                                            setAppointment({
                                                ...appointment,
                                                notes: e.target.value,
                                            })
                                        }
                                    />
                                </Col>
                            </Row>
                        </form>
                    </div>

                    <div className="modal-footer">
                        {appointment.id && (
                            <Button
                                color="danger"
                                onClick={() => handleCancelBooking(appointment.id)}
                            >
                                Cancel Appointment
                            </Button>
                        )}

                        <Button color="secondary" onClick={toggleModal}>
                            Close
                        </Button>

                        <Button color="primary" onClick={handleSubmit}>
                            {appointment.id ? "Update" : "Submit"} Appointment
                        </Button>

                        {appointment.id && (
                            <Link
                                to={`patient?_p=${appointment.patient_id}`}
                                className="btn btn-success"
                                onClick={toggleModal}
                            >
                                View
                            </Link>
                        )}
                    </div>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default WelcomeChairScreen;
