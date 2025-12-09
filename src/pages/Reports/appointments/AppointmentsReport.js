import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'token', text: 'Token' },
    { dataField: 'appointment_date', text: 'Date' },
    { dataField: 'patient.full_name', text: 'Patient' },
    { dataField: 'doctor.name', text: 'Doctor' },
    { dataField: 'is_visited', text: 'Visited', formatter: (cell) => cell == 0 ? "Pending" : "Visited" },
    { dataField: 'arravel_time', text: 'Arraved at' },
    { dataField: 'notes', text: 'Note' },
]

const AppointmentsReport = () => {
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
        const { success, body } = await get(`reports/appointments?${query}`);

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
            <Filters hasFilter={{ date: true, doctor: true, status: true, patient: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Appointment Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default AppointmentsReport;