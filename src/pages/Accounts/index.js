import React, { useState, lazy, Suspense } from "react"
import MetaTags from 'react-meta-tags'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap"

// Import icons
import {
  FaCreditCard,
  FaFileInvoiceDollar,
  FaBook,
  FaWallet,
  FaUniversity
} from "react-icons/fa"

const Accounts = () => {
  const [selectedCategory, setSelectedCategory] = useState("ManageAccounts");
  const [selectedCard, setSelectedCard] = useState(null);
  const [componentMap, setComponentMap] = useState({});

  const colors = ["primary", "success", "info", "warning", "danger"];

  const accountCards = {
    "ManageAccounts": [
      { module: "ManagePayment", title: "Payment", icon: FaCreditCard, color: colors[0], id: 1 },
      { module: "ManageBill", title: "Bill", icon: FaFileInvoiceDollar, color: colors[1], id: 2 },
      { module: "ManagePassbook", title: "Passbook", icon: FaBook, color: colors[2], id: 3 },
      { module: "ManagePettyCash", title: "Petty Cash", icon: FaWallet, color: colors[3], id: 4 },
      { module: "ManageBankDeposit", title: "Bank Deposit", icon: FaUniversity, color: colors[4], id: 5 },
    ]
  };

  const loadModules = async (path) => {
    const cards = accountCards[path];
    const map = {};

    cards.forEach(card => {
      const moduleName = card.module || card.title.replace(/\s+/g, '');
      map[moduleName] = lazy(() => import(`./${path}/${moduleName}`));
    });

    setComponentMap(map);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    loadModules(selectedCategory);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Accounts | {process.env.REACT_APP_TITLE}</title>
        </MetaTags>
        <Container fluid>
          <h4>Accounts</h4>

          {selectedCard ? (
            <Row>
              <Col lg={12}>
                {/* <h5 className="card-title mb-4 d-flex align-items-center">
                  <i
                    role="button"
                    title="Go back"
                    className="me-2 fa fa-arrow-left"
                    onClick={() => setSelectedCard(null)}
                  />
                  {selectedCard.title}
                </h5> */}
                <Suspense fallback={<div>Loading...</div>}>
                  {
                    (() => {
                      const Comp = componentMap[selectedCard.module];
                      return Comp ? <Comp /> : null;
                    })()
                  }
                </Suspense>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col lg={12}>
                {/* <h5 className="card-title mb-4">Select a Payment Module</h5> */}
                <Row>
                  {accountCards[selectedCategory].map((card) => (
                    <Col
                      onClick={() => handleCardClick(card)}
                      md={3}
                      key={card.id}
                      className="mb-4"
                    >
                      <Card className="cursor-pointer"
                        style={{ cursor: 'pointer' }}>
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
    </React.Fragment>
  )
}

export default Accounts;
