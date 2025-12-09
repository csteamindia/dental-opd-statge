import React, { useEffect, useState} from "react"
import Datatables from 'pages/utils/table/datatable';
import { PATIENT_URL } from "helpers/url_helper";
import { get } from "helpers/api_helper";
import { useHistory } from "react-router-dom";

const Patientslist = props => {
  const history = useHistory();
  const [ dataRows, setDataRows ] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    search: ''
  });

  const getPatients = async () => {
    const { success, body } = await get(`${PATIENT_URL}?limit=${pagination.limit}&page=${pagination.page}&q=${pagination.search}`);
    if(success){
      setDataRows(body); 
    }
  }

  useEffect(() => {
    getPatients();
  }, [pagination]);

  const columns = [
    { dataField: 'id', text: '#', style: { width: '20px' }, formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)},
    { 
      dataField: 'profile_pic', 
      text: 'Profile', 
      style: { width: '60px' },
      formatter: function ProfilePicFormatter(cell, row) {
        return (
          <img 
            src={`${process.env.REACT_APP_API_URL}${row.profile_pic}` || '/images/default-avatar.png'} 
            alt={`${row.first_name}'s profile`}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            }}
          />
        );
      }
    },
    { dataField: 'first_name', text: 'Patient Name', formatter: (cell, row) => `${row.first_name} ${row.last_name}`  },
    { dataField: 'case_no', text: 'Case #' },
    { dataField: 'gender', text: 'Gender' },
    { dataField: 'mobile', text: 'Mobile' },
    { dataField: 'email', text: 'Email' },
    {
      dataField: 'actions',
      text: '',
      style: { width: '60px' },
      isDummyField: true,
      // eslint-disable-next-line react/display-name
      formatter: (cell, row) => (
        <>
          <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit">
            <i className="fas fa-pencil-alt" />
          </a>
          {' '}
          <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1, row.code)} title={row.status == 0 ? 'Delete' : 'Restore'}>
            <i className="fas fa-trash-alt" />
          </a>
        </>
      )
    }
  ];

  const handleRowClick = (row) => {
    history.push({
      pathname: '/patient',
      search: `?_p=${row.id}`,
      state: { patientData: row }
    });
  }

  return (
    <Datatables
      isSearch={true}
      columns={columns}
      showTableOnly={true}
      rowsLength={dataRows?.totalItems || 0}
      rows={dataRows.items || []}
      keyField={'id'}
      title="All patients"
      isAdd={false}
      isTableHead={true}
      onRowClick={handleRowClick}
      rowClasses="cursor-pointer hover:bg-gray-100"
      ssr={() => setPagination}
    />
  )
}

export default Patientslist;