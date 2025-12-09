import React, { useState } from 'react';
import { Col, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { FaUsers } from "react-icons/fa"
import Examinations from './examination_tabs/examinations';
import DentalChart from './examination_tabs/dentalchart';
import PeriodontalChart from './examination_tabs/periodontalchart ';

const Examination = ({patientData}) => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [pdForm, setPDForm] = useState(false);
    const handleCardClick = () => { }

    const handdleMenuChange = () => {
        setSelectedTab(3);
        setPDForm(!pdForm);
    }

    return (
        <Row>
            {
                !pdForm && 
                <Col lg={3}>
                    <Card>
                        <CardBody>
                            <ListGroup flush>
                                <ListGroupItem
                                    tag="a"
                                    href="#"
                                    action
                                    className="d-flex align-items-center"
                                    active={selectedTab == 1}
                                    onClick={() => setSelectedTab(1)}
                                >
                                    <FaUsers className={`me-3 text-${selectedTab == 1 ? 'white' : 'primary'}`} />
                                    <span>Examination</span>
                                </ListGroupItem>
                                <ListGroupItem
                                    tag="a"
                                    href="#"
                                    action
                                    className="d-flex align-items-center"
                                    active={selectedTab == 2}
                                    onClick={() => setSelectedTab(2)}
                                >
                                    <FaUsers className={`me-3 text-success`} />
                                    <span>Dental Chart</span>
                                </ListGroupItem>
                                <ListGroupItem
                                    tag="a"
                                    href="#"
                                    action
                                    className="d-flex align-items-center"
                                    active={selectedTab == 3}
                                    onClick={() => setSelectedTab(3)}
                                >
                                    <FaUsers className={`me-3 text-info`} />
                                    <span>Periodontal Chart</span>
                                </ListGroupItem>
                            </ListGroup>
                        </CardBody>
                    </Card>
                </Col>
            }
            <Col>
                {selectedTab == 1 && <Examinations patientData={patientData} />}
                {selectedTab == 2 && <DentalChart patientData={patientData} />}
                {selectedTab == 3 && <PeriodontalChart patientData={patientData} callback={handdleMenuChange} isform={()=>setPDForm(!pdForm)} />}
            </Col>
        </Row>
    )
}

export default Examination;
