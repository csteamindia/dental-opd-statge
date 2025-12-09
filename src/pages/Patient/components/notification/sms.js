
import React, { useState } from 'react';
import { Row, Col, Modal, ModalBody } from 'reactstrap'

const SmsNotification = ({mobile="", open=false, callback=()=>{}}) => {
    const [data, setData] = useState({
        mobile: mobile,
        message: ""
    })

    const handleSendButton  = () =>{} 

    return (
        <Modal size="lg" isOpen={open}>
            <div className='d-flex justify-content-between pt-3 ps-3 pe-3'>
                <h5>Send Sms</h5>
                <span role="button" onClick={callback}>x</span>
            </div>
            <hr />
            <ModalBody className='mt-0'>
                <Row>
                    <Col>
                        <strong>Patient Whatsapp No# {mobile}</strong>
                        <textarea rows={4} className='form-control mt-2' onChange={(e) => { setData(p => ({...p, message: e.target.value}))}} placeholder='please enter message' />
                    </Col>
                </Row>
                <Row className='mt-3 text-end'>
                    <Col>
                        <button onClick={handleSendButton} className='btn btn-success' style={{width: '160px'}}>Send</button>
                    </Col>
                </Row>
            </ModalBody>
    </Modal>
    )
}

export default SmsNotification;