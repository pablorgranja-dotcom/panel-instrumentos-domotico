const ExcelJS = require('exceljs');
const Measurement = require('../models/Measurement');

class ExcelService {
  async generateReport(fechaHoraInicio, fechaHoraFin) {
    console.log(' Recibido inicio:', fechaHoraInicio, 'fin:', fechaHoraFin);

    // 1. Las fechas vienen como "YYYY-MM-DDTHH:mm" (hora local Ecuador)
    // La BD guarda en UTC, así que necesitamos SUMAR 5 horas para convertir a UTC
    
    const inicioLocal = new Date(fechaHoraInicio);
    const finLocal = new Date(fechaHoraFin);
    
    // Sumar 5 horas (Ecuador es UTC-5)
    const inicioUTC = new Date(inicioLocal.getTime() + (5 * 60 * 60 * 1000));
    const finUTC = new Date(finLocal.getTime() + (5 * 60 * 60 * 1000));

    // Convertir a formato SQLite "YYYY-MM-DD HH:mm:ss"
    const inicioStr = inicioUTC.toISOString().replace('T', ' ').substring(0, 19);
    const finStr = finUTC.toISOString().replace('T', ' ').substring(0, 19);

    console.log('🔍 Buscando desde (UTC):', inicioStr);
    console.log('🔍 Buscando hasta (UTC):', finStr);

    // 2. Buscar en la base de datos
    const registros = await Measurement.query()
      .where('created_at', '>=', inicioStr)
      .where('created_at', '<=', finStr)
      .orderBy('created_at', 'asc');

    console.log(`📊 Registros encontrados: ${registros.length}`);

    if (registros.length === 0) {
      return null;
    }

    // 3. Crear libro de Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Datos DHT11');

    // 4. Definir las columnas del Excel (incluye Estado del Foco)
    sheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Fecha', key: 'fecha', width: 12 },
      { header: 'Hora', key: 'hora', width: 10 },
      { header: 'Temperatura (°C)', key: 'temperatura', width: 18 },
      { header: 'Humedad (%)', key: 'humedad', width: 15 },
      { header: 'Estado del Foco', key: 'estado_foco', width: 18 }
    ];

    // 5. Formatear el encabezado
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 20;

    const offsetEcuador = 5 * 60 * 60 * 1000;

    // 6. Agregar datos con manejo seguro de fechas y estado del foco
    registros.forEach(reg => {
      let fechaLocal;
      try {
        const fechaObj = new Date(reg.created_at);
        if (isNaN(fechaObj.getTime())) {
          console.warn('⚠️ Fecha inválida en BD:', reg.created_at);
          return;
        }
        fechaLocal = new Date(fechaObj.getTime() - offsetEcuador);
      } catch (e) {
        console.warn('️ Error procesando fecha:', reg.created_at, e);
        return;
      }

      // Determinar estado del foco (SQLite guarda 1 o 0, o true/false)
      const ledEncendido = Number(reg.led_status) === 1 || reg.led_status === true;

      sheet.addRow({
        id: reg.id,
        fecha: fechaLocal.toLocaleDateString('es-EC'),
        hora: fechaLocal.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }),
        temperatura: reg.temperature,
        humedad: reg.humidity,
        estado_foco: ledEncendido ? 'Encendido' : 'Apagado'
      });
    });

    // 7. Congelar la primera fila
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    return workbook;
  }
}

module.exports = new ExcelService();