const jwt = require('jsonwebtoken');

//=========================
// Verificar Token
// ========================

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'no funciono el token :('
                }
            });
        }
        req.usuario = decoded.usuario;

        next();
    })

};

//=========================
// Verifica AdminRole
// ========================
let verificarAdmin_Rol = (req, res, next) => {
    let usuario = req.usuario;
    //console.log(usuario.role);
    if (usuario.role === 'USER_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: `El usuario ${usuario.nombre} no tiene privilegios para realizar esta acción`
            }
        })
    }
    next();


}

module.exports = {
    verificarToken,
    verificarAdmin_Rol
}