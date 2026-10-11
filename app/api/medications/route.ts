// API: GET /api/medications, POST /api/medications
import { NextRequest, NextResponse } from 'next/server';
import { medicationsDb, Medication } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let medications = Object.values(medicationsDb);

  if (status && status !== 'all') {
    medications = medications.filter(m => m.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    medications = medications.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  // Summary stats
  const stats = {
    total: Object.keys(medicationsDb).length,
    available: Object.values(medicationsDb).filter(m => m.status === 'available').length,
    low: Object.values(medicationsDb).filter(m => m.status === 'low').length,
    critical: Object.values(medicationsDb).filter(m => m.status === 'critical').length,
  };

  return NextResponse.json({ data: medications, stats, total: medications.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, genericName, category, stock, unit, minStock, price, supplier, expiryDate, batchNumber } = body;

    if (!name || !stock || !unit) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const newId = `MED-${Date.now()}`;
    const stockNum = Number(stock);
    const minStockNum = Number(minStock) || 100;

    let status: Medication['status'] = 'available';
    if (stockNum === 0) status = 'critical';
    else if (stockNum < minStockNum) status = 'low';

    // Check expiry
    if (expiryDate && new Date(expiryDate) < new Date()) {
      status = 'expired';
    }

    const newMed: Medication = {
      id: newId,
      name,
      genericName: genericName || name,
      category: category || 'Khác',
      stock: stockNum,
      unit,
      minStock: minStockNum,
      price: Number(price) || 0,
      supplier: supplier || 'Chưa xác định',
      expiryDate: expiryDate || '',
      status,
      batchNumber: batchNumber || `BATCH-${Date.now()}`,
    };

    medicationsDb[newId] = newMed;
    return NextResponse.json({ data: newMed, message: 'Đã thêm thuốc thành công' }, { status: 201 });

  } catch {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
