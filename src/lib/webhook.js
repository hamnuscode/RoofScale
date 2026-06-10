/* Where qualified/unqualified leads should be POSTed.
   Replace with your CRM / Zapier / Make webhook endpoint. */
export const WEBHOOK_URL = 'https://example.com/webhook/roofing-audit'

/* Silent qualification scoring.
   Disqualifiers: 1 to 3 jobs/month, not the owner, or "No" budget. */
export function isQualified(answers) {
  if (answers.jobsPerMonth === '1-3') return false
  if (answers.isOwner === 'No') return false
  if (answers.budget === 'No') return false
  return true
}

/* Fire-and-forget POST; never blocks the redirect to thank-you. */
export function sendLead(payload) {
  try {
    if (WEBHOOK_URL && !WEBHOOK_URL.includes('example.com') && 'fetch' in window) {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    } else {
      // Placeholder endpoint: log the payload that is ready to send.
      console.log('[audit-form] payload ready to POST to WEBHOOK_URL:', payload)
    }
  } catch (err) {
    console.warn('[audit-form] webhook send skipped:', err)
  }
}
