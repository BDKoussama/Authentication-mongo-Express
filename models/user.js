var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
// athenticate method
UserSchema.statics.authenticate = function( email , password , callback ){
    console.log('____4____');
    User.findOne({ email : email })
        .exec( function( error,user ){
            if(error){
              return callback(error) ;
            }else if( !user ){
              var err = new Error('User not Found ! ');
              err.status = 401 ;
              return callback(err) ;
            }
          bcrypt.compare(password , user.password , function( error , result ){
                if(result === true ){
                    return callback(null , user);
                }else{
                     return callback();
                }
          });
        });
}
// hash password before saving it to db
UserSchema.pre('save' , function(next) {

   var user = this ;
   bcrypt.hash(user.password , 10 , ( err , hash ) => {
      if(err){
        console.error(err);
        next(err);
      }else{
        user.password = hash ;
        next();
      }
   });

});
var User = mongoose.model('User', UserSchema);
module.exports = User;
