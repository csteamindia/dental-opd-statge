import React from 'react';

export const CommunicationAttributeColumn = (handleEdit, handleDelete) => [
  { dataField: 'id', text: '#' },
  { dataField: 'title', text: 'Title' },
  { dataField: '', text: 'Scheduled Time' },
  {
    // eslint-disable-next-line react/display-name
    formatter: (cell) => (
      <span className={`badge ${cell ? 'bg-success' : 'bg-secondary'}`}>
        {cell ? 'ON' : 'OFF'}
      </span>
    )
  },
  // {
  //   dataField: 'actions',
  //   text: 'Actions',
  //   isDummyField: true,
  //   // eslint-disable-next-line react/display-name
  //   formatter: (cell, row) => (
  //     <>
  //       <a href="#" className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(row)} title="Edit">
  //         <i className="fas fa-pencil-alt" />
  //       </a>
  //       <a href="#" className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id, row.status ? 0 : 1, row.code)} title={row.status ? 'Disable' : 'Enable'}>
  //         <i className="fas fa-trash-alt" />
  //       </a>
  //     </>
  //   )
  // }
];
