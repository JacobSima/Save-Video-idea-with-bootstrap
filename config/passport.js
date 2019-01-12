const LocalStrategy =require('passport-local').Strategy
const  mongoose = require('mongoose')
const bcrypt = require('bcrypt')


//load user model
const User = require('../model/User')
module.exports =function(passport){
   passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
     // check email from database
       const user = await User.findOne({email})
       if(!user){
         return done(null,false,{message:'Not User Found'})
       }
      //user found now check the password
      const macth = await bcrypt.compare(password,user.password)
      if(!macth){
        return done(null,false,{message:'Password Incorrect'})
      }
      return done(null,user)
        
   }))


   passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}