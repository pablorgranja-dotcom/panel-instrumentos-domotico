Crear el componente Footer.jsx
Crea el archivo frontend/src/components/Footer.jsx


Actualizar App.jsx para incluir el Footer
Abre frontend/src/App.jsx y haz cambios:




en la placa Arduino se instalo código para led


Editar el archivo de migración creado
Abre el archivo recién creado en backend/migrations/ (el que termina en _create_devices_table.js)


Abre el archivo creado en backend/seeds/ y reemplaza su contenido:


Backend (Modelo, Servicio, Controlador, Rutas)
1. backend/src/models/Device.js (crear archivo)
2. backend/src/validations/deviceSchema.js (crear archivo)
3. backend/src/services/deviceService.js (crear archivo)
4. backend/src/controllers/deviceController.js (crear archivo)
5. backend/src/routes/deviceRoutes.js (crear archivo)
6. Actualizar backend/src/app.js
7. Actualizar backend/src/serial/arduinoConnection.js


FASE 4: Frontend
1. frontend/src/components/DeviceControl.jsx (crear archivo)
2. Actualizar frontend/src/App.jsx


Pasos para probar (EN ESTE ORDEN):
Carga el nuevo código en el Arduino (con el LED en pin 13 o usa el LED integrado de la placa).
Cierra el Monitor Serial de Arduino IDE (muy importante).
Reinicia el backend:





