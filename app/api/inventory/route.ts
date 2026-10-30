import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const DEFAULT_FILM = [
  { id: 'c2-carb-5', series: 'C2 Carbon', vlt: '5%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
  { id: 'c2-carb-20', series: 'C2 Carbon', vlt: '20%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
  { id: 'c2-carb-35', series: 'C2 Carbon', vlt: '35%', masterRollPrice: 331.56, linearFtPrice: 4.16, stockFt: 0, description: 'Non-reflective dyed carbon matrix.' },
  { id: 'c2-cer-5', series: 'C2 Ceramic', vlt: '5%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 49, description: 'Nano-ceramic heat rejection formulation.' },
  { id: 'c2-cer-20', series: 'C2 Ceramic', vlt: '20%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 0, description: 'Nano-ceramic heat rejection formulation.' },
  { id: 'c2-cer-35', series: 'C2 Ceramic', vlt: '35%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 28, description: 'Nano-ceramic heat rejection formulation.' },
  { id: 'c2-cer-50', series: 'C2 Ceramic', vlt: '50%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 50, description: 'Nano-ceramic heat rejection formulation.' },
  { id: 'c2-cer-75', series: 'C2 Ceramic', vlt: '75%', masterRollPrice: 481.68, linearFtPrice: 5.89, stockFt: 56, description: 'Nano-ceramic heat rejection formulation.' }
];

const DEFAULT_TOOLS = [
  { id: 'nt-cutter-pro-a1p', name: 'NT Cutter Pro A-1P "Red Dot" Knife', category: 'Knives', price: 10.00, stockQty: 10, description: 'Auto-lock precision stainless steel graphic knife with 30° angle.' },
  { id: 'banana-buffers-10pk', name: 'Banana Buffers Squeegee Wings (10/pk)', category: 'Buffers', price: 16.00, stockQty: 12, description: 'Pre-cut wet-wing felt buffers for streak-free, scratchless squeegee glide.' },
  { id: 'blade-pack-30deg', name: '30° Precision Snap-Off Blades (Pack)', category: 'Blades', price: 12.00, stockQty: 13, description: 'Ultra-sharp 30-degree segment blades for intricate automotive edge trimming.' },
  { id: 'nt-cutter-ba50ss', name: 'NT Cutter BA-50SS 9mm Stainless Blades (50/pk)', category: 'Blades', price: 25.00, stockQty: 1, description: 'Rust-resistant 58-degree surgical stainless blades (Low Stock).' },
  { id: 'hard-card-gold-4in', name: '3M Pro Squeegee Hard Card (Gold 4")', category: 'Hard Cards', price: 5.00, stockQty: 10, description: 'Teflon-infused firm hard card for corner setting and shrinking edges.' },
  { id: 'contour-squeegee-triangle', name: 'Triangle Contour Squeegee Card', category: 'Hard Cards', price: 5.00, stockQty: 10, description: 'Ergonomic triangle contour card designed for tight corners, gaskets, and curved glass edges.' },
  { id: 'small-squeegee-rubber-5in', name: 'Small Squeegee 5" Rubber Window Tint Scraper', category: 'Squeegees', price: 8.50, stockQty: 6, description: '5-inch flexible rubber squeegee for glass preparation and fluid evacuation.' }
];

export async function GET() {
  try {
    const film = await redis.get('apex:inventory:film');
    const tools: any = await redis.get('apex:inventory:tools');

    let mergedTools = DEFAULT_TOOLS;
    if (tools && Array.isArray(tools)) {
      mergedTools = DEFAULT_TOOLS.map((defTool) => {
        const existing = tools.find((t: any) => t.id === defTool.id);
        return existing || defTool;
      });
      tools.forEach((t: any) => {
        if (!mergedTools.some((mt) => mt.id === t.id)) {
          mergedTools.push(t);
        }
      });
    }

    return NextResponse.json({
      film: film || DEFAULT_FILM,
      tools: mergedTools,
    });
  } catch (error) {
    console.error('Failed to fetch inventory from Redis:', error);
    return NextResponse.json({ film: DEFAULT_FILM, tools: DEFAULT_TOOLS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { film, tools } = body;

    if (film) await redis.set('apex:inventory:film', film);
    if (tools) await redis.set('apex:inventory:tools', tools);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save inventory to Redis:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}