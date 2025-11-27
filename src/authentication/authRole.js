import { STATUS_CODES } from "../config/constants.js";

export default function requiredRole(...allowedRoles) {
    return function (req, res, next) {
        if (!allowedRoles.includes(req.user.role)) {
            res.status(STATUS_CODES.INSUFFICIENT_PERMISSIONS).json({ error: "Forbidden: Insufficient permissions" });
        } 
        next();
    };
};