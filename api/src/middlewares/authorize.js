import { validateUserService } from "../services/Auth.service.js"; // Adjust path as needed
export const authorize = (moduleName = null) => {
  return async (req, res, next) => {
    try {
      const { user_id } = req.tokendata;
      const user = await validateUserService(req, user_id);
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });

      const rolePermissions = user.user_role?.role_permissions || [];

      // Auto-detect module name from route if not explicitly passed
      const routeName = moduleName || req.baseUrl.split('/').pop();

      const hasPermission = rolePermissions.some((perm) => {
        return perm.module_name.toLowerCase() == routeName.toLowerCase() && perm.is_accessable;
      });

      // if (!hasPermission) {
      //   return res.status(403).json({ success: false, message: 'Forbidden: You do not have access' });
      // }
      next();
    } catch (error) {
      console.error("Authorization error:", error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};
