import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';


// tableColumns.js
export const ManageBankDepositColumns = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'deposit_date', text: 'Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD'), },
  {
    dataField: 'bank_name',
    text: 'Bank Name',
    formatter: (cell, row) => row.bank?.bank_name
  },
  {
    dataField: 'branch',
    text: 'Branch',
    formatter: (cell, row) => row.bank?.branch
  },
  {
    dataField: 'ac_no',
    text: 'Account Number',
    formatter: (cell, row) => row.bank?.ac_no
  },
  { dataField: 'reference_no', text: 'Transaction ID' },
  { dataField: 'deposit_amount', text: 'Price' },
  {
    dataField: 'actions',
    text: '',
    isDummyField: true,
    // eslint-disable-next-line react/display-name
    formatter: (cell, row) => (
      <>
        <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
          <i className="fas fa-pencil-alt" />
        </a>
        {' '}
        <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Restore' : 'Delete'}>
          <i className="fas fa-trash-alt" />
        </a>
      </>
    )
  }
];


