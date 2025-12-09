import React, { useState } from "react";
import { get, post } from 'helpers/api_helper';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Datatables from 'pages/utils/table/datatable';
import { NOTIFICATION_URL } from 'helpers/url_helper';

const SMSTemplate = () => {
    const [data, setData] = useState({
        title:'',
        description:'',
    });

    const handleSubmit = async() => {
        const res = await post(`${NOTIFICATION_URL}/wp/templates`);
        console.log(res);
    }

    return(
        <Card>
            <CardBody>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <h3>Templates</h3>
                            <Row className='mt-2'>
                                <Col>
                                    <FormGroup>
                                        <Label for="username">Title</Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            value={data?.title}
                                            onChange={(e) => setData(p=>({...p, title: e.target.value}))}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="username">Content</Label>
                                        <textarea
                                            rows={6}
                                            className="form-control"
                                            type="text"
                                            id="content"
                                            value={data?.content}
                                            onChange={(e) => setData(p=>({...p, description: e.target.value}))}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button className='mt-2' type="submit">Save Template</Button>
                        </Form>
                    </Col>
                    <Col md={5}>
                        <Datatables
                            isSearch={true}
                            columns={[]}
                            showTableOnly={true}
                            rowsLength={0}
                            rows={[]}
                            keyField={'id'}
                            title="Templates"
                            isAdd={false}
                            isTableHead={true}
                            ssr={() => { }}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card> 
    )
}

export default SMSTemplate;