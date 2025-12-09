import React, { useRef, useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Col,
  Row,
  Card,
  CardBody
} from "reactstrap"
import { get } from 'helpers/api_helper'
import { useParams } from 'react-router-dom';
import moment from "moment";
import letter_head from 'assets/images/letter_head.png';

<style>
  {`@media print {
    body * {
      visibility: hidden;
    }
    .printable {
      visibility: visible;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
    .page-break {
      page-break: always;
    }
  }`}
</style>


const thStyle = {
  border: '1px solid #ccc',
  padding: '4px',
  backgroundColor: '#f0f0f0',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '6px',
};

const PatientSummary = () => {
    const { id } = useParams();
    const printRef = useRef();
    const [summary, setSummary] = useState(null); 

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // to reload original React structure
    };

    const fatchData = async() => {
        const { success, body } = await get(`/patients/summary?patient_id=${id}`);
        if(success){
            setSummary(body);
        }
    }

    useEffect(fatchData, [])

    return (
        <React.Fragment>
        <div className="page-content">
            <MetaTags>
            <title>Patient Summary | {process.env.REACT_APP_TITLE}</title>
            </MetaTags>
            <Container fluid >
                <button onClick={handlePrint}>Print Container</button>
                
                <div ref={printRef} className="printable">
                    <h4 className="text-center">Patinet Summary</h4>

                    <Card>
                        <CardBody>
                            <h5>Case Details</h5>
                            <Row>
                                <Col md={5} sm={12}>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr><td>Patient Name</td><td>{`${summary?.profile?.title} ${summary?.profile?.first_name} ${summary?.profile?.last_name}`}</td></tr>
                                            <tr><td>Gender/Age/Date Of Birth</td><td>{`${summary?.profile?.gender} / ${summary?.profile?.age} / ${summary?.profile?.dob}`}</td></tr>
                                            {/* <tr><td>Occupaon</td><td>summary?.profile?.title</td></tr> */}
                                            <tr><td>Referred By</td><td>{summary?.profile?.reference_type}</td></tr>
                                            <tr><td>Remark/Note</td><td>-</td></tr>
                                        </tbody>
                                    </table>
                                </Col>
                                <Col md={4} sm={7}>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Address</th>
                                            </tr>
                                            <tr>
                                                <td>{summary?.profile?.address}<br />{summary?.profile?.city}, {summary?.profile?.state} <br /> {summary?.profile?.Country} - {summary?.profile?.zip_code}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                                <Col md={3} sm={5}>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Registration Date#</th>
                                                <td>{summary?.profile?.date}</td>
                                            </tr>
                                            <tr>
                                                <th>CASE NO#</th>
                                                <td>{summary?.profile?.case_no}</td>
                                            </tr>
                                            <tr>
                                                <th>Dr Incharge#</th>
                                                <td>{summary?.profile?.doctors?.name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody>
                            <h5>Essential Medical Information (if any)</h5>
                            <ul>
                                <li>Allergies</li>
                                <li>Dental Treatment</li>
                            </ul>
                        </CardBody>
                    </Card>
                    
                    {/* Examinaon */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Examinaons</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Complaint</th>
                                        <th>Diagnosis</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.examinations?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.examination_date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctors?.name}</td>
                                                <td>
                                                    {
                                                        (() => {
                                                            let tooth = v?.tooth;
                                                            try {
                                                                const parsed = JSON.parse(tooth);
                                                                if (parsed?.complaint) {
                                                                    return parsed.complaint.map((c, i) => (
                                                                    <li key={`PSETCL_${i+1}`}>{c.label}</li>
                                                                    ));
                                                                }
                                                            } catch {
                                                            return <li>{tooth}</li>;
                                                            }
                                                        })()
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (() => {
                                                            let tooth = v?.tooth;
                                                            try {
                                                                const parsed = JSON.parse(tooth);
                                                                if (parsed?.diagnosis) {
                                                                    return parsed.diagnosis.map((c, i) => (
                                                                    <li key={`PSETCL_${i+1}`}>{c.label}</li>
                                                                    ));
                                                                }
                                                            } catch {
                                                                return <li>{tooth}</li>;
                                                            }
                                                        })()
                                                    }
                                                </td>
                                                <td>{v.remark}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Dental Chart */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Dental Chart Data</h5>
                            {
                            summary?.dentalchart?.map((v, i) => (
                                <table  key={`SNPL_${i+1}`} className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Doctor</th>
                                            <th>Tooth</th>
                                            <th>Examination</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <>
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{moment(v.date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>{v.toothinfo}</td>
                                                <td>{v.examination}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={5}>
                                                    {
                                                        v?.treatment ? 
                                                        <div>
                                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                <tr>
                                                                    <th style={thStyle}>Treatment</th>
                                                                    <th style={thStyle}>Cost</th>
                                                                    <th style={thStyle}>Discount</th>
                                                                    <th style={thStyle}>Total</th>
                                                                    <th style={thStyle}>Is Saved</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {JSON.parse(v.treatment).map((item, index) => (
                                                                        <tr key={index}>
                                                                        <td style={tdStyle}>{item.label}</td>
                                                                        <td style={tdStyle}>{item.cost}</td>
                                                                        <td style={tdStyle}>{item.discount}</td>
                                                                        <td style={tdStyle}>{item.total}</td>
                                                                        <td style={tdStyle}>{item.is_save ? 'Yes' : 'No'}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                            
                                                            <span className="mt-2"><b>Note:</b> {v.remark}</span>
                                                        </div>: ''
                                                    }
                                                </td>
                                            </tr>
                                        </>
                                    </tbody>
                                </table>
                                ))
                            }
                        </CardBody>
                    </Card>
                    
                    {/* Appointment */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Appointments</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Status</th>
                                        <th>Arrival Time</th>
                                        <th>Token Number</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.appointments?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.appointment_date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>{v.is_visited == 0 ? 'Scheduled': (v.is_visited == 1? 'Visited': 'Cancled')}</td>
                                                <td>{moment(v.updated_at).format('DD-MM-YYYY')}</td>
                                                <td>-</td>
                                                <td>{v.notes}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Prescripon Details */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Treatment</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Treatment</th>
                                        <th>Teeth</th>
                                        <th>Note</th>
                                        <th>Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.tretments?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>{v?.treatment_type}</td>
                                                <td>{v?.tooths}</td>
                                                <td>{v.treatment_note}</td>
                                                <td>{v.treatment_total_cost}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Prescripon Details */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Prescripons</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Doctor</th>
                                        <th>Prescripon</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.prescriptions?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>
                                                    {
                                                        v.medicine && JSON.parse(v.medicine).map((v, i) =>{
                                                            return <li key={`MMIPFP_${i+1}`}>{v?.medicine[0]?.label} | {v?.dose?.label} | {v?.duration?.label}<br /></li>
                                                        })
                                                    }
                                                </td>
                                                <td>{v.note}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Invesgations */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Invesgations</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Invesgated By</th>
                                        <th>Temprature</th>
                                        <th>Blood Pressure</th>
                                        <th>Blood Sugar</th>
                                        <th>Auscultation</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.investigations?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.note_date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>{v.temperature}</td>
                                                <td>{v.blood_pressure}</td>
                                                <td>{v.blood_sugar}</td>
                                                <td>{v.auscultation}</td>
                                                <td>{v.note}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Note */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Notes</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Note By</th>
                                        <th>Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.notes?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.note_date).format('DD-MM-YYYY')}</td>
                                                <td>{v?.doctor?.name}</td>
                                                <td>{v.note}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* Followups */}
                    <Card className="page-break">
                        <CardBody>
                            <h5>Followups</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        summary?.followups?.map((v, i) => (
                                            <tr key={`SNPL_${i+1}`}>
                                                <td>{i+1}</td>
                                                <td>{moment(v.followup_date).format('DD-MM-YYYY')}</td>
                                                <td>{v.remark}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </div>
        
            </Container>
        </div>
        </React.Fragment>
    )
}

export default PatientSummary;
