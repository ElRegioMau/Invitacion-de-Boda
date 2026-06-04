# Guía completa: Google Sheets + Apps Script para el RSVP

---

## PASO 1 — Crear la hoja de cálculo en Google Sheets

1. Ve a https://sheets.google.com
2. Haz clic en **"+"** para crear una hoja nueva
3. Ponle el nombre: **"RSVP - Boda Gilberto & Laura"**
4. La primera vez que alguien envíe el formulario, el script creará automáticamente las columnas:
   - Fecha y Hora | Nombre | Teléfono | Asistirá

> Tip: si quieres verlas desde antes, agrégalas tú manualmente en la fila 1 con ese mismo orden.

---

## PASO 2 — Abrir el editor de Apps Script

1. En tu hoja de Google Sheets, ve al menú:
   **Extensiones → Apps Script**
2. Se abrirá una nueva pestaña con el editor de código

---

## PASO 3 — Pegar el código

1. Borra todo el código que ya está en el editor (normalmente dice `function myFunction() {}`)
2. Copia el contenido completo del archivo **appscript.gs** que se te entregó
3. Pégalo en el editor
4. Haz clic en el ícono de **guardar** (disco) o presiona `Ctrl + S`
5. Ponle nombre al proyecto si te lo pide (ej: "Wedding RSVP")

---

## PASO 4 — Publicar como Web App

1. En el editor de Apps Script, haz clic en el botón azul **"Implementar"** (arriba a la derecha)
2. Selecciona **"Nueva implementación"**
3. Haz clic en el ícono de engranaje ⚙️ junto a "Seleccionar tipo"
4. Elige **"Aplicación web"**
5. Configura así:
   - **Descripción:** RSVP Boda (o lo que gustes)
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** **Cualquier persona** ← MUY IMPORTANTE
6. Haz clic en **"Implementar"**
7. Autoriza los permisos que te pida (verás pantallas de "Google quiere acceder a…")
   - Haz clic en "Avanzado" → "Ir a [nombre del proyecto]" → "Permitir"

---

## PASO 5 — Copiar la URL de la Web App

1. Después de implementar, Google te mostrará una ventana con:
   **"URL de la aplicación web"**
2. Copia esa URL, se verá algo así:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
3. Guarda esa URL, la necesitas en el siguiente paso

---

## PASO 6 — Pegar la URL en el archivo JS

1. Abre el archivo **JS/script.js**
2. En la línea 6 encontrarás:
   ```javascript
   const APPS_SCRIPT_URL = 'TU_APPS_SCRIPT_WEB_APP_URL_AQUI';
   ```
3. Reemplaza `TU_APPS_SCRIPT_WEB_APP_URL_AQUI` con tu URL, ejemplo:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Guarda el archivo

---

## PASO 7 — Probar

1. Abre la invitación en tu celular o navegador
2. Ve a la sección "¿Nos acompañarás?"
3. Llena el formulario y envía
4. Abre tu Google Sheet y verifica que apareció el registro

---

## Notas importantes

- **No compartas la URL de Apps Script** públicamente (ya viene embebida en el JS de la invitación, pero evita postearla por separado)
- Cada vez que modifiques el código de Apps Script, debes hacer una **nueva implementación** (no uses la misma versión, crea una nueva)
- El script usa `mode: 'no-cors'` en fetch, lo que es normal: el navegador no leerá la respuesta del servidor, pero el dato sí se guardará correctamente en tu hoja

---

## Estructura de la hoja de cálculo resultante

| Fecha y Hora | Nombre | Teléfono | Asistirá |
|---|---|---|---|
| 12/1/2026 10:30 AM | Juan Pérez | +52 81 1234 5678 | Sí |
| 12/1/2026 11:00 AM | María López | +52 81 9876 5432 | No |

---

## ¿Problemas comunes?

**El formulario envía pero no aparece nada en Sheets:**
- Verifica que en el paso 4 elegiste "Cualquier persona" en "Quién tiene acceso"
- Asegúrate de haber copiado la URL correcta (termina en `/exec`, no en `/dev`)

**Error de autorización:**
- Vuelve al editor de Apps Script → Implementar → Administrar implementaciones
- Elimina la implementación actual y crea una nueva repitiendo el paso 4

**La URL cambió:**
- Cada nueva implementación puede generar una URL diferente
- Actualiza la URL en JS/script.js y vuelve a subir el archivo
