import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { get, post } from "helpers/api_helper";
import { DOCTOR_URL, DENTAL_CHART_EXAMINATION_URL, PATIENT_URL } from "helpers/url_helper";
import { Toothchart } from "../../../../utils/toothchart";

const treatmentOptions = [
    {
        category: "Diagnostic & Preventive Care",
        options: [
            { value: "consultation", label: "Consultation" },
            { value: "fluoride_treatment", label: "Fluoride Treatment" },
            { value: "pit_fissures_sealan", label: "Pit & Fissures Sealan" },
            { value: "night_guard", label: "Night Guard" }
        ]
    },
    {
        category: "Restorative Treatments",
        options: [
            { value: "fillings", label: "Fillings" },
            { value: "crowns", label: "Crowns" },
            { value: "post_core", label: "Post & Core" },
            { value: "root_canal_treatment", label: "Root Canal Treatment" },
            { value: "re_root_canal_treatment", label: "Re-root Canal Treatment" }
        ]
    },
    {
        category: "Prosthodontics (Replacement of Teeth)",
        options: [
            { value: "dentures", label: "Dentures" },
            { value: "dental_implant", label: "Dental Implant" },
            { value: "veneer", label: "Veneer" }
        ]
    },
    {
        category: "Orthodontics (Braces & Alignment)",
        options: [
            { value: "braces", label: "Braces" },
            { value: "lingual_braces", label: "Lingual Braces" }
        ]
    },
    {
        category: "Oral Surgery",
        options: [
            { value: "advance_surgical_procedure", label: "Advance Surgical Procedure" },
            { value: "surgical_extraction", label: "Surgical Extraction" },
            { value: "routine_extraction", label: "Routine Extraction" },
            { value: "gum_surgery", label: "Gum Surgery" }
        ]
    },
    {
        category: "Cosmetic Dentistry",
        options: [
            { value: "teeth_whitening", label: "Teeth Whitening" }
        ]
    },
    {
        category: "Other",
        options: [
            { value: "add_treatment_type", label: "Add TreatmentType" }
        ]
    }
];

const formattedTreatmentOptions = treatmentOptions.map(group => ({
    label: group.category,
    options: group.options
}));

const DentalChart = ({ patientData }) => {
    // const [toothInfo, setToothInfo] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [doctorsOptions, setDoctorsOptions] = useState([]);
    const [selectedTrat, setSelectedTrat] = useState('');
    const [examOptions, setExamOptions] = useState([]);
    const [formData, setFormData] = useState({
        date: new Date(),
        doctorOptions: null,
        doctor: patientData?.doctor,
        examination: null,
        treatment: null,
        note: null,
    });
    const [finalData, setFinalData] = useState([])
    const [selectedTeeth, setSelectedTeeth] = useState({});

    const fetchExaminationOptions = async () => {
        const { success, body } = await get(`${DENTAL_CHART_EXAMINATION_URL}/options`);
        if (success) {
            const options = body?.map(v => ({
                label: v.label,
                options: JSON.parse(v.group)
            }))
            setExamOptions(options)
        }
    }

    const handleToothClick = (toothNumber) => {
        setSelectedTeeth(prev => ({
            ...prev,
            [toothNumber]: !prev[toothNumber]
        }));
    }

    useEffect(() => {
        fetchExaminationOptions();
    }, []);


    const fatchDocs = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors&optionType=1`);
        if (success) {
            setDoctorsOptions(body)
            const doc = body.filter(v => v.value == patientData?.doctor);
            setFormData(p => ({ ...p, doctorOptions: doc, doctor: doc?.value }));
        }
    }

    
    useEffect(() => {
        fatchDocs()
    }, []);

    
    const handleExamination = () => {
        const obj = {
            ...formData,
            date: startDate,
            toothInfo: Object.keys(selectedTeeth)
        }

        setFormData(obj);
        obj?.toothInfo?.map(v => {
            const finalDataTemp = {
                doctor: formData?.doctorOptions?.value,
                date: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                patient_id: patientData?.id,
                examination: formData?.examination?.label,
                note: formData?.note,
                toothInfo: v,
                treatment: formData?.treatment.map(v => ({
                    label: v.label,
                    cost: 0,
                    discount: 0,
                    total: 0,
                    is_save: 0
                }))
            }

            setFinalData(p => [...p, finalDataTemp])
        })

        setSelectedTeeth({});
    };

    const handleFinalSubmit = async () => {
        const { success } = await post('dentalchart', finalData);
        if (success) {
            fetchChartData();
            setFormData({
                date: new Date(),
                doctorOptions: null,
                doctor: null,
                examination: null,
                treatment: null,
                note: null,
            })
            setSelectedTeeth({})
        }
    }

    const fetchChartData = async () => {
        const { success, body } = await get(`dentalchart?patient_id=${patientData?.id}`);
        if (success) {
            let a = []
            body?.items?.map(v => {
                a.push({
                    id: v?.id,
                    doctor: v?.doctor,
                    date: v?.date,
                    examination: v?.examination,
                    note: v?.note,
                    toothInfo: v?.toothinfo,
                    treatment: v?.treatment ? JSON.parse(v?.treatment).map(c => ({
                        label: c.label,
                        cost: c.cost,
                        discount: c.discount,
                        total: c.total,
                        is_save: c.is_save
                    })) : []
                })
            });

            setFinalData(a)
        }
    }

    useEffect(() => {
        fetchChartData();
    }, [])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md={8}>
                        <Toothchart callback={handleToothClick} selectedTeeth={selectedTeeth} selectedTrat={selectedTrat} />
                    </Col>
                    <Col md={4}>
                        <h5>Examination</h5>
                        <div className="mb-2">
                            <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="mb-2">
                            <Select
                                options={doctorsOptions}
                                value={doctorsOptions?.filter(v => v.value == formData?.doctor || v.value == patientData?.doctor)}
                                placeholder="Select doctor"
                                onChange={(selectedOption) => {
                                    setFormData(p => ({ ...p, doctorOptions: selectedOption, doctor: selectedOption.value }))
                                }}
                                name="doc"
                                id="doc"
                            />
                        </div>
                        <div className="mb-2">
                            <Select
                                options={examOptions}
                                name="examinationToothOptions"
                                id="examinationToothOptions"
                                placeholder="Select examination type"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={formData?.examination}
                                onChange={(selectedOption) => {
                                    setFormData(p => ({ ...p, examination: selectedOption }))
                                    setSelectedTrat(`${selectedOption.tooth}_`)
                                }}
                            />
                        </div>
                        <div className="mb-2">
                            <Select
                                options={formattedTreatmentOptions}
                                isMulti
                                closeMenuOnSelect={false}
                                placeholder="Select Treatment Type"
                                name="treatment"
                                id="treatment"
                                value={formData?.treatment}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(selectedOption) => {
                                    setFormData(p => ({ ...p, treatment: selectedOption }))
                                }}
                            />
                        </div>
                        <div>
                            <textarea className="form-control" rows={1} placeholder="examination note" defaultValue={formData?.note} onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))} />
                        </div>

                        <button className="btn btn-primary mt-2 w-100" onClick={handleExamination}>Add</button>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Tooth</th>
                                    <th>Examination</th>
                                    <th>Treatment</th>
                                    <th>Note</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {finalData?.map((item, index) => (
                                    <tr key={`DCT_${index + 1}`}>
                                        <td>{moment(item?.date).format('DD-MM-YYYY')}</td>
                                        <td>{item?.toothInfo}</td>
                                        <td>{item?.examination}</td>
                                        <td style={{ width: '50%' }}><table><tbody>
                                            {item?.treatment?.map((tv, treatmentIndex) => (
                                                <tr key={`TTOP_${treatmentIndex + 1}`}>
                                                    <td>{tv.label}</td>
                                                    <td style={{ width: '98px' }}><input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Cost"
                                                        value={tv.cost || ''}
                                                        onChange={(e) => {
                                                            const cost = parseFloat(e.target.value) || 0;
                                                            setFinalData(prev =>
                                                                prev.map((data, i) =>
                                                                    i === index
                                                                        ? {
                                                                            ...data,
                                                                            treatment: data.treatment.map((t, ti) =>
                                                                                ti === treatmentIndex
                                                                                    ? { ...t, cost, total: cost - (t.discount || 0) }
                                                                                    : t
                                                                            )
                                                                        }
                                                                        : data
                                                                )
                                                            );
                                                        }}
                                                    /></td>
                                                    <td style={{ width: '98px' }}><input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Discount"
                                                        value={tv.discount || ''}
                                                        onChange={(e) => {
                                                            const discount = parseFloat(e.target.value) || 0;
                                                            setFinalData(prev =>
                                                                prev.map((data, i) =>
                                                                    i === index
                                                                        ? {
                                                                            ...data,
                                                                            treatment: data.treatment.map((t, ti) =>
                                                                                ti === treatmentIndex
                                                                                    ? { ...t, discount, total: (t.cost || 0) - discount }
                                                                                    : t
                                                                            )
                                                                        }
                                                                        : data
                                                                )
                                                            );
                                                        }}
                                                    /></td>
                                                    <td style={{ width: '98px' }}><input className="form-control" disabled value={tv.total || ''} placeholder="Total" /></td>
                                                    <td style={{ width: '26px' }}><label className="d-flex">
                                                        <input
                                                            type="checkbox"
                                                            className="ms-4 me-2"
                                                            checked={tv.is_save || false}
                                                            onChange={(e) => {
                                                                setFinalData(prev =>
                                                                    prev.map((data, i) =>
                                                                        i === index
                                                                            ? {
                                                                                ...data,
                                                                                treatment: data.treatment.map((t, ti) =>
                                                                                    ti === treatmentIndex
                                                                                        ? { ...t, is_save: e.target.checked }
                                                                                        : t
                                                                                )
                                                                            }
                                                                            : data
                                                                    )
                                                                );
                                                            }}
                                                        /> Save
                                                    </label></td>
                                                </tr>
                                            ))}
                                        </tbody></table></td>
                                        <td>{item?.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
                {
                    finalData.length > 0 &&
                    <Row>
                        <Col>
                            <button className="btn btn-primary w-100" onClick={handleFinalSubmit}>Save Examination</button>
                        </Col>
                    </Row>
                }
            </CardBody>
        </Card>

    );
};

export default DentalChart;
