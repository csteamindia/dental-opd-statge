import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { TREATMENT_URL, PATIENT_URL, BILLING_URL } from 'helpers/url_helper';
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import AddTreatmentRows from 'pages/utils/incrementalRowsTreatment';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";

const Prescription = ({ patientData }) => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ tretment_date: new Date().toISOString() });
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [doctors, setDoctors] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${TREATMENT_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination?.limit || 10}&search=${pagination?.Search || ''}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const getExtraData = async () => {
        const { success, body } = await get(`${PATIENT_URL}/options?_type=doctors&optionType=1`);
        if (success) {
            setDoctors(body);
        }
    };

    useEffect(() => {
        getExtraData();
    }, [])

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        // setFormData({ tretment_date: new Date().toISOString() });
    };

    const handleChange = (e) => {
        console.log(e)
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        let objectData = [];
        formData?.treatments?.forEach(v => {
            objectData.push({
                patient_id: patientData.id,
                doctor_code: formData.doctor_code,
                treatment_date: formData.tretment_date,
                tooths: v.teeth.join(','),
                treatment_type: v.treatment_type?.value,
                treatment_cost: v.cost,
                tretment_note: v.note,
                treatment_discount: v.discount,
                treatment_total_cost: v.total,
                treatment_discount_type: v.multiply_cost ? 1 : 0
            });
        });

        const url = editMode ? `${TREATMENT_URL}/${editingId}` : TREATMENT_URL;
        const method = editMode ? put : post;

        const res = await method(url, { _q: objectData });

        if (res.success) {
            showSuccessAlert(editMode ? 'Treatment updated successfully!' : 'Treatment created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleMultiRowData = (data) => {
        setFormData(prev => ({
            ...prev,
            treatments: data // or update logic
        }));
    }

    const expandRow = {
        renderer: row => {
            let notes = [{
                treatment_date: row.treatment_date,
                treatment_note: row.treatment_note,
                tooths: row.tooths,
            }];

            if (row?.notes?.length > 0) {
                notes = [...notes, ...row?.notes];
            }

            console.log(row)

            return notes.map((note, index) => (
                <table className='table' key={`EXR_${index + 1}`}>
                    <tbody>
                        <tr>
                            <td colSpan={2}><span style={{ fontSize: '18px' }}>{row?.doctor?.name}</span> {moment(note.treatment_date).format('DD-MM-YYYY')} </td>
                        </tr>
                        <tr>
                            <td>
                                TOOTHS: <b>{note.tooths}</b> <br /><br />
                                {note.treatment_note}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))
        },
        showExpandColumn: true,
        expandByColumnOnly: true,
        onlyOneExpanding: true
    };

    const handleGenrateBill = async (data) => {
        const res = await post(BILLING_URL, { _q: data?.id })
    }

    const handleEdit = (row) => {
        const treatmentRow = {
            id: row.id,
            treatment_date: row.treatment_date,
            note: row.treatment_note,
            doctor_code: row.doctor_code,
            treatments: [{
                teeth: row.tooths?.split(',') || [],
                treatment_type: { value: row.treatment_type, label: row.treatment_type },
                cost: row.treatment_cost,
                discount: row.treatment_discount,
                total: row.treatment_total_cost,
                note: row.treatment_note,
                multiply_cost: row.treatment_discount_type === 1
            }]
        };

        setEditingId(row.id);
        setEditMode(true);
        setFormData(treatmentRow);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Treatment`, `Do you really want to ${action} this Treatment?`,
            `Yes, ${action} it!`, `${action}d!`, `Treatment has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${TREATMENT_URL}/${id}?sts=${sts}`);
            if (success)
                fetchData();
        }
    };

    const treatmentsColumns = [
        { dataField: 'id', text: '#', editable: false, style: { width: '20px' }, },
        { dataField: 'treatment_date', text: 'Date', editable: false, formatter: (cell, row) => { return <> {moment(row.treatment_date).format('DD-MM-YYYY')} </> } },
        { dataField: 'doctor.name', text: 'Treatment By', editable: false  },
        { dataField: 'treatment_type', text: 'Treatment Type', editable: false },
        { dataField: 'treatment_total_cost', text: 'Cost', editable: false  },
        // inside the column definition replace editor with editorRenderer:
        {
            dataField: 'treatment_status',
            text: 'Status',
            editorRenderer: (editorProps, value, row) => {
                const handleChange = (e) => {
                    const newValue = e.target.value;
                    // update the internal editor value so table knows about it
                    editorProps.onUpdate(newValue);
                    // update UI immediately
                    // setData(prev => prev.map(r => r.id === row.id ? { ...r, treatment_status: newValue } : r));
                    // call your API
                    updateTreatmentStatus(row.id, newValue);
                    console.log('instant change fired', { oldValue: value, newValue, row });
                };

                return (
                <select className="form-control" value={value || ''} onChange={handleChange}>
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="discontinued">Discontinued</option>
                </select>
                );
            }
        },

        // {
        //     dataField: 'actions0', style: { width: '20px' }, text: '', formatter: (cell, row) => {
        //         return row.is_billed ?
        //             <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleGeneratedBillEdit(row)} title="Edit">
        //                 <i className="fas fa-print" />
        //             </a> :
        //             <a href="#" className="btn btn-info btn-sm edit" onClick={() => handleGenrateBill(row)} title="Genrate Bill">
        //                 <i className="bx bx-cog bx-spin" /> Genrate Bill
        //             </a>

        //     }
        // },
        {
            dataField: 'actions', text: '',editable: false, isDummyField: true,
            formatter: (cell, row) => (
                <div className="d-flex gap-2">
                    <Link to="#" className="btn btn-primary btn-sm" onClick={() => handleEdit(row)} title="Edit">
                        <i className="fas fa-pencil-alt" />
                    </Link>
                    <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm`}
                        onClick={() => handleDelete(row.id, row.status === 1 ? 0 : 1)}
                        title={row.status === 0 ? 'Delete' : 'Restore'}>
                        <i className={`fas ${row.status === 0 ? 'fa-trash-alt' : 'fa-check'}`} />
                    </Link>
                </div>
            )
        }
    ];

    const updateTreatmentStatus = (data) => {
        console.log(data)
    }

    const selectedDoctorCode = formData?.doctor_code ?? patientData?.doctor ?? null;

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between mb-2">
                                <h5> <i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> { formData?.id ? "Edit" : "Add"} Treatment </h5>
                                <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel </button>
                            </div>
                            <hr />
                            <Row>
                                <Col md={4}>
                                    <div className="form-group mb-4">
                                        <label>Select Date</label>
                                        <Flatpickr className="form-control d-block" options={{ altInput: true, dateFormat: "Y-m-d H:i" }} placeholder="MM, DD, YYYY"
                                            value={formData.treatment_date}
                                            onChange={(date) => { setFormData(prev => ({ ...prev, tretment_date: date[0]?.toISOString() })) }} />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label>Doctor</label>
                                    <Select
                                        id="doctor"
                                        className="basic-single"
                                        isClearable={true}
                                        isSearchable={true}
                                        options={doctors}
                                        value={
                                            doctors.find(doc => doc.value == selectedDoctorCode) || null
                                        }
                                        onChange={(op) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                doctor_code: op?.value || null
                                            }))
                                        }
                                        isDisabled={editMode}
                                        placeholder="Select Doctor"
                                    />
                                </Col>
                            </Row>
                            <div className="mb-4 bg-light p-3 rounded">
                                <AddTreatmentRows callback={handleMultiRowData} tData={formData.treatments}/>
                            </div>
                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Note</label>
                                        <input type="text" className="form-control" placeholder="Enter Notes" name="note" value={formData?.note} onChange={handleChange} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mt-4'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-success" type="button" onClick={handleSubmit}> Submit </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={treatmentsColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            expandRow={expandRow}
            handleAddButton={handleToggle}
            title="All Treatments"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            cellEdit={true}
            ssr={setPagination}
        />
    );
};

export default Prescription;
