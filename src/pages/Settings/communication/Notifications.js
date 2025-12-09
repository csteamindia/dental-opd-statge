import React, { useEffect, useState } from 'react';
import { get, post } from 'helpers/api_helper';
import { Nav, NavItem, NavLink, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import classnames from "classnames"
import { useLocation } from "react-router-dom"
import LoadingComponent from "../../utils/loadingComponent"
import cookieHelper from "helpers/getCookieData";


const Compoents = {
    EmailConfig: React.lazy(() => import("./emailConfig")),
    WhatsappConfig: React.lazy(() => import("./whatsappConfig"))
};

const difinedtabs = [
    "EmailConfig",
    "WhatsappConfig"
]

const CommunicationAttribute = () => {
    const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null;
    const [tabs, setTabs] = useState(difinedtabs);

    useEffect(() => {
        const availableTabs = [];

        if (clinic.smtp) {
            availableTabs.push("EmailConfig");
        }
        if (clinic.whatsapp) {
            availableTabs.push("WhatsappConfig");
        }

        setTabs(availableTabs);
    }, [clinic]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabName = queryParams.get('_t');
    const [customIconActiveTab, setcustomIconActiveTab] = useState("1")
    const [ActiveComponent, setActiveComponent] = useState(Compoents["EmailConfig"])


    const toggleIconCustom = tab => {
        if (customIconActiveTab !== tab) {
            setcustomIconActiveTab(tab)
            setActiveComponent(Compoents[tabs[tab - 1]])
        }
    }

    return (
        <Row>
            <Col>
                <Card className="mb-1">
                    <CardBody>
                        <Nav className="navtab-bg nav-justified nav nav-pills">
                            {
                                tabs.map((tab, index) => {
                                    return (
                                        <NavItem key={index}>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
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
                    </CardBody>
                </Card>
                <br />
                <React.Suspense fallback={<LoadingComponent />}>
                    {ActiveComponent ? <ActiveComponent /> : <LoadingComponent />}
                </React.Suspense>
            </Col>
        </Row>
    );
};

export default CommunicationAttribute;
