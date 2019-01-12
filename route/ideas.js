const express = require('express')
const router = express.Router()
const Idea = require('../model/Idea')
const {ensureAuthenticated} =require('../helpers/auth')

// Add Idea Form
router.get('/add',[ensureAuthenticated],async(req,res)=>{
  res.render('ideas/add')
})
//Ideas Route
router.get('/',[ensureAuthenticated],async(req,res)=>{
  const ideas = await Idea.find({user:req.user.id}).sort({date:'desc'})
  res.render('ideas/index',{ideas:ideas})
})

//process form
router.post('/',[ensureAuthenticated],async(req,res)=>{
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
    details:req.body.details,
    user:req.user.id
  }) 
   await newIdea .save()
   req.flash('success_msg','Video Idea Added')
   res.redirect('/ideas')
}
})

//Edit idea form
router.get('/:id',[ensureAuthenticated],async(req,res)=>{
const idea = await Idea.findOne({_id:req.params.id})
    if(idea.user !== req.user.id){
      req.flash('error_msg','Not Authorized')
      res.redirect('/ideas')
    }else{
      res.render('ideas/edit',{idea:idea})
    }
})

//update idea
router.put('/:id',[ensureAuthenticated],async(req,res)=>{
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
router.delete('/:id',[ensureAuthenticated],async(req,res)=>{
const idea = await Idea.findOneAndDelete ({_id:req.params.id})
if(idea.user !==req.user.id){
  req.flash('error_msg','Not Authorized')
  res.redirect('/ideas')
}else{
  req.flash('success_msg','Video Idea Removed')
  res.redirect('/ideas')
}
})

module.exports = router


