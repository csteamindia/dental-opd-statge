import React, { useEffect, useState } from "react";

const WhatsappConfig = () => {
    const [qrCode, setQRCode] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getQrCode = async () => {
        try {
            const formData = new FormData();
            formData.append("session", "4242803_ff");

            const response = await fetch("https://thedigitalizeclick.com/api/whatsapp/qrcode", {
                method: "POST",
                headers: {
                    "Api-key": "a190fd98-88d0-42bc-9e0b-6dacc558d55f"
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const { status, message, data } = await response.json();
            
            if (status == 'success') {
                setQRCode(data);
            } else {
                throw new Error(message || "Failed to fetch QR code.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const testmesage = async () => {
        const postdata = {
            contact: [
            {
                number: "919173742348",
                message: "In publishing and graphic design, Lorem ipsum"
            }]
        };

        const [success, data] = await post('/wp/send', postdata);        
    };

    useEffect(() => {
        getQrCode();
    }, []);

    if (loading) return <p>Loading QR Code...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            {
                qrCode.status === 409 ? (
                    <>
                        <p>WhatsApp tunnel connected</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input type="text" placeholder="Enter test message" />
                            <button onClick={testmesage}>Send</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Scan the QR Code to Connect WhatsApp</h3>
                        <img src={qrCode?.qr} alt="WhatsApp QR Code" />
                    </>
                )
            }
        </div>
    );
};

export default WhatsappConfig;
