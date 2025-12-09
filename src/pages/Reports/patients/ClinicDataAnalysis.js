import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";
import Timezone from "../../utils/timezone";

const ClinicDataAnalysis = () => {
    const [rows, setRows] = useState([]);
    const [dataRange, setDataRange] = useState([new Date(), new Date()]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { dataField: 'id', text: '#' },
        { dataField: 'patient_id', text: 'Patient' },
        { dataField: 'doctor_id', text: 'Doctor' },
        { dataField: 'mobile', text: 'Mobile' },
    ];

    const handleSubmit = () => {
        setLoading(true);

        const payload = {
            dataRangeFrom: dataRange[0],
            dataRangeTo: dataRange[1],
        };

        console.log("Submitted Data:", payload);
        setLoading(false);
    };

    return (
        <>
            <Row style={{ marginBottom: '-16px' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
                                    <label>Date Range</label>
                                    <Flatpickr
                                        className="form-control d-block"
                                        placeholder="MM, DD, YYYY"
                                        value={dataRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                                        onChange={(dates) => {
                                            const converted = dates.map(date => Timezone(date));
                                            setDataRange(converted);
                                        }}
                                    />
                                </Col>
                                <Col className='mt-1'>
                                    <button className='btn btn-primary mt-4' onClick={handleSubmit} > {loading ? "Loading..." : "Filter Data"} </button>
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
                title="Clinic Data Analysis"
                isAdd={false}
                isTableHead={true}
                loading={loading}
                ssr={() => { }}
            />
        </>
    );
};

export default ClinicDataAnalysis;
