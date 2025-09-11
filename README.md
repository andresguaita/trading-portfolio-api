# Trading Portfolio API

**API REST desarrollada en Node.js/NestJS para gestión de portafolios de trading con soporte para órdenes de compra/venta y manejo de efectivo.**

## Funcionalidades

- **Portfolio**: Consulta valor total de cuenta, efectivo disponible y posiciones con rendimientos
- **Búsqueda de Instrumentos**: Buscar activos por ticker o nombre con paginación
- **Gestión de Órdenes**: Creación de órdenes MARKET/LIMIT para BUY/SELL/CASH_IN/CASH_OUT
- **Gestión de Efectivo**: Ingreso y retiro de fondos modelado como instrumento MONEDA
- **Market Data**: Precios actuales e históricos para cálculo de rendimientos
- **Validaciones**: Control de fondos suficientes, acciones disponibles y tipos de orden

## Instalación y Ejecución

### Opción 1: Docker (RECOMENDADO)

**Stack completo con un solo comando:**

```bash
# Clonar repositorio
git clone trading-portfolio-api
cd trading-portfolio-api

# Levantar PostgreSQL + API con datos de prueba
docker-compose up --build
```

**API disponible en:** http://localhost:3000/api

**¿Qué incluye Docker?**
- PostgreSQL local con 66 instrumentos argentinos
- 4 usuarios de prueba con datos realistas  
- Órdenes históricas y market data
- Sin configuraciones adicionales

### Opción 2: Instalación Manual

**Requisitos:**
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

**Pasos:**

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar base de datos:**
```bash
# Crear base de datos PostgreSQL
createdb trading_portfolio_db

# Ejecutar script de inicialización
psql -d trading_portfolio_db -f database/init.sql
```

3. **Variables de entorno (.env):**
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=tu_usuario
DATABASE_PASSWORD=tu_password
DATABASE_NAME=trading_portfolio_db
NODE_ENV=development
```

4. **Ejecutar:**
```bash
# Desarrollo
npm run start:dev

# Producción  
npm run build && npm run start:prod
```

## API Endpoints

### Portfolio

**GET** `/api/portfolio/:userId`

Obtiene información completa del portfolio de un usuario.

```bash
curl /api/portfolio/1
```

**Respuesta:**
```json
{
  "userId": 1,
  "totalValue": 1200000,
  "availableCash": 753000,
  "positions": [
    {
      "instrumentId": 47,
      "ticker": "PAMP",
      "name": "Pampa Holding S.A.",
      "quantity": 40,
      "averagePrice": 930.00,
      "currentPrice": 925.85,
      "marketValue": 37034.00,
      "totalReturn": -0.45,
      "dailyReturn": 0.44
    }
  ]
}
```

### Búsqueda de Instrumentos

**GET** `/api/instruments/search?query=<query>&page=<page>&limit=<limit>`

Busca instrumentos por ticker o nombre.

```bash
curl "/api/instruments/search?query=PAMP&page=1&limit=5"
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": 47,
      "ticker": "PAMP",
      "name": "Pampa Holding S.A.",
      "type": "ACCIONES"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

### Listar Instrumentos

**GET** `/api/instruments?page=<page>&limit=<limit>`

Lista todos los instrumentos con paginación.

```bash
curl "/api/instruments?page=1&limit=10"
```

### Crear Órdenes

**POST** `/api/orders`

Crea una nueva orden de trading.

#### CASH_IN (Ingreso de efectivo)
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 66,
    "side": "CASH_IN", 
    "type": "MARKET",
    "quantity": 50000
  }'
```

#### CASH_OUT (Retiro de efectivo)  
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 66,
    "side": "CASH_OUT",
    "type": "MARKET", 
    "quantity": 10000
  }'
```

#### COMPRA por cantidad
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "side": "BUY",
    "type": "MARKET",
    "quantity": 10
  }'
```

#### COMPRA por monto
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1, 
    "instrumentId": 47,
    "side": "BUY",
    "type": "MARKET",
    "amount": 10000
  }'
```

#### VENTA
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47, 
    "side": "SELL",
    "type": "MARKET",
    "quantity": 5
  }'
```

#### ORDEN LÍMITE  
```bash
curl -X POST /api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "instrumentId": 47,
    "side": "BUY", 
    "type": "LIMIT",
    "quantity": 10,
    "price": 900.00
  }'
```

**Respuesta de Orden:**
```json
{
  "id": 12,
  "userId": 1,
  "instrumentId": 47,
  "side": "BUY",
  "type": "MARKET", 
  "status": "FILLED",
  "quantity": 10,
  "price": 925.85,
  "executedPrice": 925.85,
  "datetime": "2023-07-14T10:30:00.000Z"
}
```

## Estados y Tipos de Orden

### Estados (Status)
- **NEW**: Orden límite creada, pendiente de ejecución
- **FILLED**: Orden ejecutada exitosamente  
- **REJECTED**: Orden rechazada (fondos/acciones insuficientes)
- **CANCELLED**: Orden cancelada por el usuario

### Tipos (Type)
- **MARKET**: Ejecución inmediata al precio de mercado
- **LIMIT**: Ejecución condicionada a precio específico

### Lados (Side)
- **BUY**: Compra de acciones
- **SELL**: Venta de acciones
- **CASH_IN**: Ingreso de efectivo
- **CASH_OUT**: Retiro de efectivo

## Testing

```bash
# Ejecutar tests
npm test

# Con Docker
docker-compose exec app npm test
