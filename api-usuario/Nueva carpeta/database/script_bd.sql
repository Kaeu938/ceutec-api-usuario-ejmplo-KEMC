-- =====================================================================
-- CCC217: Análisis de problemas
-- Script de creación de base de datos - Actividad Artículos
-- =====================================================================

DROP DATABASE IF EXISTS db_articulos;
CREATE DATABASE db_articulos
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_articulos;

-- ---------------------------------------------------------------------
-- Tabla: Articulos
-- ---------------------------------------------------------------------
CREATE TABLE Articulos (
    CodArticulo         VARCHAR(15)     NOT NULL,
    Nombre              VARCHAR(100)    NOT NULL,
    Descripcion         VARCHAR(255)    NULL,
    PrecioUnidad        DECIMAL(10,2)   NOT NULL,
    UnidadesStock       INT             NOT NULL DEFAULT 0,
    StockSeguridad      INT             NOT NULL DEFAULT 0,
    Imagen              VARCHAR(255)    NULL,
    FechaCreacion       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_articulos PRIMARY KEY (CodArticulo),
    CONSTRAINT ck_precio_positivo CHECK (PrecioUnidad >= 0),
    CONSTRAINT ck_unidades_positivas CHECK (UnidadesStock >= 0),
    CONSTRAINT ck_stock_seguridad_positivo CHECK (StockSeguridad >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- Datos de prueba (opcional)
-- ---------------------------------------------------------------------
INSERT INTO Articulos (CodArticulo, Nombre, Descripcion, PrecioUnidad, UnidadesStock, StockSeguridad, Imagen)
VALUES
('ART001', 'Mouse óptico USB', 'Mouse óptico USB con cable de 1.5m', 8.50, 50, 10, NULL),
('ART002', 'Teclado mecánico', 'Teclado mecánico retroiluminado', 25.00, 30, 5, NULL);
