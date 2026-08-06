import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

const FROM = "Beryl's Beauty Mark <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html }) {
  if (!env.resendApiKey) {
    console.log("RESEND_API_KEY not set, skipping email:", subject);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    console.error("Failed to send email:", subject, error.message);
  }
}

export function sendOrderConfirmation(customerEmail, order) {
  if (!customerEmail) return;
  const itemsHtml = order.items
    .map((item) => `<li>${item.quantity} x ${item.name} - GHC ${item.unitPrice}</li>`)
    .join("");
  return sendEmail({
    to: customerEmail,
    subject: "Your Beryl's Beauty Mark order is confirmed",
    html: `
      <h2>Thank you for your order</h2>
      <p>We have received your payment and your order is being prepared.</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: GHC ${order.totalAmount}</strong></p>
      <p>We will notify you as your order status updates.</p>
    `,
  });
}

export function sendAdminOrderNotification(order, customer) {
  if (!env.adminEmail) return;
  return sendEmail({
    to: env.adminEmail,
    subject: "New order received",
    html: `
      <h2>New order</h2>
      <p><strong>${customer.name}</strong> (${customer.phone}) just paid for an order.</p>
      <p>Total: GHC ${order.totalAmount}</p>
      <p>Check the admin dashboard for full details.</p>
    `,
  });
}

export function sendBookingReceived(customerEmail, booking, serviceName) {
  if (!customerEmail) return;
  return sendEmail({
    to: customerEmail,
    subject: "Your appointment request was received",
    html: `
      <h2>Appointment request received</h2>
      <p>Service: ${serviceName}</p>
      <p>Date: ${booking.date}</p>
      <p>Time: ${booking.timeSlot}</p>
      <p>Your confirmation code: <strong>${booking.confirmationCode}</strong></p>
      <p>We will confirm your appointment shortly.</p>
    `,
  });
}

export function sendAdminBookingNotification(booking, customer, serviceName) {
  if (!env.adminEmail) return;
  return sendEmail({
    to: env.adminEmail,
    subject: "New appointment request",
    html: `
      <h2>New appointment request</h2>
      <p><strong>${customer.name}</strong> (${customer.phone}) requested an appointment.</p>
      <p>Service: ${serviceName}</p>
      <p>Date: ${booking.date}</p>
      <p>Time: ${booking.timeSlot}</p>
    `,
  });
}

export function sendBookingApproved(customerEmail, booking, serviceName) {
  if (!customerEmail) return;
  return sendEmail({
    to: customerEmail,
    subject: "Your appointment is approved, payment needed",
    html: `
      <h2>Your appointment is approved</h2>
      <p>Service: ${serviceName}</p>
      <p>Date: ${booking.date}</p>
      <p>Time: ${booking.timeSlot}</p>
      <p>Please complete payment from your account to secure this slot.</p>
    `,
  });
}

export function sendOrderStatusUpdate(customerEmail, order, status) {
  if (!customerEmail) return;
  return sendEmail({
    to: customerEmail,
    subject: "Your order status has been updated",
    html: `
      <h2>Order update</h2>
      <p>Your order is now: <strong>${status.replaceAll("_", " ")}</strong></p>
    `,
  });
}