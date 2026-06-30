

function schemasValidate(schema){
    return function(req, res, next){
        const data = schema.safeParse(req.body)
        console.log(req.body)
        if(!data.success){
            const firstErrorMessage = data.error.issues[0].message
            return res.json({
                status:"error",
                message: firstErrorMessage
            })
        }
        req.body = data.data; 

        next()
    }
}

module.exports = {
    schemasValidate
}