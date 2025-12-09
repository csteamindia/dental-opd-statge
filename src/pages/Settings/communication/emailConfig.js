import React, { useState } from "react";
import { get, post } from 'helpers/api_helper';
import { Nav, NavItem, NavLink, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Select from "react-select";

const EmailConfig = () => {
    const [smtpServer, setSmtpServer] = useState({
        host: '',
        port: [{ value: 465, label: 465 }],
        encription: [{ value: 'ssl', label: 'SSL' }],
        from_email: '',
        username: '',
        password: '',
    });

    const handleSubmit = () => { }

    return (
        <Card>
            <CardBody>
                <Form onSubmit={handleSubmit}>
                    <h3>SMPT Config</h3>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="smtpServer">SMTP Server</Label>
                                <Input
                                    type="text"
                                    id="smtpServer"
                                    value={smtpServer?.host}
                                    onChange={(e) => setSmtpServer(p => ({ ...p, host: e.target.value }))}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="port">Port</Label>
                                <Select
                                    id="port"
                                    className="basic-single"
                                    isClearable={false}
                                    isSearchable={false}
                                    value={smtpServer?.port}
                                    options={[
                                        { value: 25, label: 25 },
                                        { value: 465, label: 465 },
                                        { value: 587, label: 587 },
                                    ]}
                                    onChange={(selectedOption) => {
                                        setSmtpServer(p => ({ ...p, port: selectedOption }))
                                    }}
                                    placeholder="Defalut port 465" />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="Encription">Encription</Label>
                                <Select
                                    id="port"
                                    className="basic-single"
                                    isClearable={false}
                                    isSearchable={false}
                                    value={smtpServer?.encription}
                                    options={[
                                        { value: 'ssl', label: 'SSL' },
                                        { value: 'tsl', label: 'TSL' }
                                    ]}
                                    onChange={(selectedOption) => {
                                        setSmtpServer(p => ({ ...p, encription: selectedOption }))
                                    }}
                                    placeholder="Defalut encription SSL" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="username">From Email</Label>
                                <Input
                                    type="email"
                                    id="from_email"
                                    value={smtpServer?.from_email}
                                    onChange={(e) => setSmtpServer(p => ({ ...p, from_email: e.target.value }))}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    value={smtpServer?.username}
                                    onChange={(e) => setSmtpServer(p => ({ ...p, username: e.target.value }))}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    value={smtpServer?.password}
                                    onChange={(e) => setSmtpServer(p => ({ ...p, password: e.target.value }))}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="mt-2">
                                <Button className='mt-2' type="submit">Save SMTP Settings</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
    )
}

export default EmailConfig;