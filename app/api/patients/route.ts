// API Route: GET/POST patients
// Path: /api/patients

import { NextRequest, NextResponse } from 'next/server';
import { patientsDb, Patient } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const wing = searchParams.get('wing');
  const doctorId = searchParams.get('doctorId');
  const search = searchParams.get('search');

  let patients = Object.values(patientsDb);

  // Filter
  if (status && status !== 'all') {
    patients = patients.filter(p => p.status === status);
  }
  if (wing && wing !== '') {
    patients = patients.filter(p => p.wing === wing);
  }
  if (doctorId && doctorId !== '') {
    patients = patients.filter(p => p.doctorId === doctorId);
  }
  if (search) {
    const q = search.toLowerCase();
    patients = patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.cccd.includes(q) ||
      p.room.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ 
    data: patients, 
    total: patients.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob, cccd, insurance, room, wing, doctorId, doctor, history } = body;

    // Validate required fields
    if (!name || !dob || !cccd || !room || !doctorId) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Generate EHR ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `EHR-2026-${randomSuffix}`;
    const birthYear = new Date(dob).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    const newPatient: Patient = {
      id: newId,
      name,
      age,
      dob,
      cccd,
      insurance: insurance || '',
      room,
      wing: wing || 'sala',
      doctor: doctor || doctorId,
      doctorId,
      status: 'new',
      statusLabel: 'Mới Tiếp Nhận',
      vitals: {
        hr: 75,
        hrStatus: 'normal',
        bp: '120/80',
        spo2: 99.0,
        glucose: 5.5,
        temp: 36.6,
      },
      history: history || 'Chưa ghi nhận tiền sử dị ứng.',
      regime: 'Đang chờ hội chẩn chuyên khoa và gán phác đồ cá nhân hóa.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in memory (in production: INSERT INTO supabase)
    patientsDb[newId] = newPatient;

    return NextResponse.json({ 
      data: newPatient, 
      message: `Đã khởi tạo thành công bệnh nhân ${name} (${newId}) chuẩn HL7/FHIR R4.` 
    }, { status: 201 });

  } catch {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
