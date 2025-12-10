import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'date', text: 'Date', formatter: (cell) => cell ? new Date(cell).toLocaleDateString() : 'N/A' },
    { dataField: 'doctor', text: 'Doctor' },
    { dataField: 'patients.full_name', text: 'Patient Name', formatter: (cell, row) => row.patients?.full_name || 'N/A' },
    { dataField: 'tooths', text: 'Tooths' },
    { dataField: 'treatment_date', text: 'Treatment Date', formatter: (cell) => cell ? new Date(cell).toLocaleDateString() : 'N/A' },
    { dataField: 'is_billed', text: 'Billed', formatter: (cell) => cell ? 'Yes' : 'No' },
];


const PatientFeedback = () => {
    const [rows, setRows] = useState([])
    const [filterData, setFilterData] = useState()
    const fatchData = async () => {
        const { success, body } = await get(`feedbacks/genaral`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fatchData()
    }, [])

    return (
        <>
            <Filters hasFilter={{ date: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Feedbacks"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default PatientFeedback;