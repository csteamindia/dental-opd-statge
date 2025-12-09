-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2025 at 02:21 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ehrdentalprod`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergies`
--

CREATE TABLE `allergies` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Asthma', '1', '82', 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(2, 'Cancer', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(3, 'Cardiac', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(4, 'Diabetes', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(5, 'Flu', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(6, 'Gastric', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(7, 'Hypertension', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(8, 'Others', NULL, NULL, 0, '2025-09-11 15:41:05', '2025-09-11 15:41:05'),
(9, 'asd', '2', '89', 0, '2025-09-11 17:17:33', '2025-09-11 17:17:33');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) NOT NULL,
  `patient_id` varchar(16) DEFAULT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `chair_code` varchar(16) DEFAULT NULL,
  `tretment_code` varchar(16) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `appointment_valid` datetime NOT NULL DEFAULT current_timestamp(),
  `notification_status` tinyint(1) DEFAULT 0,
  `notification_for_patinet` tinyint(1) DEFAULT 0,
  `notification_for_doctor` tinyint(1) DEFAULT 0,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `is_visited` int(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `arravel_time` datetime DEFAULT NULL,
  `attened_time` datetime DEFAULT NULL,
  `completed_time` datetime DEFAULT NULL,
  `canceled_at` datetime DEFAULT NULL,
  `canceled_note` varchar(320) DEFAULT NULL,
  `canceled_by` varchar(16) DEFAULT NULL,
  `token` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_code`, `appointment_date`, `chair_code`, `tretment_code`, `notes`, `appointment_valid`, `notification_status`, `notification_for_patinet`, `notification_for_doctor`, `clinic_id`, `client_id`, `status`, `is_visited`, `created_at`, `updated_at`, `arravel_time`, `attened_time`, `completed_time`, `canceled_at`, `canceled_note`, `canceled_by`, `token`) VALUES
(1, '1', 'sU68f1', '2025-09-16 05:30:00', '1', '8', 'demo', '2025-09-16 00:19:45', 0, 0, 0, '1', '1', 0, 0, '2025-09-15 18:49:45', '2025-09-15 18:49:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, '2', 'sU68f1', '2025-09-17 05:30:00', '1', '7', 'demo', '2025-09-16 00:31:42', 0, 0, 0, '1', '1', 0, 0, '2025-09-15 19:01:42', '2025-09-15 19:01:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, '2', 'sU68f1', '2025-09-16 05:30:00', '1', '5', 'demo 2', '2025-09-16 00:33:45', 0, 0, 0, '1', '1', 0, 0, '2025-09-15 19:03:45', '2025-09-15 19:03:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` bigint(20) NOT NULL,
  `bank_name` varchar(160) DEFAULT NULL,
  `ac_no` varchar(16) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `branch` varchar(160) DEFAULT NULL,
  `addrress` varchar(320) DEFAULT NULL,
  `ac_type` enum('saving','current') DEFAULT 'current',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bank_deposits`
--

CREATE TABLE `bank_deposits` (
  `id` bigint(20) NOT NULL,
  `bank_id` bigint(20) NOT NULL,
  `deposit_amount` decimal(12,2) NOT NULL,
  `deposit_date` datetime NOT NULL,
  `deposit_type` enum('cash','cheque','online') NOT NULL,
  `reference_no` varchar(64) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `billings`
--

CREATE TABLE `billings` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `treatment_ids` text DEFAULT NULL,
  `treatment_info` text DEFAULT NULL,
  `date` datetime NOT NULL,
  `billing_no` varchar(255) NOT NULL,
  `paid` decimal(10,2) NOT NULL DEFAULT 0.00,
  `pending` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `note` varchar(400) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 - unpaid\r\n1 - partial paid\r\n2 - unpaid\r\n3 - cancled\r\n',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `billing_transactions`
--

CREATE TABLE `billing_transactions` (
  `id` int(11) NOT NULL,
  `billing_no` varchar(255) NOT NULL,
  `receipt_no` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chairs`
--

CREATE TABLE `chairs` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `description` varchar(260) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `cabin_no` int(11) DEFAULT NULL,
  `intervel` int(11) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chairs`
--

INSERT INTO `chairs` (`id`, `title`, `description`, `start_time`, `end_time`, `cabin_no`, `intervel`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Char - 1', NULL, '10:00:00', '07:00:00', 1, 25, '1', '1', 0, '2025-09-15 14:19:45', '2025-09-15 14:19:45');

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

CREATE TABLE `clinics` (
  `id` bigint(20) NOT NULL,
  `clinic_name` varchar(100) DEFAULT NULL,
  `doctor_code` varchar(100) DEFAULT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `time_zone` varchar(50) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `client_id` bigint(20) DEFAULT NULL,
  `kiosk_code` text DEFAULT NULL,
  `access_code` text DEFAULT NULL,
  `clinic_url` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `whatsapp` int(1) NOT NULL DEFAULT 0,
  `wp_key` varchar(300) DEFAULT NULL,
  `wp_sessionid` varchar(60) DEFAULT NULL,
  `smtp_host` varchar(320) DEFAULT NULL,
  `smtp_port` varchar(4) DEFAULT NULL,
  `smtp_encription` varchar(4) DEFAULT NULL,
  `smtp_username` varchar(320) DEFAULT NULL,
  `smtp_password` text DEFAULT NULL,
  `smtp_from_email` varchar(320) DEFAULT NULL,
  `smtp` int(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`id`, `clinic_name`, `doctor_code`, `slug`, `address`, `city`, `state`, `country`, `email`, `phone`, `time_zone`, `zip_code`, `client_id`, `kiosk_code`, `access_code`, `clinic_url`, `is_default`, `whatsapp`, `wp_key`, `wp_sessionid`, `smtp_host`, `smtp_port`, `smtp_encription`, `smtp_username`, `smtp_password`, `smtp_from_email`, `smtp`, `status`, `created_at`, `updated_at`) VALUES
(1, '909dental', 'sU68f1', NULL, '909 Mfaume Road, West Upanga,', 'Dar-es-Salaam', 'Dar-es-Salaam', 'Tanzania', '909dental@gmail.com', '9173742348', NULL, '38292', 1, '11bbc584-92fa-4f52-b968-9adfea9b2b63', '988b1d46-d3cc-4aeb-8506-1dc58fa3745b', 'https://clinic.domain.com/11bbc584-92fa-4f52-b968-9adfea9b2b63', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2025-09-15 14:04:29', '2025-09-15 14:04:29');

-- --------------------------------------------------------

--
-- Table structure for table `communication_group`
--

CREATE TABLE `communication_group` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `communication_group`
--

INSERT INTO `communication_group` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Call', NULL, NULL, 0, '2025-09-15 14:20:10', NULL),
(2, 'Wp', '1', '1', 0, '2025-09-15 14:20:30', '2025-09-15 14:20:30');

-- --------------------------------------------------------

--
-- Table structure for table `dentalcharttoothsexaminations`
--

CREATE TABLE `dentalcharttoothsexaminations` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `group_` text NOT NULL,
  `clinic_id` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dentalcharttoothsexaminations`
--

INSERT INTO `dentalcharttoothsexaminations` (`id`, `title`, `group_`, `clinic_id`, `client_id`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Caries Surfaces Involved', '[{\"tooth\":\"selected\",\"label\":\"a\",\"value\":\"a\"},{\"tooth\":\"selected\",\"label\":\"b\",\"value\":\"b\"},{\"tooth\":\"selected\",\"label\":\"c\",\"value\":\"c\"}]', '2', '89', '2025-09-11 23:05:53', '2025-09-11 23:05:53', 0),
(2, 'tooth_investigation', '[{\"tooth\":\"selected\",\"label\":\"a\",\"value\":\"a\"},{\"tooth\":\"selected\",\"label\":\"b\",\"value\":\"b\"}]', '1', '1', '2025-09-15 19:56:23', '2025-09-15 19:56:23', 0),
(3, 'Caries Surfaces Involved', '[{\"tooth\":\"selected\",\"label\":\"x\",\"value\":\"x\"},{\"tooth\":\"selected\",\"label\":\"y\",\"value\":\"y\"},{\"tooth\":\"selected\",\"label\":\"z\",\"value\":\"z\"}]', '1', '1', '2025-09-16 00:58:46', '2025-09-16 00:58:46', 0);

-- --------------------------------------------------------

--
-- Table structure for table `dental_charts`
--

CREATE TABLE `dental_charts` (
  `id` bigint(20) NOT NULL,
  `doctor_id` varchar(16) NOT NULL,
  `patient_id` varchar(16) NOT NULL,
  `date` datetime DEFAULT NULL,
  `toothinfo` varchar(400) DEFAULT NULL,
  `examination` varchar(120) NOT NULL,
  `treatment_type` varchar(255) DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `total_discount` decimal(10,2) DEFAULT NULL,
  `final_amount` decimal(10,2) DEFAULT NULL,
  `is_multiply` tinyint(1) DEFAULT 0,
  `is_confirm` tinyint(1) DEFAULT 0,
  `is_patient` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 0,
  `is_treatment_plan` tinyint(1) DEFAULT 0,
  `is_billed` tinyint(1) DEFAULT 0,
  `remark` varchar(320) NOT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dental_charts`
--

INSERT INTO `dental_charts` (`id`, `doctor_id`, `patient_id`, `date`, `toothinfo`, `examination`, `treatment_type`, `treatment`, `total_cost`, `total_discount`, `final_amount`, `is_multiply`, `is_confirm`, `is_patient`, `is_approved`, `is_treatment_plan`, `is_billed`, `remark`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, '', '1', '2025-09-15 19:59:06', '11', 'a', NULL, '[{\"label\":\"Consultation\",\"cost\":100,\"discount\":0,\"total\":100,\"is_save\":0},{\"label\":\"Fluoride Treatment\",\"cost\":60,\"discount\":0,\"total\":60,\"is_save\":0}]', NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, '', '1', '1', 0, '2025-09-15 20:00:03', '2025-09-15 20:00:03'),
(2, '', '1', '2025-09-15 19:59:06', '22', 'a', NULL, '[{\"label\":\"Consultation\",\"cost\":40,\"discount\":0,\"total\":40,\"is_save\":0},{\"label\":\"Fluoride Treatment\",\"cost\":50,\"discount\":0,\"total\":50,\"is_save\":0}]', NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, '', '1', '1', 0, '2025-09-15 20:00:03', '2025-09-15 20:00:03'),
(3, '', '1', '2025-09-15 19:59:06', '31', 'a', NULL, '[{\"label\":\"Consultation\",\"cost\":60,\"discount\":0,\"total\":60,\"is_save\":0},{\"label\":\"Fluoride Treatment\",\"cost\":70,\"discount\":0,\"total\":70,\"is_save\":0}]', NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, '', '1', '1', 0, '2025-09-15 20:00:03', '2025-09-15 20:00:03');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) NOT NULL,
  `code` varchar(16) DEFAULT NULL,
  `name` varchar(160) DEFAULT NULL,
  `mobile` varchar(16) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `registration_no` varchar(60) DEFAULT NULL,
  `color_code` varchar(26) DEFAULT NULL,
  `signature` text DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `code`, `name`, `mobile`, `email`, `registration_no`, `color_code`, `signature`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'sU68f1', '909Dental', '9173742348', 'yennam111@gmail.com', NULL, NULL, NULL, NULL, '1', 0, '2025-09-15 13:55:42', '2025-09-15 13:55:42');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_timings`
--

CREATE TABLE `doctor_timings` (
  `id` bigint(20) NOT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `exe_time` int(11) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE `examinations` (
  `id` bigint(20) NOT NULL,
  `examination_date` datetime DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL,
  `examination` varchar(255) DEFAULT NULL,
  `treatment` varchar(255) DEFAULT NULL,
  `tooth` text DEFAULT NULL,
  `client_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `clinic_id` bigint(20) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `examination_options`
--

CREATE TABLE `examination_options` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `clinic_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `type` enum('diagnosis','complaints') NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `created_by` varchar(20) NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `examination_options`
--

INSERT INTO `examination_options` (`id`, `title`, `clinic_id`, `client_id`, `type`, `status`, `created_at`, `created_by`, `updated_at`) VALUES
(1, 'abc', 2, 89, 'complaints', 0, '2025-09-11 23:18:51', '', '2025-09-11 23:18:51'),
(2, 'asd', 2, 89, 'diagnosis', 0, '2025-09-11 23:19:59', '', '2025-09-11 23:19:59'),
(3, 'ddd', 2, 89, 'complaints', 0, '2025-09-11 23:28:16', '', '2025-09-11 23:28:16'),
(4, 'ffdf', 2, 89, 'complaints', 0, '2025-09-11 23:30:04', '', '2025-09-11 23:30:04'),
(5, 'rrr', 2, 89, 'complaints', 0, '2025-09-11 23:31:02', '', '2025-09-11 23:31:02'),
(6, 'ff', 2, 89, 'diagnosis', 0, '2025-09-11 23:31:19', '', '2025-09-11 23:31:19');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` bigint(20) NOT NULL,
  `patinet_code` varchar(16) DEFAULT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `queation_code` varchar(16) DEFAULT NULL,
  `remark` varchar(320) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_quations`
--

CREATE TABLE `feedback_quations` (
  `id` bigint(20) NOT NULL,
  `title` text DEFAULT NULL,
  `type` tinyint(1) DEFAULT 0,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` bigint(20) NOT NULL,
  `patient_id` varchar(16) NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file_path` longtext NOT NULL,
  `status` tinyint(4) DEFAULT 0,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `patient_id`, `file_type`, `description`, `file_path`, `status`, `clinic_id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, '1', '2', 'demo', '[{\"path\":\"/uploads/1/1/1/2/1757965008824_Feature - Book Scanner.png\",\"originalname\":\"1757965008824_Feature - Book Scanner.png\",\"mimetype\":\"image/png\",\"size\":\"55.82 KB\"}]', 0, '1', '1', '2025-09-16 01:06:48', '2025-09-16 01:06:48'),
(2, '1', '3', 'demo', '[{\"path\":\"/uploads/1/1/1/3/1757965027385_feature.png\",\"originalname\":\"1757965027385_feature.png\",\"mimetype\":\"image/png\",\"size\":\"28.94 KB\"}]', 0, '1', '1', '2025-09-16 01:07:07', '2025-09-16 01:07:07'),
(3, '1', '3', 'demo', '[{\"path\":\"/uploads/1/1/1/3/1757965056104_favicon_io (2).zip\",\"originalname\":\"1757965056104_favicon_io (2).zip\",\"mimetype\":\"application/x-zip-compressed\",\"size\":\"103.65 KB\"}]', 0, '1', '1', '2025-09-16 01:07:36', '2025-09-16 01:07:36'),
(4, '2', '2', '', '[{\"path\":\"/uploads/1/1/2/2/1757965114265_Feature - Book Scanner.png\",\"originalname\":\"1757965114265_Feature - Book Scanner.png\",\"mimetype\":\"image/png\",\"size\":\"55.82 KB\"}]', 0, '1', '1', '2025-09-16 01:08:34', '2025-09-16 01:08:34');

-- --------------------------------------------------------

--
-- Table structure for table `investigations`
--

CREATE TABLE `investigations` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `blood_pressure` varchar(255) DEFAULT NULL,
  `blood_sugar` varchar(255) DEFAULT NULL,
  `auscultation` varchar(255) DEFAULT NULL COMMENT 'OS (Other Sounds)',
  `patient_id` varchar(16) NOT NULL,
  `clinic_id` varchar(16) NOT NULL,
  `doctor_code` varchar(16) NOT NULL,
  `examination` text DEFAULT NULL,
  `chief_complaint` text DEFAULT NULL,
  `diagnosis_type` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `client_id` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'English', NULL, NULL, 0, '2025-09-15 14:25:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mediciens`
--

CREATE TABLE `mediciens` (
  `id` bigint(20) NOT NULL,
  `name` varchar(160) DEFAULT NULL,
  `molucule` varchar(160) DEFAULT NULL,
  `dose` varchar(16) DEFAULT NULL,
  `frequent` varchar(16) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `is_fevrate` tinyint(1) DEFAULT 0,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mediciens`
--

INSERT INTO `mediciens` (`id`, `name`, `molucule`, `dose`, `frequent`, `duration`, `is_fevrate`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Antibiotics', 'Amoxicillin Trihydrate', '500 mg', '1-0-1', '5 days', 0, '1', '82', 0, '2025-09-11 15:14:30', NULL),
(2, 'Paracetamol', NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, '2025-09-11 15:14:30', NULL),
(3, 'Tab. Crocin', 'Tab. Crocin', '500 mg', '1-0-1', '5 days', 0, NULL, NULL, 0, '2025-09-11 15:14:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) NOT NULL,
  `client_id` varchar(16) NOT NULL,
  `_access` text NOT NULL,
  `module` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `n_type` varchar(255) NOT NULL,
  `n_for` varchar(255) NOT NULL,
  `n_value` text NOT NULL,
  `n_status` tinyint(4) NOT NULL DEFAULT 0,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

CREATE TABLE `notification_logs` (
  `id` bigint(20) NOT NULL,
  `notification_type` varchar(60) DEFAULT NULL,
  `content` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) NOT NULL,
  `doctor` varchar(16) NOT NULL,
  `date` date DEFAULT NULL,
  `case_no` varchar(50) DEFAULT NULL,
  `title` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT ' ',
  `dob` date DEFAULT NULL,
  `age` varchar(36) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `communication_group` text DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `patient_tags` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `zip_code` varchar(8) DEFAULT NULL,
  `alternative_email` varchar(100) DEFAULT NULL,
  `alternative_mobile` varchar(15) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference` varchar(128) DEFAULT NULL,
  `patient_relationship` varchar(50) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `doctor`, `date`, `case_no`, `title`, `first_name`, `last_name`, `dob`, `age`, `gender`, `mobile`, `email`, `profile_pic`, `communication_group`, `language`, `patient_tags`, `allergies`, `address`, `state`, `city`, `country`, `zip_code`, `alternative_email`, `alternative_mobile`, `reference_type`, `reference`, `patient_relationship`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'sU68f1', '2025-09-15', 'Case01', 'Mr.', 'sai', 'kumar', NULL, '0 years 0 months', 'Male', '9173742345', 'psyenna@gmail.com', NULL, '[]', NULL, '[]', '[\"1\",\"2\",\"3\",\"4\"]', '909 Mfaume Road, West Upanga,', 'Dar-es-Salaam', 'Dar-es-Salaam', 'Tanzania', '38292', NULL, NULL, NULL, NULL, NULL, '1', '1', 0, '2025-09-15 14:05:31', '2025-09-15 19:42:18'),
(2, 'sU68f1', '2025-09-15', 'CASE02', 'Mr.', 'varun', ' ', NULL, '0 years 0 months', 'Male', '9173742344', 'yennam111@gmail.com', NULL, NULL, NULL, NULL, NULL, 'demo', 'demo', 'demo', 'demo', '38292', NULL, NULL, NULL, NULL, NULL, '1', '1', 0, '2025-09-15 14:06:30', '2025-09-15 14:06:30');

-- --------------------------------------------------------

--
-- Table structure for table `patient_follow_up`
--

CREATE TABLE `patient_follow_up` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `followup_date` date NOT NULL,
  `added_by` bigint(20) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_follow_up`
--

INSERT INTO `patient_follow_up` (`id`, `patient_id`, `followup_date`, `added_by`, `clinic_id`, `client_id`, `remark`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-09-16', 1, '1', '1', 'call back', 0, '2025-09-16 01:11:21', '2025-09-16 01:11:21');

-- --------------------------------------------------------

--
-- Table structure for table `patient_notes`
--

CREATE TABLE `patient_notes` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `note_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_notes`
--

INSERT INTO `patient_notes` (`id`, `patient_id`, `doctor_code`, `note_date`, `note`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, '2025-09-16', 'demo', '1', '1', 0, '2025-09-16 01:11:08', '2025-09-16 01:11:08');

-- --------------------------------------------------------

--
-- Table structure for table `periodical_chart`
--

CREATE TABLE `periodical_chart` (
  `id` bigint(20) NOT NULL,
  `doctor_id` varchar(16) NOT NULL,
  `patient_id` varchar(16) NOT NULL,
  `lower` text DEFAULT NULL,
  `upper` text DEFAULT NULL,
  `date` date NOT NULL,
  `clinic_id` varchar(16) NOT NULL,
  `client_id` varchar(16) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` bigint(20) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `role_id` bigint(20) NOT NULL,
  `client_id` varchar(16) NOT NULL,
  `clinic_id` bigint(20) NOT NULL,
  `module_name` varchar(128) DEFAULT NULL,
  `is_accessable` tinyint(1) NOT NULL DEFAULT 0,
  `is_creatable` tinyint(1) NOT NULL DEFAULT 0,
  `is_readable` tinyint(1) NOT NULL DEFAULT 0,
  `is_writable` tinyint(1) NOT NULL DEFAULT 0,
  `is_deletable` tinyint(1) NOT NULL DEFAULT 0,
  `is_creatable_checkbox` tinyint(1) NOT NULL DEFAULT 0,
  `is_readable_checkbox` tinyint(1) NOT NULL DEFAULT 0,
  `is_writable_checkbox` tinyint(1) NOT NULL DEFAULT 0,
  `is_deletable_checkbox` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `role_id`, `client_id`, `clinic_id`, `module_name`, `is_accessable`, `is_creatable`, `is_readable`, `is_writable`, `is_deletable`, `is_creatable_checkbox`, `is_readable_checkbox`, `is_writable_checkbox`, `is_deletable_checkbox`, `status`, `created_at`, `updated_at`) VALUES
(1, 'patients', 1, '', 1, 'patients', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-04-14 07:24:25', '2025-05-02 01:51:45'),
(2, 'Reports', 1, '', 1, 'reports', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-04-14 07:24:25', NULL),
(3, 'Allergies', 1, '', 1, 'Allergies', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-04-29 05:55:20', NULL),
(4, 'Appointment', 1, '', 1, 'Appointment', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 03:46:26', '2025-05-01 03:46:26'),
(5, 'Banks', 1, '', 1, 'Banks', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 04:01:38', NULL),
(6, 'Chairs', 1, '', 1, 'Chairs', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 04:12:18', NULL),
(7, 'Clinics', 1, '', 1, 'Clinics', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 04:22:02', NULL),
(8, 'Communication-Group', 1, '', 1, 'Communication-Group', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 05:20:05', NULL),
(9, 'Dentalchart', 1, '', 1, 'Dentalchart', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 05:25:46', NULL),
(10, 'Doctor-Timings', 1, '', 1, 'Doctor-Timings', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 05:31:47', NULL),
(11, 'Doctors', 1, '', 1, 'Doctors', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 05:38:09', NULL),
(12, 'feedback-quations', 1, '', 1, 'feedback-quations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 06:06:40', NULL),
(13, 'feedbacks', 1, '', 1, 'feedbacks', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 06:11:26', NULL),
(14, 'Files', 1, '', 1, 'Files', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 06:17:54', NULL),
(15, 'Investigations', 1, '', 1, 'Investigations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 06:26:58', NULL),
(16, 'Mediciens', 1, '', 1, 'Mediciens', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 06:35:04', NULL),
(17, 'Patient-Tags', 1, '', 1, 'Patient-Tags', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 01:41:31', NULL),
(18, 'Permissions', 1, '', 1, 'Permissions', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 01:49:36', NULL),
(19, 'Prescriptions', 1, '', 1, 'Prescriptions', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:07:00', NULL),
(20, 'reference-types', 1, '', 1, 'reference-types', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:11:12', NULL),
(21, 'Roles', 1, '', 1, 'Roles', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:15:58', NULL),
(22, 'Tretments', 1, '', 1, 'Tretments', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:20:10', NULL),
(23, 'Health', 1, '', 1, 'Health', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(24, 'Accounts', 1, '', 1, 'Accounts', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(25, 'RX-Templates', 1, '', 1, 'RX-Templates', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(26, 'DentalChartToothsExaminations', 1, '', 1, 'DentalChartToothsExaminations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(27, 'Examinations', 1, '', 1, 'Examinations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(28, 'patient-notes', 1, '', 1, 'patient-notes', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(29, 'patient-follow-up', 1, '', 1, 'patient-follow-up', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-02 02:31:54', NULL),
(31, 'patients', 2, '57', 1, 'patients', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-04-14 07:24:25', '2025-05-02 01:51:45'),
(32, 'Appointment', 2, '', 5, 'Appointment', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-01 03:46:26', '2025-05-01 03:46:26'),
(33, 'patient_follow_up', 1, '38', 1, 'patient_follow_up', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-08-29 09:53:41', '2025-08-29 09:53:41'),
(34, 'patient_follow_up', 1, '38', 1, 'patient_follow_up', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-08-29 09:54:31', '2025-08-29 09:54:31');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint(20) NOT NULL,
  `patient_id` varchar(16) NOT NULL,
  `title` varchar(120) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `doctor_code` varchar(16) NOT NULL,
  `medicine` text DEFAULT NULL,
  `investigation_attachment` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `patient_id`, `title`, `date`, `doctor_code`, `medicine`, `investigation_attachment`, `note`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, '2', 'dmeo', '2025-09-16 00:00:00', 'sU68f1', '[{\"id\":0,\"medicine\":{\"value\":2,\"label\":\"Paracetamol\",\"molucule\":null,\"dose\":null,\"frequent\":null,\"duration\":null},\"dose\":{\"value\":\"100mg\",\"label\":\"100mg\"},\"frequent\":{\"value\":\"1-0-0\",\"label\":\"1-0-0\"},\"duration\":{\"value\":\"1 day\",\"label\":\"1 Day\"}},{\"id\":2,\"medicine\":{\"value\":3,\"label\":\"Tab. Crocin\",\"molucule\":\"Tab. Crocin\",\"dose\":\"500 mg\",\"frequent\":\"1-0-1\",\"duration\":\"5 days\"},\"dose\":{\"value\":\"500 mg\",\"label\":\"500 mg\"},\"frequent\":{\"value\":\"1-0-1\",\"label\":\"1-0-1\"},\"duration\":{\"value\":\"5 days\",\"label\":\"5 Days\"}}]', NULL, 'demo', '1', '1', 0, '2025-09-16 00:20:54', '2025-09-16 00:20:54');

-- --------------------------------------------------------

--
-- Table structure for table `referance_types`
--

CREATE TABLE `referance_types` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint(20) NOT NULL,
  `clinic_id` bigint(20) DEFAULT NULL,
  `client_id` varchar(16) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(160) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `clinic_id`, `client_id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 'Admin', 'admin', 0, '2025-09-10 09:08:36', NULL),
(2, NULL, NULL, 'Doctor', 'doctor', 0, '2025-09-11 08:25:04', '2025-09-11 08:25:04'),
(3, NULL, NULL, 'Receptionist', 'receptionist', 0, '2025-09-11 13:41:21', '2025-09-11 13:41:21');

-- --------------------------------------------------------

--
-- Table structure for table `rx_templates`
--

CREATE TABLE `rx_templates` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `medicins` text NOT NULL,
  `doctor_code` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `client_id` bigint(20) NOT NULL,
  `clinic_id` bigint(20) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Crown', NULL, NULL, 0, '2025-09-15 14:24:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `treatment`
--

CREATE TABLE `treatment` (
  `id` int(11) NOT NULL,
  `doctor_code` varchar(26) NOT NULL,
  `patient_id` varchar(16) NOT NULL,
  `treatment_date` datetime DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `treatment_type` longtext DEFAULT NULL,
  `tooths` text DEFAULT NULL,
  `treatment_cost` double NOT NULL DEFAULT 0,
  `treatment_discount` double NOT NULL DEFAULT 0,
  `treatment_discount_type` int(1) NOT NULL DEFAULT 0 COMMENT '0 - amount, 1 - percentage',
  `treatment_total_cost` double NOT NULL DEFAULT 0,
  `treatment_status` enum('planned','in_progress','completed','discontinued') NOT NULL DEFAULT 'planned',
  `treatment_note` varchar(320) DEFAULT NULL,
  `is_billed` int(1) NOT NULL DEFAULT 0,
  `billed_date` datetime DEFAULT NULL,
  `client_id` varchar(16) NOT NULL,
  `clinic_id` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `treatment`
--

INSERT INTO `treatment` (`id`, `doctor_code`, `patient_id`, `treatment_date`, `group_id`, `treatment_type`, `tooths`, `treatment_cost`, `treatment_discount`, `treatment_discount_type`, `treatment_total_cost`, `treatment_status`, `treatment_note`, `is_billed`, `billed_date`, `client_id`, `clinic_id`, `created_at`, `updated_at`, `status`) VALUES
(1, 'sU68f1', '1', '2025-09-15 00:00:00', NULL, 'aligner', 'upper,lower', 1000, 0, 0, 25000, 'planned', '', 0, NULL, '1', '1', '2025-09-15 20:00:37', '2025-09-15 20:00:37', 0),
(2, 'sU68f1', '1', '2025-09-16 00:00:00', NULL, 'fillings', '14,44', 500, 0, 1, 1000, 'planned', '', 0, NULL, '1', '1', '2025-09-16 01:32:54', '2025-09-16 01:32:54', 0),
(3, 'sU68f1', '1', '2025-09-16 00:00:00', NULL, 'crowns', '13,43', 600, 0, 1, 1200, 'planned', '', 0, NULL, '1', '1', '2025-09-16 01:32:54', '2025-09-16 01:32:54', 0),
(4, 'sU68f1', '1', '2025-09-16 00:00:00', NULL, 'fillings', '43,42', 0, 0, 0, 0, 'planned', '', 0, NULL, '1', '1', '2025-09-16 01:36:48', '2025-09-16 01:36:48', 0);

-- --------------------------------------------------------

--
-- Table structure for table `treatment_notes`
--

CREATE TABLE `treatment_notes` (
  `id` bigint(20) NOT NULL,
  `treatment_id` varchar(16) NOT NULL,
  `treatment_date` datetime DEFAULT NULL,
  `treatment_note` text DEFAULT NULL,
  `tooths` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tretment_types`
--

CREATE TABLE `tretment_types` (
  `id` bigint(20) NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `cost` varchar(16) DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `is_billed` int(1) DEFAULT 0,
  `billed_date` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tretment_types`
--

INSERT INTO `tretment_types` (`id`, `title`, `cost`, `clinic_id`, `client_id`, `is_billed`, `billed_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Dental cleaning', '0', NULL, '82', 0, NULL, 0, '2025-09-11 13:42:39', '2025-09-11 13:42:39'),
(2, 'Fluoride treatment', NULL, NULL, '82', 0, NULL, 0, '2025-09-11 13:42:48', '2025-09-11 13:42:48'),
(3, 'Dental sealants', NULL, NULL, '82', 0, NULL, 0, '2025-09-11 13:42:55', '2025-09-11 13:42:55'),
(4, 'Fillings', NULL, '5', '83', 0, NULL, 0, '2025-09-11 13:43:01', '2025-09-11 13:43:01'),
(5, 'Crowns', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 13:43:01', '2025-09-11 13:43:01'),
(6, 'Veneer', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(7, 'Surgical Extraction', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(8, 'Pit & Fissures Sealan', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(9, 'Fillings', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(10, 'Fluoride Treatment', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(11, 'Gum Surgery', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(12, 'Teeth Whitening', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(13, 'Consultation', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(14, 'Lingual Braces', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(15, 'Dental Implant', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(16, 'Routine Extraction', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(17, 'Advance Surgical Proced', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(18, 'Post & Core', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(19, 'Root Canal Treatment', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(20, 'Dentures', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(21, 'Braces', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(22, 'Re-root Canal Treatment', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59'),
(23, 'Night Guard', NULL, NULL, NULL, 0, NULL, 0, '2025-09-11 15:18:59', '2025-09-11 15:18:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `clinic_id` varchar(16) DEFAULT NULL,
  `client_id` varchar(16) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `email` varchar(160) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password` text NOT NULL,
  `is_verified` int(11) DEFAULT 0,
  `role` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `clinic_id`, `client_id`, `name`, `email`, `mobile`, `password`, `is_verified`, `role`, `created_at`, `updated_at`) VALUES
(1, '1', '1', '909Dental', 'yennam111@gmail.com', '9173742348', 'ZuR118iEFtyB', 1, 1, '2025-09-15 13:55:42', '2025-09-15 14:01:14'),
(2, '1', '1', 'Receptionist', 'Receptionist@gmail.com', '9999999999', 'bQ6jiZBhW2FC', 1, 3, '2025-09-15 18:51:42', '2025-09-15 18:51:42');

-- --------------------------------------------------------

--
-- Table structure for table `user_config`
--

CREATE TABLE `user_config` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(11) NOT NULL,
  `whastsapp` int(1) NOT NULL DEFAULT 1,
  `email` int(1) NOT NULL DEFAULT 1,
  `billing_info` int(1) NOT NULL DEFAULT 1,
  `covid_19` int(1) DEFAULT 1,
  `profile_pic` int(1) NOT NULL DEFAULT 1,
  `allergies` int(1) NOT NULL DEFAULT 1,
  `summary` int(1) NOT NULL DEFAULT 1,
  `follow_up` int(1) NOT NULL DEFAULT 1,
  `clinics` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_config`
--

INSERT INTO `user_config` (`id`, `user_id`, `whastsapp`, `email`, `billing_info`, `covid_19`, `profile_pic`, `allergies`, `summary`, `follow_up`, `clinics`) VALUES
(1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1),
(2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_verification`
--

CREATE TABLE `user_verification` (
  `id` bigint(20) NOT NULL,
  `token` text NOT NULL,
  `_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `client_id` varchar(16) NOT NULL,
  `ip_address` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_verification`
--

INSERT INTO `user_verification` (`id`, `token`, `_datetime`, `client_id`, `ip_address`, `created_at`, `updated_at`, `status`) VALUES
(1, 'qAlZJpvbUDFuYMkRRxkQtL7z4wTegbgcJqdUH7FW6HVILkrgWoWpxUqaI8mXW63fjgw9ZIn4', '2025-09-15 19:25:42', '1', '::1', '2025-09-15 19:25:42', '2025-09-15 19:31:14', 1),
(2, '7sUUlyHLIRrbZMdJuwdSKigtsEq6qyHVbQ48URUrarj7t7pyqoZVhiIfGtwPDZbfbSaSUVJf', '2025-09-16 00:21:42', '2', '', '2025-09-16 00:21:42', '2025-09-16 00:21:42', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `receipt_type` int(1) NOT NULL DEFAULT 1,
  `transection_id` varchar(260) DEFAULT NULL,
  `transection_description` varchar(160) DEFAULT NULL,
  `no_of_entries` int(11) NOT NULL,
  `total_value` decimal(10,2) NOT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `voucher_transactions`
--

CREATE TABLE `voucher_transactions` (
  `id` bigint(20) NOT NULL,
  `voucher_id` varchar(260) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `entity` varchar(255) NOT NULL DEFAULT 'voucher',
  `description` varchar(60) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wp_templates`
--

CREATE TABLE `wp_templates` (
  `id` bigint(20) NOT NULL,
  `title` varchar(120) NOT NULL,
  `description` text NOT NULL,
  `clinic_id` varchar(16) NOT NULL,
  `client_id` varchar(16) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergies`
--
ALTER TABLE `allergies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_deposits`
--
ALTER TABLE `bank_deposits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `billings`
--
ALTER TABLE `billings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `billing_transactions`
--
ALTER TABLE `billing_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chairs`
--
ALTER TABLE `chairs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clinics`
--
ALTER TABLE `clinics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `communication_group`
--
ALTER TABLE `communication_group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dentalcharttoothsexaminations`
--
ALTER TABLE `dentalcharttoothsexaminations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dental_charts`
--
ALTER TABLE `dental_charts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_timings`
--
ALTER TABLE `doctor_timings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `examination_options`
--
ALTER TABLE `examination_options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback_quations`
--
ALTER TABLE `feedback_quations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investigations`
--
ALTER TABLE `investigations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mediciens`
--
ALTER TABLE `mediciens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_logs`
--
ALTER TABLE `notification_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_follow_up`
--
ALTER TABLE `patient_follow_up`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_notes`
--
ALTER TABLE `patient_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `periodical_chart`
--
ALTER TABLE `periodical_chart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referance_types`
--
ALTER TABLE `referance_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `rx_templates`
--
ALTER TABLE `rx_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `treatment`
--
ALTER TABLE `treatment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `treatment_notes`
--
ALTER TABLE `treatment_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tretment_types`
--
ALTER TABLE `tretment_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- Indexes for table `user_config`
--
ALTER TABLE `user_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_verification`
--
ALTER TABLE `user_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voucher_transactions`
--
ALTER TABLE `voucher_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wp_templates`
--
ALTER TABLE `wp_templates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_deposits`
--
ALTER TABLE `bank_deposits`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `billings`
--
ALTER TABLE `billings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `billing_transactions`
--
ALTER TABLE `billing_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chairs`
--
ALTER TABLE `chairs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `clinics`
--
ALTER TABLE `clinics`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `communication_group`
--
ALTER TABLE `communication_group`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dentalcharttoothsexaminations`
--
ALTER TABLE `dentalcharttoothsexaminations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dental_charts`
--
ALTER TABLE `dental_charts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `doctor_timings`
--
ALTER TABLE `doctor_timings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examination_options`
--
ALTER TABLE `examination_options`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback_quations`
--
ALTER TABLE `feedback_quations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `investigations`
--
ALTER TABLE `investigations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mediciens`
--
ALTER TABLE `mediciens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_logs`
--
ALTER TABLE `notification_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `patient_follow_up`
--
ALTER TABLE `patient_follow_up`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patient_notes`
--
ALTER TABLE `patient_notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `periodical_chart`
--
ALTER TABLE `periodical_chart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `referance_types`
--
ALTER TABLE `referance_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rx_templates`
--
ALTER TABLE `rx_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `treatment`
--
ALTER TABLE `treatment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `treatment_notes`
--
ALTER TABLE `treatment_notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tretment_types`
--
ALTER TABLE `tretment_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_config`
--
ALTER TABLE `user_config`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_verification`
--
ALTER TABLE `user_verification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `voucher_transactions`
--
ALTER TABLE `voucher_transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wp_templates`
--
ALTER TABLE `wp_templates`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clinics`
--
ALTER TABLE `clinics`
  ADD CONSTRAINT `clinics_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
