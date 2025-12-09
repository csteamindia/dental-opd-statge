import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'full_name', text: 'Full Name' },
    { dataField: 'dob', text: 'Date Of Birth' },
    { dataField: 'case_no', text: 'Case No' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'mobile', text: 'Mobile' },
];


const BirthdayReport = () => {
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
        const { success, body } = await get(`reports/birthdays?${query}&is_report=1`);

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
            <Filters hasFilter={{ birthdayRange: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Birthday Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default BirthdayReport;


// import React, { useEffect, useState } from 'react';
// import { get } from 'helpers/api_helper';
// import Datatables from 'pages/utils/table/datatable';
// import Filters from '../filters';

// const columns = [
//     { dataField: 'id', text: '#' },
//     { dataField: 'full_name', text: 'Full Name' },
//     { dataField: 'case_no', text: 'Case No' },
//     { dataField: 'dob', text: 'Date Of Birth' },
//     { dataField: 'email', text: 'Email' },
//     { dataField: 'mobile', text: 'Mobile' },
// ];

// const BirthdayReport = () => {
//     const [rows, setRows] = useState([]);
//     const [filterData, setFilterData] = useState();

//     const fetchData = async () => {
//         const query = Object.entries(filterData)
//             .filter(([_, value]) =>
//                 value !== undefined &&
//                 value !== null &&
//                 value !== '' &&
//                 (typeof value !== 'object' || Array.isArray(value))
//             )
//             .flatMap(([key, value]) =>
//                 Array.isArray(value)
//                     ? value.map((v, i) => [`${key}[${i}]`, v])
//                     : [[key, value]]
//             )
//             .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
//             .join('&');

//         const { success, body } = await get(`reports/birthdays?${query}`);
//         if (success) setRows(body);
//     };

//     useEffect(() => {
//         if (filterData)
//             fetchData();
//     }, [filterData]);

//     return (
//         <>
//             <Filters hasFilter={{ date: true }} callBack={(e) => setFilterData(e)} />
//             <Datatables
//                 isSearch={true}
//                 columns={columns}
//                 showTableOnly={true}
//                 rowsLength={rows?.count || 0}
//                 rows={rows?.rows || []}
//                 keyField={'id'}
//                 title="Birthday Report's"
//                 isAdd={false}
//                 isTableHead={true}
//                 ssr={() => { }}
//             />
//         </>
//     );
// };

// export default BirthdayReport;
