const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    const auth = req.headers["authorization"]
    if(!auth) return res.status(401).json({status: "error", message: "токен отсутствует"})
    const token = auth.split(' ')[1]
    

    
    try{
      const result = jwt.verify(token, process.env.JWT_SECRET)
      req.user = result
      
      next()
    }
    catch(e){
       return res.status(403).json({ status: "error", message: "Токен невалиден или просрочен" });
    }
}

module.exports = {
    authMiddleware
}