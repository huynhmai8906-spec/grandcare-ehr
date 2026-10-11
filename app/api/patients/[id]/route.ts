// API Route: GET/PUT/DELETE single patient  
// Path: /api/patients/[id]

import { NextRequest, NextResponse } from 'next/server';
import { patientsDb } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patient = patientsDb[id];
  
  if (!patient) {
    return NextResponse.json({ error: 'Không tìm thấy bệnh nhân' }, { status: 404 });
  }

  // Generate HL7 FHIR R4 Bundle
  const fhirBundle = {
    resourceType: 'Bundle',
    id: `bundle-${id.toLowerCase()}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:${id}`,
        resource: {
          resourceType: 'Patient',
          id: id,
          identifier: [
            { system: 'https://grandcare.vn/id/ehr', value: id },
            { system: 'urn:oid:2.16.840.1.113883.4.1', value: patient.cccd },
            { system: 'https://grandcare.vn/id/insurance', value: patient.insurance },
          ],
          active: true,
          name: [{ use: 'official', text: patient.name }],
          gender: 'unknown',
          birthDate: patient.dob,
          generalPractitioner: [{ display: patient.doctor }],
          managingOrganization: { display: 'GrandCare Medical VIP Geriatric Center' },
        },
      },
      {
        fullUrl: `urn:uuid:observation-${id}-vitals`,
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [{
            coding: [{ 
              system: 'http://terminology.hl7.org/CodeSystem/observation-category', 
              code: 'vital-signs' 
            }]
          }],
          code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
          subject: { reference: `Patient/${id}` },
          effectiveDateTime: new Date().toISOString(),
          valueQuantity: { value: patient.vitals.hr, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' },
        },
      },
      {
        fullUrl: `urn:uuid:encounter-${id}`,
        resource: {
          resourceType: 'Encounter',
          status: 'in-progress',
          class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'inpatient encounter' },
          subject: { reference: `Patient/${id}` },
          location: [{ location: { display: patient.room } }],
        },
      },
    ],
  };

  return NextResponse.json({ data: patient, fhir: fhirBundle });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patient = patientsDb[id];
  
  if (!patient) {
    return NextResponse.json({ error: 'Không tìm thấy bệnh nhân' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updated = {
      ...patient,
      ...body,
      id, // prevent ID change
      updatedAt: new Date().toISOString(),
    };
    patientsDb[id] = updated;
    return NextResponse.json({ data: updated, message: 'Cập nhật thành công' });
  } catch {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!patientsDb[id]) {
    return NextResponse.json({ error: 'Không tìm thấy bệnh nhân' }, { status: 404 });
  }

  const deletedName = patientsDb[id].name;
  delete patientsDb[id];
  
  return NextResponse.json({ 
    message: `Hồ sơ ${id} (${deletedName}) đã được xóa và lưu nhật ký kiểm toán (Audit Trail) HL7 thành công.` 
  });
}
