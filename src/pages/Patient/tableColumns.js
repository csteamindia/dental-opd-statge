import React from "react"
import { getZoneDateTime } from "../utils/timezone"

const formatLabel = str =>
  str
    ? str.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())
    : str

export let ManageTreatmentsColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) =>
      (pagination?.page - 1) * pagination?.limit + (rowIndex + 1),
  },
  { dataField: "title", text: "Title" },
  { dataField: "cost", text: "Cost" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.edit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>{" "}
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManagePrescriptionColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  {
    dataField: "deposit_date",
    text: "Date",
    formatter: cell => getZoneDateTime(cell).format("YYYY-MM-DD"),
  },
  {
    dataField: "doctor",
    text: "Doctor",
    formatter: (cell, row) => row.doctor?.name,
  },
  { dataField: "title", text: "Prescription" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.view(row)}
          title="Print"
        >
          <i className="fas fa-eye" />
        </button>{" "}
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.edit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>{" "}
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManageExaminationsColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  {
    dataField: "examination_date",
    text: "Date",
    formatter: cell => getZoneDateTime(cell).format("YYYY-MM-DD"),
  },
  {
    dataField: "doctor",
    text: "Doctor",
    formatter: (cell, row) => row.doctors?.name,
  },
  {
    dataField: "action1",
    text: "Chief Complaint",
    isDummyField: true,
    formatter: (cell, row) => {
      const t = JSON.parse(row?.tooth)
      return (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {t["complaint"]?.map((v, i) => (
            <li key={i}>{v.label}</li>
          ))}
        </ul>
      )
    },
  },
  {
    dataField: "action2",
    text: "Diagnosis",
    isDummyField: true,
    formatter: (cell, row) => {
      const t = JSON.parse(row.tooth)
      return (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {t["diagnosis"]?.map((v, i) => (
            <li key={i}>{v.label}</li>
          ))}
        </ul>
      )
    },
  },
  { dataField: "remark", text: "Note" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.edit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>{" "}
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManageInvestigationColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  {
    dataField: "examination_date",
    text: "Date",
    formatter: cell => getZoneDateTime(cell).format("YYYY-MM-DD"),
  },
  {
    dataField: "doctor_id",
    text: "Doctor",
    formatter: (cell, row) => row.doctor?.name,
  },
  { dataField: "temperature", text: "Temperature" },
  { dataField: "blood_pressure", text: "Blood Pressure" },
  { dataField: "blood_sugar", text: "Blood Sugar" },
  {
    dataField: "auscultation",
    text: "Auscultation",
    formatter: cell => formatLabel(cell),
  },
  {
    dataField: "other_type",
    text: "Other",
    formatter: cell => formatLabel(cell),
  },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.edit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>{" "}
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManageAppointmentColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  {
    dataField: "appointment_date",
    text: "Appointment Date",
    formatter: cell => getZoneDateTime(cell).format("YYYY-MM-DD"),
  },
  {
    dataField: "doctor_code",
    text: "Doctor",
    formatter: (cell, row) => row.doctor?.name,
  },
  {
    dataField: "is_visited",
    text: "Is Visited",
    formatter: (cell, row) => {
      if (row.is_visited == 1) {
        return <span className="text-success">Visited</span>
      }
      if (row.is_visited == 2) {
        return <span className="text-danger">Cancelled</span>
      }
      return <span className="text-warning">Pending</span>
    },
  },
  {
    dataField: "reporting_time",
    text: "Arrival Time",
    formatter: cell =>
      cell ? getZoneDateTime(cell).format("YYYY-MM-DD HH:mm") : "N/A",
  },
  { dataField: "treatment_time", text: "Treatment Time" },
  { dataField: "notes", text: "notes" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className="btn btn-primary btn-sm edit"
          onClick={() => callback?.edit(row)}
          title="Edit"
        >
          <i className="fas fa-pencil-alt" />
        </button>{" "}
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManagePatientNotesColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  {
    dataField: "note_date",
    text: "Notes Date",
    formatter: cell =>
      cell ? getZoneDateTime(cell).format("YYYY-MM-DD") : "N/A",
  },
  {
    dataField: "doctor_code",
    text: "Doctor",
    formatter: (cell, row) => row.doctor?.name,
  },
  { dataField: "note", text: "View Notes" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]

export let ManagePatientFollowUpColumns = (callback = {}, pagination) => [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => {
      return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)
    },
  },
  { dataField: "patient.mobile", text: "Mobile Number" },
  {
    dataField: "followup_date",
    text: "Follow Up Date",
    formatter: cell =>
      cell ? getZoneDateTime(cell).format("DD-MM-YYYY") : "N/A",
  },
  { dataField: "remark", text: "Follow Up Reason" },
  { dataField: "client.name", text: "Followed By" },
  {
    dataField: "actions",
    text: "",
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <button
          className={`btn btn-${
            row.status === 0 ? "danger" : "success"
          } btn-sm edit`}
          onClick={() =>
            callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)
          }
          title={row.status === 0 ? "Delete" : "Restore"}
        >
          <i
            className={`fas ${row.status == 0 ? "fa-trash-alt" : "fa-check"}`}
          />
        </button>
      </>
    ),
  },
]
