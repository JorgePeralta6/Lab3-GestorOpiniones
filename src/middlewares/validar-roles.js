export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.role)) {
            return res.status(400).json({
                success: false,
                msg: `Usuario no autorizado, posee un rol ${req.usuario.role}, los roles autorizados son ${roles}`
            })
        }

        next();
    }
}

export const validarAdminRole = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};
