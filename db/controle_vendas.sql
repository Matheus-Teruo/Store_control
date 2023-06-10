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
-- Table structure for table `estandes`
--

DROP TABLE IF EXISTS `estandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estandes` (
  `IDestande` int NOT NULL AUTO_INCREMENT,
  `observacao` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `nomeItem` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preco` int NOT NULL,
  `estoque` int NOT NULL,
  `IDestande` int NOT NULL,
  PRIMARY KEY (`IDitem`),
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
  `kenjinkai` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diretoria` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`IDkenjinkai`)
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
-- Table structure for table `sacolas`
--

DROP TABLE IF EXISTS `sacolas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sacolas` (
  `IDitem` int NOT NULL,
  `IDvenda` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `p_unidade` int NOT NULL,
  PRIMARY KEY (`IDitem`,`IDvenda`),
  KEY `IDvenda` (`IDvenda`),
  CONSTRAINT `sacolas_ibfk_1` FOREIGN KEY (`IDitem`) REFERENCES `itens` (`IDitem`),
  CONSTRAINT `sacolas_ibfk_2` FOREIGN KEY (`IDvenda`) REFERENCES `vendas` (`IDvenda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sacolas`
--

LOCK TABLES `sacolas` WRITE;
/*!40000 ALTER TABLE `sacolas` DISABLE KEYS */;
/*!40000 ALTER TABLE `sacolas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `IDvenda` int NOT NULL AUTO_INCREMENT,
  `IDvendedor` int NOT NULL,
  `IDestande` int NOT NULL,
  `horario` datetime NOT NULL,
  PRIMARY KEY (`IDvenda`),
  KEY `IDvendedor` (`IDvendedor`),
  KEY `IDestande` (`IDestande`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`IDvendedor`) REFERENCES `vendedores` (`IDvendedor`),
  CONSTRAINT `vendas_ibfk_2` FOREIGN KEY (`IDestande`) REFERENCES `estandes` (`IDestande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendedores`
--

DROP TABLE IF EXISTS `vendedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendedores` (
  `IDvendedor` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IDestande` int DEFAULT NULL,
  PRIMARY KEY (`IDvendedor`),
  KEY `IDestande` (`IDestande`),
  CONSTRAINT `vendedores_ibfk_1` FOREIGN KEY (`IDestande`) REFERENCES `estandes` (`IDestande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendedores`
--

LOCK TABLES `vendedores` WRITE;
/*!40000 ALTER TABLE `vendedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendedores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-10 17:22:47
