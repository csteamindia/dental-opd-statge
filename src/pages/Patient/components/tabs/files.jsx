import React, { useState, useEffect } from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import Dropzone from 'helpers/Dropzone'
import { uploadImg, get } from 'helpers/api_helper';
import { FILES_URL } from 'helpers/url_helper';
import Datatables from 'pages/utils/table/datatable';

const options = {
    '1':'Testimonials',
    '2':'Scanned Image',
    '3':'Patient Reports',
    '4':'Other'
}

const Files = ({patientData}) => {
    const [rows, setRows] = useState({});
    const [formData, setFormData] = useState({ file_type: '', remark: '', files: ''});
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fatchFiles = async() => {
        const {success, body} = await get(`${FILES_URL}?patient_id=${patientData?.id}`);
        if(success){
            setRows(body);
        }
    }

    useEffect(() => {
        fatchFiles();
    }, []);

    const handleFilesData = (files) => {
        setFormData(p => ({...p, files: files}));
    }

    const handleSubmit = async() => {
        const data = new FormData();
        data.append('file_type', formData.file_type);
        data.append('remark', formData.remark);

        if(formData.files.length > 0) {
            for(let i = 0; i < formData.files.length; i++) {
                data.append('files[]', formData.files[i]);
            }
        }

        try {
            const {success, body} = await uploadImg(`${FILES_URL}?patient_id=${patientData?.id}`, data);
            if(success){
                alert('File uploaded successfully');
                fatchFiles();
            }
            
        } catch (error) {
            alert('Error uploading file');
            console.error(error);
        }
    }
    
    return(
        <Row>
             <Col lg={3}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col>
                                <label>File Type</label>
                                <select className='form-control' name="file_type" onChange={(e) => setFormData(p => ({...p, file_type: e.target.value}))}>
                                    <option value='1'>Testimonials</option>
                                    <option value='2'>Scanned Image</option>
                                    <option value='3'>Patient Reports</option>
                                    <option value='4'>Other</option>
                                </select>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col>
                                <label>Remark</label>
                                <textarea className='form-control' onChange={(e) => setFormData(p => ({...p, remark: e.target.value}))} />
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col>
                                <label>File</label>
                                <Dropzone callback={handleFilesData} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button className='btn btn-primary w-100 mt-2' onClick={handleSubmit}>Upload</button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
            <Col>
                <Card>
                    <CardBody>
                        <Row>
                            {Object.entries(rows?.items || {}).map(([date, items]) => (
                                <div key={date}>
                                    <h5 className="mb-3 mt-4">{date}</h5> {/* Group Header by Date */}

                                    <Row>
                                    {items.map((item, index) => (
                                        <Col key={`UIPD_${date}_${index}`}>
                                            <div className="p-1 border shadow-none card">
                                                <div className="position-relative d-flex">
                                                    {
                                                        item?.file_path && JSON.parse(item?.file_path)?.map((v, i) => {
                                                            return <img key={`FIPU_${i+1}`} className="me-2" src={`${process.env.REACT_APP_FILE_LINK}${v.path}`} style={{width: '192px'}}/>
                                                        })
                                                    }
                                                </div>
                                                <div className="pt-2">
                                                    <ul className="list-inline">
                                                        <li className="list-inline-item me-3">
                                                            <i className="bx bx-purchase-tag-alt align-middle text-muted me-1"></i> {options[item.file_type]}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                    </Row>
                                </div>
                            ))}
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default Files;