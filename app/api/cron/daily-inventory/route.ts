import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { redis } from '@/lib/redis';

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FILM = [
  { id: 'c2-cer-5', series: 'C2 Ceramic', vlt: '5%', stockFt: 49 },
  { id: 'c2-cer-20', series: 'C2 Ceramic', vlt: '20%', stockFt: 0 },
  { id: 'c2-cer-35', series: 'C2 Ceramic', vlt: '35%', stockFt: 28 },
  { id: 'c2-cer-50', series: 'C2 Ceramic', vlt: '50%', stockFt: 50 },
  { id: 'c2-cer-70', series: 'C2 Ceramic', vlt: '70%', stockFt: 56 },
];

const DEFAULT_TOOLS = [
  { id: 'nt-cutter-pro-a1p', name: 'NT Cutter Pro A-1P "Red Dot" Knives', stockQty: 10 },
  { id: 'banana-buffers-10pk', name: 'Banana Buffers Squeegee Wings (10/pk)', stockQty: 12 },
  { id: 'blade-pack-30deg', name: '30° Precision Snap-Off Blade Packs', stockQty: 13 },
  { id: 'nt-cutter-ba50ss', name: 'NT Cutter BA-50SS Stainless Blades (50s)', stockQty: 1 },
  { id: 'hard-card-gold-4in', name: 'Pro Squeegee Hard Cards (Gold 4")', stockQty: 10 },
];

export async function GET(req: Request) {
  try {
    const today = new Date().toLocaleDateString('en-US', {
      timeZone: 'America/Phoenix',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Fetch live inventory from Upstash Redis, fallback to defaults
    const filmData: any[] = (await redis.get('apex:inventory:film')) || DEFAULT_FILM;
    const toolsData: any[] = (await redis.get('apex:inventory:tools')) || DEFAULT_TOOLS;

    const filmLines = filmData
      .filter((f) => f.series === 'C2 Ceramic')
      .map((f) => {
        let tag = '';
        if (f.stockFt === 0) tag = ' (OUT OF STOCK - RESTOCK NEEDED)';
        else if (f.stockFt < 30) tag = ' (LOW STOCK)';
        return `- ${f.vlt} VLT Nano-Ceramic:   ${f.stockFt} Linear Ft${tag}`;
      })
      .join('\n');

    const toolLines = toolsData
      .map((t) => {
        let tag = '';
        if (t.stockQty <= 0) tag = ' (OUT OF STOCK)';
        else if (t.stockQty <= 2) tag = ' (CRITICAL LOW)';
        const unitLabel = t.name.includes('(10/pk)') ? `${t.stockQty} packs (${t.stockQty * 10} wings)` : `${t.stockQty} units`;
        return `- ${t.name}:   ${unitLabel}${tag}`;
      })
      .join('\n');

    const reportText = `
APEX ROLL SUPPLY CO. - DAILY HUB INVENTORY AUDIT
==================================================
Date: ${today} (7:00 AM MST Automated Dispatch)
Location: Prescott Valley Wholesale Hub

GEOSHIELD C2 CERAMIC MASTER ROLL & CUT INVENTORY:
--------------------------------------------------
${filmLines}

SHOP CONSUMABLES & PRECISION TOOLS ON HAND:
--------------------------------------------------
${toolLines}

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