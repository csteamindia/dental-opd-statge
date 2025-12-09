-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 04:23 PM
-- Server version: 8.0.39
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `opd-v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergies`
--

CREATE TABLE `allergies` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Updated Allergy', '1', '38', 0, '2025-04-16 09:16:15', '2025-04-25 12:03:27'),
(2, 'Peanut Allergy', '1', '38', 0, '2025-04-23 06:00:54', '2025-04-23 06:02:24'),
(3, 'Allergy', '1', '38', 0, '2025-05-01 06:19:38', '2025-05-12 07:42:47');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint NOT NULL,
  `patinet_code` varchar(16) DEFAULT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `chair_code` varchar(16) DEFAULT NULL,
  `tretment_code` varchar(16) DEFAULT NULL,
  `notes` text,
  `notification_status` tinyint(1) DEFAULT '0',
  `notification_for_patinet` tinyint(1) DEFAULT '0',
  `notification_for_doctor` tinyint(1) DEFAULT '0',
  `appointment_valid` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_visited` tinyint(1) NOT NULL DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patinet_code`, `doctor_code`, `appointment_date`, `chair_code`, `tretment_code`, `notes`, `notification_status`, `notification_for_patinet`, `notification_for_doctor`, `appointment_valid`, `is_visited`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PAT001', 'DOC001', '2025-04-20 16:00:00', 'CHAIR01', 'TREAT001', 'Follow-up appointment for dental cleaning.', 1, 1, 0, '2025-05-09 18:05:41', 0, '1', '38', 0, '2025-04-17 04:53:02', '2025-05-12 13:34:24'),
(2, 'PAT001', 'DOC001', '2025-04-20 16:00:00', 'CHAIR01', 'TREAT001', 'Follow-up appointment.', 1, 1, 0, '2025-05-09 18:05:41', 0, '1', '38', 0, '2025-04-23 06:12:20', '2025-05-09 07:25:40'),
(3, 'PAT001', 'DOC001', '2025-04-20 16:00:00', 'CHAIR01', 'TREAT001', 'Follow-up appointment.', 1, 1, 0, '2025-05-09 18:05:41', 0, '1', '38', 0, '2025-05-09 12:35:41', '2025-05-12 07:34:33');

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` bigint NOT NULL,
  `bank_name` varchar(160) DEFAULT NULL,
  `ac_no` varchar(16) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `branch` varchar(160) DEFAULT NULL,
  `addrress` varchar(320) DEFAULT NULL,
  `ac_type` enum('savings','current') DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `banks`
--

INSERT INTO `banks` (`id`, `bank_name`, `ac_no`, `ifsc_code`, `branch`, `addrress`, `ac_type`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'HDFC Bank', '123456789012', 'HDFC0001234', 'Surat', '123 MG Road, Mumbai, India', 'savings', '1', '38', 0, '2025-04-16 09:41:57', '2025-04-22 11:12:23'),
(2, 'ICICI Bank', '987654321098', 'ICIC0004567', 'Andheri West Branch', '456 Andheri West, Mumbai, India', 'current', '1', '38', 0, '2025-04-23 06:20:38', '2025-04-23 06:20:38'),
(3, 'ICICI Bank', '987654321098', 'ICIC0004567', 'Surat', '456 Andheri West, Mumbai, India', 'current', '1', '38', 0, '2025-05-01 09:33:30', '2025-05-12 07:43:30');

-- --------------------------------------------------------

--
-- Table structure for table `bank_deposits`
--

CREATE TABLE `bank_deposits` (
  `id` bigint NOT NULL,
  `bank_id` bigint NOT NULL,
  `deposit_amount` decimal(12,2) NOT NULL,
  `deposit_date` datetime NOT NULL,
  `deposit_type` enum('cash','cheque','online') NOT NULL,
  `reference_no` varchar(64) DEFAULT NULL,
  `note` text,
  `client_id` varchar(36) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bank_deposits`
--

INSERT INTO `bank_deposits` (`id`, `bank_id`, `deposit_amount`, `deposit_date`, `deposit_type`, `reference_no`, `note`, `client_id`, `clinic_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 10000.00, '2025-05-21 05:30:00', 'online', 'TXN123456789', 'Initial funding deposit', '38', '1', 0, '2025-05-21 17:38:07', '2025-05-21 17:43:38');

-- --------------------------------------------------------

--
-- Table structure for table `chairs`
--

CREATE TABLE `chairs` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `description` varchar(260) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `cabin_no` int DEFAULT NULL,
  `intervel` int DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chairs`
--

INSERT INTO `chairs` (`id`, `title`, `description`, `start_time`, `end_time`, `cabin_no`, `intervel`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Chair 1', 'Main dental chair in Cabin 1', '09:00:00', '17:00:00', 5, 30, '1', '38', 0, '2025-04-16 09:46:41', '2025-05-08 11:32:19'),
(2, 'Chair 2', 'Secondary dental chair in Cabin 2', '10:00:00', '18:00:00', 7, 20, '1', '38', 0, '2025-04-23 06:46:02', '2025-05-12 07:44:08');

-- --------------------------------------------------------

--
-- Table structure for table `clinics`
--

CREATE TABLE `clinics` (
  `id` bigint NOT NULL,
  `clinic_name` varchar(100) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `time_zone` varchar(50) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `client_id` bigint DEFAULT NULL,
  `kiosk_code` text,
  `access_code` text,
  `clinic_url` text,
  `is_default` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clinics`
--

INSERT INTO `clinics` (`id`, `clinic_name`, `doctor_name`, `slug`, `address`, `city`, `state`, `country`, `email`, `phone`, `time_zone`, `zip_code`, `client_id`, `kiosk_code`, `access_code`, `clinic_url`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ABC Clinic', 'Dr. John Doe', NULL, 'Patna', 'Patna', 'Bihar', 'India', 'contact@abcclinic.com', '1234567890', 'GMT-5', '10001', 38, NULL, NULL, NULL, 0, 0, '2025-04-17 11:35:26', '2025-05-12 08:58:05'),
(4, 'General Hospital', 'Dr. Praduman Kumar', 'General Hospital', '123 Clinic Surat.', 'Surat', 'Gujarat', 'India', 'contact@generalclinic.com', '9117446581', 'GMT-5', '10002', 38, '0', '0', '0', 0, 0, '2025-05-13 10:03:10', '2025-05-13 10:03:10');

-- --------------------------------------------------------

--
-- Table structure for table `communication_group`
--

CREATE TABLE `communication_group` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '1 - sms',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `communication_group`
--

INSERT INTO `communication_group` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Follow-Up Patients', '1', '38', 0, '2025-04-16 09:51:23', '2025-05-12 07:45:09');

-- --------------------------------------------------------

--
-- Table structure for table `dental_charts`
--

CREATE TABLE `dental_charts` (
  `id` bigint NOT NULL,
  `treatment_plan` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `doctor_id` bigint NOT NULL,
  `date` date NOT NULL,
  `treatment_type` varchar(255) DEFAULT NULL,
  `treatment` varchar(255) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `total_discount` decimal(10,2) DEFAULT NULL,
  `final_amount` decimal(10,2) DEFAULT NULL,
  `is_multiply` tinyint(1) DEFAULT '0',
  `is_confirm` tinyint(1) DEFAULT '0',
  `is_patient` tinyint(1) DEFAULT '0',
  `is_approved` tinyint(1) DEFAULT '0',
  `is_treatment_plan` tinyint(1) DEFAULT '0',
  `is_billed` tinyint(1) DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dental_charts`
--

INSERT INTO `dental_charts` (`id`, `treatment_plan`, `name`, `doctor_id`, `date`, `treatment_type`, `treatment`, `total_cost`, `total_discount`, `final_amount`, `is_multiply`, `is_confirm`, `is_patient`, `is_approved`, `is_treatment_plan`, `is_billed`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Root Canal Therapy', 'Praduman Kumar', 1, '2025-04-18', 'Endodontics', 'Canal cleaning and filling', 1500.00, 100.00, 1400.00, 0, 1, 1, 0, 1, 0, '1', '38', 0, '2025-04-18 11:47:03', '2025-04-18 11:47:03'),
(2, 'Root', 'Praduman Kumar', 1, '2025-04-18', 'Endodontics', 'Canal cleaning and filling', 1500.00, 100.00, 1400.00, 0, 1, 1, 0, 1, 0, '1', '38', 0, '2025-04-18 16:52:34', '2025-05-12 14:29:56');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint NOT NULL,
  `code` varchar(16) DEFAULT NULL,
  `name` varchar(160) DEFAULT NULL,
  `mobile` varchar(16) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `registration_no` varchar(60) DEFAULT NULL,
  `color_code` varchar(26) DEFAULT NULL,
  `signature` text,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `code`, `name`, `mobile`, `email`, `registration_no`, `color_code`, `signature`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DOC001', 'Dr. Priya Sharma', '9876543210', 'priya.sharma@example.com', 'MCI2025001', 'DOC001', 'Dr. Priya Sharma Signature Base64', '1', '38', 0, '2025-04-16 09:53:28', '2025-05-12 08:45:28');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_timings`
--

CREATE TABLE `doctor_timings` (
  `id` bigint NOT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `exe_time` int DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctor_timings`
--

INSERT INTO `doctor_timings` (`id`, `doctor_code`, `start_time`, `end_time`, `exe_time`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DOC001', '09:00:00', '13:00:00', 20, '1', '38', 0, '2025-04-16 09:59:19', '2025-05-09 07:48:10'),
(2, 'DOC001', '01:00:00', '04:00:00', 20, '1', '38', 0, '2025-05-08 12:10:04', '2025-05-12 08:50:44');

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE `examinations` (
  `id` bigint NOT NULL,
  `examination_date` datetime DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL,
  `examination` varchar(255) DEFAULT NULL,
  `treatment` varchar(255) DEFAULT NULL,
  `tooth` text,
  `client_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  `clinic_id` bigint NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `examinations`
--

INSERT INTO `examinations` (`id`, `examination_date`, `doctor`, `examination`, `treatment`, `tooth`, `client_id`, `patient_id`, `clinic_id`, `remark`, `status`, `created_at`, `updated_at`) VALUES
(1, '2025-05-13 16:00:00', 'Dr. Ayesha Khan', 'Routine dental check-up', 'Cleaning and polishing', 'Upper-left molar', 38, 1, 1, 'Patient advised to floss daily', 0, '2025-05-13 13:41:25', '2025-05-13 13:41:25');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` bigint NOT NULL,
  `patinet_code` varchar(16) DEFAULT NULL,
  `doctor_code` varchar(16) DEFAULT NULL,
  `queation_code` varchar(16) DEFAULT NULL,
  `remark` varchar(320) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `patinet_code`, `doctor_code`, `queation_code`, `remark`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(2, 'PAT001', 'DOC001', 'Q9876', 'Good experienc', '1', '38', 0, '2025-04-17 06:13:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `feedback_quations`
--

CREATE TABLE `feedback_quations` (
  `id` bigint NOT NULL,
  `title` text,
  `type` tinyint(1) DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedback_quations`
--

INSERT INTO `feedback_quations` (`id`, `title`, `type`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'clinic', 0, '1', '38', 0, '2025-04-16 10:45:18', '2025-04-16 10:45:18'),
(2, 'clinic', 1, '1', '38', 0, '2025-04-17 06:53:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` bigint NOT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `description` text,
  `file_path` varchar(255) NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `file_type`, `description`, `file_path`, `status`, `clinic_id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 'image', 'Sample Description', '/path/to/file.jpg', 0, '1', '38', '2025-04-18 12:40:48', '2025-05-12 14:32:25');

-- --------------------------------------------------------

--
-- Table structure for table `investigations`
--

CREATE TABLE `investigations` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `blood_pressure` varchar(255) DEFAULT NULL,
  `blood_sugar` varchar(255) DEFAULT NULL,
  `auscultation` varchar(255) DEFAULT NULL COMMENT 'OS (Other Sounds)',
  `patient_id` int NOT NULL,
  `clinic_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `examination` text,
  `chief_complaint` text,
  `diagnosis_type` varchar(255) DEFAULT NULL,
  `note` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `investigations`
--

INSERT INTO `investigations` (`id`, `date`, `temperature`, `blood_pressure`, `blood_sugar`, `auscultation`, `patient_id`, `clinic_id`, `doctor_id`, `examination`, `chief_complaint`, `diagnosis_type`, `note`, `created_at`, `updated_at`, `status`) VALUES
(1, '2025-04-18', '37.0', '120/80', '95', 'Normal', 1, 1, 1, 'General physical examination', 'Fever and headache', 'Primary Case', 'Patient should rest and follow prescribed medications.', '2025-04-18 11:18:38', '2025-05-19 10:29:25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mediciens`
--

CREATE TABLE `mediciens` (
  `id` bigint NOT NULL,
  `name` varchar(160) DEFAULT NULL,
  `molucule` varchar(160) DEFAULT NULL,
  `dose` varchar(16) DEFAULT NULL,
  `frequent` varchar(16) DEFAULT NULL,
  `duration` varchar(16) DEFAULT NULL,
  `is_fevrate` tinyint(1) DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mediciens`
--

INSERT INTO `mediciens` (`id`, `name`, `molucule`, `dose`, `frequent`, `duration`, `is_fevrate`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Paracetamol', 'Acetaminophen', '500mg', '2 times', '5 days', 1, '1', '38', 0, '2025-04-17 05:56:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `n_type` varchar(255) NOT NULL,
  `n_for` varchar(255) NOT NULL,
  `n_value` text NOT NULL,
  `n_status` tinyint NOT NULL DEFAULT '0',
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `n_type`, `n_for`, `n_value`, `n_status`, `clinic_id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 'New Appointment Booked', 'appointment', 'doctor', 'A new appointment has been booked for Dr. Smith at 3:00 PM.', 0, '1', '38', '2025-05-21 15:35:48', '2025-05-21 15:35:48');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint NOT NULL,
  `date` date DEFAULT NULL,
  `case_no` varchar(50) DEFAULT NULL,
  `title` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `communication_group_id` bigint DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `patient_tags` text,
  `allergies` text,
  `address` text,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `alternative_email` varchar(100) DEFAULT NULL,
  `alternative_mobile` varchar(15) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `patient_relationship` varchar(50) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `date`, `case_no`, `title`, `first_name`, `last_name`, `dob`, `age`, `gender`, `mobile`, `email`, `profile_pic`, `communication_group_id`, `language`, `patient_tags`, `allergies`, `address`, `state`, `city`, `country`, `alternative_email`, `alternative_mobile`, `reference_type`, `patient_relationship`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, '2025-04-17', 'CASE001', 'New', 'Praduman Kumar', 'Kumar', '2001-03-09', 34, 'Male', '9117446581', 'praduman802213@gmail.com', 'path/to/profile.jpg', 1, 'English', 'diabetic, smoker', 'penicillin', '123 Main Street', 'Bihar', 'Patna', 'India', 'john.alt@example.com', '1234567890', 'Online', 'Self', '1', '38', 0, '2025-04-17 11:05:50', '2025-05-21 14:00:37'),
(2, '2025-04-28', '12345', 'Mr.', 'John', 'Doe', '1990-01-01', 35, 'Male', '+1234567890', 'john.doe@example.com', 'profile_pic_url.jpg', 1, 'English', 'General Checkup', 'Penicillin', '123 Main St, Springfield', 'Illinois', 'Springfield', 'USA', 'john.doe.alternative@example.com', '+0987654321', 'Self-Referral', 'Self', '1', '38', 0, '2025-04-28 09:34:22', '2025-04-28 09:34:22'),
(3, '2025-04-28', '12345', 'Mr.', 'John', 'KKK', '1990-01-01', 35, 'Male', '+1234567890', 'john.doe@example.com', 'profile_pic_url.jpg', 1, 'English', 'General Checkup', 'Penicillin', '123 Main St, Springfield', 'Illinois', 'Springfield', 'USA', 'john.doe.alternative@example.com', '+0987654321', 'Self-Referral', 'Self', '1', '38', 0, '2025-04-28 09:34:22', '2025-05-01 06:50:09'),
(4, '2025-04-28', '12345', 'Mr.', 'John', 'Doe', '1990-01-01', 35, 'Male', '+1234567890', 'john.doe@example.com', 'profile_pic_url.jpg', 1, 'English', 'General Checkup', 'Penicillin', '123 Main St, Springfield', 'Illinois', 'Springfield', 'USA', 'john.doe.alternative@example.com', '+0987654321', 'Self-Referral', 'Self', '1', '38', 0, '2025-04-28 09:55:15', '2025-05-12 09:03:02');

-- --------------------------------------------------------

--
-- Table structure for table `patient_tags`
--

CREATE TABLE `patient_tags` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `description` varchar(260) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `cabin_no` int DEFAULT NULL,
  `intervel` int DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `patient_tags`
--

INSERT INTO `patient_tags` (`id`, `title`, `description`, `start_time`, `end_time`, `cabin_no`, `intervel`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Morning Shift', 'Tags for the morning shift appointments.', '09:00:00', '12:00:00', 6, 15, '1', '38', 0, '2025-04-16 11:14:32', '2025-05-12 08:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` bigint NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role_id` bigint NOT NULL,
  `clinic_id` bigint NOT NULL,
  `module_name` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_accessable` tinyint(1) NOT NULL DEFAULT '0',
  `is_creatable` tinyint(1) NOT NULL DEFAULT '0',
  `is_readable` tinyint(1) NOT NULL DEFAULT '0',
  `is_writable` tinyint(1) NOT NULL DEFAULT '0',
  `is_deletable` tinyint(1) NOT NULL DEFAULT '0',
  `is_creatable_checkbox` tinyint(1) NOT NULL DEFAULT '0',
  `is_readable_checkbox` tinyint(1) NOT NULL DEFAULT '0',
  `is_writable_checkbox` tinyint(1) NOT NULL DEFAULT '0',
  `is_deletable_checkbox` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `role_id`, `clinic_id`, `module_name`, `is_accessable`, `is_creatable`, `is_readable`, `is_writable`, `is_deletable`, `is_creatable_checkbox`, `is_readable_checkbox`, `is_writable_checkbox`, `is_deletable_checkbox`, `status`, `created_at`, `updated_at`) VALUES
(1, 'patients', 1, 1, 'patients', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-04-14 12:54:25', '2025-05-09 09:31:54'),
(2, 'Reports', 1, 1, 'reports', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-04-14 12:54:25', NULL),
(3, 'Allergies', 1, 1, 'Allergies', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-04-29 11:25:20', NULL),
(4, 'Appointment', 1, 1, 'Appointment', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 09:16:26', '2025-05-01 09:16:26'),
(5, 'Banks', 1, 1, 'Banks', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 09:31:38', NULL),
(6, 'Chairs', 1, 1, 'Chairs', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 09:42:18', NULL),
(7, 'Clinics', 1, 1, 'Clinics', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 09:52:02', NULL),
(8, 'Communication-Group', 1, 1, 'Communication-Group', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 10:50:05', NULL),
(9, 'dental-charts', 1, 1, 'dental-charts', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 10:55:46', NULL),
(10, 'Doctor-Timings', 1, 1, 'Doctor-Timings', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:01:47', NULL),
(11, 'Doctors', 1, 1, 'Doctors', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:08:09', NULL),
(12, 'feedback-quations', 1, 1, 'feedback-quations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:36:40', NULL),
(13, 'feedbacks', 1, 1, 'feedbacks', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:41:26', NULL),
(14, 'Files', 1, 1, 'Files', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:47:54', NULL),
(15, 'Investigations', 1, 1, 'Investigations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 11:56:58', NULL),
(16, 'Mediciens', 1, 1, 'Mediciens', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-01 12:05:04', NULL),
(17, 'Patient-Tags', 1, 1, 'Patient-Tags', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:11:31', NULL),
(18, 'Permissions', 1, 1, 'Permissions', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:19:36', NULL),
(19, 'Prescriptions', 1, 1, 'Prescriptions', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:37:00', NULL),
(20, 'reference-types', 1, 1, 'reference-types', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:41:12', NULL),
(21, 'Roles', 1, 1, 'Roles', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:45:58', NULL),
(22, 'Tretments', 1, 1, 'Tretments', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 07:50:10', NULL),
(23, 'Health', 1, 1, 'Health', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-02 08:01:54', '2025-05-12 09:04:52'),
(24, 'Examinations', 1, 1, 'Examinations', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-13 07:04:38', NULL),
(25, 'RX_Templates', 1, 1, 'RX_Templates', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-20 06:23:57', '2025-05-20 06:23:57'),
(26, 'Bank-Deposits', 1, 1, 'Bank-Deposits', 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, '2025-05-21 11:38:14', '2025-05-21 11:38:14'),
(27, 'Notifications', 1, 1, 'Notifications', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, '2025-05-21 13:58:41', '2025-05-21 13:58:41');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `medicine` text,
  `investigation_attachment` text,
  `note` text,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `doctor_id`, `medicine`, `investigation_attachment`, `note`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Paracetamol 500mg twice a day', NULL, 'Patient advised to rest ', '1', '38', 0, '2025-04-18 12:28:02', '2025-05-12 14:30:47');

-- --------------------------------------------------------

--
-- Table structure for table `referance_types`
--

CREATE TABLE `referance_types` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `referance_types`
--

INSERT INTO `referance_types` (`id`, `title`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'New Reference Type', '1', '38', 0, '2025-04-16 12:25:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint NOT NULL,
  `clinic_id` bigint NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(160) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `clinic_id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin', NULL, 0, '2025-04-14 12:54:44', NULL),
(2, 1, 'users', NULL, 0, '2025-04-28 13:24:00', '2025-05-12 09:03:56');

-- --------------------------------------------------------

--
-- Table structure for table `rx_templates`
--

CREATE TABLE `rx_templates` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `medicine_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `doctor_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `note` text,
  `client_id` bigint NOT NULL,
  `clinic_id` bigint NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rx_templates`
--

INSERT INTO `rx_templates` (`id`, `title`, `medicine_name`, `doctor_code`, `note`, `client_id`, `clinic_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'General Fever Treatment', 'Paracetamol', 'DOC001', 'Take after meals', 38, 1, 0, '2025-05-20 12:53:23', '2025-05-20 12:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20220403185733-create-permissions.cjs'),
('20220403185733-create-roles.cjs'),
('20220403185733-create-users.cjs'),
('20240101000001_create_communication_group.cjs'),
('20240101000002_create_patient_tags.cjs'),
('20240101000003_create_feedback.cjs'),
('20240101000004_create_feedback_quations.cjs'),
('20240101000006_create_chairs.cjs'),
('20240101000007_create_allergies.cjs'),
('20240101000008_create_banks.cjs'),
('20240101000009_create_doctors.cjs'),
('20240101000010_create_doctor_timings.cjs'),
('20240101000011_create_referance_types.cjs'),
('20240101000012_create_appointments.cjs'),
('20240101000013_create_tretments.cjs'),
('20240101000014_create_mediciens.cjs'),
('20250417095334-create-patients.cjs'),
('20250417112556-create-clinics.cjs'),
('20250418044833-create-investigations.cjs'),
('20250418055846-create-dental-charts.cjs'),
('20250418064800-create-prescriptions.cjs'),
('20250418070229-create-files.cjs'),
('20250513065047-create-examinations.cjs'),
('20250519121843-create-rx-templates.cjs'),
('20250521110349-create-bank-deposits.cjs'),
('20250521132210-create-notifications.cjs');

-- --------------------------------------------------------

--
-- Table structure for table `tretments`
--

CREATE TABLE `tretments` (
  `id` bigint NOT NULL,
  `title` varchar(160) DEFAULT NULL,
  `cost` varchar(16) DEFAULT NULL,
  `clinic_id` varchar(36) DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tretments`
--

INSERT INTO `tretments` (`id`, `title`, `cost`, `clinic_id`, `client_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Dental Cleaning', '100', '1', '38', 0, '2025-04-17 05:39:43', '2025-05-12 08:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(160) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` text COLLATE utf8mb4_general_ci NOT NULL,
  `is_verified` int DEFAULT '0',
  `role` int NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `mobile`, `password`, `is_verified`, `role`, `status`, `created_at`, `updated_at`) VALUES
(37, 'abc', 'abcs@gmail.com', '9173742348', '123456', 0, 1, 0, '2025-05-08 11:05:55', '2025-04-07 14:31:55'),
(38, 'Praduman Kumar', 'praduman802213@gmail.com', '9117446581', '12345', 0, 1, 0, '2025-05-08 11:05:55', NULL);

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
-- Indexes for table `mediciens`
--
ALTER TABLE `mediciens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_tags`
--
ALTER TABLE `patient_tags`
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
-- Indexes for table `tretments`
--
ALTER TABLE `tretments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bank_deposits`
--
ALTER TABLE `bank_deposits`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chairs`
--
ALTER TABLE `chairs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clinics`
--
ALTER TABLE `clinics`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `communication_group`
--
ALTER TABLE `communication_group`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dental_charts`
--
ALTER TABLE `dental_charts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `doctor_timings`
--
ALTER TABLE `doctor_timings`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `feedback_quations`
--
ALTER TABLE `feedback_quations`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investigations`
--
ALTER TABLE `investigations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mediciens`
--
ALTER TABLE `mediciens`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `patient_tags`
--
ALTER TABLE `patient_tags`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `referance_types`
--
ALTER TABLE `referance_types`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rx_templates`
--
ALTER TABLE `rx_templates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tretments`
--
ALTER TABLE `tretments`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clinics`
--
ALTER TABLE `clinics`
  ADD CONSTRAINT `clinics_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
