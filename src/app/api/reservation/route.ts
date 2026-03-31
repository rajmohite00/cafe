import { NextRequest } from 'next/server';

// In-memory store for demo purposes
// In production: replace with a real database (Prisma + PostgreSQL, etc.)
const reservations: object[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, guests, name, email, phone, occasion, requests } = body;

    if (!date || !time || !guests || !name || !email || !phone) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reservation = {
      id: Date.now().toString(),
      date, time, guests, name, email, phone,
      occasion: occasion || null,
      requests: requests || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reservations.push(reservation);

    console.log('[Reservation Created]', reservation);

    return Response.json({ success: true, id: reservation.id }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ reservations });
}
