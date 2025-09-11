-- Database: trading_portfolio_db
-- Initialization script with sample data

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "public"."marketdata";
DROP TABLE IF EXISTS "public"."orders";
DROP TABLE IF EXISTS "public"."instruments";
DROP TABLE IF EXISTS "public"."users";

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS instruments_id_seq;
CREATE SEQUENCE IF NOT EXISTS orders_id_seq;
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE SEQUENCE IF NOT EXISTS marketdata_id_seq;

-- Create tables
CREATE TABLE "public"."instruments" (
    "id" int4 NOT NULL DEFAULT nextval('instruments_id_seq'::regclass),
    "ticker" varchar(10),
    "name" varchar(255),
    "type" varchar(10),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "email" varchar(255),
    "accountnumber" varchar(20),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."orders" (
    "id" int4 NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
    "instrumentid" int4,
    "userid" int4,
    "size" int4,
    "price" numeric(10,2),
    "type" varchar(10),
    "side" varchar(10),
    "status" varchar(20),
    "datetime" timestamp,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."marketdata" (
    "id" int4 NOT NULL DEFAULT nextval('marketdata_id_seq'::regclass),
    "instrumentid" int4,
    "high" numeric(10,2),
    "low" numeric(10,2),
    "open" numeric(10,2),
    "close" numeric(10,2),
    "previousclose" numeric(10,2),
    "date" date,
    PRIMARY KEY ("id")
);

-- Insert sample data
INSERT INTO "public"."users" ("id", "email", "accountnumber") VALUES
(1, 'emiliano@test.com', '10001'),
(2, 'jose@test.com', '10002'),
(3, 'francisco@test.com', '10003'),
(4, 'juan@test.com', '10004');

INSERT INTO "public"."instruments" ("id", "ticker", "name", "type") VALUES
(1, 'DYCA', 'Dycasa S.A.', 'ACCIONES'),
(2, 'CAPX', 'Capex S.A.', 'ACCIONES'),
(3, 'PGR', 'Phoenix Global Resources', 'ACCIONES'),
(4, 'MOLA', 'Molinos Agro S.A.', 'ACCIONES'),
(5, 'MIRG', 'Mirgor', 'ACCIONES'),
(6, 'PATA', 'Importadora y Exportadora de la Patagonia', 'ACCIONES'),
(7, 'TECO2', 'Telecom', 'ACCIONES'),
(8, 'FERR', 'Ferrum S.A.', 'ACCIONES'),
(9, 'SAMI', 'S.A San Miguel', 'ACCIONES'),
(10, 'IRCP', 'IRSA Propiedades Comerciales S.A.', 'ACCIONES'),
(11, 'GAMI', 'Boldt Gaming S.A.', 'ACCIONES'),
(12, 'DOME', 'Domec', 'ACCIONES'),
(13, 'INTR', 'Compañía Introductora de Buenos Aires S.A.', 'ACCIONES'),
(14, 'MTR', 'Matba Rofex S.A.', 'ACCIONES'),
(15, 'FIPL', 'Fiplasto', 'ACCIONES'),
(16, 'GARO', 'Garovaglio Y Zorraquín', 'ACCIONES'),
(17, 'SEMI', 'Molinos Juan Semino', 'ACCIONES'),
(18, 'HARG', 'Holcim (Argentina) S.A.', 'ACCIONES'),
(19, 'BPAT', 'Banco Patagonia', 'ACCIONES'),
(20, 'RIGO', 'Rigolleau S.A.', 'ACCIONES'),
(21, 'CVH', 'Cablevision Holding', 'ACCIONES'),
(22, 'BBAR', 'Banco Frances', 'ACCIONES'),
(23, 'LEDE', 'Ledesma', 'ACCIONES'),
(24, 'CELU', 'Celulosa Argentina S.A.', 'ACCIONES'),
(25, 'CECO2', 'Central Costanera', 'ACCIONES'),
(26, 'AGRO', 'Agrometal', 'ACCIONES'),
(27, 'AUSO', 'Autopistas del Sol', 'ACCIONES'),
(28, 'BHIP', 'Banco Hipotecario S.A.', 'ACCIONES'),
(29, 'BOLT', 'Boldt S.A.', 'ACCIONES'),
(30, 'CARC', 'Carboclor S.A.', 'ACCIONES'),
(31, 'BMA', 'Banco Macro S.A.', 'ACCIONES'),
(32, 'CRES', 'Cresud S.A.', 'ACCIONES'),
(33, 'EDN', 'Edenor S.A.', 'ACCIONES'),
(34, 'GGAL', 'Grupo Financiero Galicia', 'ACCIONES'),
(35, 'DGCU2', 'Distribuidora De Gas Cuyano S.A.', 'ACCIONES'),
(36, 'GBAN', 'Gas Natural Ban S.A.', 'ACCIONES'),
(37, 'CGPA2', 'Camuzzi Gas del Sur', 'ACCIONES'),
(38, 'CADO', 'Carlos Casado', 'ACCIONES'),
(39, 'GCLA', 'Grupo Clarin S.A.', 'ACCIONES'),
(40, 'GRIM', 'Grimoldi', 'ACCIONES'),
(41, 'RICH', 'Laboratorios Richmond', 'ACCIONES'),
(42, 'MOLI', 'Molinos Río de la Plata', 'ACCIONES'),
(43, 'VALO', 'BCO DE VALORES ACCIONES ORD.', 'ACCIONES'),
(44, 'TGNO4', 'Transportadora de Gas del Norte', 'ACCIONES'),
(45, 'LOMA', 'Loma Negra S.A.', 'ACCIONES'),
(46, 'IRSA', 'IRSA Inversiones y Representaciones S.A.', 'ACCIONES'),
(47, 'PAMP', 'Pampa Holding S.A.', 'ACCIONES'),
(48, 'TGSU2', 'Transportadora de Gas del Sur', 'ACCIONES'),
(49, 'TXAR', 'Ternium Argentina S.A', 'ACCIONES'),
(50, 'YPFD', 'Y.P.F. S.A.', 'ACCIONES'),
(51, 'MORI', 'Morixe Hermanos S.A.C.I.', 'ACCIONES'),
(52, 'INVJ', 'Inversora Juramento S.A.', 'ACCIONES'),
(53, 'POLL', 'Polledo S.A.', 'ACCIONES'),
(54, 'METR', 'MetroGAS S.A.', 'ACCIONES'),
(55, 'LONG', 'Longvie', 'ACCIONES'),
(56, 'SUPV', 'Grupo Supervielle S.A.', 'ACCIONES'),
(57, 'ROSE', 'Instituto Rosenbusch', 'ACCIONES'),
(58, 'OESTE', 'Oeste Grupo Concesionario', 'ACCIONES'),
(59, 'COME', 'Sociedad Comercial Del Plata', 'ACCIONES'),
(60, 'CEPU', 'Central Puerto', 'ACCIONES'),
(61, 'ALUA', 'Aluar Aluminio Argentino S.A.I.C.', 'ACCIONES'),
(62, 'CTIO', 'Consultatio S.A.', 'ACCIONES'),
(63, 'TRAN', 'Transener S.A.', 'ACCIONES'),
(64, 'HAVA', 'Havanna Holding', 'ACCIONES'),
(65, 'BYMA', 'Bolsas y Mercados Argentinos S.A.', 'ACCIONES'),
(66, 'ARS', 'PESOS', 'MONEDA');

INSERT INTO "public"."orders" ("id", "instrumentid", "userid", "size", "price", "type", "side", "status", "datetime") VALUES
(1, 66, 1, 1000000, 1.00, 'MARKET', 'CASH_IN', 'FILLED', '2023-07-12 12:11:20'),
(2, 47, 1, 50, 930.00, 'MARKET', 'BUY', 'FILLED', '2023-07-12 12:31:20'),
(3, 47, 1, 50, 920.00, 'LIMIT', 'BUY', 'CANCELLED', '2023-07-12 14:21:20'),
(4, 47, 1, 10, 940.00, 'MARKET', 'SELL', 'FILLED', '2023-07-12 14:51:20'),
(5, 45, 1, 50, 710.00, 'LIMIT', 'BUY', 'NEW', '2023-07-12 15:14:20'),
(6, 47, 1, 100, 950.00, 'MARKET', 'SELL', 'REJECTED', '2023-07-12 16:11:20'),
(7, 31, 1, 60, 1500.00, 'LIMIT', 'BUY', 'NEW', '2023-07-13 11:13:20'),
(8, 66, 1, 100000, 1.00, 'MARKET', 'CASH_OUT', 'FILLED', '2023-07-13 12:31:20'),
(9, 31, 1, 20, 1540.00, 'LIMIT', 'BUY', 'FILLED', '2023-07-13 12:51:20'),
(10, 54, 1, 500, 250.00, 'MARKET', 'BUY', 'FILLED', '2023-07-13 14:11:20'),
(11, 31, 1, 30, 1530.00, 'MARKET', 'SELL', 'FILLED', '2023-07-13 15:13:20');

INSERT INTO "public"."marketdata" ("id", "instrumentid", "high", "low", "open", "close", "previousclose", "date") VALUES
(1, 31, 1560.00, 1470.00, 1525.00, 1502.80, 1520.25, '2023-07-14'),
(2, 45, 744.45, 724.00, 730.00, 734.65, 734.35, '2023-07-14'),
(3, 47, 927.70, 902.05, 920.15, 925.85, 921.80, '2023-07-14'),
(4, 54, 233.00, 225.25, 232.00, 229.50, 232.00, '2023-07-14'),
(5, 66, 1.00, 1.00, 1.00, 1.00, 1.00, '2023-07-14');

-- Create indexes
CREATE INDEX idx_instruments_ticker ON public.instruments USING btree (ticker);
CREATE INDEX idx_instruments_name ON public.instruments USING btree (name);
CREATE INDEX idx_orders_instrument ON public.orders USING btree (instrumentid);
CREATE INDEX idx_orders_user ON public.orders USING btree (userid);

-- Add foreign key constraints
ALTER TABLE "public"."orders" ADD FOREIGN KEY ("instrumentid") REFERENCES "public"."instruments"("id");
ALTER TABLE "public"."orders" ADD FOREIGN KEY ("userid") REFERENCES "public"."users"("id");
ALTER TABLE "public"."marketdata" ADD FOREIGN KEY ("instrumentid") REFERENCES "public"."instruments"("id");
