import React, { useEffect, useState, useRef } from "react"
import { Row, Col, Card, CardBody, Modal } from "reactstrap"
import Dropzone from "react-dropzone"
import { get, post, uploadImg } from 'helpers/api_helper';
import { PATIENT_URL } from 'helpers/url_helper';
import cookieHelper from "helpers/getCookieData";
import { useHistory } from "react-router-dom";
import Select from 'react-select'
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { showSuccessAlert } from "pages/utils/alertMessages";
import CTMTabs from "./CTMTabs";

const AddPatient = ({ patientData, is_update = false }) => {
    let clinic = null;

    try {
        const cookie = cookieHelper.getCookie('_c');
        clinic = cookie ? JSON.parse(atob(cookie)) : null;
    } catch (err) {
        console.error("Failed to read _c cookie:", err);
        clinic = null;
    }

    const debounceTimeout = useRef(null);
    const history = useHistory();

    const [formData, setFormData] = useState({
        patientData, title: "Mr.", communication_group: patientData?.communication_group || "[]",
        patient_tags: patientData?.patient_tags || "[]",
        allergies: patientData?.allergies || "[]",
        ...patientData
    });

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [gender, setGender] = useState("Male");
    const [dob, setDob] = useState(patientData?.bob);
    const [age, setAge] = useState(0);
    const [referanceOptions, setReferanceOptions] = useState([])
    const [options, setOptions] = useState({ communicationGroup: [], tags: [], allergies: [] })
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("CommunicationGroup");

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const optionsFatch = async () => {
        const { success, body } = await get(`${PATIENT_URL}/profile/options`);
        if (success) {
            sessionStorage.setItem('options', JSON.stringify(body));
            setOptions(body);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type == 'checkbox') {
            const a = e.target.checked
            setFormData(prev => ({
                ...prev,
                [name]: a
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const calculateAge = (dateString) => {
        if (!dateString) return "0 years 0 months";
        const dobDate = new Date(dateString);
        const now = new Date();
        let years = now.getFullYear() - dobDate.getFullYear();
        let months = now.getMonth() - dobDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} years ${months} months`;
    };

    useEffect(() => {
        setAge(calculateAge(dob));
    }, [dob]);

    useEffect(() => {
        calculateAge(patientData?.dob)
    }, [patientData])

    const handleSubmit = async () => {
        const formDataWithNewFields = {
            ...formData,
            date,
            gender,
            dob,
            age,
            clinic_id: clinic.id,
            reference: formData.reference?.value || ''
        };

        if(!formData?.case_no){
            alert("Please enter case number.!");
            return;
        }

        // API request to submit the form data
        const {success, body} = await post(PATIENT_URL, formDataWithNewFields);
        if (success) {
            showSuccessAlert("Patient added successfully!");
            if (body?.id) {
                // localStorage.setItem("patientData", formData);
                history.push({
                    pathname: '/patient',
                    search: `?_p=${body.id}`,
                    state: { patientData: body }
                });
            } else {
                setFormData({});
            }
        }
    };

    useEffect(optionsFatch, [])

    const handleAcceptedFiles = async (files) => {
        const data = new FormData();
        data.append('file_type', 'profile');
        data.append('files[]', files[0]);

        try {
            const { success, body } = await uploadImg(`${PATIENT_URL}/profile?patient_id=${patientData?.id}`, data);
            if (success) {
                alert('Profile updated successfully.');
                history.push({
                    pathname: '/patient',
                    search: `?_p=${body.id}`,
                    state: { patientData: body }
                });
            }
        } catch (error) {
            alert('Error Updating Profile');
        }
    }

    const handleInvalidSubmit = () => {
        alert("Please enter the required fields.");
    };

    const handleInputChange = (inputValue) => {
        setReferanceOptions([]);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (!inputValue) return;

            const type = (formData?.reference_type || '').toLowerCase();

            get(`${PATIENT_URL}/options?_type=${type}s&search=${inputValue}`)
                .then(({ success, body }) => {
                    if (success) {
                        const options = Array.isArray(body) ? body : [];
                        setReferanceOptions(options);
                    }
                });
        }, 500); // debounce delay
    };


    return (
        <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData}>
            <Row>
                <Col md={3}>
                    <Card>
                        <CardBody>

                            {
                                !patientData?.id &&  
                                <>
                                    <label>Profile Image</label>
                                    <div style={{ width: "82px" }}>
                                        <Dropzone multiple={false} onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} s>
                                            {({ getRootProps, getInputProps }) => (
                                                <div style={{ minHeight: "96px" }} className="dropzone">
                                                    <div className="dz-message needsclick mt-3 p-0" {...getRootProps()} >
                                                        <input {...getInputProps()} />
                                                        {
                                                            formData?.profile_pic ? (<img src={`${process.env.REACT_APP_API_URL}${formData?.profile_pic}`} alt="Uploaded"
                                                                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 4 }} />
                                                            ) : (
                                                                <div> <i className="display-4 text-muted bx bxs-cloud-upload" /> </div>
                                                            )}
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                    </div>

                                    <div className="form-check form-check-inline mt-3">
                                        <input id="customRadioInline1" name="welcome_checkbox" onChange={handleChange} type="checkbox" className="form-check-input form-check-input" defaultValue="" />
                                        <label className="form-check-label" htmlFor="customRadioInline1">Send a welcome message to the patient.</label>
                                    </div>
                                    <div className="form-check form-check-inline mt-3">
                                        <input id="customRadioInline2" name="portal_access_checkbox" onChange={handleChange} type="checkbox" className="form-check-input form-check-input" defaultValue="" />
                                        <label className="form-check-label" htmlFor="customRadioInline2">Enable sportal access for this patient.</label>
                                    </div>
                                </>
                            }



                            <Row className="mt-3">
                                <Col>
                                    <label>Preferred Language</label>
                                    <select className="form-control" name="language" onChange={handleChange} value={formData?.language || ''}>
                                        {options?.language?.map((v, i) => <option key={`CGPOI_${i + 1}`} value={v.value}>{v.label}</option>)}
                                    </select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>Communication Group</div>
                                        <i role="button" className="fas fa-plus" onClick={() => openModal("CommunicationGroup")} />
                                    </label>
                                    <select className="form-control" multiple value={formData?.communication_group ? JSON.parse(formData?.communication_group) : []} onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setFormData(prev => ({ ...prev, communication_group: JSON.stringify(selectedOptions) }))
                                    }}>
                                        {options?.communicationGroup?.map((v, i) => <option key={`CGPOI_${i + 1}`} value={v.value}>{v.label}</option>)}
                                    </select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>Tags</div>
                                        <i role="button" className="fas fa-plus" onClick={() => openModal("Tags")} />
                                    </label>
                                    <select className="form-control" multiple value={formData?.patient_tags ? JSON.parse(formData?.patient_tags) : []} onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            patient_tags: JSON.stringify(selectedOptions)
                                        }));
                                    }}>
                                        {options?.tags?.map((v, i) => <option key={`TPOI_${i + 1}`} value={v.value}>{v.label}</option>)}
                                    </select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <label style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}><div>Medical Alerts</div>
                                        <i role="button" className="fas fa-plus" onClick={() => openModal("Allergy")} />
                                    </label>
                                    <select className="form-control" multiple value={formData?.allergies ? JSON.parse(formData?.allergies) : []} onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            allergies: JSON.stringify(selectedOptions)
                                        }));
                                    }}>
                                        {options?.allergies?.map((v, i) => <option key={`CGPOI_${i + 1}`} value={v.value}>{v.label}</option>)}
                                    </select>
                                </Col>
                            </Row>
                        </CardBody>
                        <CTMTabs isOpen={modalOpen} toggle={closeModal} type={modalType} onItemAdded={(newItem) => {
                            if (!newItem) return;
                            const newOption = {
                                value: newItem.id ?? newItem.value ?? newItem.title,
                                label: newItem.title ?? newItem.label ?? newItem.value,
                            };
                            setOptions(prev => {
                                const updated = { ...prev };
                                if (modalType === "CommunicationGroup") {
                                    updated.communicationGroup = [...(updated.communicationGroup || []), newOption];
                                    setFormData(prev => ({ ...prev, communication_group: JSON.stringify([...(JSON.parse(prev.communication_group || "[]")), newOption.value,]), }));
                                }

                                if (modalType === "Tags") {
                                    updated.tags = [...(updated.tags || []), newOption];
                                    setFormData(prev => ({ ...prev, patient_tags: JSON.stringify([...(JSON.parse(prev.patient_tags || "[]")), newOption.value,]), }));
                                }

                                if (modalType === "Allergy") {
                                    updated.allergies = [...(updated.allergies || []), newOption];
                                    setFormData(prev => ({ ...prev, allergies: JSON.stringify([...(JSON.parse(prev.allergies || "[]")), newOption.value,]) }));
                                }
                                return updated;
                            })
                        }}
                        />
                    </Card>
                </Col>
                <Col md={9}>
                    <Card>
                        <CardBody>
                            <h4>Personal Details</h4>
                            <Row>
                                <Col md={6}>
                                    <label>Registration Date</label>
                                    <input type="date" name="date" className="form-control" value={date}
                                        disabled={!!patientData}  onChange={(e) => setDate(e.target.value)} />
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col md={6}>
                                    <label className="img">Case Number</label>
                                    <AvField name="case_no" className="" id="" type="text" placeholder="Case number" errorMessage="Please enter Case Number" disabled={!!patientData}  value={formData?.case_no || ''} onChange={handleChange} required />
                                </Col>
                            </Row>

                            {/* Patient Details */}
                            <Row className="mt-2">
                                <Col md={1}>
                                    <label>Title</label>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="title"
                                        options={[
                                            { value: "Mr.", label: "Mr." },
                                            { value: "Mrs.", label: "Mrs." },
                                            { value: "Miss.", label: "Miss." },
                                            { value: "Dr.", label: "Dr." }
                                        ]}
                                        // value={formData?.title ? { value: formData?.title, label: formData?.title } : null}
                                        value={
                                            formData?.title
                                                ? { value: formData.title, label: formData.title }
                                                : null
                                        }
                                        onChange={(selected) => setFormData((prev) => ({ ...prev, title: selected ? selected.value : null }))} />
                                </Col>

                                <Col md={6} lg={4}>
                                    <div className='mt-2'>
                                        <label className="img">First Name</label>
                                        <AvField name="first_name" type="text" placeholder="Enter First Name" value={formData?.first_name} onChange={handleChange} required errorMessage="Please enter First Name" />
                                    </div>
                                </Col>
                                <Col md={6} lg={4}>
                                    <div className='mt-2'>
                                        <label>Last Name</label>
                                        <AvField name="last_name" type="text" placeholder="Enter Last Name" value={formData?.last_name} onChange={handleChange} errorMessage="Please enter Last Name" />
                                    </div>
                                </Col>
                                <Col md={6} lg={3}>
                                    <div className="mb-3">
                                        <label className="d-block mb-3 form-label">Gender *</label>
                                        <div className="form-check form-check-inline">
                                            <input id="customRadioInline3" name="gender" type="radio" className="form-check-input" value="Male" checked={gender === "Male"}
                                                onChange={(e) => setGender(e.target.value)} />
                                            <label className="form-check-label" htmlFor="customRadioInline3">Male</label>
                                        </div>
                                        &nbsp;
                                        <div className="form-check form-check-inline">
                                            <input id="customRadioInline4" name="gender" type="radio" className="form-check-input" value="Female" checked={gender === "Female"}
                                                onChange={(e) => setGender(e.target.value)} />
                                            <label className="form-check-label" htmlFor="customRadioInline4">Female</label>
                                        </div>
                                    </div>
                                </Col>

                            </Row>
                            <Row className="mt-3">
                                <Col md={6} lg={4}>
                                    <label>Date of Birth</label>
                                    <input type="date" className="form-control" value={dob}
                                        onChange={(e) => { const selectedDate = e.target.value; setDob(selectedDate); setAge(calculateAge(selectedDate)); }} />
                                    {dob && <span>Patient Age is {age}</span>}
                                </Col>
                                <Col md={6} lg={4}>
                                    <div className='mt-2'>
                                        <label className="img">Contact Number</label>
                                        <AvField name="mobile" type="text" placeholder="Enter Contact Number" value={formData?.mobile} onChange={handleChange} required errorMessage="Please enter Contact Number" />
                                    </div>
                                </Col>
                                <Col md={6} lg={4}>
                                    <div className='mt-2'>
                                        <AvField name="email" label="Email Address" type="email" placeholder="Enter Email Address" value={formData?.email} onChange={handleChange} errorMessage="Please enter Email Address" />
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <label>Address</label>
                                    <textarea rows={4} type="text" className="form-control" placeholder="address" name="address"
                                        value={formData?.address || ''} onChange={handleChange} />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6} lg={3}>
                                    <label>Country</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="country"
                                        value={formData?.country || ''} onChange={handleChange} />
                                </Col>
                                <Col md={6} lg={3}>
                                    <label>City</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="city"
                                        value={formData?.city || ''} onChange={handleChange} />
                                </Col>
                                <Col md={6} lg={3}>
                                    <label>State</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="state"
                                        value={formData?.state || ''} onChange={handleChange} />
                                </Col>
                                <Col md={6} lg={3}>
                                    <label>Zip/Pin Code</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="zip_code"
                                        value={formData?.zip_code || ''} onChange={handleChange} />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6} lg={3}>
                                    <label>Alternative Email address</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="alternative_email"
                                        value={formData?.alternative_email || ''} onChange={handleChange} />
                                </Col>
                                <Col md={6} lg={3}>
                                    <label>Alternative Mobile Number</label>
                                    <input type="text" className="form-control" placeholder="Contact Details" name="alternative_mobile"
                                        value={formData?.alternative_mobile || ''} onChange={handleChange} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    {
                        !is_update &&
                        <Card>
                            <CardBody>
                                <Row className="mt-3">
                                    <Col md={6} lg={4}>
                                        <label>Reference Type</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="reference_type"
                                            isClearable
                                            options={[
                                                { value: "Patient", label: "Patient" },
                                                { value: "Doctor", label: "Doctor" },
                                                { value: "Other", label: "Other" },
                                            ]}
                                            value={
                                                formData?.reference_type
                                                ? {
                                                    value: formData.reference_type,
                                                    label: formData.reference_type,
                                                    }
                                                : null
                                            }
                                            onChange={(selected) =>
                                                setFormData((prev) => ({
                                                ...prev,
                                                reference_type: selected?.value || null,
                                                }))
                                            }
                                            placeholder="Select Reference Type"
                                        />
                                    </Col>

                                    <Col md={6} lg={4}>
                                        <label>Reference</label>
                                        {
                                            formData?.reference_type === "Other" ?
                                                <input type="text" className="form-control" placeholder="Contact Details" name="reference" value={formData?.reference || ''} onChange={handleChange} />
                                                : <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="reference"
                                                    isClearable
                                                    options={referanceOptions}
                                                    value={formData?.reference || null}
                                                    onChange={(selected) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            reference: selected || null,
                                                        }))
                                                    }
                                                    onInputChange={handleInputChange}
                                                    placeholder="Search & Select Reference"
                                                />
                                        }
                                    </Col>

                                    <Col md={6} lg={4}>
                                        <label>Patient Relationship</label>
                                        <input type="text" className="form-control" placeholder="Contact Details" name="patient_relationship"
                                            value={formData?.patient_relationship || ''} onChange={handleChange} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    }

                    <Row>
                        <Col>
                            <Card>
                                <CardBody className="text-right">
                                    {/* <button className="btn btn-danger">Cancel</button> */}
                                    <button className="btn btn-primary" style={{ float: 'right' }}>submit</button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </AvForm>
    );
};

export default AddPatient;