import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";
import Timezone from "../../utils/timezone";

const GeneralReportTypes = [
    { label: "Birth Day Report", value: "Birth Day Report" },
];

const GeneralReport = () => {
    const [rows, setRows] = useState([]);
    const [options, setOptions] = useState({ GeneralReport: [] });
    const [filterData, setFilterData] = useState({});
    const [registrationRange, setRegistrationRange] = useState([new Date(), new Date()]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { dataField: 'id', text: '#' },
        { dataField: 'patient_id', text: 'Patient' },
        { dataField: 'payment_type', text: 'Payment Type' },
        { dataField: 'mobile', text: 'Mobile' },
    ];

    useEffect(() => {
        // Set static payment types
        setOptions({ GeneralReport: GeneralReportTypes });
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            GeneralReportTypes: filterData?.GeneralReport?.value || null,
            registrationFrom: registrationRange[0],
            registrationTo: registrationRange[1],
        };

        console.log("Submitted Data:", payload);
        setLoading(false);
    }

    return (
        <>
            <Row style={{ marginBottom: '-16px' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <label>General Report</label>
                                    <Select id="generalReport" className="basic-single" isClearable={true} isSearchable={true} options={options?.GeneralReport} value={filterData?.GeneralReport}
                                        onChange={(selectedOption) => setFilterData(prev => ({ ...prev, GeneralReport: selectedOption }))} placeholder="Select Outstanding Options" />
                                </Col>
                                <Col>
                                    <label>Registration Date</label>
                                    <Flatpickr className="form-control d-block" placeholder="MM, DD, YYYY" value={registrationRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                                        onChange={(dates) => {
                                            const converted = dates.map(date => Timezone(date));
                                            setRegistrationRange(converted);
                                        }} />
                                </Col>
                                <Col className='mt-1'>
                                    <button className='btn btn-primary mt-4' onClick={handleSubmit}> {loading ? "Loading..." : "Filter Data"} </button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Datatables
                isSearch={true}
                columns={columns}
                showTableOnly={true}
                rowsLength={rows?.length || 0}
                rows={rows || []}
                keyField={'id'}
                title="Outstanding Report's"
                isAdd={false}
                isTableHead={true}
                loading={loading}
                ssr={() => { }}
            />
        </>
    );
};

export default GeneralReport;
