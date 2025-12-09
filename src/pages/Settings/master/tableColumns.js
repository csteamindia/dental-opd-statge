import React from 'react';
import { Link } from 'react-router-dom';

export let ManageBankColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1) },
  { dataField: 'bank_name', text: 'Bank Name' },
  { dataField: 'ac_no', text: 'Account Number' },
  { dataField: 'ifsc_code', text: 'IFSC Code' },
  { dataField: 'branch', text: 'Branch' },
  { dataField: 'addrress', text: 'Address' },
  { dataField: 'ac_type', text: 'Account Type' },
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

export let ManageTreatmentsColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Title' },
  { dataField: 'cost', text: 'Cost' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => row.client_id ? 
      <>
        <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
          <i className="fas fa-pencil-alt" />
        </Link>
        {' '}
        <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
          <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
        </Link>
      </>: ''
  }
];

export let ManageMedicineColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'name', text: 'Name' },
  { dataField: 'dose', text: 'Dose' },
  { dataField: 'duration', text: 'Duration' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => row.client_id ? 
      <>
        <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
          <i className="fas fa-pencil-alt" />
        </Link>
        {' '}
        <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
          <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
        </Link>
      </>: ''
  }
];

export let ManageAllergiesColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Symptom / Title' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => row.client_id ? <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>: ''
  }
];

export let ManageCommunicationGroupColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Communication Group' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => row.client_id ? <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>: ''
  }
];

export let ManageTagColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Tag' },
  {
    dataField: 'actions', text: '', isDummyField: true,
    formatter: (cell, row) => row.client_id ? <>
      <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
        <i className="fas fa-pencil-alt" />
      </Link>
      {' '}
      <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
        <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
      </Link>
    </>: ''
  }
];

export let ManageChairsColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Title' },
  { dataField: 'cabin_no', text: 'Cabin No' },
  { dataField: 'start_time', text: 'Start Time' },
  { dataField: 'end_time', text: 'End Time' },
  { dataField: 'intervel', text: 'Intervel' },
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

export let ManageReferencesColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Title' },
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

export let ManageRXTemplatetColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Template Name' },
  { dataField: 'doctor_code', text: 'Doctor' },
  // { dataField: 'medicine_name', text: 'Medicine' },
  { dataField: 'note', text: 'Note' },
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

// export let ManageDentalChartColumns = (callback = {}) => [
//   { dataField: 'id', text: '#' },
//   { dataField: 'title', text: 'Examination Type' },
//   // { dataField: 'group', text: 'Examination Type Group', },
//   {
//     dataField: 'group',
//     text: 'Examination Type Group',
//     formatter: (cell) => (
//       <>
//         {cell.split(",").map((item, index) => (
//           <span key={index} className="badge bg-info text-dark me-1">{item.trim()}</span>
//         ))}
//       </>
//     )
//   },
//   {
//     dataField: 'actions', text: '', isDummyField: true,
//     formatter: (cell, row) => <>
//       <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
//         <i className="fas fa-pencil-alt" />
//       </Link>
//       {' '}
//       <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} >
//         <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
//       </Link>
//     </>
//   }
// ];
export let ManageDentalChartColumns = (callback = {}, pagination) => [
  { dataField: 'id', text: '#', formatter: (cell, row, rowIndex) => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return (page - 1) * limit + (rowIndex + 1);
  }},
  { dataField: 'title', text: 'Examination Type' },
  {
    dataField: 'group', text: 'Examination Type Group',
    formatter: (cell) => {
      let items = cell? JSON.parse(cell): []
      return (
        <ul style={{ paddingLeft: '20px', marginBottom: 0, }}>
          {items.map((item, i) => (
            <li key={i}>{item.value}</li>
          ))}
        </ul>
      );
    }

  },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    formatter: (cell, row) => (
      <>
        <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => callback?.edit(row)} title="Edit" >
          <i className="fas fa-pencil-alt" />
        </Link>{' '}
        <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`}
          onClick={() => callback?.delete(row.id, row.status === 1 ? 0 : 1, row.code)}
          title={row.status === 0 ? 'Delete' : 'Restore'}>
          <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} />
        </Link>
      </>
    )
  }
];


