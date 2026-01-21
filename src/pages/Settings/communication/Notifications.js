import React, { useEffect, useMemo, useState, Suspense } from "react"
import { Nav, NavItem, NavLink, Row, Col, Card, CardBody } from "reactstrap"
import classnames from "classnames"
import LoadingComponent from "../../utils/loadingComponent"
import cookieHelper from "helpers/getCookieData"

const Components = {
  EmailConfig: React.lazy(() => import("./emailConfig")),
  WhatsappConfig: React.lazy(() => import("./whatsappConfig")),
}

const CommunicationAttribute = () => {
  const clinic = cookieHelper.getCookie("_c")
    ? JSON.parse(atob(cookieHelper.getCookie("_c")))
    : {}

  const availableTabs = useMemo(() => {
    const tabs = []

    if (clinic?.smtp) {
      tabs.push({ key: "EmailConfig", label: "Email Config" })
    }

    if (clinic?.whatsapp) {
      tabs.push({ key: "WhatsappConfig", label: "Whatsapp Config" })
    }

    return tabs
  }, [clinic])

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.key)
  const ActiveComponent = activeTab ? Components[activeTab] : null

  return (
    <Row>
      <Col>
        <Card className="mb-1">
            <Nav className="navtab-bg nav-justified nav-pills">
              {availableTabs.map(tab => (
                <NavItem key={tab.key}>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab == tab.key,
                    })}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
        </Card>

        <Suspense fallback={<LoadingComponent />}>
          {ActiveComponent ? (
            <ActiveComponent clinicData={clinic} />
          ) : (
            <LoadingComponent />
          )}
        </Suspense>
      </Col>
    </Row>
  )
}

export default CommunicationAttribute
