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
    console.log('Attempting to send email to:', params.to);
    console.log('From email:', params.fromEmail || "dc@damian.kessler.nl");
    
    const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        Messages: params.to.map(email => ({
          From: {
            Email: params.fromEmail || "dckessler95@gmail.com",
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
    console.log('Mailjet response status:', result.response?.status);
    console.log('Mailjet response body:', JSON.stringify(result.body, null, 2));
    
    // Check if email was actually accepted
    if (result.body && result.body.Messages) {
      const firstMessage = result.body.Messages[0];
      if (firstMessage && firstMessage.Status === 'success') {
        console.log('Email accepted by Mailjet for delivery');
        return true;
      } else {
        console.log('Email not accepted by Mailjet:', firstMessage);
        return false;
      }
    }
    
    return false;
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

export async function sendAdminNotification(orderDetails: string): Promise<boolean> {
  const subject = "🔔 Nieuwe Ramen Bestelling - Pluk & Poot";
  
  const textContent = `
Hallo Damian,

Er is een nieuwe ramen bestelling binnengekomen op je website!

${orderDetails}

Log in op je admin dashboard om de bestelling te bekijken en te beheren.

Groet,
Je Pluk & Poot Website
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">🔔 Nieuwe Ramen Bestelling</h1>
      
      <p>Hallo Damian,</p>
      
      <p>Er is een nieuwe ramen bestelling binnengekomen op je website!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Bestelling Details:</h3>
        <pre style="white-space: pre-wrap; font-family: monospace;">${orderDetails}</pre>
      </div>
      
      <p>Log in op je admin dashboard om de bestelling te bekijken en te beheren.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Groet,<br>
        <strong>Je Pluk & Poot Website</strong></p>
      </div>
    </div>
  `;

  return await sendBulkEmail({
    to: ["dckessler95@gmail.com"],
    subject,
    textContent,
    htmlContent,
    fromEmail: "dckessler95@gmail.com",
    fromName: "Pluk & Poot Notificaties"
  });
}

// Email template voor contact formulier berichten
export async function sendContactNotification(contactData: any): Promise<boolean> {
  const subject = "📬 Nieuw Contact Bericht - Pluk & Poot";
  
  const textContent = `
Hallo Damian,

Er is een nieuw contact bericht binnengekomen via je website!

Naam: ${contactData.name}
Email: ${contactData.email}
Telefoon: ${contactData.phone || 'Niet opgegeven'}

Bericht:
${contactData.message}

Verzonden op: ${new Date().toLocaleString('nl-NL')}

Groet,
Je Pluk & Poot Website
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">📬 Nieuw Contact Bericht</h1>
      
      <p>Hallo Damian,</p>
      
      <p>Er is een nieuw contact bericht binnengekomen via je website!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
        <p><strong>Naam:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Telefoon:</strong> ${contactData.phone || 'Niet opgegeven'}</p>
        
        <h4 style="color: #374151; margin-bottom: 10px;">Bericht:</h4>
        <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #7c3aed;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      <p><small>Verzonden op: ${new Date().toLocaleString('nl-NL')}</small></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Groet,<br>
        <strong>Je Pluk & Poot Website</strong></p>
      </div>
    </div>
  `;

  return await sendBulkEmail({
    to: ["dckessler95@gmail.com"],
    subject,
    textContent,
    htmlContent,
    fromEmail: "dckessler95@gmail.com",
    fromName: "Pluk & Poot Contact"
  });
}

// Email template voor syrup bestellingen
export async function sendOrderNotification(orderData: any): Promise<boolean> {
  const subject = "🛒 Nieuwe Siroop Bestelling - Pluk & Poot";
  
  const textContent = `
Hallo Damian,

Er is een nieuwe siroop bestelling binnengekomen!

Klant: ${orderData.customerName}
Email: ${orderData.customerEmail}
Telefoon: ${orderData.customerPhone || 'Niet opgegeven'}
Product: ${orderData.productName}
Aantal: ${orderData.quantity}
Totaal: €${orderData.totalAmount}

Opmerkingen: ${orderData.notes || 'Geen opmerkingen'}

Verzonden op: ${new Date().toLocaleString('nl-NL')}

Groet,
Je Pluk & Poot Website
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">🛒 Nieuwe Siroop Bestelling</h1>
      
      <p>Hallo Damian,</p>
      
      <p>Er is een nieuwe siroop bestelling binnengekomen!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Bestelling Details:</h3>
        <p><strong>Klant:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Telefoon:</strong> ${orderData.customerPhone || 'Niet opgegeven'}</p>
        <p><strong>Product:</strong> ${orderData.productName}</p>
        <p><strong>Aantal:</strong> ${orderData.quantity}</p>
        <p><strong>Totaal:</strong> €${orderData.totalAmount}</p>
        
        ${orderData.notes ? `
        <h4 style="color: #374151; margin-bottom: 10px;">Opmerkingen:</h4>
        <div style="background-color: white; padding: 15px; border-radius: 5px;">
          ${orderData.notes}
        </div>
        ` : ''}
      </div>
      
      <p><small>Verzonden op: ${new Date().toLocaleString('nl-NL')}</small></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Groet,<br>
        <strong>Je Pluk & Poot Website</strong></p>
      </div>
    </div>
  `;

  return await sendBulkEmail({
    to: ["dckessler95@gmail.com"],
    subject,
    textContent,
    htmlContent,
    fromEmail: "dckessler95@gmail.com",
    fromName: "Pluk & Poot Bestellingen"
  });
}