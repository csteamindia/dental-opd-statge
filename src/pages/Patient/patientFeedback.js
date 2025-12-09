import React from "react"
import MetaTags from 'react-meta-tags';
import { Container } from "reactstrap"

const PatientFeedback = () => {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Patient | {process.env.REACT_APP_TITLE}</title>
          </MetaTags>
          <Container fluid>
            <h4>Patients feedback</h4>
        </Container>
        </div>
        </React.Fragment>
    )
}

export default PatientFeedback;