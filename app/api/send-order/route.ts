import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';

const resend = new Resend(process.env.RESEND_API_KEY);

function generatePackingSlipPdf(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Header Branding
    doc.fillColor('#991b1b').fontSize(20).text('APEX ROLL SUPPLY CO.', { align: 'left' });
    doc.fillColor('#4b5563').fontSize(9).text('Wholesale Window Film & Linear Supply Hub', { align: 'left' });
    doc.text('Prescott Valley, Arizona | orders@apexrollsupply.com | (928) 420-3903', { align: 'left' });

    doc.moveDown(0.5);
    doc.strokeColor('#dc2626').lineWidth(2).moveTo(40, doc.y).lineTo(572, doc.y).stroke();
    doc.moveDown(1);

    // Document Title & Metadata
    const startY = doc.y;
    doc.fillColor('#111827').fontSize(14).text('COMMERCIAL PACKING SLIP / MANIFEST', 40, startY);
    doc.fontSize(10).fillColor('#374151');
    doc.text(`Order ID: ${order.orderId}`, 40, startY + 20);
    doc.text(`Date & Time: ${order.date || new Date().toLocaleString()}`, 40, startY + 34);

    // Bill To & Fulfillment Info (Right Column)
    doc.fontSize(10).fillColor('#111827').text('COMMERCIAL ACCOUNT:', 320, startY);
    doc.fillColor('#374151');
    doc.text(`Shop: ${order.shopName}`, 320, startY + 14);
    doc.text(`Contact: ${order.contactName}`, 320, startY + 28);
    doc.text(`Email: ${order.contactEmail}`, 320, startY + 42);
    doc.text(`AZ TPT Resale License: ${order.tptLicense}`, 320, startY + 56);
    doc.text(`Fulfillment: ${order.fulfillmentType}`, 320, startY + 70);

    doc.y = startY + 95;
    doc.moveDown(0.5);
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(572, doc.y).stroke();
    doc.moveDown(1);

    // Table Header
    const tableTop = doc.y;
    doc.fillColor('#111827').fontSize(9).font('Helvetica-Bold');
    doc.text('ITEM DESCRIPTION', 40, tableTop);
    doc.text('SPEC / WIDTH', 280, tableTop);
    doc.text('QUANTITY', 400, tableTop, { width: 70, align: 'right' });
    doc.text('SUBTOTAL', 490, tableTop, { width: 80, align: 'right' });

    doc.font('Helvetica');
    let currentY = tableTop + 16;
    doc.strokeColor('#d1d5db').lineWidth(0.5).moveTo(40, currentY - 4).lineTo(572, currentY - 4).stroke();

    // Table Rows
    const items = order.items || [];
    items.forEach((item: any) => {
      const isFilm = (item.category || '').includes('Film');
      const name = isFilm ? `${item.series} (${item.vlt})` : item.name;
      const spec = isFilm
        ? item.orderType === 'roll'
          ? `${item.rolls}x ${item.width || '40"'} x 100' Roll`
          : `${item.width || '40"'} Cut: ${item.linearFt} Linear Ft`
        : 'Unit Supply';
      const qty = isFilm ? (item.orderType === 'roll' ? `${item.rolls} roll(s)` : `${item.linearFt} ft`) : `${item.quantity} unit(s)`;
      const price = `$${Number(item.totalPrice || 0).toFixed(2)}`;

      doc.fillColor('#1f2937').fontSize(9);
      doc.text(name, 40, currentY, { width: 235 });
      doc.fillColor('#4b5563').text(spec, 280, currentY, { width: 115 });
      doc.text(qty, 400, currentY, { width: 70, align: 'right' });
      doc.fillColor('#111827').text(price, 490, currentY, { width: 80, align: 'right' });

      currentY += 22;
      doc.strokeColor('#f3f4f6').lineWidth(0.5).moveTo(40, currentY - 4).lineTo(572, currentY - 4).stroke();
    });

    // Summary Financials
    currentY += 10;
    doc.fontSize(9).fillColor('#4b5563');
    doc.text('Items Subtotal:', 380, currentY, { width: 90, align: 'right' });
    doc.fillColor('#111827').text(`$${Number(order.subtotal || 0).toFixed(2)}`, 490, currentY, { width: 80, align: 'right' });

    currentY += 16;
    doc.fillColor('#4b5563').text('Courier / Delivery:', 380, currentY, { width: 90, align: 'right' });
    doc.fillColor('#111827').text(
      order.deliveryFee > 0 ? `+$${Number(order.deliveryFee).toFixed(2)}` : '$0.00 (Free)',
      490,
      currentY,
      { width: 80, align: 'right' }
    );

    currentY += 18;
    doc.strokeColor('#dc2626').lineWidth(1).moveTo(380, currentY - 4).lineTo(572, currentY - 4).stroke();
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#991b1b');
    doc.text('Total Invoiced:', 380, currentY, { width: 90, align: 'right' });
    doc.text(`$${Number(order.total || 0).toFixed(2)}`, 490, currentY, { width: 80, align: 'right' });

    // Driver / Receiving Signature Box
    doc.y = currentY + 45;
    doc.strokeColor('#9ca3af').lineWidth(0.5);
    
    doc.text('Courier Drop-off & Verification:', 40, doc.y);
    const signBoxY = doc.y + 12;
    doc.rect(40, signBoxY, 240, 50).stroke();
    doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text('Installer / Receiving Signature', 48, signBoxY + 36);

    doc.rect(310, signBoxY, 262, 50).stroke();
    doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text('Apex Dispatch Route Notes / Date Received', 318, signBoxY + 36);

    doc.end();
  });
}

export async function POST(req: Request) {
  try {
    const order = await req.json();

    // Generate the PDF Buffer
    const pdfBuffer = await generatePackingSlipPdf(order);

    const isApplication = (order.shopName || '').includes('[B2B PASSCODE APPLICATION]');
    const subjectLine = isApplication
      ? `[B2B Application] New Commercial Account Verification - ${order.contactName}`
      : `[Wholesale Order Confirmed] ${order.orderId} - ${order.shopName}`;

    // Itemized HTML Table for Email Body
    const itemsHtml = (order.items || [])
      .map((item: any) => {
        const isFilm = (item.category || '').includes('Film');
        const desc = isFilm
          ? `${item.series} (${item.width || '40"'} - ${item.vlt}) [${item.orderType === 'roll' ? `${item.rolls}x 100ft Master Roll` : `${item.linearFt} Linear Ft Cut`}]`
          : `${item.name} (Qty: ${item.quantity})`;
        return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #27272a;">${desc}</td>
          <td style="padding: 8px; border-bottom: 1px solid #27272a; text-align: right; font-family: monospace;">$${Number(item.totalPrice || 0).toFixed(2)}</td>
        </tr>`;
      })
      .join('');

    const htmlBody = `
      <div style="background-color: #0e0f12; color: #f4f4f5; font-family: Arial, sans-serif; padding: 24px; max-width: 620px; margin: auto; border: 1px solid #27272a; border-radius: 12px;">
        <div style="border-bottom: 2px solid #b91c1c; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">APEX ROLL SUPPLY CO.</h2>
          <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px;">Wholesale Window Film &amp; Supply Hub • Prescott Valley, AZ</p>
        </div>

        <h3 style="color: #ef4444; margin-top: 0; font-size: 16px;">${isApplication ? 'Commercial Account Application' : 'Wholesale Order Dispatch Confirmation'}</h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Order ID:</td><td style="padding: 4px 0; font-family: monospace; font-weight: bold; color: #ffffff;">${order.orderId}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Shop Name:</td><td style="padding: 4px 0; color: #ffffff;">${order.shopName}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Contact:</td><td style="padding: 4px 0; color: #ffffff;">${order.contactName} (${order.contactEmail})</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">AZ TPT License:</td><td style="padding: 4px 0; font-family: monospace; color: #ef4444;">${order.tptLicense}</td></tr>
          <tr><td style="padding: 4px 0; color: #a1a1aa;">Fulfillment:</td><td style="padding: 4px 0; color: #ffffff;">${order.fulfillmentType}</td></tr>
        </table>

        ${
          !isApplication
            ? `
          <h4 style="color: #ffffff; margin-bottom: 8px; font-size: 14px;">Order Manifest</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
            <thead>
              <tr style="color: #a1a1aa; border-bottom: 1px solid #3f3f46; text-align: left;">
                <th style="padding: 6px 8px;">Item</th>
                <th style="padding: 6px 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align: right; font-size: 13px; margin-bottom: 20px;">
            <p style="margin: 4px 0; color: #a1a1aa;">Subtotal: <span style="color: #ffffff; font-family: monospace;">$${Number(order.subtotal || 0).toFixed(2)}</span></p>
            <p style="margin: 4px 0; color: #a1a1aa;">Delivery: <span style="color: #ffffff; font-family: monospace;">${order.deliveryFee > 0 ? `+$${Number(order.deliveryFee).toFixed(2)}` : '$0.00'}</span></p>
            <p style="margin: 6px 0 0; font-size: 16px; font-weight: bold; color: #ef4444;">Total: <span style="font-family: monospace;">$${Number(order.total || 0).toFixed(2)}</span></p>
          </div>
          <p style="font-size: 12px; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 12px;">
            📎 <em>A printable PDF Commercial Packing Slip is attached for warehouse fulfillment and delivery sign-off.</em>
          </p>
        `
            : ''
        }
      </div>
    `;

    // Dispatch email with PDF attachment
    const emailResult = await resend.emails.send({
      from: 'Apex Orders <orders@apexrollsupply.com>',
      to: ['orders@apexrollsupply.com'],
      replyTo: order.contactEmail,
      subject: subjectLine,
      html: htmlBody,
      attachments: [
        {
          filename: `PackingSlip-${order.orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    console.error('Order dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}