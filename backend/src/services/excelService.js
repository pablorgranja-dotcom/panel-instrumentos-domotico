const ExcelJS = require('exceljs');
const Measurement = require('../models/Measurement');

class ExcelService {
  async generateReport(fechaHoraInicio, fechaHoraFin) {
    console.log('📅 Recibido inicio:', fechaHoraInicio, 'fin:', fechaHoraFin);

    // 1. Asegurar que el formato tenga segundos (ej: '2026-07-29T00:00' -> '2026-07-29T00:00:00')
    const inicioStrFmt = fechaHoraInicio.length === 16 ? fechaHoraInicio + ':00' : fechaHoraInicio;
    const finStrFmt = fechaHoraFin.length === 16 ? fechaHoraFin + ':00' : fechaHoraFin;

    // 2. Separar la fecha en partes numéricas
    const partsInicio = inicioStrFmt.split(/[-T:]/).map(Number);
    const partsFin = finStrFmt.split(/[-T:]/).map(Number);

    console.log('🔢 Partes inicio:', partsInicio);
    console.log('🔢 Partes fin:', partsFin);

    const [y1, m1, d1, h1, min1, s1] = partsInicio;
    const [y2, m2, d2, h2, min2, s2] = partsFin;

    // 3. Validar que se hayan convertido correctamente a números
    if (isNaN(y1) || isNaN(y2)) {
      console.error('❌ Error: Las fechas no se pudieron parsear correctamente.');
      return null;
    }

    // 4. Calcular UTC (Ecuador es UTC-5, por lo que SUMAMOS 5 horas a la hora local para obtener UTC)
    const inicioUTC = new Date(Date.UTC(y1, m1 - 1, d1, h1 + 5, min1, s1 || 0));
    const finUTC = new Date(Date.UTC(y2, m2 - 1, d2, h2 + 5, min2, s2 || 59));

    console.log('🌍 Inicio UTC:', inicioUTC.toISOString());
    console.log('🌍 Fin UTC:', finUTC.toISOString());

    // 5. Buscar en la base de datos
    const registros = await Measurement.query()
      .where('created_at', '>=', inicioUTC.toISOString())
      .where('created_at', '<=', finUTC.toISOString())
      .orderBy('created_at', 'asc');

    console.log(`📊 Registros encontrados: ${registros.length}`);

    if (registros.length === 0) {
      return null;
    }

    // 6. Crear libro de Excel
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

    const offsetEcuador = 5 * 60 * 60 * 1000;

    // 7. Agregar datos con manejo seguro de fechas
    registros.forEach(reg => {
      let fechaLocal;
      try {
        const fechaObj = new Date(reg.created_at);
        if (isNaN(fechaObj.getTime())) {
          console.warn('⚠️ Fecha inválida en BD:', reg.created_at);
          return; // Saltar este registro si la fecha está corrupta
        }
        fechaLocal = new Date(fechaObj.getTime() - offsetEcuador);
      } catch (e) {
        console.warn('⚠️ Error procesando fecha:', reg.created_at, e);
        return;
      }

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