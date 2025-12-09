import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';
import { INVESTIONGATIONS_URL, PATIENT_URL } from 'helpers/url_helper';
import Datatables from 'pages/utils/table/datatable';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css";
import Flatpickr from "react-flatpickr";
import Timezone from "../../utils/timezone";

const ActivityTypeOptions = [
    { label: "Patients", value: "Patients" },
    { label: "Appointments", value: "Appointments" },
    { label: "Treatments", value: "Treatments" },
    { label: "Collections", value: "Collections" },
];
const AnalyticsTypeOptions = [
    { label: "Yearly", value: "Yearly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Daily", value: "Daily" },
];

const ClinicDashboard = ({ patientData }) => {
    const [rows, setRows] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filterData, setFilterData] = useState({});
    const [dataRange, setDataRange] = useState([new Date(), new Date()]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const columns = [
        { dataField: 'id', text: '#' },
        { dataField: 'patient_id', text: 'Patient' },
        { dataField: 'doctor_id', text: 'Doctor' },
        { dataField: 'mobile', text: 'Mobile' },
    ];

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${INVESTIONGATIONS_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        setRows(success ? (Array.isArray(body) ? body : body?.data || []) : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors`);
        if (success) setDoctors(body);
    };

    useEffect(() => {
        getExtraData();
    }, []);

    const handleChange = (field, value) => {
        setFilterData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        setLoading(true);

        const payload = {
            doctor: filterData?.doctor_code?.map(d => d.value) || [],
            ActivityType: filterData?.ActivityTypeOptions?.map(t => t.value) || [],
            AnalyticsType: filterData?.AnalyticsTypeOptions?.map(t => t.value) || [],
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
                                    <label>Doctor</label>
                                    <Select id="doctor" className="basic-single"
                                        isMulti={true} isClearable={true} isSearchable={true}
                                        options={doctors} value={filterData.doctor_code}
                                        onChange={val => handleChange('doctor_code', val)}
                                        placeholder="Select Doctor" />
                                </Col>
                                <Col>
                                    <label>Activity Type</label>
                                    <Select id="activityTypeOptions" className="basic-single" isClearable={true} isSearchable={true}
                                        options={ActivityTypeOptions} value={filterData?.ActivityTypeOptions}
                                        onChange={(selectedOption) => setFilterData(prev => ({ ...prev, ActivityTypeOptions: selectedOption }))}
                                        placeholder="Select Activity" />
                                </Col>
                                <Col>
                                    <label>Analytics Type</label>
                                    <Select id="analyticsTypeOptions" className="basic-single" isClearable={true} isSearchable={true}
                                        options={AnalyticsTypeOptions} value={filterData?.AnalyticsTypeOptions}
                                        onChange={(selectedOption) => setFilterData(prev => ({ ...prev, AnalyticsTypeOptions: selectedOption }))}
                                        placeholder="Select Analytics" />
                                </Col>
                                <Col>
                                    <label>Date Range</label>
                                    <Flatpickr
                                        className="form-control d-block"
                                        value={dataRange}
                                        options={{ altInput: true, mode: 'range', dateFormat: 'Y-m-d' }}
                                        onChange={dates => setDataRange(dates.map(Timezone))}
                                    />
                                </Col>
                                <Col md={1} className='mt-1'>
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
                title="Clinic Activity"
                isAdd={false}
                isTableHead={true}
                loading={loading}
                ssr={setPagination}
            />
        </>
    );
};

export default ClinicDashboard;
