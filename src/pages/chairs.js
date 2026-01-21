import React, { useState, useEffect, useMemo } from "react"
import MetaTags from "react-meta-tags"
import { Container, Modal, Row, Col, Button } from "reactstrap"
import { get, post, del } from "helpers/api_helper"
import { APPOINTMENT_URL, PATIENT_URL, CHAIR_URL } from "helpers/url_helper"
import {
  showErroeAlert,
  showSuccessAlert,
  showDeleteConfirmationWithText,
} from "pages/utils/alertMessages"
import Select from "react-select"
import { Link } from "react-router-dom"
import LiveClock from "./utils/liveClock"
import chair_bg from "../assets/images/chair_dental.png"
import { getZoneDateTime } from "./utils/timezone"

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
  "21:00:00",
  "22:00:00",
  "23:00:00",
]

const WelcomeChairScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [cabins, setCabins] = useState([])
  const [rows, setRows] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [DDoptions, setDDOptions] = useState([])
  const [appointment, setAppointment] = useState({})
  const [tableData, setTableData] = useState(null)
  const [todoListData, setTodoListData] = useState(null)
  const [dateTime, setDateTime] = useState(new Date())
  const [nonScheduledAppointments, setNonScheduledAppointments] = useState([])

  const [selectedTime, setSelectedTime] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    const { success, body } = await get(`${CHAIR_URL}`)
    if (success) {
      setRows(body)
      setCabins(body?.items.map(row => row.id))
      setIsLoading(false)
    }
  }

  const getTodoListData = async () => {
    setIsLoading(true)

    try {
      const { success, body } = await get(`${APPOINTMENT_URL}/todo?flag=c`)

      if (!success || !Array.isArray(body)) {
        setTodoListData([])
        setNonScheduledAppointments([])
        return
      }

      const scheduledAppointments = []
      const nonScheduledAppointments = []

      for (const item of body) {
        if (item.index_position === null || item.index_position === undefined) {
          nonScheduledAppointments.push(item)
        } else {
          scheduledAppointments.push(item)
        }
      }

      setTodoListData(scheduledAppointments)
      setNonScheduledAppointments(nonScheduledAppointments)
    } catch (err) {
      console.error("Failed to load todo list", err)
      setTodoListData([])
      setNonScheduledAppointments([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      ;(async () => {
        const { success, body } = await get(`${PATIENT_URL}/options`)
        if (success) setDDOptions(body)
      })()
    }
  }, [isModalOpen])

  useEffect(() => {
    fetchData()
    getTodoListData()
  }, [])

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const handleSubmit = async () => {
    delete appointment?.chairdata

    if (Object.keys(appointment).length >= 5) {
      const res = await post(APPOINTMENT_URL, appointment)
      if (res.success) {
        showSuccessAlert("Appointment created successfully!")
        setIsModalOpen(false)
        setAppointment({})
        getTodoListData()
      }
    } else showErroeAlert("Invalid Data!")
  }

  const handleModalForBookSlot = (data, hour, index) => {
    setAppointment({})
    const date = getZoneDateTime(dateTime).format("YYYY-MM-DD")
    setAppointment({
      //   ...appointment,
      appointment_date: `${date} ${hour}`,
      chairdata: data,
      chair_code: data?.cabinNo,
      index_position: index,
    })
    setIsModalOpen(true)
  }

  // Convert "HH:mm:ss" → seconds
  const toSeconds = t => {
    if (!t) return 0
    const [h, m, s] = t.split(":").map(Number)
    return h * 3600 + m * 60 + (s || 0)
  }

  const generateSlots = (startTime, endTime, intervalMin) => {
    const format = "HH:mm:ss"
    let start = getZoneDateTime(startTime)
    const end = getZoneDateTime(endTime)

    const slots = []

    while (start < end) {
      const s = start.format(format)
      const e = start.clone().add(intervalMin, "minutes").format(format)

      slots.push({
        start_time: s,
        end_time: e,
      })

      start = getZoneDateTime(start).add(intervalMin, "minutes")
    }
    return slots
  }

  // filterTime format → "HH:mm:ss" or "HH:mm"
  const renderTableData = (filterTime = null) => {
    const filterSeconds = filterTime ? toSeconds(filterTime) : null

    return cabins.map(cabinNo => {
      const chair = rows?.items?.find(r => r.id == cabinNo)
      if (!chair) return null

      let slots = generateSlots(
        chair.start_time,
        chair.end_time,
        chair.intervel
      )

      // 🔥 Apply time filter if provided
      if (filterSeconds !== null) {
        slots = slots.filter(slot => {
          const s = toSeconds(slot.start_time)
          const e = toSeconds(slot.end_time)

          return filterSeconds >= s && filterSeconds <= e
        })
      }

      return {
        cabinNo,
        title: chair.title,
        doc_code: chair.client,
        slots,
      }
    })
  }

  const isPastSlot = slotStartTime => {
    const slotDateTime = getZoneDateTime(
      `${getZoneDateTime().format("YYYY-MM-DD")} ${slotStartTime}`
    )

    return slotDateTime.isBefore(getZoneDateTime())
  }

  useEffect(() => {
    setTableData(renderTableData(selectedTime))
  }, [cabins, rows, hours, selectedTime])

  const handleCancelBooking = id => {
    showDeleteConfirmationWithText(async note => {
      await del(`${APPOINTMENT_URL}/${id}?note=${note}`)
      getTodoListData()
    }, "Reason for canceling this appointment")
  }

  const handleModifyBooking = (bookingData, cabin) => {
    const date = getZoneDateTime(bookingData?.start).format("YYYY-MM-DD")
    const hour = getZoneDateTime(bookingData?.start).format("HH:mm")

    const selectedDoc = DDoptions?.doctors?.filter(
      v => bookingData?.doctor?.code == v.value
    )

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
    })

    setIsModalOpen(true)
  }

  const handleReportingTime = async (id, time) => {
    const res = await get(`${APPOINTMENT_URL}/reporting?id=${id}&time=${time}`)
    if (res.success) {
      showSuccessAlert("Reporting time updated successfully!")
      setIsModalOpen(false)
      setAppointment({})
      getTodoListData()
    }
  }

  // if (isLoading) {
  // return (
  //   <div className="text-center mt-5">
  //     <div className="spinner-border text-primary" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //   </div>
  // )
  // }

  const selectableSlots = useMemo(() => {
    if (!tableData || !todoListData) return []

    const bookedPositions = new Set(
      todoListData
        .filter(v => v.canceled_at == "Invalid date")
        .map(v => v.index_position)
    )

    const slots = []

    tableData.forEach((chair, chairIndex) => {
      chair.slots.forEach((slot, slotIndex) => {
        const position = `${chairIndex}${slotIndex}`

        if (!bookedPositions.has(position)) {
          slots.push({
            chairTitle: chair.title,
            chairId: chair.cabinNo,
            index_position: position,
            start: slot.start_time,
            end: slot.end_time,
            chair,
          })
        }
      })
    })

    return slots
  }, [tableData, todoListData])

  const [assigningAppointment, setAssigningAppointment] = useState(null)
  const [selectedChair, setSelectedChair] = useState(null)

  const chairOptions = useMemo(() => {
    const map = {}

    selectableSlots.forEach(slot => {
      // if (!isPastSlot(slot.start)) return // skip past slots

      if (!map[slot.chairTitle]) {
        map[slot.chairTitle] = {
          label: slot.chairTitle,
          value: slot.chairId,
          slots: [],
        }
      }
      map[slot.chairTitle].slots.push(slot)
    })

    return Object.values(map)
  }, [selectableSlots])

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

          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Non-Chair Scheduled Appointments</h5>
              <div className="d-flex flex-wrap gap-3">
                {nonScheduledAppointments.length > 0 ? (
                  nonScheduledAppointments.map((bookedItem, index) => (
                    <div
                      key={index}
                      className="shadow-sm border rounded p-3 bg-white"
                      style={{ width: "200px" }}
                    >
                      <div className="mb-2">
                        <div className="fw-bold">
                          Case No: {bookedItem.patient?.case_no ?? "—"}
                        </div>
                        <div>
                          Patient: {bookedItem.patient?.first_name}{" "}
                          {bookedItem.patient?.last_name ?? ""}
                        </div>
                        <div>Contact: {bookedItem.patient?.mobile ?? "—"}</div>
                      </div>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => {
                          setAssigningAppointment(bookedItem)
                          setIsModalOpen(true)
                        }}
                      >
                        Assign Chair
                      </button>
                    </div>
                  ))
                ) : (
                  <div>No non-chair scheduled appointments.</div>
                )}
              </div>
            </div>
          </div>

          {/* Hour Filter */}
          <div className="d-flex gap-2 overflow-auto mb-3 pb-2">
            {hours.map(h => (
              <span
                key={h}
                onClick={() => setSelectedTime(h)}
                className={`px-3 py-2 rounded fw-bold cursor-pointer shadow-sm 
                                    ${
                                      selectedTime === h
                                        ? "bg-primary text-white"
                                        : "bg-light"
                                    }`}
              >
                {h}
              </span>
            ))}

            {/* Reset */}
            <span
              onClick={() => setSelectedTime(null)}
              className="px-3 py-2 bg-secondary text-white rounded fw-bold cursor-pointer shadow-sm"
            >
              All
            </span>
          </div>

          <div className="row" style={{ justifyCntent: "space-around" }}>
            {tableData?.map(
              (chair, chairIndex) =>
                chair.slots.length > 0 && (
                  <div key={chairIndex} className="col-12 col-md-6">
                    <div className="card shadow-sm p-3 position-relative">
                      <h5 className="text-primary mb-3">{chair.title}</h5>
                      {chair.slots.map((slot, slotIndex) => {
                        const startTime = getZoneDateTime(slot.start_time)
                        const endTime = getZoneDateTime(slot.end_time)
                        const displayTime = `${startTime.format(
                          "hh:mm A"
                        )} - ${endTime.format("hh:mm A")}`

                        const bookedItem = todoListData
                          ?.filter(v => v.canceled_at === "Invalid date")
                          ?.find(
                            v =>
                              v.index_position === `${chairIndex}${slotIndex}`
                          )

                        const isPast = isPastSlot(slot.start_time)
                        const isCurrent =
                          !bookedItem &&
                          !isPast &&
                          startTime.isBefore(getZoneDateTime()) &&
                          endTime.isAfter(getZoneDateTime())

                        // Slot styling
                        const slotStyle = {
                          borderRadius: "8px",
                          padding: "12px",
                          margin: "6px ",
                          textAlign: "center",
                          transition: "0.3s",
                          border: bookedItem
                            ? "2px solid #f0ad4e"
                            : isCurrent
                            ? "2px solid #198754"
                            : isPast
                            ? "2px solid #ccc"
                            : "2px solid #0d6efd",
                          backgroundColor: bookedItem
                            ? "#fff8e1"
                            : isCurrent
                            ? "#d1e7dd"
                            : isPast
                            ? "#f8f9fa"
                            : "#e7f1ff",
                        }

                        return (
                          // !isPast ? (
                          <div className="row m-0" key={slotIndex}>
                            <div className="col-12" style={slotStyle}>
                              <div
                                className="fw-bold mb-2"
                                style={{
                                  fontSize: "15px",
                                  color: bookedItem
                                    ? "#d48806"
                                    : isPast
                                    ? "#6c757d"
                                    : isCurrent
                                    ? "#198754"
                                    : "#0d6efd",
                                }}
                              >
                                {displayTime}
                              </div>

                              {!bookedItem ? (
                                !isPast ? (
                                  <button
                                    className="btn btn-primary btn-sm w-100"
                                    onClick={() =>
                                      handleModalForBookSlot(
                                        chair,
                                        slot.start_time,
                                        `${chairIndex}${slotIndex}`
                                      )
                                    }
                                  >
                                    Book
                                  </button>
                                ) : (
                                  <div className="text-muted small">
                                    Time Passed
                                  </div>
                                )
                              ) : bookedItem.is_show ? (
                                bookedItem.reporting_time ? (
                                  <div className="row m-0">
                                    <div className="col-10 mb-2 text-start">
                                      <div className="fw-semibold">
                                        <b>
                                          Case No:{" "}
                                          {bookedItem.patient?.case_no ?? "—"}
                                        </b>
                                      </div>
                                      <div>
                                        Patient:{" "}
                                        <b>
                                          {bookedItem.patient?.first_name}{" "}
                                          {bookedItem.patient?.last_name}
                                        </b>
                                      </div>
                                      <div>
                                        Contact:{" "}
                                        <b>{bookedItem.patient?.mobile}</b>
                                      </div>
                                      <div className="text-success fw-semibold">
                                        <b style={{ fontSize: "16px" }}>
                                          Reported:{" "}
                                          {getZoneDateTime(
                                            bookedItem.reporting_time
                                          ).format("hh:mm A")}
                                        </b>
                                      </div>
                                    </div>
                                    <div
                                      className="col-2"
                                      style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "16px",
                                      }}
                                    >
                                      <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                          handleModifyBooking(bookedItem, chair)
                                        }
                                        title="Modify"
                                        style={{
                                          width: "92px",
                                          height: "36px",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        <i className="bx bxs-analyse"></i>{" "}
                                        Modify
                                      </button>
                                      <br />
                                      <a
                                        className="btn btn-info"
                                        href={`/patient?_p=${bookedItem.patient_id}`}
                                        title="View"
                                        style={{
                                          width: "92px",
                                          height: "36px",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        <i className="fas fa-eye"></i> View
                                      </a>
                                      <br />
                                      <button
                                        className="btn btn-success"
                                        onClick={toggleModal}
                                        title="Notify"
                                        style={{
                                          width: "92px",
                                          height: "36px",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        <i className="fab fa-whatsapp"></i>{" "}
                                        Notify
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="mb-2 text-start">
                                      <div className="fw-semibold">
                                        Case No:{" "}
                                        {bookedItem.patient?.case_no ?? "—"}
                                      </div>
                                      <div>
                                        Patient:{" "}
                                        {bookedItem.patient?.first_name}{" "}
                                        {bookedItem.patient?.last_name}
                                      </div>
                                      <div>
                                        Contact: {bookedItem.patient?.mobile}
                                      </div>
                                    </div>
                                    <button
                                      className="btn btn-warning w-100"
                                      onClick={() =>
                                        handleReportingTime(
                                          bookedItem.id,
                                          getZoneDateTime().toISOString()
                                        )
                                      }
                                    >
                                      Reported
                                    </button>
                                  </>
                                )
                              ) : (
                                <div className="fw-semibold text-muted">
                                  Booked
                                </div>
                              )}
                            </div>
                          </div>
                          // ) : (
                          //   ""
                        )
                      })}
                    </div>
                  </div>
                )
            )}
          </div>
        </Container>

        {/* Appointment Modal */}
        <Modal size="lg" isOpen={isModalOpen} toggle={toggleModal}>
          <div className="modal-header">
            <h5 className="modal-title">Appointment</h5>
            <button className="btn-close" onClick={toggleModal}></button>
          </div>

          <div className="modal-body">
            {assigningAppointment && (
              <>
                {/* Chair dropdown */}
                <Select
                  options={chairOptions}
                  value={selectedChair}
                  onChange={chair => setSelectedChair(chair)}
                  placeholder="Select Chair"
                />

                {/* Time slots for selected chair */}
                {selectedChair && selectedChair.slots.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {selectedChair.slots.map(slot => (
                      <div
                        key={slot.index_position}
                        className="border rounded p-2 bg-light cursor-pointer"
                        style={{ width: 180 }}
                        onClick={() => {
                          setAppointment({
                            id: assigningAppointment.id,
                            patient_id: assigningAppointment.patient_id,
                            chair_code: slot.chairId,
                            index_position: slot.index_position,
                            chairdata: slot.chair,
                            appointment_date: `${getZoneDateTime().format(
                              "YYYY-MM-DD"
                            )} ${slot.start}`,
                          })
                        }}
                      >
                        <div>
                          {slot.start} - {slot.end}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
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
                        v => v.value == appointment?.patient_id
                      ) || null
                    }
                    onChange={x =>
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
                        v => v.value == appointment?.doctor_code
                      ) || null
                    }
                    onChange={x =>
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
                        v => v.value == appointment?.treatment_code
                      ) || null
                    }
                    onChange={x =>
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
                    onChange={e =>
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
  )
}

export default WelcomeChairScreen
