
  CREATE TABLE `client` (
    `client_id` bigint(20) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `email` varchar(160) DEFAULT NULL,
    `mobile` varchar(15) DEFAULT NULL,
    `ip_address` varchar(15) DEFAULT NULL,
    `location` varchar(15) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


  CREATE TABLE `clinic` (
    `clinic_id` bigint(20) NOT NULL,
    `client_id` bigint(20) NOT NULL,
    `clinic_name` varchar(180) NOT NULL,
    `clinic_logo` varchar(180) NOT NULL,
    `clinic_access_code` varchar(180) NOT NULL,
    `clinic_locality` varchar(180) NOT NULL,
    `doctor_id` bigint(20) NOT NULL,
    `address` text NOT NULL,
    `alternative_address` text NOT NULL,
    `country` int(11) NOT NULL,
    `state` int(11) NOT NULL,
    `city` varchar(120) NOT NULL,
    `zipcode` int(11) NOT NULL,
    `time_zone` varchar(120) NOT NULL,
    `is_default` tinyint(1) NOT NULL DEFAULT 0,
    `koisk_access_code` varchar(120) NOT NULL,
    `patient_portal_access_code` varchar(120) NOT NULL,
    `signature` varchar(120) NOT NULL,
    `expries_at` timestamp NOT NULL DEFAULT (current_timestamp() + interval 21 day),
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL,
    `status` tinyint(1) NOT NULL DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  CREATE TABLE `clinic_mapping` (
    `id` bigint(20) NOT NULL,
    `doctor_id` varchar(128) DEFAULT NULL,
    `clinic_id` varchar(160) DEFAULT NULL,
    `is_accessable` tinyint(1) NOT NULL DEFAULT 0,
    `is_verified_access` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  -- --------------------------------------------------------

  --
  -- Table structure for table `doctor`
  --

  CREATE TABLE `doctor` (
    `doctor_id` bigint(20) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `email` varchar(160) DEFAULT NULL,
    `mobile` varchar(15) DEFAULT NULL,
    `registration_no` varchar(46) DEFAULT NULL,
    `color_code` varchar(26) DEFAULT NULL,
    `signature` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  -- --------------------------------------------------------

  --
  -- Table structure for table `permissions`
  --

  CREATE TABLE `permissions` (
    `permission_id` bigint(20) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `role_id` bigint(20) NOT NULL,
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  -- --------------------------------------------------------

  --
  -- Table structure for table `roles`
  --

  CREATE TABLE `roles` (
    `role_id` bigint(20) NOT NULL,
    `clinic_id` bigint(20) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `description` varchar(160) DEFAULT NULL,
    `status` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  -- --------------------------------------------------------

  --
  -- Table structure for table `sequelizemeta`
  --

  CREATE TABLE `sequelizemeta` (
    `name` varchar(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

  -- --------------------------------------------------------

  --
  -- Table structure for table `users`
  --

  CREATE TABLE `users` (
    `user_id` bigint(20) NOT NULL,
    `name` varchar(128) DEFAULT NULL,
    `email` varchar(160) DEFAULT NULL,
    `mobile` varchar(15) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `client_id` bigint(20) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  --
  -- Indexes for dumped tables
  --

  --
  -- Indexes for table `client`
  --
  ALTER TABLE `client`
    ADD PRIMARY KEY (`client_id`);

  --
  -- Indexes for table `clinic`
  --
  ALTER TABLE `clinic`
    ADD PRIMARY KEY (`clinic_id`),
    ADD KEY `client_id` (`client_id`);

  --
  -- Indexes for table `clinic_mapping`
  --
  ALTER TABLE `clinic_mapping`
    ADD PRIMARY KEY (`id`);

  --
  -- Indexes for table `doctor`
  --
  ALTER TABLE `doctor`
    ADD PRIMARY KEY (`doctor_id`);

  --
  -- Indexes for table `permissions`
  --
  ALTER TABLE `permissions`
    ADD PRIMARY KEY (`permission_id`);

  --
  -- Indexes for table `roles`
  --
  ALTER TABLE `roles`
    ADD PRIMARY KEY (`role_id`);

  --
  -- Indexes for table `sequelizemeta`
  --
  ALTER TABLE `sequelizemeta`
    ADD PRIMARY KEY (`name`),
    ADD UNIQUE KEY `name` (`name`);
  ALTER TABLE `users`
    ADD PRIMARY KEY (`user_id`);
  ALTER TABLE `client`
    MODIFY `client_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `clinic`
    MODIFY `clinic_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `clinic_mapping`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `doctor`
    MODIFY `doctor_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `permissions`
    MODIFY `permission_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `roles`
    MODIFY `role_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `users`
    MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT;
  ALTER TABLE `clinic`
    ADD CONSTRAINT `clinic_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`client_id`);
  COMMIT;
