import React, { useEffect, useState } from "react";
import { Row, Col } from 'reactstrap'
import Select from "react-select";
import { get } from 'helpers/api_helper'
import { MEDICINE_URL, PATIENT_URL } from "helpers/url_helper";
import { duration } from "moment";

const frequentOptions = [
    { value: '1-0-0', label: '1-0-0' },
    { value: '1-1-0', label: '1-1-0' },
    { value: '1-1-1', label: '1-1-1' },
    { value: '0-1-0', label: '0-1-0' },
    { value: '1-0-1', label: '1-0-1' },
    { value: '0-1-1', label: '0-1-1' },
    { value: '0-0-1', label: '0-0-1' }
];
const dosageOptions = [
    { value: '100mg', label: '100mg' },
    { value: '200mg', label: '200mg' },
    { value: '250mg', label: '250mg' },
    { value: '500mg', label: '500mg' },
    { value: '1000mg', label: '1000mg' },
    { value: '1ml', label: '1ml' },
    { value: '2ml', label: '2ml' },
    { value: '2.5ml', label: '2.5ml' },
    { value: '3ml', label: '3ml' },
    { value: '4ml', label: '4ml' },
    { value: '5ml', label: '5ml' },
    { value: '10ml', label: '10ml' },
    { value: '15ml', label: '15ml' },
    { value: '20ml', label: '20ml' },
    { value: '25ml', label: '25ml' }
];
const durationOptions = [
    { value: '1 day', label: '1 Day' },
    { value: '2 days', label: '2 Days' },
    { value: '3 days', label: '3 Days' },
    { value: '4 days', label: '4 Days' },
    { value: '5 days', label: '5 Days' },
    { value: '6 days', label: '6 Days' },
    { value: '7 days', label: '7 Days' },
    { value: '10 days', label: '10 Days' },
    { value: '15 days', label: '15 Days' },
    { value: '20 days', label: '20 Days' },
    { value: '30 days', label: '30 Days' },
    { value: '1 week', label: '1 Week' },
    { value: '2 weeks', label: '2 Weeks' },
    { value: '3 weeks', label: '3 Weeks' },
    { value: '4 weeks', label: '4 Weeks' },
    { value: '5 weeks', label: '5 Weeks' },
    { value: '6 weeks', label: '6 Weeks' },
    { value: '7 weeks', label: '7 Weeks' },
    { value: '1 month', label: '1 Month' },
    { value: '2 months', label: '2 Months' },
    { value: '3 months', label: '3 Months' },
    { value: '4 months', label: '4 Months' },
    { value: '5 months', label: '5 Months' },
    { value: '6 months', label: '6 Months' },
    { value: '1 year', label: '1 Year' },
];

const Addrows = ({ editModa = false, editData = [], callback = () => { }, tData=null}) => {
    const [medicines, setMedicines] = useState([])
    const [tableRow, setTableRow] = useState(tData? tData: [
        {
            id: 0,
            medicine: '',
            dose: '',
            frequent: '',
            duration: ''
        }
    ]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=mediciens`);
        if (success) {
            setMedicines(body)
        }
    };

    useEffect(() => {
        getExtraData();
    }, [])

    const handleAddRowNested = () => {
        setTableRow(prev => [...prev, { id: prev.length + 1 }]);
    };

    const handleRemoveRow = (id) => {
        if (id !== 1) {
            setTableRow(prev => prev.filter(row => row.id !== id));
        }
    };

    useEffect(() => {
        if (tableRow.length > 0) {
            callback(tableRow)
        }
    }, [tableRow])

    useEffect(() => {
        if (editModa) {
            setTableRow(editData)
        }
    }, [editModa])

    return (
        <div className="inner-repeater mb-4">
            {tableRow?.map((row, index) => (
                <div key={`MRID_${index + 1}`} className="mb-3">
                    <Row className="align-items-end">
                        <Col md={4}>
                            {
                                index == 0 &&
                                <label>Medicine</label>
                            }
                            <Select
                                id="medicines"
                                className="basic-single"
                                isClearable={true}
                                isSearchable={true}
                                options={medicines}
                                value={tableRow[index]?.medicine || []}
                                onChange={(selectedOption) => {
                                    // safely add dose if not already in list
                                    if (
                                        selectedOption?.dose &&
                                        !dosageOptions.some(opt => opt.value === selectedOption.dose)
                                    ) {
                                        dosageOptions.push({
                                        value: selectedOption.dose,
                                        label: selectedOption.dose
                                        });
                                    }

                                    // safely add frequent if not already in list
                                    if (
                                        selectedOption?.frequent &&
                                        !frequentOptions.some(opt => opt.value === selectedOption.frequent)
                                    ) {
                                        frequentOptions.push({
                                        value: selectedOption.frequent,
                                        label: selectedOption.frequent
                                        });
                                    }

                                    // safely add duration if not already in list
                                    if (
                                        selectedOption?.duration &&
                                        !durationOptions.some(opt => opt.value === selectedOption.duration)
                                    ) {
                                        durationOptions.push({
                                        value: selectedOption.duration,
                                        label: selectedOption.duration
                                        });
                                    }

                                    // update row
                                    setTableRow(prev =>
                                        prev.map((row, i) =>
                                        i === index
                                            ? {
                                                ...row,
                                                medicine: medicines.filter(v => v.value === selectedOption?.value)[0] || '',
                                                dose: dosageOptions.filter(v => v.value === selectedOption?.dose)[0] || '',
                                                frequent: frequentOptions.filter(v => v.value === selectedOption?.frequent)[0] || '',
                                                duration: durationOptions.filter(v => v.value === selectedOption?.duration)[0] || ''
                                            }
                                            : row
                                        )
                                    );
                                    }}

                                placeholder="Select Medicine" />
                        </Col>
                        <Col md={2}>
                            {
                                index == 0 &&
                                <label>Dosage</label>
                            }
                            <Select
                                id="medicines"
                                className="basic-single"
                                isClearable={true}
                                isSearchable={true}
                                options={dosageOptions}
                                value={tableRow[index]?.dose || []}
                                onChange={(selectedOption) => {
                                    setTableRow(prev =>
                                        prev.map((row, i) =>
                                            i === index
                                                ? { ...row, dose: selectedOption }
                                                : row
                                        )
                                    );
                                    // setFormData((prev) => ({
                                    //     ...prev,
                                    //     medicine_id: selectedOption?.value,
                                    //     medicine_name: selectedOption?.label
                                    // }));
                                }}
                                placeholder="Select Dosage" />
                        </Col>
                        <Col md={2}>
                            {
                                index == 0 &&
                                <label>Frequency</label>
                            }
                            <Select
                                id="medicines"
                                className="basic-single"
                                isClearable={true}
                                isSearchable={true}
                                value={tableRow[index]?.frequent || []}
                                options={frequentOptions}
                                onChange={(selectedOption) => {
                                    setTableRow(prev =>
                                        prev.map((row, i) =>
                                            i === index
                                                ? { ...row, frequent: selectedOption }
                                                : row
                                        )
                                    );
                                }}
                                placeholder="Select Frequency" />
                        </Col>
                        <Col md={2}>
                            {
                                index == 0 &&
                                <label>Duration</label>
                            }
                            <Select
                                id="medicines"
                                className="basic-single"
                                isClearable={true}
                                isSearchable={true}
                                value={tableRow[index]?.duration || []}
                                options={durationOptions}
                                onChange={(selectedOption) => {
                                    setTableRow(prev =>
                                        prev.map((row, i) =>
                                            i === index
                                                ? { ...row, duration: selectedOption }
                                                : row
                                        )
                                    );
                                }}
                                placeholder="Select Duration" />
                        </Col>
                        <Col md={1} className="d-flex flex-column">
                            {(tableRow.length - 1) == index ? (
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleAddRowNested}
                                >
                                    <i className="mdi mdi-plus" />
                                </button>
                            ) : (
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => handleRemoveRow(row.id)}
                                >
                                    <i className="mdi mdi-delete" />
                                </button>
                            )}
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    )
}

export default Addrows;