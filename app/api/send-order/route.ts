import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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
      subtotal,
      deliveryFee,
      total,
      items,
      date,
    } = orderData;

    const itemRows = (items || [])
      .map((item: any) => {
        if (item.category === 'Film') {
          const detail =
            item.orderType === 'roll'
              ? `${item.rolls} x 40" x 100' Master Roll`
              : `40" Wide Cut x ${item.linearFt} Linear Feet`;
          return `• ${item.series} (${item.vlt} VLT) - ${detail} | $${Number(item.totalPrice || 0).toFixed(2)}`;
        }
        return `• ${item.name} (Qty: ${item.quantity}) | $${Number(item.totalPrice || 0).toFixed(2)}`;
      })
      .join('\n');

    const emailText = `
NEW WHOLESALE ORDER RECEIVED
====================================
Order ID: ${orderId}
Date/Time: ${date}

COMMERCIAL VERIFICATION:
  Registered Shop: ${shopName}
  Contact Person: ${contactName}
  Shop Email: ${contactEmail}
  Arizona TPT Resale License #: ${tptLicense}

FULFILLMENT METHOD:
  Route: ${fulfillmentType}

ITEMS ORDERED:
${itemRows}

FINANCIAL BREAKDOWN:
  Items Subtotal: $${Number(subtotal || total).toFixed(2)}
  Regional Delivery Fee: $${Number(deliveryFee || 0).toFixed(2)}
  TOTAL DISPATCH AMOUNT: $${Number(total).toFixed(2)}
====================================
`;

    // Verified domain dispatch: from and to orders@apexrollsupply.com
    const response = await resend.emails.send({
      from: 'Apex Roll Supply <orders@apexrollsupply.com>',
      to: 'orders@apexrollsupply.com',
      replyTo: contactEmail || 'orders@apexrollsupply.com',
      subject: `[WHOLESALE ORDER] ${orderId} - ${shopName} (TPT: ${tptLicense})`,
      text: emailText,
    });

    if (response.error) {
      console.error('Resend delivery error:', response.error);
      return NextResponse.json({ error: response.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}