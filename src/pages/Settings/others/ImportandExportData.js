import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post } from 'helpers/api_helper';

const ImportandExportData = () => {

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Row>
                    <Col md={12}>

                        <Card>
                            <CardBody>
                                <h4 className="card-title">Import and Export Data</h4>
                                <p className="card-title-desc">You can import and export your data from here.</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title">Import and Export Data</h4>
                                <p className="card-title-desc">You can import and export your data from here.</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );

};

export default ImportandExportData;
