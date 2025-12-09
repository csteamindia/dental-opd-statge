import React, { useEffect, useState } from "react";
import { Modal, Row, Col } from "reactstrap";
import { get, post } from "helpers/api_helper";
import { showSuccessAlert } from "pages/utils/alertMessages";

const TYPE_CONFIG = {
    CommunicationGroup: { api: "Communication-Group", label: "Communication Group" },
    Allergy: { api: "Allergies", label: "Medical Alerts" },
    Tags: { api: "Tags", label: "Tags" },
};

const CTMTabs = ({ patientData, isOpen, toggle, type = "CommunicationGroup", onItemAdded }) => {
    const [formData, setFormData] = useState({ title: "" });

    const { api: apiEndpoint, label: labelName } = TYPE_CONFIG[type] || TYPE_CONFIG.CommunicationGroup;

    useEffect(() => {
        if (isOpen) {
            setFormData({ patientData, title: "" });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { success, body } = await post(apiEndpoint, formData);
            if (success) {
                showSuccessAlert(`${labelName} created successfully!`);
                toggle();
                setFormData({ patientData, title: "" });
                if (onItemAdded) {
                    onItemAdded(body);
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return (
        <Modal size="md" isOpen={isOpen} toggle={toggle} className="custom-modal">
            <div className="modal-header">
                <h5 className="modal-title">{labelName}</h5>
                <button type="button" className="btn-close" onClick={toggle}></button>
            </div>
            <div className="modal-body">
                <Row>
                    <Col>
                        <label>{labelName}</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={labelName}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="mt-3">
                            <button className="btn btn-primary" style={{ float: "right" }} onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default CTMTabs;
