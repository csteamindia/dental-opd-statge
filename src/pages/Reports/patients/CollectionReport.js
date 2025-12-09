import React, { useEffect, useState } from 'react';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Filters from '../filters';

const columns = [
    { dataField: 'id', text: '#' },
    { dataField: 'date', text: 'Registration Date' },
    { dataField: 'daysRange', text: 'Days Range' },
    { dataField: 'PaymentType', text: 'Payment Type' },
];


const CollectionReport = () => {
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
        const { success, body } = await get(`reports/patients?${query}`);

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
            <Filters hasFilter={{ registrationRange: true, daysRange: true, paymentType: true }} callBack={(e) => setFilterData(e)} />
            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.count || 0}
                rows={rows?.rows || []}
                keyField={'id'}
                title="Collection Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default CollectionReport;



// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, CardBody } from 'reactstrap';
// import { get, post } from 'helpers/api_helper';
// import Datatables from 'pages/utils/table/datatable';
// import Select from "react-select";
// import "flatpickr/dist/themes/material_red.css";
// import Flatpickr from "react-flatpickr";
// import Timezone from "../../utils/timezone";

// const daysRange = [
//     { label: "Yearly", value: "Yearly" },
//     { label: "Monthly", value: "Monthly" },
//     { label: "Daily", value: "Daily" },
// ];

// const paymentTypes = [
//     { label: "All", value: "All" },
//     { label: "Cash", value: "Cash" },
//     { label: "Cheque", value: "Cheque" },
//     { label: "Card", value: "Card" },
//     { label: "RTGS", value: "RTGS" },
//     { label: "NEFT", value: "NEFT" },
//     { label: "Paytm Wallet", value: "Paytm Wallet" },
//     { label: "Google Pay", value: "Google Pay" },
// ];

// const CollectionReport = () => {
//     const [rows, setRows] = useState([]);
//     const [options, setOptions] = useState({ paymentType: [] });
//     const [filterData, setFilterData] = useState({});
//     const [registrationRange, setRegistrationRange] = useState([new Date(), new Date()]);
//     const [loading, setLoading] = useState(false);

//     const columns = [
//         { dataField: 'id', text: '#' },
//         { dataField: 'patient_id', text: 'Patient' },
//         { dataField: 'payment_type', text: 'Payment Type' },
//         { dataField: 'mobile', text: 'Mobile' },
//     ];

//     useEffect(() => {
//         // Set static payment types
//         setOptions({ paymentType: paymentTypes });
//     }, []);

//     const handleSubmit = async () => {
//         setLoading(true);
//         const payload = {
//             daysRange: filterData?.daysRange?.value || null,
//             paymentType: filterData?.paymentType?.value || null,
//             registrationFrom: registrationRange[0],
//             registrationTo: registrationRange[1],
//         };

//         console.log("Submitted Data:", payload);
//         setLoading(false);
//     }

//     return (
//         <>
//             <Row style={{ marginBottom: '-16px' }}>
//                 <Col>
//                     <Card>
//                         <CardBody>
//                             <Row>
//                                 <Col>
//                                     <label>Range</label>
//                                     <Select id="daysRange" className="basic-single" isClearable={true} isSearchable={true} options={daysRange} value={filterData?.daysRange}
//                                         onChange={(selectedOption) => setFilterData(prev => ({ ...prev, daysRange: selectedOption }))} placeholder="Select Days Range" />
//                                 </Col>
//                                 <Col>
//                                     <label>Payment Type</label>
//                                     <Select id="paymentType" className="basic-single" isClearable={true} isSearchable={true} options={options?.paymentType} value={filterData?.paymentType}
//                                         onChange={(selectedOption) => setFilterData(prev => ({ ...prev, paymentType: selectedOption }))} placeholder="Select Payment Type" />
//                                 </Col>
//                                 <Col>
//                                     <label>Registration Date</label>
//                                     <Flatpickr className="form-control d-block" placeholder="MM, DD, YYYY" value={registrationRange}
//                                         options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
//                                         onChange={(dates) => {
//                                             const converted = dates.map(date => Timezone(date));
//                                             setRegistrationRange(converted);
//                                         }} />
//                                 </Col>
//                                 <Col className='mt-1'>
//                                     <button className='btn btn-primary mt-4' onClick={handleSubmit}> {loading ? "Loading..." : "Filter Data"} </button>
//                                 </Col>
//                             </Row>
//                         </CardBody>
//                     </Card>
//                 </Col>
//             </Row>

//             <Datatables
//                 isSearch={true}
//                 columns={columns}
//                 showTableOnly={true}
//                 rowsLength={rows?.length || 0}
//                 rows={rows || []}
//                 keyField={'id'}
//                 title="Collection Report's"
//                 isAdd={false}
//                 isTableHead={true}
//                 loading={loading}
//                 ssr={() => { }}
//             />
//         </>
//     );
// };

// export default CollectionReport;
