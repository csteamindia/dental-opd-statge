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


const EmailReport = () => {
    const [rows, setRows] = useState([])
    const [filterData, setFilterData] = useState()

    const fatchData = async () => {
        const query = Object.entries(filterData)
            .filter(([_, value]) =>
                value !== undefined &&
                value !== null &&
                value !== '' &&
                !Array.isArray(value) &&
                typeof value !== 'object'
            )
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const { success, body } = await get(`reports/doctors-work?${query}`);

        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        if (filterData)
            fatchData()
    }, [filterData])


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
                title="Email Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default EmailReport;