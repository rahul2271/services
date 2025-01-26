
// app/api/kit/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();

  try {
    // Replace with your actual SheetDB API URL
    const response = await fetch('https://sheetdb.io/api/v1/jwq0nlx0lcilp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return NextResponse.json({ status: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
