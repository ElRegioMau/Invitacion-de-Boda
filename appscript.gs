// =====================================================
//  WEDDING RSVP — Google Apps Script
//  Pega este código completo en tu proyecto de Apps Script
// =====================================================

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Si la hoja está vacía, crea los encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Fecha y Hora', 'Nombre', 'Teléfono', 'Asistirá']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 4).setBackground('#2a2a2a');
      sheet.getRange(1, 1, 1, 4).setFontColor('#ffffff');
    }

    var timestamp = e.parameter.timestamp || new Date().toLocaleString('es-MX');
    var name      = e.parameter.name      || '';
    var phone     = e.parameter.phone     || '';
    var attending = e.parameter.attending || '';

    // Validación básica
    if (!name || !phone) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'Datos incompletos' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([timestamp, name, phone, attending]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Registro guardado' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
