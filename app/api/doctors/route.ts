// API: GET /api/doctors
import { NextResponse } from 'next/server';
import { doctorsDb } from '@/lib/data';

export async function GET() {
  const doctors = Object.values(doctorsDb);
  return NextResponse.json({ data: doctors, total: doctors.length });
}
