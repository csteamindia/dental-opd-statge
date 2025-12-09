import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'date', text: 'Registration Date' },
    { dataField: 'case_no', text: 'Case No' },
    { dataField: 'full_name', text: 'Patient Name' },
    { dataField: 'doctors.name', text: 'Doctor', formatter: (cell, row) => row.doctors?.name || 'N/A', },
    { dataField: 'mobile', text: 'Mobile' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'communication_group', text: 'Communication Group' },
    { dataField: 'reference_type', text: 'Reference Type', formatter: (cell) => {
        switch(cell){
            case "Doc": return "Doctor";
            case "P": return "Patient";
            default: return "Other";
        }
    } },
];

const PatientReport = () => {
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
        const { success, body } = await get(`reports/patients?${query}&is_report=1`);

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
            <Filters hasFilter={{ doctor: true, genderOptions: true, patient: true, referrerTypes: true, referrerBy: true, communication: true, birthdayRange: true, registrationRange: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Patient Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default PatientReport;

