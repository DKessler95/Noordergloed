import Mailjet from 'node-mailjet';

if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
  throw new Error("MAILJET_API_KEY and MAILJET_SECRET_KEY environment variables must be set");
}

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

interface EmailParams {
  to: string[];
  subject: string;
  textContent: string;
  htmlContent: string;
  fromEmail?: string;
  fromName?: string;
}

export async function sendBulkEmail(params: EmailParams): Promise<boolean> {
  try {
    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        Messages: params.to.map(email => ({
          From: {
            Email: params.fromEmail || "dc@damian.kessler.nl",
            Name: params.fromName || "Pluk & Poot"
          },
          To: [
            {
              Email: email,
              Name: ""
            }
          ],
          Subject: params.subject,
          TextPart: params.textContent,
          HTMLPart: params.htmlContent
        }))
      });

    const result = await request;
    console.log('Email sent successfully:', result.body);
    return true;
  } catch (error) {
    console.error('Mailjet email error:', error);
    return false;
  }
}

export async function sendRamenInvitation(emails: string[], date: string): Promise<boolean> {
  const subject = `🍜 Ramen Ervaring Bevestiging - ${date}`;
  
  const textContent = `
Beste ramen liefhebber,

Geweldig nieuws! We hebben genoeg aanmeldingen voor de ramen ervaring op ${date}.

De ramen ervaring zal plaatsvinden bij Pluk & Poot met verse, lokale ingrediënten en authentieke Japanse smaken.

Details:
- Datum: ${date}
- Tijd: 18:00 - 20:00
- Locatie: Pluk & Poot, Groningen
- Prijs: €25 per persoon

We nemen binnenkort contact met je op voor de finale details en betalingsinstructies.

Met vriendelijke groet,
Het Pluk & Poot Team
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">🍜 Ramen Ervaring Bevestiging</h1>
      
      <p>Beste ramen liefhebber,</p>
      
      <p><strong>Geweldig nieuws!</strong> We hebben genoeg aanmeldingen voor de ramen ervaring op <strong>${date}</strong>.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Details van je Ramen Ervaring:</h3>
        <ul style="list-style: none; padding: 0;">
          <li>📅 <strong>Datum:</strong> ${date}</li>
          <li>🕕 <strong>Tijd:</strong> 18:00 - 20:00</li>
          <li>📍 <strong>Locatie:</strong> Pluk & Poot, Groningen</li>
          <li>💰 <strong>Prijs:</strong> €25 per persoon</li>
        </ul>
      </div>
      
      <p>De ramen ervaring wordt bereid met verse, lokale ingrediënten en authentieke Japanse smaken.</p>
      
      <p>We nemen binnenkort contact met je op voor de finale details en betalingsinstructies.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Met vriendelijke groet,<br>
        <strong>Het Pluk & Poot Team</strong></p>
      </div>
    </div>
  `;

  return await sendBulkEmail({
    to: emails,
    subject,
    textContent,
    htmlContent
  });
}