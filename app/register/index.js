var userExists;
function setValue(value) {
	userExists = value;
  }

module.exports = {
	
//---------------------------------------------------------------

	renderRegister: ((req, res) => {
		res.render('register', { title: 'Form Validation', success: req.session.success, errors: req.session.errors });
		req.session.errors = null;
	}),

//--------------------------------------------------------------


	register : (req, res) => {		
		req.check('username', 'Invalid email address').isEmail();
		req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.ConfirmPassword);
		var username = req.body.username;
		var password = req.body.password;

		var bcryptNodejs = require("bcrypt-nodejs");
		var salt = bcryptNodejs.genSaltSync(10);
		var hash = bcryptNodejs.hashSync(password, salt);
		var uname = "SELECT * FROM users where username like '"+ username +"'";
		var insert = "INSERT INTO users(username, password, type) VALUES ('"+ username +"', '"+ hash +"', 'user')";
		
		//------------------------		
		const db = require('../../db');
		async function query (q) {
			let res;
			try {
			  await db.query('BEGIN');
			  try {
				res = await db.query(q);
				await db.query('COMMIT');
			  } catch (err) {
				await db.query('ROLLBACK');
				throw err;
			  }
			} finally {
			}
			return res;
		  };
		  
		  async function main () {
			try {
			  const rows = await query(uname);
			  setValue(rows.rowCount);
			  if(rows.rowCount < 1){
				  try{
				await query(insert);
			  } catch (err) {
				console.log('Database ' + err);
			  }}
			} catch (err) {
			  console.log('Database ' + err);
			}
		  };
		//---------------------

		var errors = req.validationErrors();
		if (errors) {
		  req.session.errors = errors;
		  req.session.success = false;
		  res.redirect('/register');
	   } else {
			 req.session.success = true;

		main().then((result) => {

			if(userExists == 1){
				req.session.errors = [ { param: 'Username', msg: 'Username already exists',	value: 'exists' } ];
				req.session.success = false;
				res.redirect('/register');
			}else{
			   res.redirect('/register');
			   
		   }

		  });
		 }
}
}