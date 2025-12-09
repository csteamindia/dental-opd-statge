import React, { useEffect, useState } from "react";
import { Row, Col, Modal } from 'reactstrap'
import Select from "react-select";
import { get } from 'helpers/api_helper'
import { MEDICINE_URL } from "helpers/url_helper";

const allTeeth = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48];

const AddTreatmentRows = ({ callback = () => { }, tData=null }) => {
    const [tretmentTypes, setTretmentTypes] = useState([
        { label: 'Aligner', value: 'aligner' },
        { label: 'Fillings', value: 'fillings' },
        { label: 'Crowns', value: 'crowns' },
        { label: 'Extractions', value: 'extractions' },
    ])
    const [isOpen, setIsOpen] = useState(false)
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [tableRow, setTableRow] = useState(tData? tData : [
        {
            id: 0,
            treatment_type: '',
            teeth: [],
            cost: '',
            discount: '',
            note: '',
            total: 0,
            multiply_cost: false
        }
    ]);

    const toothCellStyle = (tooth) => ({
        cursor: 'pointer',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: '1px solid #ccc',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2.5px',
        color: tableRow[selectedRowIndex]?.teeth?.includes(tooth) ? '#fff' : '#062E54',
        backgroundColor: tableRow[selectedRowIndex]?.teeth?.includes(tooth) ? '#062E54' : 'transparent'
    });

    const handleToothClick = (toothNumber) => {
        if (selectedRowIndex !== null) {
            if (toothNumber === 'all') {
                setTableRow(prev =>
                    prev.map((row, i) => {
                        if (i === selectedRowIndex) {
                            const updatedTeeth = row.teeth?.length === allTeeth.length ? [] : allTeeth;
                            const cost = parseFloat(row.cost) || 0;
                            const discount = parseFloat(row.discount) || 0;
                            const teethCount = row.multiply_cost ? (updatedTeeth.length || 1) : 1;

                            return {
                                ...row,
                                teeth: updatedTeeth,
                                total: (cost * teethCount) - discount
                            };
                        }
                        return row;
                    })
                );
            } else {
                setTableRow(prev =>
                    prev.map((row, i) => {
                        if (i === selectedRowIndex) {
                            const updatedTeeth = row.teeth?.includes(toothNumber)
                                ? row.teeth.filter(t => t !== toothNumber)
                                : [...(row.teeth || []), toothNumber];
                            const cost = parseFloat(row.cost) || 0;
                            const discount = parseFloat(row.discount) || 0;
                            const teethCount = row.multiply_cost ? (updatedTeeth.length || 1) : 1;

                            return {
                                ...row,
                                teeth: updatedTeeth,
                                total: (cost * teethCount) - discount
                            };
                        }
                        return row;
                    })
                );
            }
        }

    };

    const handleAddRowNested = () => {
        setTableRow(prev => [...prev, {
            id: prev.length,
            treatment_type: '',
            teeth: [],
            cost: '',
            discount: '',
            note: '',
            lowersets: 0,
            uppersets: 0,
            total: 0,
            multiply_cost: 0
        }]);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const openToothModal = (index) => {
        setSelectedRowIndex(index);
        setIsOpen(true);
    };

    const handleFieldChange = (index, field, value) => {
        // Update tableRow state
        setTableRow(prev =>
            prev.map((row, i) => {
                if (i !== index) return row;

                const updatedRow = {
                    ...row,
                    [field]: value
                };

                // Calculate total when cost, discount, multiply_cost, or teeth change
                const cost = parseFloat(updatedRow.cost) || 0;
                const discount = parseFloat(updatedRow.discount) || 0;
                
                // let teethCount = updatedRow.multiply_cost ? (updatedRow.teeth?.length || 1) : 1;

                // if(row.treatment_type?.value == 'aligner'){
                //     teethCount = (parseFloat(row.uppersets) + parseFloat(row.lowersets))
                // }

                // updatedRow.total = (cost * teethCount) - discount;

                // return updatedRow;

                // Determine teeth count
                let teethCount = 1;

                if (updatedRow.treatment_type?.value === 'aligner') {
                    const upper = parseFloat(updatedRow.uppersets) || 0;
                    const lower = parseFloat(updatedRow.lowersets) || 0;
                    teethCount = upper + lower;
                } else if (updatedRow.multiply_cost) {
                    teethCount = updatedRow.teeth?.length || 1;
                }

                // Update total
                updatedRow.total = (cost * teethCount) - discount;

                return updatedRow;
            })
        );

        // Update treatments state
        setTreatments(prev => {
            const newTreatments = Array.isArray(prev) ? [...prev] : [];
            const currentRow = newTreatments[index] || {};

            const updatedTreatment = {
                ...currentRow,
                [field]: value
            };

            // Calculate total for the treatment
            const cost = parseFloat(updatedTreatment.cost) || 0;
            const discount = parseFloat(updatedTreatment.discount) || 0;
            const teethCount = updatedTreatment.multiply_cost ? (updatedTreatment.teeth?.length || 1) : 1;

            updatedTreatment.total = (cost * teethCount) - discount;

            newTreatments[index] = updatedTreatment;
            return newTreatments;
        });
    };

    useEffect(() => {
        callback(tableRow)
    }, [treatments])
    
    const aligners = (tooth, index, checked) => {
        setTableRow(prev =>
            prev.map((row, i) => {
            if (i !== index) return row;

            // Create updated teeth list
            let updatedTeeth = checked
                ? [...row.teeth, tooth]
                : row.teeth.filter(t => t != tooth);

                console.log(updatedTeeth)

            // Remove duplicates
            updatedTeeth = [...new Set(updatedTeeth)];

            // Recalculate total based on new teeth count
            const cost = parseFloat(row.cost) || 0;

            const total = row.multiply_cost
                ? cost  * (parseFloat(row.uppersets) + parseFloat(row.lowersets))
                : cost;

            return {
                ...row,
                teeth: updatedTeeth,
                total
            };
            })
        );
    };

    console.log(tData)


    // Update the tooth display component
    return (
        <div className="inner-repeater mb-4">
            {tableRow?.map((row, index) => (
                <div key={row.id} className="mb-3">
                    <Row className="align-items-end">
                        <Col md={3}>
                            {
                                index == 0 &&
                                <label>Treatment Type</label>
                            }
                            <Select
                                id="medicines"
                                className="basic-single"
                                isClearable={true}
                                isSearchable={true}
                                options={tretmentTypes}
                                value={row?.treatment_type || []}
                                onChange={(e) => handleFieldChange(index, 'treatment_type', e)}
                                placeholder="Select Medicine" />
                        </Col>
                        <Col md={2}>
                            {
                                row?.treatment_type?.value == 'aligner' ? 
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {/* Upper */}
                                            <div style={{ alignItems: 'center', gap: '8px' }}>
                                                <span className="me-2">Upper</span>
                                                <input
                                                    type="checkbox"
                                                    checked={row.teeth.includes('upper')}
                                                    onChange={(e) => aligners('upper', index, e.target.checked)}
                                                />
                                                {row.teeth.includes('upper') && (
                                                    <>
                                                        <br />
                                                        <input
                                                            type="number"
                                                            placeholder="Sets"
                                                            value={row.uppersets || ''}
                                                            onChange={(e) => handleFieldChange(index, 'uppersets', e.target.value)}
                                                            style={{ width: '60px' }}
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            {/* Lower */}
                                            <div style={{ alignItems: 'center', gap: '8px' }}>
                                                <span className="me-2">Lower</span>
                                                <input
                                                    type="checkbox"
                                                    checked={row.teeth.includes('lower')}
                                                    onChange={(e) => aligners('lower', index, e.target.checked)}
                                                />
                                                {row.teeth.includes('lower') && (
                                                    <>
                                                        <br />
                                                        <input
                                                            type="number"
                                                            placeholder="Sets"
                                                            value={row.lowersets || ''}
                                                            onChange={(e) => handleFieldChange(index, 'lowersets', e.target.value)}
                                                            style={{ width: '60px' }}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                : <>
                                    {index === 0 && <label>Tooth</label>}
                                    <div>
                                        <span onClick={() => openToothModal(index)} style={{
                                            cursor: 'pointer',
                                            color: '#062E54',
                                            transition: 'color 0.3s ease',
                                            ':hover': {
                                                color: 'red'
                                            }
                                        }}>
                                            {row.teeth?.length > 0 ? row.teeth.join(', ') : '+ Select Tooth'}
                                        </span>
                                        <br />
                                        <input
                                            type="checkbox"
                                            checked={row?.multiply_cost || false}
                                            onChange={(e) => handleFieldChange(index, 'multiply_cost', e.target.checked)}
                                        /> Multiply cost by tooth count.
                                    </div>
                                </>
                            }
                        </Col>
                        <Col md={1}>
                            {
                                index == 0 &&
                                <label>Cost</label>
                            }
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Cost"
                                value={row?.cost}
                                min="-999999"
                                step="any"
                                onChange={(e) => handleFieldChange(index, 'cost', e.target.value)}
                            />
                        </Col>
                        <Col md={1}>
                            {
                                index == 0 &&
                                <label>Discount</label>
                            }
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Discount"
                                value={row?.discount}
                                min="-999999"
                                step="any"
                                onChange={(e) => handleFieldChange(index, 'discount', e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            {
                                index == 0 &&
                                <label>Note</label>
                            }
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Note"
                                value={row?.note}
                                onChange={(e) => handleFieldChange(index, 'note', e.target.value)}
                            />
                        </Col>
                        <Col md={2}>
                            {
                                index == 0 &&
                                <label>Total</label>
                            }
                            <input disabled type="text" className="form-control" placeholder="Total" value={row?.total || 0} />
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

            <Modal size="lg" isOpen={isOpen} toggle={toggleModal} className="custom-modal">
                <div className="modal-body">
                    <button
                        type="button"
                        className="btn btn-outline-primary mb-3"
                        onClick={() => handleToothClick('all')}
                    >
                        {tableRow[selectedRowIndex]?.teeth?.length === allTeeth.length
                            ? 'Deselect All'
                            : 'Select All'}
                    </button>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <table className="w-100">
                                        <tbody>
                                            <tr>
                                                {[18, 17, 16, 15, 14, 13, 12, 11].map(tooth => (
                                                    <td
                                                        key={tooth}
                                                        onClick={() => handleToothClick(tooth)}
                                                        style={toothCellStyle(tooth)}
                                                    >
                                                        {tooth}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                {[48, 47, 46, 45, 44, 43, 42, 41].map(tooth => (
                                                    <td
                                                        key={tooth}
                                                        onClick={() => handleToothClick(tooth)}
                                                        style={toothCellStyle(tooth)}
                                                    >
                                                        {tooth}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td>
                                    <table className="w-100">
                                        <tbody>
                                            <tr>
                                                {[21, 22, 23, 24, 25, 26, 27, 28].map(tooth => (
                                                    <td
                                                        key={tooth}
                                                        onClick={() => handleToothClick(tooth)}
                                                        style={toothCellStyle(tooth)}
                                                    >
                                                        {tooth}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                {[31, 32, 33, 34, 35, 36, 37, 38].map(tooth => (
                                                    <td
                                                        key={tooth}
                                                        onClick={() => handleToothClick(tooth)}
                                                        style={toothCellStyle(tooth)}
                                                    >
                                                        {tooth}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
                </div>
            </Modal>
        </div>
    )
}

export default AddTreatmentRows;
