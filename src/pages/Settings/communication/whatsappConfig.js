import React, { useEffect, useState } from "react"
import { NOTIFICATION_URL } from "helpers/url_helper"
import { post, get } from "helpers/api_helper"
import { set } from "lodash"

const WhatsappConfig = ({ clinicData }) => {
  const [config, setConfig] = useState(null)
  const [qrCode, setQRCode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wpConnected, setWpConnected] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    wp_key: "",
    wp_sessionid: "",
  })

  /* ---------------- CHECK CONFIG ---------------- */
  const fetchConfig = async () => {
    if (!clinicData?.id) return

    try {
      setLoading(true)

      const { success, body } = await get(
        `${NOTIFICATION_URL}/config/wp/${clinicData.id}`,
        {}
      )

      if (success && body?.wp_key && body?.wp_sessionid) {
        const cfg = {
          wp_key: body.wp_key,
          wp_sessionid: body.wp_sessionid,
        }

        setConfig(cfg)
        await fetchStatus(cfg.wp_key, cfg.wp_sessionid)
      }
    } catch {
      setError("Failed to load WhatsApp configuration")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- STATUS / QR ---------------- */
  const fetchStatus = async (apiKey, sessionId) => {
    try {
      const formData = new FormData()
      formData.append("id", sessionId)

      const res = await fetch(
        "https://engage.catchysystem.com/api/whatsapp/status",
        {
          method: "POST",
          headers: { "Api-key": apiKey },
          body: formData,
        }
      )

      const data = await res.json()
      if (data.status == "error") {
        setError(data.error)
      }
      if (data.response?.status == "inactive") {
        await fetchQrCode(apiKey, sessionId)
      }
      if (data.data?.status == 301) {
        setWpConnected(true)
      }
    } catch {
      setError("Failed to fetch WhatsApp status")
    }
  }

  /* ---------------- GET QR CODE ---------------- */
  const fetchQrCode = async (apiKey, sessionId) => {
    try {
      const formData = new FormData()
      formData.append("id", sessionId)

      const res = await fetch(
        "https://engage.catchysystem.com/api/whatsapp/qr-code",
        {
          method: "POST",
          headers: { "Api-key": apiKey },
          body: formData,
        }
      )

      const data = await res.json()
      setQRCode(data.data)
    } catch {
      setError("Failed to fetch WhatsApp status")
    }
  }

  /* ---------------- SAVE CONFIG ---------------- */
  const saveConfig = async () => {
    try {
      setLoading(true)

      const { success } = await post(
        `${NOTIFICATION_URL}/config/wp/${clinicData.id}`,
        form
      )

      if (!success) throw new Error("Save failed")

      setConfig(form)
      await fetchStatus(form.wp_key, form.wp_sessionid)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- TEST MESSAGE ---------------- */
  const sendTestMessage = async () => {
    await post("/wp/send", {
      contact: [
        {
          number: "919173742348",
          message: "WhatsApp test message",
        },
      ],
    })
  }

  useEffect(() => {
    fetchConfig()
  }, [clinicData?.id])

  /* ---------------- UI ---------------- */
  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-danger">{error}</p>

  /* ---------- NO CONFIG ---------- */
  if (!config) {
    return (
      <div className="card">
        <div className="card-body">
          <input
            className="form-control mb-2"
            placeholder="API Key"
            value={form.wp_key}
            onChange={e => setForm({ ...form, wp_key: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Session ID"
            value={form.wp_sessionid}
            onChange={e => setForm({ ...form, wp_sessionid: e.target.value })}
          />

          <button className="btn btn-primary" onClick={saveConfig}>
            Save & Generate QR
          </button>
        </div>
      </div>
    )
  }

  /* ---------- CONFIG EXISTS ---------- */
  return (
    <div className="card">
      <div className="card-body">
        {{ error } && <p className="text-danger">{error}</p>}
        {wpConnected ? (
          <>
            <p className="text-success">✅ WhatsApp Connected</p>
            <button className="btn btn-success" onClick={sendTestMessage}>
              Send Test Message
            </button>
          </>
        ) : (
          <>
            <p>Scan QR Code to connect WhatsApp</p>
            {qrCode?.qr && <img src={qrCode.qr} alt="WhatsApp QR" />}
          </>
        )}
      </div>
    </div>
  )
}

export default WhatsappConfig
