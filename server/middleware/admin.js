let admin = (req,res,next) => {
    if(req.user.role===0){
        return res.send(' You dont have Admin priviledge')
    }
    next()
}

module.exports={admin}