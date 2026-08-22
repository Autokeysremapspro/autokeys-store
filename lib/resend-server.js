async function sendEmail({ from, to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`resend_error: ${res.status} ${body}`);
  }
  return res.json();
}

module.exports = { sendEmail };
