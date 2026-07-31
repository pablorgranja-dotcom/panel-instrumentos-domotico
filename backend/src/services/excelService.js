const ExcelJS = require('exceljs');
const Measurement = require('../models/Measurement');

class ExcelService {
  async generateReport(fecha) {
    // fecha viene en formato "YYYY-MM-DD" (ej: "2026-07-29")
    const [year, month, day] = fecha.split('-').map(Number);
    
    // 1. DIAGNÓSTICO: Ver cómo están guardados los datos en la BD
    const ultimoRegistro = await Measurement.query().orderBy('created_at', 'desc').first();
    if (ultimoRegistro) {
      console.log('🔎 Último registro en BD:', ultimoRegistro.created_at, '(Tipo:', typeof ultimoRegistro.created_at, ')');
    } else {
      console.log('⚠️ La base de datos está vacía.');
      return null;
    }

    // 2. Calcular el rango en UTC (Ecuador es UTC-5)
    // Inicio: 29/07/2026 00:00:00 hora Ecuador = 29/07/2026 05:00:00 UTC
    const inicioUTC = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
    // Fin: 29/07/2026 23:59:59 hora Ecuador = 30/07/2026 04:59:59 UTC
    const finUTC = new Date(Date.UTC(year, month - 1, day + 1, 4, 59, 59));

    // 3. Forzar formato ISO String para la consulta (SQLite lo entiende mejor así)
    const inicioStr = inicioUTC.toISOString();
    const finStr = finUTC.toISOString();

    console.log(`🔍 Buscando entre: ${inicioStr} y ${finStr}`);

    // 4. Buscar usando los strings ISO
    const registros = await Measurement.query()
      .where('created_at', '>=', inicioStr)
      .where('created_at', '<=', finStr)
      .orderBy('created_at', 'asc');

    console.log(`📊 Registros encontrados: ${registros.length}`);

    if (registros.length === 0) {
      return null;
    }

    // 5. Crear libro de Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Datos DHT11');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Fecha', key: 'fecha', width: 12 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Temperatura (°C)', key: 'temperatura', width: 18 },
      { header: 'Humedad (%)', key: 'humedad', width: 15 }
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 20;

    // 6. Agregar datos ajustados a hora de Ecuador
    registros.forEach(reg => {
      // Aseguramos que sea un objeto Date válido
      const fechaObj = new Date(reg.created_at);
      const offsetEcuador = 5 * 60 * 60 * 1000;
      const fechaLocal = new Date(fechaObj.getTime() - offsetEcuador);

      sheet.addRow({
        id: reg.id,
        fecha: fechaLocal.toLocaleDateString('es-EC'),
        hora: fechaLocal.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temperatura: reg.temperature,
        humedad: reg.humidity
      });
    });

    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    return workbook;
  }
}

module.exports = new ExcelService();