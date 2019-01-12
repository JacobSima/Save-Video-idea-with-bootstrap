const express = require('express')
const router = express.Router()

//Index Route
router.get('/',async(req,res)=>{
  const title ='Welcome'
  res.render('index',{title:title})
})
// About page
router.get('/about',async(req,res)=>{
  res.render('about')
})

module.exports = router