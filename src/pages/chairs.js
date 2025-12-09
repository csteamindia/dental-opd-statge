import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Container, Modal, Row, Col, Button } from "reactstrap";
import { get, post, del } from "helpers/api_helper";
import { APPOINTMENT_URL, PATIENT_URL, CHAIR_URL } from "helpers/url_helper";
import { showErroeAlert, showSuccessAlert, showDeleteConfirmationWithText } from "pages/utils/alertMessages";
import Select from "react-select"
import { Link } from "react-router-dom";
import moment from "moment";
import LiveClock from "./utils/liveClock";

const hours = [
    "08:00:00",
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
    "18:00:00",
    "19:00:00",
    "20:00:00",
    "21:00:00"
];

// helper to convert "HH:mm:ss" → seconds
const toSeconds = (timeStr) => {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
};

const WelcomeChairScreen = () => {
    const [cabins, setCabins] = useState([]);
    const [rows, setRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [DDoptions, setDDOptions] = useState([]);
    const [appointment, setAppointment] = useState({})
    const [tableData, setTableData] = useState(null)
    const [todoListData, setTodoListData] = useState(null)
    const [dateTime, setDateTime] = useState(new Date());

    // fetch Chair data
    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${CHAIR_URL}`);
        if (success) {
            setRows(body);
            setLoading(false);
            setCabins(body?.items.map(row => row.id))
        }
    };

    // Get Todo List Data
    const getTodoListData = async () => {
        const { success, body } = await get(`${APPOINTMENT_URL}/todo?flag=c`);
        if (success) {
            setTodoListData(body);
        }
    }
    
    useEffect(() => {
        if (isModalOpen) {
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
    }, [isModalOpen]);
    
    useEffect(() => {
        getTodoListData();
        fetchData();
    }, []);

    const toggleModal = () => setIsModalOpen(!isModalOpen)

    const handleSubmit = async () => {
        delete appointment?.chairdata;
        
        if(Object.keys(appointment).length >= 5){
            const res = await post(APPOINTMENT_URL, appointment);
            if (res.success) {
                showSuccessAlert('Appointment created successfully!');
                setIsModalOpen(false);
                setAppointment({});
                getTodoListData();
            }
        }else{
            showErroeAlert('invalid Data!');
        }
    };

    const handleModalForBookSlot = (data, hour, index) => {
        const date = moment(dateTime).format('YYYY-MM-DD');
        setAppointment(p => ({...p, appointment_date : `${date} ${hour}`, chairdata: data, chair_code: data?.cabinNo, index_position: index}))
        setIsModalOpen(!isModalOpen)
    }
    
    const renderTableData = () => hours.map((hour, rowIndex) => {
        const slotStart = toSeconds(hour);
        const slotEnd = slotStart + 3600;

        const cabinsData = cabins.map((cabinNo, colIndex) => {
            const matches = rows?.items?.filter((row) => {
                if (!row.start_time || !row.end_time || row.cabin_no !== cabinNo) return false;

                const start = toSeconds(row.start_time);
                const end = toSeconds(row.end_time);

                if (start < end) {
                    return slotStart < end && slotEnd > start;
                } else {
                    return ((slotStart < 86400 && slotEnd > start) || (slotStart < end));
                }
            }) || [];

            return { cabinNo, matches, index: `${rowIndex}-${colIndex}` };
        });

        return { hour, cabins: cabinsData };
    });
    
    useEffect(() => {
        const data = renderTableData();
        setTableData(data);
    }, [cabins])

    const handleCancelBooking = (id) => {
        showDeleteConfirmationWithText(async (note) => {
            await del(`${APPOINTMENT_URL}/${id}?note=${note}`);
            getTodoListData();
        }, "Reason for canceling this appointment");
    }

    const handleModifyBooking = (bookingData, cabin) => {
        const date = moment(bookingData?.start).format('YYYY-MM-DD');
        const hour = moment(bookingData?.start).format('HH:mm');
        console.log(bookingData, cabin)

        const selectedDoc = DDoptions?.doctors?.filter(v => bookingData?.doctor?.code == v.value)

        setAppointment(p => ({
            ...p,
            id: bookingData?.id, 
            chairData: cabin,
            treatment_code: bookingData?.tretment_code,
            notes: bookingData?.notes,
            patient_id: bookingData?.patient_id, 
            appointment_date : `${date} ${hour}`, 
            chair_code: bookingData?.chair_code, 
            index_position: bookingData?.index_position, 
            doctorSelected: selectedDoc, 
            doctor_code: bookingData?.doctor?.code
        }))
        setIsModalOpen(!isModalOpen)
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Chairs | {process.env.REACT_APP_TITLE}</title>
                </MetaTags>
                
                <Container fluid>
                    <div className="p-2 mb-2 d-flex justify-content-between align-items-center bg-light border">
                        <Link to="/patients" className="btn btn-primary"><i className="fas fa-plus me-2" />New Patinet</Link>
                        <h3 className="text-primary text-end"><LiveClock /></h3>
                    </div>
                    {tableData?.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="mb-2 card">
                            {/* Row Header */}
                            <h5 className="d-inline-block px-1 py-1 bg-primary text-white text-lg fw-semibold shadow-sm">
                                {row.hour}
                            </h5>

                            {/* Horizontal scroll container */}
                            <div className="d-flex gap-3 overflow-auto p-2">
                                {row.cabins.map((cabin, colIndex) => {
                                    const bookedItem = todoListData?.filter(v => v.canceled_at == 'Invalid date')?.find(
                                        (v) => v.index_position == `${rowIndex}-${colIndex}`
                                    );

                                    const isSlotTimeAvailable = cabin.matches.length ? true: false;
                                    const chairData = isSlotTimeAvailable ? cabin.matches[0]: false;

                                    return (
                                        <div
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            className={`text-center border border-primary flex-shrink-0 rounded-lg p-3`}
                                            style={{ minWidth: window.innerWidth < 768 ? "100%" : "260px", margin: '0 auto' }}
                                        >
                                        {/* Cabin header */}
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <b className="text-muted">{chairData?.title }</b>
                                            {
                                                bookedItem ? 
                                                <Link to={`#`} className="btn btn-close btn-danger text-white" title="Cancel" onClick={() => handleCancelBooking(bookedItem.id)}/>: ''
                                            }
                                        </div>

                                        {/* Available vs Booked */}
                                        {!bookedItem ? (
                                            isSlotTimeAvailable > 0 ? (
                                            <>
                                                <p className="text-muted mb-3">Available</p>
                                                <button className="btn btn-success w-100" onClick={() => handleModalForBookSlot( cabin, row.hour, `${rowIndex}-${colIndex}`)}>Book Now </button>
                                            </>) : 'not available'
                                        ) : (
                                            <>
                                                <div className="mb-2">
                                                    <div className="fw-bold">Case No: {bookedItem.patient?.case_no ?? "—"}</div>
                                                    <div>Patient: {bookedItem.patient?.first_name}{" "}{bookedItem.patient?.last_name}</div>
                                                    <div>Patient: {bookedItem.patient?.mobile}</div>
                                                </div>
                                                <div className="d-flex gap-2 w-100">
                                                    <Link to='#' className="btn btn-warning text-white flex-grow-1" title="modify" onClick={() => handleModifyBooking(bookedItem, cabin)}>
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
                                        )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </Container>

                {/* Start Popup Modal */}
                <Modal size="lg" isOpen={isModalOpen} toggle={toggleModal} className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">Appointment</h5>
                        <button type="button" className="btn-close" onClick={toggleModal}></button>
                    </div>
                    <div className="modal-body">
                        <span>Appointment Slot Time: <b>{appointment?.appointment_date}</b></span><br />
                        <span>Chair / Cabin: <b>{appointment?.chairdata?.title}</b></span>
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
                                            value={appointment?.patientSelected || DDoptions?.patients?.filter(v => appointment?.patient_id == v.value)}
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
                                    <div className="mb-3">
                                    <label className="control-label">Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        options={DDoptions?.doctors}
                                        value={
                                            DDoptions?.doctors?.find(v => v.value == appointment?.doctor_code) || null
                                        }
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
                                    <label>Treatment</label>
                                    <Select
                                        id="treatment"
                                        className="basic-single"
                                        classNamePrefix="select"
                                        options={DDoptions?.treatments}
                                        value={
                                            DDoptions?.treatments?.find(v => v.value == appointment?.treatment_code) || null
                                        }
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
                                            onChange={(e) => {
                                                setAppointment(prev => ({
                                                    ...prev,
                                                    'notes': e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            appointment?.id &&
                            <Button color="danger" onClick={() =>  handleCancelBooking(appointment?.id)}>Cancel Appointment</Button>
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
            </div>
        </React.Fragment>
    );
};

export default WelcomeChairScreen;
