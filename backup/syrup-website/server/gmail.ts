import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dckessler95@gmail.com',
    pass: 'ixyj ixjt imnb tvuu'
  }
});

interface EmailParams {
  to: string[];
  subject: string;
  textContent: string;
  htmlContent: string;
  fromEmail?: string;
  fromName?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log('Sending email via Gmail SMTP to:', params.to);
    
    const mailOptions = {
      from: `${params.fromName || 'Pluk & Poot'} <dckessler95@gmail.com>`,
      to: params.to.join(', '),
      subject: params.subject,
      text: params.textContent,
      html: params.htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Gmail email sent successfully:', result.messageId);
    
    // DO NOT SEND ADMIN COPY - this was causing duplicate emails
    return true;
  } catch (error) {
    console.error('Gmail email error:', error);
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

  // Send to customer only, no admin copies
  const result = await sendEmail({
    to: emails,
    subject,
    textContent,
    htmlContent
  });
  
  // DO NOT send admin copy to prevent duplicate emails
  return result;
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

  return await sendEmail({
    to: ["dckessler95@gmail.com"],
    subject,
    textContent,
    htmlContent
  });
}

export async function sendContactNotification(contactData: any): Promise<boolean> {
  const subject = "📬 Nieuw Contact Bericht - Pluk & Poot";
  const fullName = `${contactData.firstName} ${contactData.lastName}`;
  
  const textContent = `
Hallo Damian,

Er is een nieuw contact bericht binnengekomen via je website!

Naam: ${fullName}
Email: ${contactData.email}
Onderwerp: ${contactData.subject}

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
        <p><strong>Naam:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Onderwerp:</strong> ${contactData.subject}</p>
        
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

  return await sendEmail({
    to: ["dckessler95@gmail.com"],
    subject,
    textContent,
    htmlContent
  });
}

export async function sendCustomerStatusUpdate(orderData: any): Promise<boolean> {
  console.log('sendCustomerStatusUpdate called with data:', JSON.stringify(orderData, null, 2));
  
  // Different messages based on status
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'bevestigd':
        return {
          subject: "✅ Je bestelling is bevestigd - Pluk & Poot",
          message: "Goed nieuws! Je bestelling is bevestigd en gaat in behandeling."
        };
      case 'klaar':
        return {
          subject: "📦 Je bestelling is klaar - Pluk & Poot",
          message: "Je bestelling is klaar! " + (orderData.deliveryMethod === 'pickup' ? 'Je kunt hem ophalen.' : 'We bezorgen hem binnenkort.')
        };
      case 'voltooid':
        return {
          subject: "🎉 Bestelling voltooid - Pluk & Poot",
          message: "Je bestelling is succesvol voltooid! Bedankt voor je aankoop bij Pluk & Poot."
        };
      case 'geannuleerd':
        return {
          subject: "❌ Bestelling geannuleerd - Pluk & Poot",
          message: "Je bestelling is geannuleerd. Neem contact met ons op als je vragen hebt."
        };
      default:
        return {
          subject: "📋 Status update - Pluk & Poot",
          message: "Er is een update voor je bestelling."
        };
    }
  };

  const statusInfo = getStatusMessage(orderData.status);
  
  const textContent = `
Hallo ${orderData.customerName},

${statusInfo.message}

Je bestelling:
Product: ${orderData.productName}
Aantal: ${orderData.quantity}
${orderData.deliveryMethod === 'delivery' ? 'Bezorgkosten: €1.00' : ''}
Totaal: €${orderData.totalAmount}
Status: ${orderData.status}

${orderData.notes ? `Opmerkingen: ${orderData.notes}` : ''}

Bij vragen kun je altijd contact met ons opnemen!

Met vriendelijke groet,
Damian van Pluk & Poot
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">${statusInfo.subject}</h1>
      
      <p>Hallo ${orderData.customerName},</p>
      
      <p>${statusInfo.message}</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Je Bestelling:</h3>
        <p><strong>Product:</strong> ${orderData.productName}</p>
        <p><strong>Aantal:</strong> ${orderData.quantity}</p>
        ${orderData.deliveryMethod === 'delivery' ? '<p><strong>Bezorgkosten:</strong> €1.00</p>' : ''}
        <p><strong>Totaal:</strong> €${orderData.totalAmount}</p>
        <p><strong>Status:</strong> <span style="background-color: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${orderData.status.toUpperCase()}</span></p>
        
        ${orderData.notes ? `
        <h4 style="color: #374151; margin-bottom: 10px;">Opmerkingen:</h4>
        <div style="background-color: white; padding: 15px; border-radius: 5px;">
          ${orderData.notes}
        </div>
        ` : ''}
      </div>
      
      <p>Bij vragen kun je altijd contact met ons opnemen!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Met vriendelijke groet,<br>
        <strong>Damian van Pluk & Poot</strong></p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: [orderData.customerEmail],
    subject: statusInfo.subject,
    textContent,
    htmlContent
  });
}

export async function sendCustomerOrderConfirmation(orderData: any): Promise<boolean> {
  console.log('sendCustomerOrderConfirmation called with data:', JSON.stringify(orderData, null, 2));
  
  const textContent = `
Hallo ${orderData.customerName},

Bedankt voor je bestelling bij Pluk & Poot!

Je bestelling:
Product: ${orderData.productName}
Aantal: ${orderData.quantity}
${orderData.deliveryMethod === 'delivery' ? 'Bezorgkosten: €1.00' : ''}
Totaal: €${orderData.totalAmount}
Bezorging: ${orderData.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen (gratis)'}

${orderData.deliveryMethod === 'delivery' && orderData.streetAddress ? `
Bezorgadres:
${orderData.streetAddress}
${orderData.postalCode} ${orderData.city}
${orderData.country}` : ''}

${orderData.notes ? `Opmerkingen: ${orderData.notes}` : ''}

Je bestelling heeft status: ${orderData.status}
Besteld op: ${new Date().toLocaleString('nl-NL')}

We nemen zo snel mogelijk contact met je op!

Met vriendelijke groet,
Damian van Pluk & Poot
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Bedankt voor je bestelling! 🌿</h1>
      
      <p>Hallo ${orderData.customerName},</p>
      
      <p>Bedankt voor je bestelling bij <strong>Pluk & Poot</strong>!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Je Bestelling:</h3>
        <p><strong>Product:</strong> ${orderData.productName}</p>
        <p><strong>Aantal:</strong> ${orderData.quantity}</p>
        ${orderData.deliveryMethod === 'delivery' ? '<p><strong>Bezorgkosten:</strong> €1.00</p>' : ''}
        <p><strong>Totaal:</strong> €${orderData.totalAmount}</p>
        <p><strong>Bezorging:</strong> ${orderData.deliveryMethod === 'delivery' ? 'Bezorgen' : 'Ophalen (gratis)'}</p>
        
        ${orderData.deliveryMethod === 'delivery' && orderData.streetAddress ? `
        <h4 style="color: #374151; margin-bottom: 10px;">Bezorgadres:</h4>
        <div style="background-color: white; padding: 15px; border-radius: 5px;">
          ${orderData.streetAddress}<br>
          ${orderData.postalCode} ${orderData.city}<br>
          ${orderData.country}
        </div>
        ` : ''}
        
        ${orderData.notes ? `
        <h4 style="color: #374151; margin-bottom: 10px;">Opmerkingen:</h4>
        <div style="background-color: white; padding: 15px; border-radius: 5px;">
          ${orderData.notes}
        </div>
        ` : ''}
        
        <p><strong>Status:</strong> <span style="background-color: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${orderData.status.toUpperCase()}</span></p>
      </div>
      
      <p>We nemen zo snel mogelijk contact met je op!</p>
      
      <p><small>Besteld op: ${new Date().toLocaleString('nl-NL')}</small></p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Met vriendelijke groet,<br>
        <strong>Damian van Pluk & Poot</strong></p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: [orderData.customerEmail],
    subject: "Bestelling Ontvangen - Pluk & Poot 🌿",
    textContent,
    htmlContent
  });
}

export async function sendOrderNotification(orderData: any): Promise<boolean> {
  console.log('sendOrderNotification called with data:', JSON.stringify(orderData, null, 2));
  
  // Different email templates based on status
  const getEmailContent = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          subject: "🛒 Nieuwe Siroop Bestelling - Pluk & Poot",
          message: "Er is een nieuwe siroop bestelling binnengekomen!"
        };
      case 'bevestigd':
        return {
          subject: "✅ Bestelling Bevestigd - Pluk & Poot",
          message: "Een siroop bestelling is bevestigd en gaat in behandeling!"
        };
      case 'klaar':
        return {
          subject: "📦 Bestelling Klaar voor Ophalen/Bezorging - Pluk & Poot",
          message: "Een siroop bestelling is klaar voor ophalen of bezorging!"
        };
      case 'voltooid':
        return {
          subject: "🎉 Bestelling Voltooid - Pluk & Poot",
          message: "Een siroop bestelling is succesvol voltooid!"
        };
      case 'geannuleerd':
        return {
          subject: "❌ Bestelling Geannuleerd - Pluk & Poot",
          message: "Een siroop bestelling is geannuleerd."
        };
      default:
        return {
          subject: "📋 Siroop Bestelling Update - Pluk & Poot",
          message: "Er is een update voor een siroop bestelling."
        };
    }
  };

  const emailContent = getEmailContent(orderData.status);
  
  const textContent = `
Hallo Damian,

${emailContent.message}

Klant: ${orderData.customerName}
Email: ${orderData.customerEmail}
Telefoon: ${orderData.customerPhone || 'Niet opgegeven'}
Product: ${orderData.productName}
Aantal: ${orderData.quantity}
${orderData.deliveryMethod === 'Bezorgen' ? 'Bezorgkosten: €1.00' : ''}
Totaal: €${orderData.totalAmount}
Bezorging: ${orderData.deliveryMethod}
Status: ${orderData.status}

Opmerkingen: ${orderData.notes || 'Geen opmerkingen'}

Verzonden op: ${new Date().toLocaleString('nl-NL')}

Groet,
Je Pluk & Poot Website
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">${emailContent.subject}</h1>
      
      <p>Hallo Damian,</p>
      
      <p>${emailContent.message}</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Bestelling Details:</h3>
        <p><strong>Klant:</strong> ${orderData.customerName}</p>
        <p><strong>Email:</strong> ${orderData.customerEmail}</p>
        <p><strong>Telefoon:</strong> ${orderData.customerPhone || 'Niet opgegeven'}</p>
        <p><strong>Product:</strong> ${orderData.productName}</p>
        <p><strong>Aantal:</strong> ${orderData.quantity}</p>
        ${orderData.deliveryMethod === 'Bezorgen' ? '<p><strong>Bezorgkosten:</strong> €1.00</p>' : ''}
        <p><strong>Totaal:</strong> €${orderData.totalAmount}</p>
        <p><strong>Bezorging:</strong> ${orderData.deliveryMethod}</p>
        <p><strong>Status:</strong> <span style="background-color: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${orderData.status.toUpperCase()}</span></p>
        
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

  return await sendEmail({
    to: ["dckessler95@gmail.com"],
    subject: emailContent.subject,
    textContent,
    htmlContent
  });
}