-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: twitter
-- ------------------------------------------------------
-- Server version	9.3.0



SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_0900_ai_ci';
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
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(140) NOT NULL,
  `id` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `posts_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `id` (`id`),
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,'<p>ありがとう</p>','0197c569-5f89-7418-aa63-60d383b19556','2025-07-23 21:05:36',NULL),(3,'<p>よっしゃー！！！！！<br>投稿できたぞ！！！！！</p>','0197c569-5f89-7418-aa63-60d383b19556','2025-07-23 21:07:54',NULL),(4,'<p>画像テスト</p>','0197c569-5f89-7418-aa63-60d383b19556','2025-07-29 17:08:11',NULL),(5,'<p>test</p><p><img src=\"__POST_IMAGE__\" alt=\"投稿画像\" /></p>','0197c569-5f89-7418-aa63-60d383b19556','2025-07-30 13:49:19',NULL),(6,'<p>テストだよ</p><p>お試しつぶやき</p><figure class=\"image\"><img src=\"__POST_IMAGE__\" alt=\"投稿画像\" /></figure>','0197c569-5f89-7418-aa63-60d383b19556','2025-07-30 15:02:25','http://localhost:3000/postImage/1753855344160.png'),(7,'<p>さよなら、、、、</p>','0197c96c-f48c-74a8-8474-2258051528c9','2025-08-01 12:51:17',NULL),(8,'<p>もう疲れた</p><figure class=\"image\"><img src=\"__POST_IMAGE__\" alt=\"投稿画像\" /></figure>','0197c569-5f89-7418-aa63-60d383b19556','2025-08-01 14:32:36','http://localhost:3000/postImage/1754026355362.jpeg'),(9,'<p>おはようございます！！！！！！！！！</p>','0197d434-e931-7359-a185-67f7b241df19','2025-08-01 15:01:57',NULL),(10,'<p>Hello!!!</p>','0197c569-5f89-7418-aa63-60d383b19556','2025-08-06 17:11:59',NULL),(11,'<p>testdesu</p>','0197c569-5f89-7418-aa63-60d383b19556','2025-08-06 19:24:56',NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `account_id` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_name` varchar(25) NOT NULL,
  `user_image` varchar(255) NOT NULL,
  `user_contents` varchar(200) DEFAULT NULL,
  `user_header` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0197c569-5f89-7418-aa63-60d383b19556','thankyou_rabit','$2b$10$lOzA.P9Wu100qmPynKQTbePGJs625h7AyxR.esDq6OAjnY6WTZWZi','ありがとうさぎ','/images/1752630044069-583779021.png','ありがとうさぎ♡\r\nAC JAPAN所属\r\nありがとうっていい響き','/images/1752572371334-773022973.jpg'),('0197c571-5fa3-775c-8b85-ed1b7516b7d8','hello_dog','$2b$10$mPKRsdw/36Ynq2hyRSKC6eKN4rCPVwzspVOYgdY175/XjqrwFSIxe','こんにちわん','/images/1752630422343-718488463.jpg','こんにちわん\r\nAC JAPAN所属','/images/1752630422342-187644369.jpg'),('0197c96c-f48c-74a8-8474-2258051528c9','goodbye_lion','$2b$10$Mj1I5yMAqMJD4A0y4vY.0.E4QxMJDuQqNJgP8AvexKzIGV5NEQOb.','さよならいおん','/images/1752576384189-563879827.jpeg','さよならいおん','/images/1752578904096-376625150.jpg'),('0197d434-e931-7359-a185-67f7b241df19','goodmorning_eal','$2b$10$i1/cN4Hkp1yFbbCxzGk07eSTKWDSqVsYmP0HhcUk4rt9PzrO5q/9O','おはようなぎ','/images/1752630613358-394089503.jpeg','おはようなぎ☀️\r\nAC JAPAN所属','/images/1752630613357-558692817.jpg'),('01980c53-a09f-757f-a12f-9cf930453f94','goodevening_croco','$2b$10$OrEOcDCQO8UgJHZN9MF/z.k4ZivFwYlHQywnk5cVOhdchizLaLslS','こんばんわに','/images/1752631307051-206010466.jpg','こんばんわに🌙\r\nAC JAPAN所属','/images/1752631307051-353638851.png'),('01987e71-3808-71af-82a3-06c6bded61d0','itadaki_mouse','$2b$10$36OhmVKl1vwk6e.ZaY0pMusb70.aAHc6ORPAEguuIj4o9BT2Bbu1u','いただきマウス','/images/default-avatar.png',NULL,NULL),('01987e78-f9d7-70ae-a94c-f65023aa79c5','test','$2b$10$sf.x0yL8p9.mrFFsMpIGeePxDsWZsRlfzy1.7APposklBpQOM.diW','test','/images/default-avatar.png',NULL,NULL),('01987e8b-0aac-72ad-b0ba-2ac800852bc9','uk3ry31','$2b$10$h4qIsG20LbnSAJe/TGA5yeCTtO.MZsiyn9lVWsVWOlr2sxt84O77.','test','/images/default-avatar.png',NULL,NULL),('01987e8b-575d-75fc-a477-c2eaa9162696','u722u2w','$2b$10$lF1Jg33ALrbVtlg41NgFQ.ZfecQ4VP0iZ4/k5PkmSudqlgEMq5TP.','test','/images/default-avatar.png',NULL,NULL),('01987ec2-3020-7195-8c76-b98ae540f02b','uo8ug4w','$2b$10$OJ1BEap5aK80CzSJ54s8jevKW.NTMEtwsl9SCenBLIkxyqomHIUdC','test','/images/default-avatar.png',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15 17:38:54
