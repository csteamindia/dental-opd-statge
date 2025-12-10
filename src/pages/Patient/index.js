import CardButton from "pages/Components/CardButton";
import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import { Container, Row, Col } from "reactstrap"
import AddPatient from "./components/addPatient";
import Patientslist from "./patientList";
import PatientFeedback from "./patientFeedback";

const Patient = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Patient | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Patients</h4>
          <div className="mb-3">
            <Row>
              <Col><CardButton title="Add New Patient" icon="fas fa-user-injured" callback={() => setSelectedTab(1)} /></Col>
              <Col><CardButton title="Patients List" icon="fas fa-users" callback={() => setSelectedTab(2)} /></Col>
              {/* <Col><CardButton title="Patient Feedback" icon="fas fa-comments" callback={() => setSelectedTab(3)} /></Col> */}
            </Row>
          </div>
          {selectedTab === 1 && <AddPatient />}
          {selectedTab === 2 && <Patientslist />}
          {selectedTab === 3 && <PatientFeedback />}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Patient;
