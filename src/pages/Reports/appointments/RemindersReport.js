import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css"
import Flatpickr from "react-flatpickr"
import Timezone from "../../utils/timezone";

const RemindersReport = () => {
    const [rows, setRows] = useState([])
    const [filterData, setFilterData] = useState([])
    const [options, setOptions] = useState({
        doctors: []
    })

    const [dateRange, setDateRange] = useState([
        new Date(),
        new Date()
    ]);


    return (
        <>
            <Row style={{ marginBottom: '-16px' }}>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <label>By Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={options?.doctors}
                                        value={filterData?.doctor_code || []}
                                        onChange={(selectedOption) => {
                                            setFilterData((prev) => ({
                                                ...prev, doctor_code: selectedOption
                                            }))
                                        }}
                                        placeholder="Select Doctor" />
                                </Col>
                                <Col md={4}>
                                    <label>By Date</label>
                                    <Flatpickr className="form-control d-block" placeholder="MM, DD, YYYY" value={dateRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }} onChange={(e) => { const dates = e.map(dateString => Timezone(dateString)); setDateRange(dates) }} />
                                </Col>
                                <Col md={2} className='mt-1'>
                                    <button className='btn btn-primary mt-4'> Filter Data </button>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Datatables
                isSearch={true}
                columns={[]}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows.items || []}
                keyField={'id'}
                title="Reminders Report's"
                isAdd={false}
                isTableHead={true}
                ssr={() => { }}
            />
        </>

    )
}

export default RemindersReport;