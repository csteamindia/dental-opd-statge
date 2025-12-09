import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get } from 'helpers/api_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_red.css"
import "./custom.css"
import Flatpickr from "react-flatpickr"
import Timezone from "../utils/timezone";
import { PATIENT_URL } from 'helpers/url_helper'

const status = [
    { "label": "All", "value": "" },
    { "label": "Waiting", "value": "Waiting" },
    { "label": "Scheduled", "value": "Scheduled" },
    { "label": "Completed", "value": "Completed" },
    { "label": "Cancelled", "value": "Cancelled" },
    { "label": "Engaged", "value": "Engaged" },
    // { "label": "DirectCheckIn", "value": "DirectCheckIn" },
    { "label": "Missed", "value": "Missed" },
    // { "label": "Rescheduled", "value": "Rescheduled" }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
];

const doctorWiseOptions = [
    { label: "Treatment Wise", value: "Treatment Wise" },
    { label: "Bill Wise", value: "Bill Wise" },
    { label: "Payment Wise", value: "Payment Wise" },
];

const referrerTypes = [
    { label: "Doctor", value: "Doc" },
    { label: "Patient", value: "P" },
    { label: "Other", value: "O" },
];

const patientDocumentTypes = [
    { label: "All", value: "All" },
    { label: "Testimonials", value: "Testimonials" },
    { label: "Scanned Images", value: "Scanned Images" },
    { label: "Patient Reports", value: "Patient Reports" },
];

const Filters = ({ hasFilter, callBack }) => {
    const [filterData, setFilterData] = useState({
        dates: [Timezone(new Date()), Timezone(new Date())], patient_id: null, doctor_code: null, status: '', status_option: null,
        registrationRange: [Timezone(new Date()), Timezone(new Date())], daterange: '', gender: '', gender_option: null, birthdayRange: [Timezone(new Date()), Timezone(new Date())], dobdaterange: '', communication_group: [], communication: '', referenceSourceTypes: [], reference: '', docWiseOption: '', doctorWiseOptions: null, patientDocumentType: '', patientDocumentTypes: null, referrerType: null, referrerTypeValue: ''
    });

    const [options, setOptions] = useState({ doctors: [], status: status, patients: [], communication: [], reference: [] });

    const fetchOptions = async () => {
        const [doctorsRes, patientsRes, communicationGroupRes, referenceTypeRes] = await Promise.all([
            get(`${PATIENT_URL}/options?_type=doctors&optionType=1`),
            get(`${PATIENT_URL}/options?_type=patients`),
            get(`${PATIENT_URL}/options?_type=communicationGroup`),
            get(`${PATIENT_URL}/options?_type=referenceType`),
        ]);

        if (doctorsRes.success) setOptions(prev => ({ ...prev, doctors: doctorsRes.body }));
        if (patientsRes.success) setOptions(prev => ({ ...prev, patients: patientsRes.body }));
        if (communicationGroupRes.success) setOptions(prev => ({ ...prev, communication: communicationGroupRes.body }));
        if (referenceTypeRes.success) setOptions(prev => ({ ...prev, reference: referenceTypeRes.body }));
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        const refOpt = filterData?.referrerTypes?.map(v => v.value).join(',');
        const commOpt = filterData?.communication_group?.map(v => v.value).join(',');

        setFilterData(prev => ({ ...prev, reference: refOpt, communication: commOpt }));
    }, [filterData?.referrerTypes, filterData?.communication_group]);

    const isMore = Object.keys(hasFilter).length > 4 ? true : false;

    return (
        <Row style={{ marginBottom: '-16px' }}>
            <Col>
                <Card>
                    <CardBody>
                        <Row>
                            {hasFilter?.date && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Date</label>
                                    <Flatpickr
                                        className="form-control d-block"
                                        value={filterData.registrationRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                                        onChange={(e) => {
                                            const registrationRange = e.map(d => Timezone(d));
                                            setFilterData(prev => ({ ...prev, registrationRange, daterange: registrationRange.join(',') }));
                                        }}
                                    />
                                </Col>
                            )}

                            {hasFilter?.patient && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Patient</label>
                                    <Select
                                        isClearable={true}
                                        options={options.patients}
                                        value={options.patients.find(opt => opt.value === filterData.patient_id) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, patient_id: selected?.value || null }))
                                        }
                                        placeholder="Select Patient"
                                    />
                                </Col>
                            )}

                            {hasFilter?.doctor && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Doctor</label>
                                    <Select
                                        isClearable={true}
                                        options={options.doctors}
                                        value={options.doctors.find(opt => opt.value === filterData.doctor_code) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, doctor_code: selected?.value || null }))
                                        }
                                        placeholder="Select Doctor"
                                    />
                                </Col>
                            )}
                            {
                                hasFilter?.registrationRange &&
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`} >
                                    <label>Registration Date</label>
                                    <Flatpickr
                                        className="form-control d-block"
                                        value={filterData.registrationRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                                        onChange={(e) => {
                                            const registrationRange = e.map(d => Timezone(d));
                                            setFilterData(prev => ({ ...prev, registrationRange, daterange: registrationRange.join(',') }));
                                        }}
                                    />
                                </Col>
                            }
                            {hasFilter?.status && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Status</label>
                                    <Select
                                        isClearable={true}
                                        options={status}
                                        value={filterData.status_option}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, status_option: selected, status: selected?.value || '' }))
                                        }
                                        placeholder="Select Status"
                                    />
                                </Col>
                            )}

                            {hasFilter?.genderOptions && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Gender</label>
                                    <Select
                                        isClearable={true}
                                        options={genderOptions}
                                        value={genderOptions.find(opt => opt.value === filterData.gender) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, gender: selected?.value || '', gender_option: selected }))
                                        }
                                        placeholder="Select Gender"
                                    />
                                </Col>
                            )}

                            {hasFilter?.birthdayRange && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Birthday</label>
                                    <Flatpickr
                                        className="form-control d-block"
                                        value={filterData.birthdayRange}
                                        options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
                                        onChange={(e) => {
                                            const birthdayRange = e.map(d => Timezone(d));
                                            setFilterData(prev => ({ ...prev, birthdayRange, dobdaterange: birthdayRange.join(',') }));
                                        }}
                                    />
                                </Col>
                            )}

                            {hasFilter?.communication && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Communication Group</label>
                                    <Select
                                        isMulti={true}
                                        isClearable={true}
                                        options={options.communication}
                                        value={filterData.communication_group}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, communication_group: selected || [] }))
                                        }
                                    />
                                </Col>
                            )}

                            {hasFilter?.doctorWiseOption && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Doctor Wise</label>
                                    <Select
                                        isClearable={true}
                                        options={doctorWiseOptions}
                                        value={doctorWiseOptions.find(opt => opt.value === filterData.docWiseOption) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, doctorWiseOptions: selected, docWiseOption: selected?.value || '' }))
                                        }
                                    />
                                </Col>
                            )}

                            {hasFilter?.patientDocumentTypes && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Patient Document</label>
                                    <Select
                                        isClearable={true}
                                        options={patientDocumentTypes}
                                        value={patientDocumentTypes.find(opt => opt.value === filterData.patientDocumentType) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, patientDocumentTypes: selected, patientDocumentType: selected?.value || '' }))
                                        }
                                    />
                                </Col>
                            )}

                            {hasFilter?.referrerTypes && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Reference Source</label>
                                    <Select
                                        isClearable={true}
                                        options={referrerTypes}
                                        value={referrerTypes.find(opt => opt.value === filterData.referrerTypeValue) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, referrerType: selected, referrerTypeValue: selected?.value || '' }))
                                        }
                                    />
                                </Col>
                            )}

                            {filterData?.referrerTypeValue == "P" && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Referance By</label>
                                    <Select
                                        isClearable={true}
                                        options={options.patients}
                                        value={options.patients.find(opt => opt.value === filterData.referrerBy) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, referrerBy: selected?.value || null }))
                                        }
                                        placeholder="Select Patient"
                                    />
                                </Col>
                            )}

                            {filterData?.referrerTypeValue == "Doc" && (
                                <Col md={3} className={`${isMore ? 'mt-2' : ''}`}>
                                    <label>Referance By</label>
                                    <Select
                                        isClearable={true}
                                        options={options.doctors}
                                        value={options.doctors.find(opt => opt.value === filterData.referrerBy) || null}
                                        onChange={(selected) =>
                                            setFilterData(prev => ({ ...prev, referrerBy: selected?.value || null }))
                                        }
                                        placeholder="Select Doctor"
                                    />
                                </Col>
                            )}

                            <Col style={{ marginTop: `${isMore ? '14px' : '8px'}` }}>
                                <button className='btn btn-primary mt-4' style={{ width: '160px' }} onClick={() => callBack(filterData)}>
                                    Filter Data
                                </button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Filters;


// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, CardBody } from 'reactstrap';
// import { get, post } from 'helpers/api_helper';
// import Select from "react-select";
// import "flatpickr/dist/themes/material_red.css"
// import "./custom.css"
// import Flatpickr from "react-flatpickr"
// import Timezone from "../utils/timezone";
// import { PATIENT_URL } from 'helpers/url_helper'

// const status = [
//     { "label": "All", "value": "" },
//     { "label": "Waiting", "value": "Waiting" },
//     { "label": "Scheduled", "value": "Scheduled" },
//     { "label": "Completed", "value": "Completed" },
//     { "label": "Cancelled", "value": "Cancelled" },
//     { "label": "Engaged", "value": "Engaged" },
//     // { "label": "DirectCheckIn", "value": "DirectCheckIn" },
//     { "label": "Missed", "value": "Missed" },
//     // { "label": "Rescheduled", "value": "Rescheduled" }
// ];

// const genderOptions = [
//     { label: 'Male', value: 'Male' },
//     { label: 'Female', value: 'Female' },
//     { label: 'Other', value: 'Other' },
// ];

// const doctorWiseOptions = [
//     { label: "Treatment Wise", value: "Treatment Wise" },
//     { label: "Bill Wise", value: "Bill Wise" },
//     { label: "Payment Wise", value: "Payment Wise" },
// ];

// const referrerTypes = [
//     { label: "Doctor", value: "Doctor" },
//     { label: "Patient", value: "Patient" },
//     { label: "External Referrance", value: "External Referrance" },
//     { label: "Other", value: "Other" },
// ];

// const patientDocumentTypes = [
//     { label: "All", value: "All" },
//     { label: "Testimonials", value: "Testimonials" },
//     { label: "Scanned Images", value: "Scanned Images" },
//     { label: "Patient Reports", value: "Patient Reports" },
// ];

// const Filters = ({ hasFilter, callBack }) => {
//     const [filterData, setFilterData] = useState({ dates: [Timezone(new Date()), Timezone(new Date())], patient: [], patient_id: null, doctors: [], doctorId: [], doctor_code: [], status: [], status_option: [], registrationRange: [Timezone(new Date()), Timezone(new Date())], daterange: '', gender: [], birthdayRange: [Timezone(new Date()), Timezone(new Date())], dobdaterange: '', communication: [], reference: [], docWiseOption: [], doctorWiseOptions: [], referrerTypes: [], communication_group: [], patientDocumentTypes: [], });

//     const [options, setOptions] = useState({ doctors: [], status: status, patients: [], communication: [], reference: [], });

//     const fetchOptions = async () => {
//         const [doctorsRes, patientsRes, communicationGroupRes, referenceTypeRes] = await Promise.all([
//             get(`${PATIENT_URL}/options?_type=doctors&optionType=1`),
//             get(`${PATIENT_URL}/options?_type=patients`),
//             get(`${PATIENT_URL}/options?_type=communicationGroup`),
//             get(`${PATIENT_URL}/options?_type=referenceType`),
//         ]);

//         if (doctorsRes.success) setOptions(prev => ({ ...prev, doctors: doctorsRes.body }));
//         if (patientsRes.success) setOptions(prev => ({ ...prev, patients: patientsRes.body }));
//         if (communicationGroupRes.success) setOptions(prev => ({ ...prev, communication: communicationGroupRes.body }));
//         if (referenceTypeRes.success) setOptions(prev => ({ ...prev, reference: referenceTypeRes.body }));
//     };

//     useEffect(() => {
//         fetchOptions();
//     }, [])

//     useEffect(() => {
//         const refOpt = filterData?.referrerTypes?.map(v => v.value).join(',')
//         const commOpt = filterData?.communication_group?.map(v => v.value).join(',')

//         setFilterData(prev => ({ ...prev, reference: refOpt, communication: commOpt }))
//     }, [filterData?.referrerTypes, filterData?.communication_group])

//     return (
//         <Row style={{ marginBottom: '-16px' }}>
//             <Col>
//                 <Card>
//                     <CardBody>
//                         <Row>
//                             {
//                                 hasFilter?.date &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Date</label>
//                                     <Flatpickr id="date" className="form-control d-block" placeholder="MM, DD, YYYY" value={filterData?.registrationRange}
//                                         options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
//                                         onChange={(e) => {
//                                             const registrationRange = e.map(registrationRangeString => Timezone(registrationRangeString));
//                                             setFilterData(prev => ({ ...prev, registrationRange, daterange: registrationRange.join(',') }))
//                                         }} />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.patient &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
//                                     <label>Patient</label>
//                                     <Select id="patient" className="basic-single" isClearable={true} isSearchable={true} options={options?.patients}
//                                         value={options?.patients?.find(opt => opt.value === filterData.patient_id) || null}
//                                         onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, patient_id: selectedOption?.value || null })) }}
//                                         placeholder="Select Patient" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.doctor &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
//                                     <label>Doctor</label>
//                                     <Select id="doctor" className="basic-single" isClearable={true} isSearchable={true} options={options?.doctors}
//                                         value={options?.doctors?.find(opt => opt.value === filterData?.doctor_code?.value) || null}
//                                         onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, doctor_code: selectedOption })); }}
//                                         placeholder="Select Doctor" />
//                                 </Col>

//                             }
//                             {
//                                 hasFilter?.status &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Status</label>
//                                     <Select className="basic-single" isClearable={true} isSearchable={true} options={status} value={filterData?.status_option || []}
//                                         onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, status_option: selectedOption, status: selectedOption?.value })) }} placeholder="Select Status" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.registrationRange &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Registration Date</label>
//                                     <Flatpickr id="date" className="form-control d-block" placeholder="MM, DD, YYYY" value={filterData?.registrationRange}
//                                         options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
//                                         onChange={(e) => {
//                                             const registrationRange = e.map(registrationRangeString => Timezone(registrationRangeString));
//                                             setFilterData(prev => ({ ...prev, registrationRange, daterange: registrationRange.join(',') }))
//                                         }} />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.genderOptions &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Gender</label>
//                                     <Select id="gender" className="basic-single" isClearable={true} isSearchable={true} options={genderOptions} value={filterData?.genderOptions || []}
//                                         onChange={(selectedOption) => {
//                                             setFilterData((prev) => ({ ...prev, genderOptions: selectedOption, gender: selectedOption?.value }))
//                                         }} placeholder="Select Gender" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.birthdayRange &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
//                                     <label>Birthday</label>
//                                     <Flatpickr id="dob-range" className="form-control d-block" placeholder="MM, DD, YYYY" value={filterData?.birthdayRange}
//                                         options={{ altInput: true, mode: "range", dateFormat: "Y-m-d" }}
//                                         onChange={(e) => {
//                                             const birthdayRange = e.map(date => Timezone(date));
//                                             // console.log("Selected Range:", birthdayRange);  // Add this
//                                             setFilterData(prev => ({ ...prev, birthdayRange, dobdaterange: birthdayRange.join(',') }));
//                                         }} />
//                                 </Col>

//                             }
//                             {
//                                 hasFilter?.reference &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} className='mt-3'>
//                                     <label>Reference Source</label>
//                                     <Select id="reference_type" className="basic-single" isClearable={true} isSearchable={true} isMulti={true} options={options?.reference}
//                                         value={filterData?.referrerTypes || []} onChange={(selectedOption) => {
//                                             setFilterData((prev) => ({ ...prev, referrerTypes: selectedOption }))
//                                         }} placeholder="Select Reference Source" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.communication &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} className='mt-3'>
//                                     <label>Communication Group</label>
//                                     <Select id="communication_group" className="basic-single" isClearable={true} isSearchable={true} isMulti={true} options={options?.communication}
//                                         value={filterData?.communication_group || []} onChange={(selectedOption) => {
//                                             setFilterData((prev) => ({ ...prev, communication_group: selectedOption }))
//                                         }} placeholder="Select Communication Group" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.doctorWiseOption &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Doctor Wise</label>
//                                     <Select id="docWiseOption" className="basic-single" isClearable={true} isSearchable={true} options={doctorWiseOptions}
//                                         value={filterData?.doctorWiseOptions || []}
//                                         onChange={(selectedOption) => {
//                                             setFilterData((prev) => ({ ...prev, doctorWiseOptions: selectedOption, docWiseOption: selectedOption?.value || '' }))
//                                         }} />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.patientDocumentTypes &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Patient Document</label>
//                                     <Select className="basic-single" isClearable={true} isSearchable={true} options={patientDocumentTypes}
//                                         value={filterData?.patientDocumentTypes || []}
//                                         onChange={(selectedOption) => {
//                                             setFilterData((prev) => ({ ...prev, patientDocumentTypes: selectedOption, status: selectedOption?.value }))
//                                         }} placeholder="Select Patient Document" />
//                                 </Col>
//                             }
//                             {
//                                 hasFilter?.referrerTypes &&
//                                 <Col md={3}  className={`${isMore? 'mt-2': ''}`} >
//                                     <label>Reference Type</label>
//                                     <Select className="basic-single" isClearable={true} isSearchable={true} options={referrerTypes} value={filterData?.referrerType || []}
//                                         onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, referrerType: selectedOption, status: selectedOption?.value })) }} placeholder="Select Reference Type" />
//                                 </Col>
//                             }
//                             <Col className='mt-1'>
//                                 <button className='btn btn-primary mt-4' onClick={() => callBack(filterData)}> Filter Data </button>
//                             </Col>
//                         </Row>

//                     </CardBody>
//                 </Card>
//             </Col>
//         </Row>
//     )
// }

// export default Filters;

// const daysOptions = [
//     { label: "Yearly", value: "Yearly" },
//     { label: "Monthly", value: "Monthly" },
//     { label: "Daily", value: "Daily" },
// ];

// const paymentOptions = [
//     { label: "All", value: "All" },
//     { label: "Cash", value: "Cash" },
//     { label: "Cheque", value: "Cheque" },
//     { label: "Card", value: "Card" },
//     { label: "RTGS", value: "RTGS" },
//     { label: "NEFT", value: "NEFT" },
//     { label: "Paytm Wallet", value: "Paytm Wallet" },
//     { label: "Google Pay", value: "Google Pay" },
// ];

// const outStandingOptions = [
//     { label: "Planned", value: "Planned" },
//     { label: "In Progress", value: "In Progress" },
//     { label: "Completed", value: "Completed" },
//     { label: "Discontinued", value: "Discontinued" },
// ];

// const revenueOptions = [
//     { label: "View Bill", value: "View Bill" },
//     { label: "View Payment", value: "View Payment" },
// ];



{/* {
                                hasFilter?.daysRange &&
                                <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
                                    <label>Days Range</label>
                                    <Select id="date" className="basic-single" isClearable={true} isSearchable={true} options={daysOptions} value={filterData?.daysRange || []}
                                        onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, daysRange: selectedOption, status: selectedOption?.value })) }} placeholder="Select Days Range" />
                                </Col>
                            }
                            {
                                hasFilter?.paymentType &&
                                <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
                                    <label>Payment Type</label>
                                    <Select className="basic-single" isClearable={true} isSearchable={true} isMulti={true} options={paymentOptions} value={filterData?.paymentType || []}
                                        onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, paymentType: selectedOption, status: selectedOption?.value })) }} placeholder="Select Payment Type" />
                                </Col>
                            }
                            {
                                hasFilter?.outStandingOption &&
                                <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
                                    <label>OutStanding Report</label>
                                    <Select className="basic-single" isClearable={true} isSearchable={true} options={outStandingOptions} value={filterData?.outStandingOption || []}
                                        onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, outStandingOption: selectedOption, status: selectedOption?.value })) }} placeholder="Select OutStanding Report" />
                                </Col>
                            }
                            {
                                hasFilter?.revenueOption &&
                                <Col md={3}  className={`${isMore? 'mt-2': ''}`}>
                                    <label>Revenue Type</label>
                                    <Select className="basic-single" isClearable={true} isSearchable={true} options={revenueOptions} value={filterData?.revenueOption || []}
                                        onChange={(selectedOption) => { setFilterData((prev) => ({ ...prev, revenueOption: selectedOption, status: selectedOption?.value })) }} placeholder="Select Revenue Options" />
                                </Col>
                            } */}