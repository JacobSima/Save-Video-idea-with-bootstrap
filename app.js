const express = require('express')
const exphbs  = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')


const app = express()

//connect to mongoDB
mongoose.connect('mongodb://localhost/vidjot-v1',{ useNewUrlParser: true })
  .then(()=>console.log('MongoDB Connected...'))
  .catch(ex=>console.log(ex))
//load idea model
const Idea = require('./model/Idea')


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

//global variables
app.use((req,res,next)=>{
  res.locals.succes_msg= req.flash('success_msg')
  res.locals.alert = req.flash('alert')
  res.locals.error_msg= req.flash('error_msg')
  res.locals.error= req.flash('error')
  next()
})



//Index Route
app.get('/',async(req,res)=>{
  const title ='Welcome'
  res.render('index',{title:title})
})
// About page
app.get('/about',async(req,res)=>{
  
  res.render('about')
})

// Add Idea Form
app.get('/ideas/add',async(req,res)=>{
    res.render('ideas/add')
})
//Ideas Route
app.get('/ideas',async(req,res)=>{
    const ideas = await Idea.find({}).sort({date:'desc'})
    res.render('ideas/index',{ideas:ideas})
})

//process form
app.post('/ideas',async(req,res)=>{
  let errors=[]
  if(req.body.title===''){errors.push({text:'Please add a title'})}
  if(req.body.details===''){errors.push({text:'Please add some details'})}
  if(errors.length >0){res.render('ideas/add',{
    errors:errors,
    title:req.body.title,
    details:req.body.details
  })
  }else{ 
    const newIdea = new Idea({
      title:req.body.title,
      details:req.body.details
    }) 
     await newIdea .save()
     req.flash('success_msg','Video Idea Added')
     res.redirect('/ideas')
  }
})

//Edit idea form
app.get('/ideas/:id',async(req,res)=>{
  const idea = await Idea.findOne({_id:req.params.id})
  res.render('ideas/edit',{idea:idea})
})

//update idea
app.put('/ideas/:id',async(req,res)=>{
  let errors=[]
  if(req.body.title ===''){errors.push({text:'please enter a title'})}
  if(req.body.details===''){errors.push({text:'Please enter some details'})}
  if(errors.length>0){
    req.flash('error_msg','Field Empty Idea not updated')
    res.redirect('/ideas')}else{
    const idea = await Idea.findOne({_id:req.params.id})
    idea.title =req.body.title
    idea.details=req.body.details
    await idea.save()
    req.flash('success_msg','Video Idea Updated')
    res.redirect('/ideas')
  }
})

// delete idea
app.delete('/ideas/:id',async(req,res)=>{
  await Idea.findOneAndDelete ({_id:req.params.id})
  req.flash('alert')
  req.flash('success_msg','Video Idea Removed')
  res.redirect('/ideas')
})


const Port = 5000;
app.listen(Port,()=>{console.log(`Server Started on port: ${Port}`)})