import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'file_type', text: 'File Type' },
    // {
    //     dataField: 'file_path',
    //     text: 'File Path',
    //     formatter: (cell, row) => {
    //         if (Array.isArray(row.file_path) && row.file_path.length > 0) { return row.file_path.map(f => (`<a href="${f.path}" target="_blank">${f.originalname}</a>`)).join('<br/>'); }
    //         return 'N/A';
    //     }
    // },
    { dataField: 'patients.full_name', text: 'Patient Name', formatter: (cell, row) => row.patients?.full_name || 'N/A' },
    {
        dataField: 'created_datetime',
        text: 'Created Date Time',
        formatter: (cell) => new Date(cell).toLocaleString(), // optional formatting
    },
];


const PatientDocumentReport = () => {
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
        const { success, body } = await get(`reports/patient-files?${query}`);

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
            <Filters hasFilter={{ registrationRange: true, patientDocumentTypes: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Patient Document Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default PatientDocumentReport;