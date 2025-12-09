import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'date', text: 'Date' },
    { dataField: 'full_name', text: 'Full Name' },
    { dataField: 'mobile', text: 'Mobile' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'reference_type', text: 'Reference Type' },
    { dataField: 'reference', text: 'Reference' },
];

const ReferenceReport = () => {
    const [rows, setRows] = useState([])

    const fatchData = async (e) => {
        const query = Object.entries(e)
            .filter(([_, value]) =>
                value !== undefined &&
                value !== null &&
                value !== '' &&
                !Array.isArray(value) &&
                typeof value !== 'object'
            )
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        const { success, body } = await get(`reports/references-reports?${query}`);

        if (success) {
            setRows(body);
        }
    }
    const handleSubmit = (e) => {
        fatchData(e);
    }

    return (
        <>
            <Filters hasFilter={{ date: true, referrerTypes: true }} callBack={handleSubmit} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="References Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default ReferenceReport;