import { sendEmail } from './gmail';

// Customer confirmation email for new ramen order
export async function sendRamenOrderConfirmation(orderData: any): Promise<boolean> {
  console.log('sendRamenOrderConfirmation called with data:', JSON.stringify(orderData, null, 2));
  
  const textContent = `
Hallo ${orderData.customerName},

Bedankt voor je ramen reservering bij Pluk & Poot!

Je reservering:
Datum: ${orderData.preferredDate}
Aantal personen: ${orderData.servings}
Status: In afwachting van bevestiging
${orderData.notes ? `Opmerkingen: ${orderData.notes}` : ''}

We bevestigen je reservering zodra we minimaal 6 personen hebben voor deze datum.
Je ontvangt een bevestigingsmail zodra het evenement definitief doorgaat.

Telefoon: ${orderData.customerPhone}
Email: ${orderData.customerEmail}

Met vriendelijke groet,
Damian van Pluk & Poot
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">🍜 Ramen Reservering Ontvangen</h1>
      
      <p>Hallo ${orderData.customerName},</p>
      
      <p>Bedankt voor je ramen reservering bij <strong>Pluk & Poot</strong>!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Je Reservering:</h3>
        <p><strong>Datum:</strong> ${orderData.preferredDate}</p>
        <p><strong>Aantal personen:</strong> ${orderData.servings}</p>
        <p><strong>Status:</strong> In afwachting van bevestiging</p>
        ${orderData.notes ? `<p><strong>Opmerkingen:</strong> ${orderData.notes}</p>` : ''}
        
        <div style="background-color: #ddd6fe; padding: 15px; border-radius: 5px; margin-top: 15px;">
          <p style="margin: 0;"><strong>📞 Contact:</strong></p>
          <p style="margin: 5px 0;">Telefoon: ${orderData.customerPhone}</p>
          <p style="margin: 5px 0;">Email: ${orderData.customerEmail}</p>
        </div>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 10px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0;"><strong>ℹ️ Volgende stappen:</strong></p>
        <p style="margin: 10px 0 0 0;">We bevestigen je reservering zodra we minimaal 6 personen hebben voor deze datum. Je ontvangt een bevestigingsmail zodra het evenement definitief doorgaat.</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>Met vriendelijke groet,<br>
        <strong>Damian van Pluk & Poot</strong></p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: [orderData.customerEmail],
    subject: "Ramen Reservering Ontvangen - Pluk & Poot 🍜",
    textContent,
    htmlContent
  });
}