function loggedOut( req , res , next ){
      if(req.session && req.session.userId){
          return res.redirect('/profile');
      }
      return next();
}

function logInRequired( req , res , next ){

    if( req.session && req.session.userId){
        return next() ;
    }else{
        var err = new Error('You must be logged in to view this page');
        err.status = 401 ;
        next(err);
    }
}
module.exports.logInRequired = logInRequired;
module.exports.loggedOut = loggedOut;
