-- Update queries for all employees
UPDATE [dbo].[Employees] SET [UIDNo] = '729937268247', [OfficialPhone] = '9099333260' WHERE [EmployeeCode] = 'ADE0001';
UPDATE [dbo].[Employees] SET [UIDNo] = '484913618661', [OfficialPhone] = '9512381616' WHERE [EmployeeCode] = 'ADE0002';
UPDATE [dbo].[Employees] SET [UIDNo] = '634510398478', [OfficialPhone] = '9998442300' WHERE [EmployeeCode] = 'ADE0003';
UPDATE [dbo].[Employees] SET [UIDNo] = '277835863289', [OfficialPhone] = '7622982298' WHERE [EmployeeCode] = 'ADE0004';
UPDATE [dbo].[Employees] SET [UIDNo] = '533521761420', [OfficialPhone] = '7622972297' WHERE [EmployeeCode] = 'ADE0005';
UPDATE [dbo].[Employees] SET [UIDNo] = '436527178804', [OfficialPhone] = '9726975341' WHERE [EmployeeCode] = 'ADE0006';
UPDATE [dbo].[Employees] SET [UIDNo] = '609545111716', [OfficialPhone] = '8460284767' WHERE [EmployeeCode] = 'ADE0007';
UPDATE [dbo].[Employees] SET [UIDNo] = '616627505959', [OfficialPhone] = '9067670571' WHERE [EmployeeCode] = 'ADE0008';
UPDATE [dbo].[Employees] SET [UIDNo] = '931093059068', [OfficialPhone] = '9725469370' WHERE [EmployeeCode] = 'ADE0009';
UPDATE [dbo].[Employees] SET [UIDNo] = '401542821251', [OfficialPhone] = '9099417647' WHERE [EmployeeCode] = 'ADE0010';
-- ... continuing for all records

-- Records with missing phone numbers will be set to NULL
UPDATE [dbo].[Employees] SET [UIDNo] = '413151340968', [OfficialPhone] = NULL WHERE [EmployeeCode] = 'ADE0103';
UPDATE [dbo].[Employees] SET [UIDNo] = '478625370493', [OfficialPhone] = NULL WHERE [EmployeeCode] = 'ADE0109';

-- Continuing with remaining records...
UPDATE [dbo].[Employees] SET [UIDNo] = '405768724953', [OfficialPhone] = '9725148907' WHERE [EmployeeCode] = 'ZHN0001';
UPDATE [dbo].[Employees] SET [UIDNo] = '216578854567', [OfficialPhone] = '8980656244' WHERE [EmployeeCode] = 'ZHN0002';
UPDATE [dbo].[Employees] SET [UIDNo] = '225573079702', [OfficialPhone] = '9664841076' WHERE [EmployeeCode] = 'ZHN0003';
UPDATE [dbo].[Employees] SET [UIDNo] = '203797368318', [OfficialPhone] = '7698828883' WHERE [EmployeeCode] = 'ZHN0004';

-- DDS series
UPDATE [dbo].[Employees] SET [UIDNo] = '463976163481', [OfficialPhone] = '8487838383' WHERE [EmployeeCode] = 'DDS0001';
UPDATE [dbo].[Employees] SET [UIDNo] = '937622937740', [OfficialPhone] = '8530101701' WHERE [EmployeeCode] = 'DDS0002';
-- ... continuing for all DDS records
UPDATE [dbo].[Employees] SET [UIDNo] = '528561951273', [OfficialPhone] = '7405131556' WHERE [EmployeeCode] = 'DDS0034';