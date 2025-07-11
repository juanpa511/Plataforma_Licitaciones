# Configuración de API Gateway para el Frontend

## 🔗 **Tu API Gateway Actual:**
- **URL Base:** `https://ve4tmpr2q1.execute-api.us-east-1.amazonaws.com/estapa_1`
- **Rutas configuradas:** `/licitaciones` y `/historial`

## 📋 **Rutas que necesita el Frontend:**

### 1. **GET /licitaciones** ✅ (Ya tienes)
- **Propósito:** Obtener lista de licitaciones con filtros
- **Parámetros opcionales:** `region`, `page`, `limit`, `estado`, `fechaInicio`, `fechaFin`
- **Respuesta esperada:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pages": 10,
    "total": 100
  },
  "estadisticas": {
    "porRegion": {...},
    "porEstado": {...}
  }
}
```

### 2. **GET /licitaciones/{id}** ❌ (Falta)
- **Propósito:** Obtener detalles de una licitación específica
- **Parámetros:** `id` en la URL
- **Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nombre": "...",
    "responsable": "...",
    "Monto": "...",
    "region": "...",
    "estado": "...",
    "fechaPublicacion": "...",
    "urlLicitacion": "...",
    "urlAdjuntos": "..."
  }
}
```

### 3. **GET /estadisticas** ❌ (Falta) o usar `/historial`
- **Propósito:** Obtener estadísticas generales
- **Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "totalLicitaciones": 100,
    "licitacionesAbiertas": 50,
    "organismos": 25,
    "montoTotal": 1000000000,
    "fechaUltimaActualizacion": "2024-01-15",
    "resumenPorRegion": {...},
    "estadosPorCategoria": {...}
  }
}
```

## ⚙️ **Configuración Actual del Frontend:**

El frontend está configurado para usar tu URL:
```javascript
// En src/config/api.js
BASE_URL: 'https://ve4tmpr2q1.execute-api.us-east-1.amazonaws.com/estapa_1'
```

## 🔧 **Pasos para completar la configuración:**

### **Opción A: Agregar las rutas faltantes en API Gateway**
1. Ir a AWS Console → API Gateway
2. Seleccionar tu API `portal-licitaciones-dev`
3. Agregar las rutas faltantes:
   - `GET /licitaciones/{id}`
   - `GET /estadisticas`

### **Opción B: Usar la ruta `/historial` existente**
Si tu ruta `/historial` devuelve estadísticas, el frontend ya está configurado para usarla como fallback.

## 🚀 **Para probar la conexión:**

1. **Crear archivo `.env` en la carpeta Frontend:**
```bash
REACT_APP_API_URL=https://ve4tmpr2q1.execute-api.us-east-1.amazonaws.com/estapa_1
```

2. **Ejecutar el frontend:**
```bash
npm start
```

3. **Verificar en la consola del navegador** si hay errores de conexión

## 📝 **Notas importantes:**
- El frontend maneja automáticamente errores de conexión
- Si una ruta no existe, intentará con rutas alternativas
- Los datos se cargan desde S3 a través de las Lambdas
- CORS está habilitado en las Lambdas para permitir peticiones desde el frontend

¿Necesitas ayuda para configurar alguna ruta específica en tu API Gateway? 