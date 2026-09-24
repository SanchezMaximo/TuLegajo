import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

interface FilaExport {
  empleado?: string;
  cuil: string;
  documento: string;
  lote?: string;
  periodo?: string;
  estado?: string;
  concepto?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { rows?: FilaExport[] };
    const rows = body.rows ?? [];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TuLegajo · Panel";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Vacaciones liquidadas");
    sheet.columns = [
      { header: "Empleado", key: "empleado", width: 28 },
      { header: "CUIL", key: "cuil", width: 16 },
      { header: "Documento", key: "documento", width: 28 },
      { header: "Lote", key: "lote", width: 22 },
      { header: "Periodo", key: "periodo", width: 12 },
      { header: "Estado", key: "estado", width: 14 },
      { header: "Concepto detectado", key: "concepto", width: 40 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const row of rows) {
      sheet.addRow({
        empleado: row.empleado ?? "",
        cuil: row.cuil,
        documento: row.documento,
        lote: row.lote ?? "",
        periodo: row.periodo ?? "",
        estado: row.estado ?? "",
        concepto: row.concepto ?? "",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="vacaciones-liquidadas.xlsx"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo generar el Excel.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
