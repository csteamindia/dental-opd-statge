import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row } from "reactstrap"
import LoadingComponent from "../../utils/loadingComponent"
import classnames from "classnames"
import { useLocation } from "react-router-dom"
import { Profiletabs } from 'constants/patient'

const Compoents = {
    Profile: React.lazy(() => import("./tabs/profile")),
    Investigations: React.lazy(() => import("./tabs/investigations")),
    Examination: React.lazy(() => import("./tabs/examination")),
    Treatment: React.lazy(() => import("./tabs/treatment")),
    Prescription: React.lazy(() => import("./tabs/prescription")),
    Files: React.lazy(() => import("./tabs/files")),
    Bills: React.lazy(() => import("./tabs/billing")),
    Payments: React.lazy(() => import("./tabs/payments")),
    Ledger: React.lazy(() => import("./tabs/ledger")),
    Appointments: React.lazy(() => import("./tabs/appointments")),
    Notes: React.lazy(() => import("./tabs/notes")),
    Followup: React.lazy(() => import("./tabs/followUp"))
};

const Tabs = ({patientData, configData=null, role = 'admin'}) => {
    const location = useLocation();
    let removeComponents = [];
    const queryParams = new URLSearchParams(location.search);
    const tabName = queryParams.get('_t');
    const [formAutoOpen, setFormAutoOpen] = useState(false)
    const [customIconActiveTab, setcustomIconActiveTab] = useState("1")
    const [ActiveComponent, setActiveComponent] = useState(Compoents["Profile"])

    let tabs = [];
    if(!configData?.user?.config?.billing_info){
        removeComponents = ["Bills", "Payments", "Ledger"]
        tabs = Profiletabs[role].filter(v => !removeComponents.includes(v));
    }else{
        tabs = Profiletabs[role];
    }
    
    const toggleIconCustom = tab => {
        if (customIconActiveTab !== tab) {
            setcustomIconActiveTab(tab)
            setActiveComponent(Compoents[tabs[tab-1]])
        }
    }
    
    useEffect(() => {
        setFormAutoOpen(false)
        if(tabName){
            setcustomIconActiveTab(`${tabs?.indexOf(tabName)+1}`)
            setActiveComponent(Compoents[tabName])
            setFormAutoOpen(true)
        }
    }, [tabName])

    return(
        <>
            <Card className="mb-1">
                <CardBody>
                    <Row>
                        <Col lg={11}>
                            <Nav className="navtab-bg nav-justified nav nav-pills">
                                {
                                    tabs.map((tab, index) => {
                                        return(
                                            <NavItem key={index}>
                                                <NavLink
                                                    style={{ cursor: "pointer", textAlign: 'left' }}
                                                    className={classnames({
                                                        active: customIconActiveTab === `${index + 1}`,
                                                    })}
                                                    onClick={() => {
                                                        toggleIconCustom(`${index + 1}`)
                                                    }}
                                                >
                                                    {tab}
                                                </NavLink>
                                            </NavItem>
                                        )
                                    })
                                }
                            </Nav>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Row>
                <Col>
                    <React.Suspense fallback={<LoadingComponent />}>
                        {ActiveComponent ? <ActiveComponent isFormPreOpen={formAutoOpen} patientData={patientData} /> : <LoadingComponent />}
                    </React.Suspense>
                </Col>
            </Row>
        </>
    )
}

export default Tabs;