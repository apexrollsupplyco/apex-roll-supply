import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend using the secure environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    const {
      orderId,
      shopName,
      contactName,
      contactEmail,
      tptLicense,
      fulfillmentType,
      items,
      total,
      date
    } = orderData;

    const itemRows = items
      .map((item: any) => {
        if (item.category === 'Film') {
          const detail =
            item.orderType === 'roll'
              ? `${item.rolls} x 40" x 100' Master Roll`
              : `40" Wide Cut x ${item.linearFt} Linear Feet`;
          return `• ${item.series} (${item.vlt} VLT) - ${detail} | $${item.totalPrice.toFixed(2)}`;
        }
        return `• ${item.name} (Qty: ${item.quantity}) | $${item.totalPrice.toFixed(2)}`;
      })
      .join('\n');

    const emailText = `
NEW WHOLESALE ORDER RECEIVED
=============================
Order ID: ${orderId}
Date/Time: ${date}

BUSINESS VERIFICATION:
- Registered Shop: ${shopName}
- Contact Person: ${contactName}
- Shop Email: ${contactEmail}
- Arizona TPT Resale License #: ${tptLicense}

FULFILLMENT METHOD:
- Route: ${fulfillmentType === 'pickup' ? 'Prescott Valley Hub Pickup' : 'Local Courier Route (Pending Email Verification)'}

ITEMS ORDERED:
${itemRows}

TOTAL ORDER AMOUNT: $${Number(total).toFixed(2)}
=============================
    `;

    // Send wholesale notification directly to orders@apexrollsupply.com
    const response = await resend.emails.send({
      from: 'Apex Roll Supply Dispatch <orders@apexrollsupply.com>',
      to: 'orders@apexrollsupply.com',
      replyTo: contactEmail,
      subject: `[WHOLESALE ORDER] ${orderId} - ${shopName} (TPT: ${tptLicense})`,
      text: emailText,
    });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}