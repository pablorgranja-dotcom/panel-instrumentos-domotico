const excelService = require('../services/excelService');

class ExportController {
  async downloadExcel(req, res) {
    const { fecha } = req.query;
    
    if (!fecha) {
      return res.status(400).json({ error: 'Falta el parámetro fecha' });
    }

    try {
      const workbook = await excelService.generateReport(fecha);

      if (!workbook) {
        return res.status(404).json({ error: 'No hay datos para esta fecha' });
      }

      res.setHeader(
        'Content-Type', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition', 
        `attachment; filename=reporte_domotico_${fecha}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
      console.log(`Excel generado exitosamente para la fecha: ${fecha}`);

    } catch (error) {
      console.error('Error al generar Excel:', error);
      res.status(500).json({ error: 'Error interno al generar el reporte' });
    }
  }
}

module.exports = new ExportController();