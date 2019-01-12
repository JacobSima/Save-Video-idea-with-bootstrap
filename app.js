const express = require('express')
const exphbs  = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//connect to mongoDB
mongoose.connect('mongodb://localhost/vidjot-v1',{ useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected...'))
  .catch(ex=>console.log(ex))
//load router
const ideas = require('./route/ideas')
const home = require('./route/home')
const users = require('./route/users')
//passport config file
require('./config/passport')(passport)

//handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//Static folder
app.use(express.static(path.join(__dirname,'public')))
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
//express sessio middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}))
// connect middleware
app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use((req,res,next)=>{
  res.locals.succes_msg= req.flash('success_msg')
  res.locals.alert = req.flash('alert')
  res.locals.error_msg= req.flash('error_msg')
  res.locals.error= req.flash('error')
  res.locals.user=req.user || null
  next()
})
//use route
app.use('/ideas',ideas)
app.use('/',home)
app.use('/users',users)


const Port = 5000;
app.listen(Port,()=>{console.log(`Server Started on port: ${Port}`)})