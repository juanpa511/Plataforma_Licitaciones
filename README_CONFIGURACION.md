# Configuración del Frontend con Backend AWS

Este documento explica cómo configurar el frontend para conectarse con tu backend de AWS Lambda.

## 🔧 Configuración Requerida

### 1. Variables de Entorno

Crea un archivo `.env` en la carpeta `Frontend` con la siguiente configuración:

```bash
# URL de tu API Gateway
REACT_APP_API_URL=https://tu-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
```

### 2. Obtener la URL de API Gateway

Para obtener la URL correcta de tu API Gateway:

1. Ve a la consola de AWS
2. Navega a API Gateway
3. Selecciona tu API
4. Ve a "Stages" y selecciona "dev"
5. Copia la "Invoke URL"

La URL debería verse así:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/dev
```

### 3. Verificar Endpoints

Tu API Gateway debe tener los siguientes endpoints configurados:

- `GET /licitaciones` - Lista de licitaciones con filtros
- `GET /licitaciones/{id}` - Detalles de una licitación específica
- `GET /estadisticas` - Estadísticas generales

## 📊 Estructura de Datos Esperada

### Endpoint `/licitaciones`
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "nombre": "Construcción de Edificio",
      "responsable": "Municipalidad de Santiago",
      "Monto": "1500000000",
      "region": "Metropolitana",
      "estado": "Abierta",
      "fechaPublicacion": "2024-01-15",
      "urlLicitacion": "https://...",
      "urlAdjuntos": "https://..."
    }
  ],
  "estadisticas": {
    "total": 100,
    "porRegion": {
      "Metropolitana": 25,
      "Valparaíso": 15
    },
    "porEstado": {
      "Abierta": 60,
      "Cerrada": 40
    },
    "fechaUltimaActualizacion": "2024-01-20T10:00:00Z"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Endpoint `/estadisticas`
```json
{
  "success": true,
  "data": {
    "totalLicitaciones": 100,
    "licitacionesAbiertas": 60,
    "organismos": 25,
    "montoTotal": 50000000000,
    "fechaUltimaActualizacion": "2024-01-20T10:00:00Z",
    "resumenPorRegion": {
      "Metropolitana": 25,
      "Valparaíso": 15,
      "Biobío": 10
    }
  }
}
```

### Endpoint `/licitaciones/{id}`
```json
{
  "success": true,
  "data": {
    "id": "123",
    "nombre": "Construcción de Edificio",
    "responsable": "Municipalidad de Santiago",
    "Monto": "1500000000",
    "region": "Metropolitana",
    "estado": "Abierta",
    "fechaPublicacion": "2024-01-15",
    "fechaCierre": "2024-03-15",
    "descripcion": "Descripción detallada...",
    "urlLicitacion": "https://...",
    "urlAdjuntos": "https://...",
    "categoria": "Construcción",
    "organismo": "Municipalidad",
    "tipoCompra": "Licitación Pública"
  }
}
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd Frontend
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar con tu URL real
nano .env
```

### 3. Ejecutar la aplicación
```bash
npm start
```

## 🔍 Funcionalidades Implementadas

### Dashboard
- ✅ Lista de licitaciones con paginación
- ✅ Filtros por región, estado y fechas
- ✅ Búsqueda en tiempo real
- ✅ Exportación a CSV y Excel
- ✅ Modal con detalles completos
- ✅ Botones de acción (Ver más, Ver licitación, Ver adjuntos)
- ✅ Fecha de última actualización

### HomePage
- ✅ Estadísticas generales desde S3
- ✅ Total de licitaciones por región
- ✅ Mapa interactivo con datos reales
- ✅ Fecha de última actualización

### Modal de Detalles
- ✅ Información completa de la licitación
- ✅ Enlaces a licitación original y adjuntos
- ✅ Formato de moneda chilena
- ✅ Estados con colores diferenciados

## 🛠️ Solución de Problemas

### Error de CORS
Si ves errores de CORS, verifica que tu API Gateway tenga CORS habilitado:

```yaml
# En serverless.yml
cors: true
```

### Error de Conexión
Si no puede conectarse a la API:

1. Verifica que la URL en `.env` sea correcta
2. Asegúrate de que las Lambdas estén desplegadas
3. Verifica que el API Gateway esté activo

### Datos no se cargan
Si los datos no se cargan:

1. Verifica que el bucket S3 tenga los datos
2. Verifica que las Lambdas tengan permisos de S3
3. Revisa los logs de CloudWatch

## 📝 Notas Importantes

- Los datos se cargan desde S3 en tiempo real
- La paginación se maneja en el servidor
- Los filtros se aplican en el backend
- La búsqueda se aplica localmente en el frontend
- Las exportaciones incluyen todos los datos filtrados

## 🎯 Próximos Pasos

1. **Configurar la URL de API Gateway** en `.env`
2. **Verificar que las Lambdas estén desplegadas**
3. **Probar la conexión** ejecutando `npm start`
4. **Personalizar el diseño** según tus necesidades
5. **Agregar más funcionalidades** como gráficos o reportes 