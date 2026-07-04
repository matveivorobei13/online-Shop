const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    const auth = req.headers["authorization"]
    if(!auth) return res.status(401).json({status: "error", message: "no token"})
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

async function roleMiddleware(req, res, next){
    console.log(req.user)
    if(req.user.role !== "admin"){
        return res.json({status: "error", message: "not enough rights"})
    }
    next()
}

module.exports = {
    authMiddleware,
    roleMiddleware
}

