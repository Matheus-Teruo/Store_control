-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: controle_vendas
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cartoes`
--

DROP TABLE IF EXISTS `cartoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartoes` (
  `IDcartao` int NOT NULL,
  `credito` int NOT NULL,
  PRIMARY KEY (`IDcartao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartoes`
--

LOCK TABLES `cartoes` WRITE;
/*!40000 ALTER TABLE `cartoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `cartoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `IDcliente` int NOT NULL AUTO_INCREMENT,
  `IDcartao` int NOT NULL,
  `h_cliente` datetime NOT NULL,
  `uso` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`IDcliente`),
  KEY `IDcartao` (`IDcartao`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`IDcartao`) REFERENCES `cartoes` (`IDcartao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doacoes`
--

DROP TABLE IF EXISTS `doacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doacoes` (
  `IDdoacao` int NOT NULL AUTO_INCREMENT,
  `valor` int NOT NULL,
  `h_doacao` datetime NOT NULL,
  `IDcartao` int NOT NULL,
  `IDusuario` int NOT NULL,
  PRIMARY KEY (`IDdoacao`),
  KEY `IDcartao` (`IDcartao`),
  KEY `IDusuario` (`IDusuario`),
  CONSTRAINT `doacoes_ibfk_1` FOREIGN KEY (`IDcartao`) REFERENCES `cartoes` (`IDcartao`),
  CONSTRAINT `doacoes_ibfk_2` FOREIGN KEY (`IDusuario`) REFERENCES `usuarios` (`IDusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doacoes`
--

LOCK TABLES `doacoes` WRITE;
/*!40000 ALTER TABLE `doacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `doacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estandes`
--

DROP TABLE IF EXISTS `estandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estandes` (
  `IDestande` int NOT NULL AUTO_INCREMENT,
  `observacao` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IDkenjinkai` int NOT NULL,
  PRIMARY KEY (`IDestande`),
  KEY `IDkenjinkai` (`IDkenjinkai`),
  CONSTRAINT `estandes_ibfk_1` FOREIGN KEY (`IDkenjinkai`) REFERENCES `kenjinkais` (`IDkenjinkai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estandes`
--

LOCK TABLES `estandes` WRITE;
/*!40000 ALTER TABLE `estandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `estandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens`
--

DROP TABLE IF EXISTS `itens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens` (
  `IDitem` int NOT NULL AUTO_INCREMENT,
  `item` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco` int NOT NULL,
  `estoque` int NOT NULL,
  `IDestande` int NOT NULL,
  PRIMARY KEY (`IDitem`),
  UNIQUE KEY `item` (`item`),
  KEY `IDestande` (`IDestande`),
  CONSTRAINT `itens_ibfk_1` FOREIGN KEY (`IDestande`) REFERENCES `estandes` (`IDestande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens`
--

LOCK TABLES `itens` WRITE;
/*!40000 ALTER TABLE `itens` DISABLE KEYS */;
/*!40000 ALTER TABLE `itens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kenjinkais`
--

DROP TABLE IF EXISTS `kenjinkais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kenjinkais` (
  `IDkenjinkai` int NOT NULL AUTO_INCREMENT,
  `kenjinkai` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `diretoria` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`IDkenjinkai`),
  UNIQUE KEY `kenjinkai` (`kenjinkai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kenjinkais`
--

LOCK TABLES `kenjinkais` WRITE;
/*!40000 ALTER TABLE `kenjinkais` DISABLE KEYS */;
/*!40000 ALTER TABLE `kenjinkais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objetos`
--

DROP TABLE IF EXISTS `objetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objetos` (
  `IDitem` int NOT NULL,
  `IDvenda` int NOT NULL,
  `quantidade` int NOT NULL,
  `p_unidade` int NOT NULL,
  PRIMARY KEY (`IDitem`,`IDvenda`),
  KEY `IDvenda` (`IDvenda`),
  CONSTRAINT `objetos_ibfk_1` FOREIGN KEY (`IDitem`) REFERENCES `itens` (`IDitem`),
  CONSTRAINT `objetos_ibfk_2` FOREIGN KEY (`IDvenda`) REFERENCES `vendas` (`IDvenda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objetos`
--

LOCK TABLES `objetos` WRITE;
/*!40000 ALTER TABLE `objetos` DISABLE KEYS */;
/*!40000 ALTER TABLE `objetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recargas`
--

DROP TABLE IF EXISTS `recargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recargas` (
  `IDrecarga` int NOT NULL AUTO_INCREMENT,
  `recarga` int NOT NULL,
  `h_recarga` datetime NOT NULL,
  `IDcartao` int NOT NULL,
  `IDusuario` int NOT NULL,
  PRIMARY KEY (`IDrecarga`),
  KEY `IDcartao` (`IDcartao`),
  KEY `IDusuario` (`IDusuario`),
  CONSTRAINT `recargas_ibfk_1` FOREIGN KEY (`IDcartao`) REFERENCES `cartoes` (`IDcartao`),
  CONSTRAINT `recargas_ibfk_2` FOREIGN KEY (`IDusuario`) REFERENCES `usuarios` (`IDusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recargas`
--

LOCK TABLES `recargas` WRITE;
/*!40000 ALTER TABLE `recargas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recargas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `IDusuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `salt` char(29) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDestande` int DEFAULT NULL,
  PRIMARY KEY (`IDusuario`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `nome` (`nome`),
  KEY `IDestande` (`IDestande`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`IDestande`) REFERENCES `estandes` (`IDestande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `IDvenda` int NOT NULL AUTO_INCREMENT,
  `IDusuario` int NOT NULL,
  `IDestande` int NOT NULL,
  `IDcartao` int NOT NULL,
  `h_venda` datetime NOT NULL,
  PRIMARY KEY (`IDvenda`),
  KEY `IDusuario` (`IDusuario`),
  KEY `IDestande` (`IDestande`),
  KEY `IDcartao` (`IDcartao`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`IDusuario`) REFERENCES `usuarios` (`IDusuario`),
  CONSTRAINT `vendas_ibfk_2` FOREIGN KEY (`IDestande`) REFERENCES `estandes` (`IDestande`),
  CONSTRAINT `vendas_ibfk_3` FOREIGN KEY (`IDcartao`) REFERENCES `cartoes` (`IDcartao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-12 18:39:44
