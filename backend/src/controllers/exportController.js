const excelService = require('../services/excelService');

class ExportController {
  async downloadExcel(req, res) {
    console.log('🔍 Query params recibidos:', req.query); // ESTE LOG DEBE APARECER
    
    const { fechaHoraInicio, fechaHoraFin } = req.query;
    
    if (!fechaHoraInicio || !fechaHoraFin) {
      console.log('❌ Faltan parámetros. Valores:', { fechaHoraInicio, fechaHoraFin });
      return res.status(400).json({ error: 'Faltan las fechas y horas de inicio y fin' });
    }

    try {
      const workbook = await excelService.generateReport(fechaHoraInicio, fechaHoraFin);

      if (!workbook) {
        return res.status(404).json({ error: 'No hay datos en ese periodo de tiempo' });
      }

      const nombreArchivo = `reporte_domotico_${fechaHoraInicio.replace('T', '_').replace(':', '-')}_a_${fechaHoraFin.replace('T', '_').replace(':', '-')}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);

      await workbook.xlsx.write(res);
      res.end();
      console.log(`📄 Excel generado exitosamente`);

    } catch (error) {
      console.error('❌ Error al generar Excel:', error);
      res.status(500).json({ error: 'Error interno al generar el reporte' });
    }
  }
}


module.exports = new ExportController();