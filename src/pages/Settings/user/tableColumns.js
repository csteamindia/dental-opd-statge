import React from 'react';
import { Link } from 'react-router-dom';

export let ManageClinicColumns = [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)   },
  { dataField: 'clinic_name', text: 'Clinic Name' },
  { dataField: 'doctor_name', text: 'Doctor Name' },
  { dataField: 'email', text: 'Email' },
  { dataField: 'phone', text: 'Phone' },
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

export let ManageDoctorColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)   },
  { dataField: 'name', text: 'Docotr Name', formatter: (cell, row) => (
    <>
      <i className="fas fa-circle" style={{ color: row.color_code, marginRight: '5px' }} />
      {cell}
    </>
  )},
  { dataField: 'email', text: 'Email' },
  { dataField: 'mobile', text: 'Mobile' },
  { dataField: 'clinic', text: 'Clinic', formatter: (cell, row) => row.clinic?.clinic_name },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => <>
      <Link to="#" className="btn btn-primary btn-sm edit me-2" onClick={() => callback?.edit(row)} title="Edit" > <i className="fas fa-pencil-alt" /></Link>
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} > <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} /> </Link>
    </>
  }
];

