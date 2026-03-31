import { NextRequest } from 'next/server';

const submissions: object[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submission = {
      id: Date.now().toString(),
      name, email, subject: subject || 'General Enquiry', message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    submissions.push(submission);

    console.log('[Contact Submission]', submission);

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ submissions });
}
