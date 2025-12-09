import cookieHelper from 'helpers/getCookieData';
import React, { useEffect, useState } from 'react';
import Dropzone from "react-dropzone"
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, put } from 'helpers/api_helper'
import { showSuccessAlert } from "pages/utils/alertMessages";
import { CLINIC_URL } from 'helpers/url_helper';

const ManageClinic = () => {
    const [clinicData, setClinicData] = useState(null)
    const [formData, setFormData] = useState({});

    const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null

    const fetchClinicData = async () => {
        const res = await get(`clinics/${clinic?.id}`);
        if (res.success) {
            setClinicData(res.body);
            setFormData({})
        }
    }

    useEffect(() => {
        fetchClinicData();
    }, [])

    const handleUpdate = async () => {
        const res = await put(`${CLINIC_URL}/${clinic?.id}`, formData);
        if (res.success) {
            showSuccessAlert("Clinic updated successfully");
            fetchClinicData();
        }
    };


    return (
        <Row>
            <Col md={8}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={2}>
                                <label>Profile Image</label>
                                <div>
                                    <Dropzone
                                        onDrop={acceptedFiles => {
                                            handleAcceptedFiles(acceptedFiles)
                                        }}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div style={{ minHeight: "108px" }} className="dropzone">
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
                                </div>
                            </Col>
                            <Col md={10}>
                                <div className="mb-1">
                                    <label>Clinic Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Clinic Name" defaultValue={clinicData?.clinic_name}
                                        onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label>Doctor Name</label>
                                    <input type="text" className="form-control" placeholder="Enter Doctor Name" defaultValue={clinicData?.doctors?.name}
                                        onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Clinic Address</label>
                                    <input type="text" className="form-control" placeholder="Enter Clinic Address" defaultValue={clinicData?.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col md={3}>
                                <div className="mb-1">
                                    <label>City</label>
                                    <input type="text" className="form-control" placeholder="Enter City" defaultValue={clinicData?.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div>
                                    <label>State</label>
                                    <input type="text" className="form-control" placeholder="Enter State" defaultValue={clinicData?.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div>
                                    <label>Country</label>
                                    <input type="text" className="form-control" placeholder="Enter Country" defaultValue={clinicData?.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div>
                                    <label>Zipcode</label>
                                    <input type="text" className="form-control" placeholder="Enter Zipcode" defaultValue={clinicData?.zip_code}
                                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col md={4}>
                                <div>
                                    <label>Contact No</label>
                                    <input type="text" className="form-control" placeholder="Enter Contact Number" defaultValue={clinicData?.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div>
                                    <label>Email Address</label>
                                    <input type="text" className="form-control" placeholder="Enter Email Address" defaultValue={clinicData?.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div>
                                    <label>Timezone</label>
                                    <input type="text" className="form-control" placeholder="Enter Locality" defaultValue={clinicData?.time_zone}
                                        onChange={(e) => setFormData({ ...formData, time_zone: e.target.value })}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col md={4}>
                <Card>
                    <CardBody>
                        <div className="mb-1">
                            <label>Kiosk Access Code</label>
                            <br />
                            <i className='fas fa-tablet-alt' /> <strong title="kiosk code">{clinicData?.kiosk_code}</strong>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <div className="mb-1">
                            <label>Clinic Access Code</label>
                            <br />
                            <i className='fas fa-lock' /> <strong title="kiosk code">{clinicData?.access_code}</strong>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <label>Clinic Public Link</label>
                        <br />
                        <i className='fas fa-lock' /> <strong title="kiosk code">{clinicData?.clinic_url}</strong>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" type="button" onClick={handleUpdate}>
                                <i className="mdi mdi-plus" /> Update
                            </button>

                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default ManageClinic;
