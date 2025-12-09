import React, { useState, useEffect, lazy, Suspense } from "react"
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Card, CardBody, ListGroup, ListGroupItem } from "reactstrap"
import cookieHelper from "helpers/getCookieData";

// Import icons
import { FaUsers, FaUserMd, FaUsersCog, FaHospital, FaList, FaCapsules, FaPiggyBank, FaCog, FaFileAlt, FaTeeth, FaChair, FaShareAlt, FaComments, FaSms, FaEnvelope, FaLanguage, FaTags } from "react-icons/fa"


const Settings = () => {
  const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null;
  const [selectedCategory, setSelectedCategory] = useState("user");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [componentMap, setCompomentMap] = useState(null);

  const colors = ["primary", "success", "info", "warning", "danger", "secondary"];

  const settingsCards = {
    "user": [
      { module: "ManageClinic", title: "Manage Clinic", icon: FaHospital, color: colors[0], id: 1, isActive: 1 },
      { module: "ManageUsers", title: "Manage Users", icon: FaUsers, color: colors[1], id: 2, isActive: 1 },
      { module: "ManageDoctor", title: "Manage Doctors", icon: FaUserMd, color: colors[2], id: 3, isActive: 1 },
      { module: "UserRoleAccess", title: "User Role Access", icon: FaUsersCog, color: colors[3], id: 4, isActive: 1 },
    ],
    "master": [
      { module: "ManageTreatments", title: "Manage Treatments", icon: FaList, color: colors[0], id: 5, isActive: 1 },
      { module: "ManageMedicine", title: "Manage Medicine", icon: FaCapsules, color: colors[1], id: 6, isActive: 1 },
      // { module: "ManageBankAccount", title: "Manage Bank Account", icon: FaPiggyBank, color: colors[2], id: 7, isActive: 1 },
      { module: "ManageSymstoms", title: "Manage Symstoms", icon: FaCog, color: colors[3], id: 8, isActive: 1 },
      { module: "ManageRxTemplate", title: "Manage Rx Template", icon: FaFileAlt, color: colors[4], id: 9, isActive: 1 },
      { module: "ManageDentalChart", title: "Manage Dental Chart", icon: FaTeeth, color: colors[5], id: 10, isActive: 1 },
      { module: "ManageChairs", title: "Manage Chairs", icon: FaChair, color: colors[0], id: 11, isActive: 1 },
      { module: "ManageReferences", title: "Manage References", icon: FaShareAlt, color: colors[1], id: 12, isActive: 1 },
      { module: "ManageCommunicationGroup", title: "Communication Group", icon: FaComments, color: colors[3], id: 13, isActive: 1 },
      { module: "ManageTags", title: "Tag's", icon: FaTags, colors: [3], id: 14, isActive: 1 },
      { module: "ManageLanguage", title: "Language's", icon: FaLanguage, color: colors[0], id: 15, isActive: 1 },
    ],
    "communication": [
      { module: "Notifications", title: "Settings", icon: FaComments, color: colors[0], id: 16, isActive: 1 },
      { module: "SMSTemplate", title: "Whastapp Template", icon: FaSms, color: colors[1], id: 17, isActive: clinic?.whatsapp || 0 },
      { module: "EmailTemplate", title: "Email Template", icon: FaEnvelope, color: colors[2], id: 18, isActive: clinic?.smtp || 0 },
    ],
  };

  const categories = [
    { id: "user", title: "User Management", icon: FaUsers, color: "primary" },
    { id: "master", title: "Manage Master", icon: FaCog, color: "success" },
    { id: "communication", title: "Notification & Reminder Settings", icon: FaComments, color: "info" },
  ];

  const loadModules = async (path) => {
    let t = []
    settingsCards[path].map((card) => {
      card.module = card.module || card.title.replace(/\s+/g, '');
      t[card.module] = lazy(() => import(`./${path}/${card.module}`));
    })
    setCompomentMap(t);
  }

  const handleCardClick = (card, selectedCategory) => {
    const t = {
      parent: selectedCategory,
      child: settingsCards[selectedCategory].map(v => {
        return {
          ...v,
          selected: card.id === v.id ? true : false
        }
      }),
    }
    setSelectedSubCategory(t);
    loadModules(selectedCategory)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Settings | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Settings</h4>

          {
            selectedSubCategory ?
              <Row>
                <Col lg={3}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-3"> <i role="button" title="go to back" className="me-2 fa fa-arrow-left" onClick={() => setSelectedSubCategory(null)} /> {categories.find(v => v.id == selectedSubCategory?.parent)?.title}</h5>
                      <ListGroup flush>
                        {selectedSubCategory?.child?.filter(v => v.isActive).map((category) => (
                          <ListGroupItem
                            key={category.id}
                            tag="a"
                            href="#"
                            action
                            className="d-flex align-items-center"
                            active={category.selected}
                            onClick={() => handleCardClick(category, selectedSubCategory?.parent)}
                          >
                            <category.icon className={`me-3 text-${category.color}`} />
                            <span>{category.title}</span>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={9}>
                  {/* <h5 className="card-title mb-4">{selectedSubCategory?.child?.find(c => c.selected)?.title}</h5> */}
                  <Suspense fallback={<div>Loading...</div>}>
                    {
                      (() => {
                        const Component = componentMap[selectedSubCategory.child.find(c => c.selected).module];
                        return Component ? <Component /> : null;
                      })()
                    }
                  </Suspense>

                </Col>
              </Row>
              :
              <Row>
                <Col lg={3}>
                  <Card>
                    <CardBody>
                      <h5 className="card-title mb-3">Settings Categories</h5>
                      <ListGroup flush>
                        {categories.map((category) => (
                          <ListGroupItem
                            key={category.id}
                            tag="a"
                            href="#"
                            action
                            className="d-flex align-items-center"
                            active={selectedCategory === category.id}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <category.icon className={`me-3 text-${category.color}`} />
                            <span>{category.title}</span>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={9}>
                  {/* <h5 className="card-title mb-4">
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </h5> */}
                  <Row>
                    {settingsCards[selectedCategory].filter(v => v.isActive).map((card) => {
                      return <Col onClick={() => handleCardClick(card, selectedCategory)} md={3} key={card.id} className="mb-4"> {/* Use card.id as the key */}
                        <Card
                          className="cursor-pointer"
                          style={{ cursor: 'pointer' }}
                        >
                          <CardBody className="text-center">
                            <card.icon
                              size={30}
                              className={`mb-3 text-${card.color}`}
                            />
                            <h6 className="text-dark">
                              {card.title}
                            </h6>
                          </CardBody>
                        </Card>
                      </Col>
                    })}
                  </Row>
                </Col>
              </Row>
          }

        </Container>
      </div>
    </React.Fragment>
  )
}

export default Settings;
