import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'treatment_date', text: 'Date', formatter: (cell) => cell ? new Date(cell).toLocaleDateString() : 'N/A' },
    { dataField: 'doctor', text: 'Doctor' },
    { dataField: 'patients.full_name', text: 'Patient Name', formatter: (cell, row) => row.patients?.full_name || 'N/A' },
    { dataField: 'tooths', text: 'Tooths' },
    { dataField: 'treatment_type', text: 'Treatment Type' },
    { dataField: 'is_billed', text: 'Billed', formatter: (cell) => cell ? 'Yes' : 'No' },
    { dataField: 'billed_date', text: 'Billed Date', formatter: (cell) => cell ? new Date(cell).toLocaleDateString() : 'N/A' },
];

const DoctorReport = () => {
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
        const { success, body } = await get(`reports/doctors-work?${query}&is_report=1`);

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
            <Filters hasFilter={{ date: true, doctor: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Doctors Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default DoctorReport;