-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for timetable_db
CREATE DATABASE IF NOT EXISTS `timetable_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `timetable_db`;

-- Dumping structure for table timetable_db.timetables
CREATE TABLE IF NOT EXISTS `timetables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `institutionName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `path_json` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table timetable_db.timetables: ~4 rows (approximately)
INSERT INTO `timetables` (`id`, `institutionName`, `path_json`, `created_at`) VALUES
	(1, 'srgfesgr', 'C:\\laragon\\www\\timetable\\back\\storage\\json\\timetable_c24f2274-1a2d-4d6d-8b42-ecfa3e1755d8.json', '2025-07-11 21:14:51'),
	(2, 'yjyjyjty ', 'C:\\laragon\\www\\timetable\\back\\storage\\json\\timetable_b021fecf-5e50-4218-a7c2-35ce14b50287.json', '2025-07-14 12:17:32'),
	(3, 'srgfesgr', 'C:\\laragon\\www\\timetable\\back\\storage\\json\\timetable_123b790c-94f0-416c-b314-b222f01c56f2.json', '2025-07-16 12:06:31'),
	(4, 'srgfesgr', 'C:\\laragon\\www\\timetable\\back\\storage\\json\\timetable_d0510b83-52cd-49e9-8484-8fa0eb8f82f0.json', '2025-07-16 12:08:11'),
	(5, 'Nom de l\'institution', 'C:\\laragon\\www\\timetable\\back\\storage\\json\\timetable_57340e08-5655-4796-8373-45bb279aafa5.json', '2025-07-16 18:44:46');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
