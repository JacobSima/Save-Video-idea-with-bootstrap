const express = require('express')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt');
const passport = require('passport')


//user Login Route
router.get('/login',async(req,res)=>{
  res.render('users/login')
})
//login post
router.post('/login',async(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next)

})
//logout
router.get('/logout',async(req,res)=>{
   req.logout()
   req.flash('success_msg','You are now logged out')
   res.redirect('/')
})
//users register route
router.get('/register',async(req,res)=>{
  res.render('users/register')
})
//register users
router.post('/register',async(req,res)=>{
  let password = req.body.password
  if(req.body.name ===''||req.body.email===''||req.body.password===''||req.body.password1===''){
    req.flash('error','All the fields required')
    res.render('users/register',{
      name:req.body.name,
      email:req.body.email
    });
    return
  }
  if(req.body.password!== req.body.password1){
    req.flash('error','Passwords do not match')
    res.render('users/register',{
      name:req.body.name,
      email:req.body.email
    })
    return
  }
   if(password.length <5){
     req.flash('error','Password must be at least 5 characters')
     res.render('users/register',{
      name:req.body.name,
      email:req.body.email
    })
    return
   }
   password= await bcrypt.hash(req.body.password,10)
// create new user
   const newUser =new User({
     name:req.body.name,
     email:req.body.email,
     password,
   })
// check if user already exist
  const user =await User.findOne({email:newUser.email})
  if(user){
    req.flash('error','Email already exist...')
    res.redirect('/users/login')
  }else{
    await newUser.save()
    req.flash('success_msg','You are now registered,please log in')
    res.redirect('/users/login')
  }
    

  
})
module.exports = router
