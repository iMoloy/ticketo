"use client";

import { useRef } from "react";
import { Button } from "@heroui/react";
import { FaDownload, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaCheckCircle } from "react-icons/fa";

export default function TicketDownloadButton({ ticket }) {
    const ticketRef = useRef(null);

    const handleDownload = () => {
        const ticketId = ticket._id?.slice(-8).toUpperCase() || "XXXXXXXX";
        const bookingDate = new Date(ticket.bookingDate).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric"
        });

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Ticketo — ${ticket.eventTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
    }
    .ticket {
      background: #0f172a;
      color: white;
      border-radius: 20px;
      width: 520px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
    }
    .ticket-header {
      background: linear-gradient(135deg, #ec4899, #6366f1);
      padding: 28px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .logo span { color: #fbbf24; }
    .badge {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 50px;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .ticket-body { padding: 28px 32px; }
    .event-title {
      font-size: 22px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 20px;
      color: #f8fafc;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #94a3b8;
    }
    .info-row .icon { color: #ec4899; font-size: 14px; }
    .info-row strong { color: #e2e8f0; }
    .divider {
      border: none;
      border-top: 1px dashed rgba(255,255,255,0.12);
      margin: 20px 0;
      position: relative;
    }
    .divider::before, .divider::after {
      content: '';
      position: absolute;
      top: -10px;
      width: 20px; height: 20px;
      background: #f1f5f9;
      border-radius: 50%;
    }
    .divider::before { left: -44px; }
    .divider::after { right: -44px; }
    .stats-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .stat-box {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 14px 18px;
      flex: 1;
      margin-right: 12px;
      text-align: center;
    }
    .stat-box:last-child { margin-right: 0; }
    .stat-box .label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .stat-box .value {
      font-size: 18px;
      font-weight: 900;
      color: #f8fafc;
    }
    .stat-box .value.green { color: #34d399; }
    .ticket-footer {
      background: rgba(255,255,255,0.04);
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 18px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ticket-id {
      font-size: 11px;
      color: #475569;
      letter-spacing: 1.5px;
      font-weight: 600;
      font-family: monospace;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(52, 211, 153, 0.1);
      border: 1px solid rgba(52, 211, 153, 0.25);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 5px 12px;
      border-radius: 50px;
    }
    @media print {
      body { background: white; padding: 0; }
      .ticket { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <div class="logo">Tick<span>eto</span></div>
      <div class="badge">🎟 Official Ticket</div>
    </div>
    <div class="ticket-body">
      <div class="event-title">${ticket.eventTitle}</div>
      <div class="info-row">
        <span class="icon">📅</span>
        <strong>Booked on:</strong> ${bookingDate}
      </div>
      <div class="info-row">
        <span class="icon">✉️</span>
        <strong>Attendee:</strong> ${ticket.userEmail || "N/A"}
      </div>
      <div class="info-row">
        <span class="icon">📍</span>
        <strong>Venue:</strong> ${ticket.eventLocation || "See event details"}
      </div>
      <hr class="divider" />
      <div class="stats-row">
        <div class="stat-box">
          <div class="label">Tickets</div>
          <div class="value">${ticket.quantity}x</div>
        </div>
        <div class="stat-box">
          <div class="label">Price/Ticket</div>
          <div class="value">$${ticket.amount && ticket.quantity ? (ticket.amount / ticket.quantity).toFixed(2) : "0.00"}</div>
        </div>
        <div class="stat-box">
          <div class="label">Total Paid</div>
          <div class="value green">$${ticket.amount?.toFixed(2) || "0.00"}</div>
        </div>
      </div>
    </div>
    <div class="ticket-footer">
      <div class="ticket-id">TICKET # ${ticketId}</div>
      <div class="status">✓ CONFIRMED</div>
    </div>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
    };

    return (
        <Button
            size="sm"
            variant="flat"
            className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 font-semibold"
            startContent={<FaDownload className="text-xs" />}
            onPress={handleDownload}
        >
            Download
        </Button>
    );
}
