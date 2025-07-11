# Mapa de Chile - Portal de Licitaciones

## Tipos de Mapa Disponibles

### 1. Mapa Real (Predeterminado)
- **Archivo**: `ChileMapReal.js`
- **Características**:
  - SVG mejorado con gradientes
  - Sombras y efectos visuales
  - Mejor proporción de regiones
  - Contadores de licitaciones con sombras
  - Panel de estadísticas integrado

### 2. Mapa Simple
- **Archivo**: `ChileMap.js`
- **Características**:
  - Versión básica con rectángulos
  - Funcionalidad completa
  - Más ligero en recursos

### 3. Mapa con Imágenes
- **Archivo**: `ChileMapImages.js`
- **Características**:
  - Usa imágenes reales de cada región
  - Requiere imágenes en `/public/images/regions/`
  - Muy visual y atractivo

### 4. Google Maps
- **Archivo**: `ChileMapGoogle.js`
- **Características**:
  - Mapa real de Google
  - Requiere API key de Google Maps
  - Marcadores interactivos
  - Zoom y navegación completa

## Cómo Cambiar el Mapa

En `HomePage.js`, puedes cambiar el mapa predeterminado modificando:

```javascript
const [mapType, setMapType] = useState('real'); // 'simple', 'real', 'images', 'google'
```

## Personalización

### Colores de Regiones
Los colores se determinan por el número de licitaciones:
- **Gris**: Sin licitaciones
- **Azul claro**: 1-2 licitaciones
- **Azul medio**: 3-4 licitaciones
- **Azul oscuro**: 5+ licitaciones

### Coordenadas SVG
Las coordenadas están en `regionPaths` dentro de cada componente de mapa. Puedes ajustarlas para mejorar la precisión.

## Dependencias

Para que funcionen todos los componentes UI, asegúrate de tener instaladas:

```bash
npm install clsx tailwind-merge
```

## Próximas Mejoras

1. **Mapa con imágenes reales**: Agregar fotos de cada región
2. **Google Maps**: Configurar API key
3. **Animaciones**: Agregar transiciones suaves
4. **Responsive**: Mejorar en dispositivos móviles 