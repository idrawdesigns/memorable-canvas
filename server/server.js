const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cookieParser())

//models
const { User} = require('./models/user')
const { Print} = require('./models/print')
const { Finishing} = require('./models/finishing')

//middleares
const { auth } = require('./middleware/auth')
const { admin } = require('./middleware/admin')


//=========================================
//          PRINT
//==========================================

app.post('/api/product/print',auth,admin,(req,res)=>{
        const print= new Print(req.body)

        print.save((err,doc)=>{
            if(err) return res.json({sucess:false,err})
            res.status(200).json({
                sucess:true,
                PrintType: doc
            })
        })
})

app.get('/api/product/prints',(req,res)=>{
    Print.find({}, (err,prints)=>{
        if(err) return res.status(400).send(err)
        res.status(200).send(prints)
    })
})



//=========================================
//          FINISHING
//=========================================

app.post('/api/product/finishing',auth,admin,(req,res)=>{
    const finishing= new Finishing(req.body)

    finishing.save((err,doc)=>{
        if(err) return res.json({sucess:false,err})
        res.status(200).json({
            sucess:true,
            FinishingType: doc
        })
    })
})

app.get('/api/product/finishings',(req,res)=>{
    Finishing.find({}, (err,finishings)=>{
    if(err) return res.status(400).send(err)
    res.status(200).send(finishings)
})
})



//=========================================
//          USERS
//==========================================

app.get('/api/users/auth',auth,(req,res)=>{
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        cart: req.user.cart,
        history: req.user.history
    })
})

app.post('/api/users/register', (req,res)=>{
    const user = new User(req.body)

    user.save((err, doc)=>{
        if(err) return res.json({sucess:false, err})
        res.status(200).json({
            sucess: true,
            // userdata:doc
        })

    })
})

app.post('/api/users/login', (req,res)=>{
    User.findOne({'email': req.body.email}, (err,user)=>{
        if(!user) return res.json({loginSuccess:false,message:'Auth Failed, email not found'})

        user.comparePassword(req.body.password, (err, isMatch)=> {
            if(!isMatch) return res.json({loginSuccess:false,message:'Wrong Password'})

            user.generateToken((err,user)=> {
                if(err) return res.status(400).send(err)
                res.cookie('w_auth',user.token).status(200).json({
                    loginSucess: true
                })
            })
        })
    })
})

app.get('/api/user/logout',auth,(req,res)=>{
        User.findOneAndUpdate(
            {_id:req.user._id},
            {token: ''},
            (err,doc)=>{
                if(err) return res.json({sucess:false,err})
                return res.status(200).send({
                    sucess: true
                })
            }
        )
})


const port = process.env.PORT || 3002

app.listen(port, ()=> {
    console.log(`Server running on ${port}`)
})