import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const today = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/Phoenix',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportText = `
APEX ROLL SUPPLY CO. - DAILY HUB INVENTORY AUDIT
==================================================
Date: ${today} (7:00 AM MST Automated Dispatch)
Location: Prescott Valley Wholesale Hub

GEOSHIELD C2 CERAMIC MASTER ROLL & CUT INVENTORY:
--------------------------------------------------
• 5% VLT Nano-Ceramic:   49 Linear Ft
• 20% VLT Nano-Ceramic:  0 Linear Ft (OUT OF STOCK - RESTOCK NEEDED)
• 35% VLT Nano-Ceramic:  28 Linear Ft
• 50% VLT Nano-Ceramic:  50 Linear Ft
• 70% VLT Nano-Ceramic:  56 Linear Ft

SHOP CONSUMABLES & PRECISION TOOLS ON HAND:
--------------------------------------------------
• NT Cutter Pro A-1P "Red Dot" Knives:     10 units
• Banana Buffers Squeegee Wings (10/pk):   12 packs (120 wings)
• 30° Precision Snap-Off Blade Packs:       13 packs
• NT Cutter BA-50SS Stainless Blades (50s): 1 pack (CRITICAL LOW)
• Pro Squeegee Hard Cards (Gold 4"):        10 units

OPERATIONAL REMINDER:
- Local Quad Cities delivery is complimentary.
- Extended deliveries carry a $50 surcharge.
==================================================
    `;

    const response = await resend.emails.send({
      from: 'Apex Inventory Bot <orders@apexrollsupply.com>',
      to: 'orders@apexrollsupply.com',
      subject: `[DAILY INVENTORY AUDIT] Apex Hub Stock Levels - ${today}`,
      text: reportText,
    });

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Daily cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}