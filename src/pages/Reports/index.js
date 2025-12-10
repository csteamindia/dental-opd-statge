import React, { useState, lazy, Suspense } from "react";
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Card, CardBody, ListGroup, ListGroupItem } from "reactstrap";
import { FaUsers, FaUserMd, FaCog, FaFileAlt, FaComments, FaEnvelope, FaFileImport, FaCalendarAlt, FaChartLine, FaChartPie, FaCreditCard, FaClipboardList, FaWhatsapp, FaBirthdayCake, FaPhoneVolume, FaStar, FaArtstation, FaStarAndCrescent } from "react-icons/fa";

const Reports = () => {
  const [selectedReports, setSelectedReports] = useState("appointments");
  const [selectedSubReports, setSelectedSubReports] = useState(null);
  const [componentMap, setComponentMap] = useState({});

  const colors = ["primary", "success", "info", "warning", "danger", "secondary"];

  const settingsCards = {
    "appointments": [
      { module: "AppointmentsReport", title: "Appointments Report", icon: FaCalendarAlt, color: "primary", id: 1, isActive: 1 },
      { module: "WaitingReport", title: "Waiting Report", icon: FaChartLine, color: "success", id: 2, isActive: 1 },
      // { module: "RemindersReport", title: "Reminders Report", icon: FaPhoneVolume, color: "info", id: 3, isActive: 1 },
    ],
    "patients": [
      { module: "PatientReport", title: "Patient Report", icon: FaChartPie, color: colors[0], id: 4, isActive: 1 },
      // { module: "CollectionReport", title: "Collection Report", icon: FaClipboardList, color: colors[2], id: 5, isActive: 1 },
      // { module: "OutstandingReport", title: "Outstanding Report", icon: FaFileAlt, color: colors[3], id: 6, isActive: 1 },
      // { module: "RevenueReport", title: "Revenue Report", icon: FaChartLine, color: colors[4], id: 7, isActive: 1 },
      { module: "DoctorReport", title: "Doctor Report", icon: FaUserMd, color: colors[5], id: 8, isActive: 1 },
      { module: "DoctorWisePatient", title: "Doctor Wise Patient Report", icon: FaUserMd, color: colors[0], id: 9, isActive: 1 },
      // { module: "OnlinePatientPaymentReport", title: "Online Patient Payment Report", icon: FaCreditCard, color: colors[1], id: 10, isActive: 1 },
      // { module: "BillingReport", title: "Billing Report", icon: FaFileAlt, color: colors[3], id: 12, isActive: 1 },
      { module: "ReferenceReport", title: "Reference Report", icon: FaUserMd, color: colors[4], id: 13, isActive: 1 },
      // { module: "ClinicDataAnalysis", title: "Clinic Data Analysis", icon: FaChartPie, color: colors[5], id: 14, isActive: 1 },
      // { module: "ClinicDashboard", title: "Clinic Dashboard", icon: FaChartLine, color: colors[0], id: 15, isActive: 1 },
      // { module: "GeneralReport", title: "General Report", icon: FaFileAlt, color: colors[2], id: 17, isActive: 1 },
      { module: "PatientDocumentReport", title: "Patient Document Report", icon: FaClipboardList, color: colors[3], id: 18, isActive: 1 },
    ],
    "communications": [
      { module: "EmailReport", title: "Email Report", icon: FaEnvelope, color: colors[0], id: 19, isActive: 1 },
      { module: "WhatsappSMSReport", title: "WhatsApp SMS Report", icon: FaWhatsapp, color: colors[2], id: 20, isActive: 1 },
      { module: "BirthdayReport", title: "Birthday Report", icon: FaBirthdayCake, color: colors[4], id: 21, isActive: 1 },
      { module: "PatientFollowupReport", title: "Patient Followup Report", icon: FaPhoneVolume, color: colors[5], id: 22, isActive: 1 },
    ],
    "labwork": [
      { module: "LabworkReport", title: "Labwork Report", icon: FaFileImport, color: colors[0], id: 23, isActive: 1 },
    ],
    "feedback": [
      { module: "PatientFeedback", title: "Patient Feedback", icon: FaStar, color: colors[0], id: 23, isActive: 1 },
    ],
  };

  const reports = [
    { id: "appointments", title: "Appointments", icon: FaUsers, color: "primary" },
    { id: "patients", title: "Patients", icon: FaCog, color: "success" },
    { id: "communications", title: "Communications", icon: FaComments, color: "info" },
    { id: "feedback", title: "Feedback", icon: FaArtstation, color: "success" },
    // { id: "labwork", title: "Lab Work", icon: FaList, color: "warning" },
  ];

  const loadModules = async (path) => {
    const t = {};
    settingsCards[path].forEach((card) => {
      const moduleName = card.module || card.title.replace(/\s+/g, '');
      t[moduleName] = lazy(() => import(`./${path}/${moduleName}`));
    });
    setComponentMap(t);
  };

  const handleCardClick = (card, reportKey) => {
    const updated = settingsCards[reportKey].map(v => ({ ...v, selected: card.id === v.id }));
    setSelectedSubReports({ parent: reportKey, child: updated });
    loadModules(reportKey);
  };

  const SelectedComponent = selectedSubReports ? componentMap?.[selectedSubReports.child.find(c => c.selected)?.module] : null;

  return (
    <div className="page-content">
      <MetaTags>
        <title>Reports | {process.env.REACT_APP_TITLE}</title>
      </MetaTags>
      <Container fluid>
        {selectedSubReports ? (
          <Row>
            <Col lg={3}>
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">
                    <i
                      role="button"
                      title="Go back"
                      className="me-2 fa fa-arrow-left"
                      onClick={() => setSelectedSubReports(null)}
                    />{" "}
                    {reports.find(v => v.id === selectedSubReports?.parent)?.title}
                  </h5>
                  <ListGroup flush>
                    {selectedSubReports.child.filter(v => v.isActive).map((report) => (
                      <ListGroupItem
                        key={report.id}
                        tag="a"
                        href="#"
                        action
                        className="d-flex align-items-center"
                        active={report.selected}
                        onClick={() => handleCardClick(report, selectedSubReports.parent)}
                      >
                        <report.icon className={`me-3 text-${report.color}`} />
                        <span>{report.title}</span>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            <Col lg={9}>
              <Suspense fallback={<div>Loading...</div>}> {SelectedComponent && <SelectedComponent />} </Suspense>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={3}>
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Reports</h5>
                  <ListGroup flush>
                    {reports.map((report) => (
                      <ListGroupItem
                        key={report.id}
                        tag="a"
                        href="#"
                        action
                        className="d-flex align-items-center"
                        active={selectedReports === report.id}
                        onClick={() => setSelectedReports(report.id)}
                      >
                        <report.icon className={`me-3 text-${report.color}`} />
                        <span>{report.title}</span>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
            <Col lg={9}>
              <Row>
                {settingsCards[selectedReports].filter(v => v.isActive).map((card) => (
                  <Col
                    onClick={() => handleCardClick(card, selectedReports)}
                    md={3}
                    key={card.id}
                    className="mb-4"
                  >
                    <Card className="cursor-pointer" style={{ cursor: "pointer" }}>
                      <CardBody className="text-center">
                        <card.icon size={30} className={`mb-3 text-${card.color}`} />
                        <h6 className="text-dark">{card.title}</h6>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Reports;