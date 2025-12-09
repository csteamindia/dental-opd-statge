import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

export let ManageTreatmentsColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)},
  { dataField: 'title', text: 'Title' },
  { dataField: 'cost', text: 'Cost' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManagePrescriptionColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'deposit_date', text: 'Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD'), },
  { dataField: 'doctor', text: 'Doctor', formatter: (cell, row) => row.doctor?.name, },
  { dataField: 'title', text: 'Prescription' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.view(row)} title="Edit" >
        <i className="fas fa-eye" />
      </Link>
      {' '}
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManageExaminationsColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'examination_date', text: 'Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD'), },
  { dataField: 'doctor', text: 'Doctor', formatter: (cell, row) => row.doctors?.name },
  {
    dataField: 'action1', text: 'Chief Complaint', isDummyField: true,
    formatter: (cell, row) => {
      const t = JSON.parse(row?.tooth)
      return <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {t['complaint']?.map((v, i) => (
          <li key={i}>{v.label}</li>
        ))}
      </ul>
    }
  },
  {
    dataField: 'action2', text: 'Diagnosis', isDummyField: true,
    formatter: (cell, row) => {
      const t = JSON.parse(row.tooth)
      return <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {t['diagnosis']?.map((v, i) => (
          <li key={i}>{v.label}</li>
        ))}
      </ul>
    }
  },
  { dataField: 'remark', text: 'Note' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManageInvestigationColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'examination_date', text: 'Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD') },
  { dataField: 'doctor_id', text: 'Doctor', formatter: (cell, row) => row.doctor?.name },
  { dataField: 'temperature', text: 'Temperature' },
  { dataField: 'blood_pressure', text: 'Blood Pressure' },
  { dataField: 'blood_sugar', text: 'Blood Sugar' },
  { dataField: 'auscultation', text: 'Auscultation' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManageAppointmentColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'appointment_date', text: 'Appointment Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD'), },
  { dataField: 'doctor_code', text: 'Doctor', formatter: (cell, row) => row.doctor?.name },
  {
    dataField: 'is_visited', text: 'Is Visited',
    formatter: (cell, row) => {
      if (row.is_visited == 1) {
        return <span className="text-success">Visited</span>
      }
      if (row.is_visited == 2) {
        return <span className="text-danger">Cancelled</span>
      }
      return <span className="text-warning">Pending</span>
    }
  },
  { dataField: 'appointment_valid', text: 'Arrival Time', },
  { dataField: 'notes', text: 'notes', },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManagePatientNotesColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'note_date', text: 'Notes Date', formatter: (cell) => cell ? moment(cell).format('YYYY-MM-DD') : 'N/A' },
  { dataField: 'doctor_code', text: 'Doctor', formatter: (cell, row) => row.doctor?.name },
  { dataField: 'note', text: 'View Notes', },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];

export let ManagePatientFollowUpColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    return (pagination?.page - 1) * pagination?.limit + (rowIndex + 1);
  } },
  { dataField: 'patient.mobile', text: 'Mobile Number' },
  { dataField: 'followup_date', text: 'Follow Up Date', formatter: (cell) => cell ? moment(cell).format('DD-MM-YYYY') : 'N/A' },
  { dataField: 'remark', text: 'Follow Up Reason' },
  { dataField: 'client.name', text: 'Followed By' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>
  }
];