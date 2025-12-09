import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import Datatables from "../../utils/table/datatable";
import Dropzone from "react-dropzone"
import SignaturePad from 'react-signature-pad-wrapper';
import { get, post, put, del } from 'helpers/api_helper';
import { DOCTOR_URL, DOCTOR_TIMING_URL } from 'helpers/url_helper';
import { ManageDoctorColumns } from './tableColumns';
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ManageDoctor = () => {
    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#563d7c');
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const [signature, setSignature] = useState(null);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const signaturePad = useRef(null);

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        setFormData({});
        setSignature(null);
        signaturePad.current?.clear?.();

    }

    const handleClearSignature = () => {
        signaturePad.current.clear();
        setSignature(null);
    };

    const handleSaveSignature = () => {
        if (signaturePad.current.isEmpty()) {
            alert('Please provide signature');
            return;
        }
        setSignature(signaturePad.current.getTrimmedCanvas().toDataURL('image/png'));
    };

    const handleSignatureChange = () => {
        const isEmpty = signaturePad.current.isEmpty();
        console.log('Signature changed, isEmpty:', isEmpty);
        setIsSignatureEmpty(isEmpty);
    };

    useEffect(() => {
        // console.log('isSignatureEmpty state changed:', isSignatureEmpty);
    }, [signaturePad]);

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${DOCTOR_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const url = editMode ? `${DOCTOR_URL}/${editingId}` : DOCTOR_URL;
        const method = editMode ? put : post;

        const data = { ...formData, color_code: selectedColor, signature, };

        const { success, body } = await method(url, data);

        if (success) {
            showSuccessAlert(editMode ? 'Doctor updated successfully!' : 'Doctor created successfully!');

            // Save timing only on create
            if (!editMode) {
                const doctorId = body?.id;
                const timings = rows1.map(row => ({
                    doctor_id: doctorId,
                    start_time: row.startTime,
                    end_time: row.endTime,
                    exe_time: row.exe_time,
                }));
                await post(DOCTOR_TIMING_URL, timings);
            }

            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
            setSignature(null);
            signaturePad.current?.clear?.();
            fetchData();
        }
    };


    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
    };

    const handleColorChange = (e) => {
        const color = e.target.value;
        setSelectedColor(color);
        setFormData(prev => ({
            ...prev,
            color_code: color
        }));
    };

    const [rows1, setrows1] = useState([{ id: 1 }])

    function handleAddRowNested() {
        const modifiedRows = [...rows1]
        modifiedRows.push({ id: modifiedRows.length + 1 })
        setrows1(modifiedRows)
    }

    function handleRemoveRow(id) {
        if (id !== 1) {
            var modifiedRows = [...rows1]
            modifiedRows = modifiedRows.filter(x => x["id"] !== id)
            setrows1(modifiedRows)
        }
    }

    const handleTimingChange = (id, field, value) => {
        setrows1(prevRows =>
            prevRows.map(row =>
                row.id === id
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.id);
        setEditMode(true);
        setIsForm(true);
    }

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Bank`, `Do you really want to ${action} this Bank?`,
            `Yes, ${action} it!`, `${action}d!`, `Bank has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${DOCTOR_URL}/${id}?sts=${sts}`);
            if (success) {
                fetchData();
            }
        }
    };

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData} >
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <div className='d-flex justify-content-between mb-2'>
                                    <h5><i role="button" className='me-2 fas fa-arrow-left' onClick={handleToggle} /> Add Doctor</h5>
                                    <button className='btn btn-danger' onClick={handleToggle} > <i className='mdi mdi-close noti-icon' /> Cancel</button>
                                </div>
                                <hr />

                                <Row className='mb-2'>
                                    <Col md={5}>
                                        <div className="mb-2">
                                            <AvField name="name" label="Full Name" type="text" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} required errorMessage="Please enter Full Name" />
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <div className="mb-2">
                                            <AvField name="code" label="Code" type="text" placeholder="Enter Code" value={formData.code} onChange={handleChange} disabled={editMode}
                                                required errorMessage="Please enter Code" />
                                        </div>
                                    </Col>
                                    <Col md={5}>
                                        <div className="mb-2">
                                            <AvField name="registration_no" label="Licence / Registration Number" type="text" placeholder="Enter Licence / Registration Number" value={formData.registration_no} disabled={editMode} onChange={handleChange} required errorMessage="Please enter Licence / Registration Number" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="mobile" label="Mobile Number" type="number" placeholder="Enter Mobile Number" value={formData.mobile} onChange={handleChange} required errorMessage="Please enter Mobile Number" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="email" label="Email Address" type="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required errorMessage="Please enter Email Address" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <label>Doctor Color Code</label>
                                        <div className="d-flex align-items-center">
                                            <input type="color" className="form-control form-control-color" value={selectedColor} onChange={handleColorChange} title="Choose your color" style={{ width: '60px' }} /> <span className="ms-2 text-muted">{selectedColor}</span>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col>
                                        <label>Signature</label>
                                        <Dropzone onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} >
                                            {({ getRootProps, getInputProps }) => (
                                                <div style={{ minHeight: "96px" }} className="dropzone">
                                                    <div
                                                        className="dz-message needsclick mt-3 p-0"
                                                        {...getRootProps()}
                                                    >
                                                        <input {...getInputProps()} />
                                                        <div className="">
                                                            <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                    </Col>
                                    <Col>
                                        <div className='mt-4 pt-1' style={{ border: '2px dashed #ced4da', borderRadius: '6px' }} onClick={handleSignatureChange} >
                                            {
                                                isSignatureEmpty ?
                                                    <span style={{ position: 'absolute', marginLeft: '32%', marginTop: '18px', fontSize: '32px' }}>Sign here</span> : ''
                                            }
                                            <SignaturePad ref={signaturePad} height={86} onEnd={handleSignatureChange} />
                                        </div>
                                    </Col>
                                </Row>

                                <br />
                                <hr />
                                <h5 className='text-info' >Appointment Timing</h5>
                                <hr />

                                <div className="inner-repeater mb-4">
                                    {(rows1 || []).map((formRow, key) => (
                                        <div key={key} className="mb-3 border p-3 rounded">
                                            <Row>
                                                <Col>
                                                    <label>Start Time</label>
                                                    <Flatpickr
                                                        className="form-control"
                                                        options={{ enableTime: true, noCalendar: true, dateFormat: "h:i K", time_24hr: false, }}
                                                        value={formRow.startTime} disabled={editMode} onChange={([date]) => handleTimingChange(formRow.id, 'startTime', date)}
                                                        placeholder="Select Time" />
                                                </Col>
                                                <Col >
                                                    <label>End Time</label>
                                                    <Flatpickr
                                                        className="form-control"
                                                        options={{ enableTime: true, noCalendar: true, dateFormat: "h:i K", time_24hr: false, }}
                                                        value={formRow.endTime} disabled={editMode} onChange={([date]) => handleTimingChange(formRow.id, 'endTime', date)}
                                                        placeholder="Select Time" />
                                                </Col>
                                                <Col>
                                                    <AvField type="number" name={`exe_time_${formRow.id}`} label="Extra Time" className="form-control" disabled={editMode} value={formRow.exe_time || ''} onChange={(e) => handleTimingChange(formRow.id, 'exe_time', e.target.value)} placeholder="Extra Time" required errorMessage="Please enter extra time" />
                                                </Col>
                                                <Col md={2} className="text-end mt-4">
                                                    <Button className='me-2' color="primary" onClick={handleAddRowNested} title="Add Row"> Add </Button>
                                                    {rows1.length > 1 && (<Button className='me-2' color="danger" onClick={() => handleRemoveRow(formRow.id)} title="Delete Row"> Delete </Button>)}
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </div>
                                <Row className='mt-2'>
                                    <Col>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'} </>} </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </AvForm>
        )
    }

    {/* List Bootstrap Table  */ }
    return (
        <Datatables
            isSearch={true}
            columns={ManageDoctorColumns({ "edit": handleEdit, "delete": handleDelete }, pagination)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Doctors"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
}

export default ManageDoctor;
