const winston = require('winston')
const { requiresLogin, requiresAdmin } = require('./middlewares/authorization')
const admin = require('../app/admin')
const users = require('../app/users')
const register = require('../app/register')
const monitoring = require('../app/monitoring')



module.exports = (app, passport, db) => {
	app.post('/api/login', passport.authenticate('local'), users.login)
	app.get('/api/logout', users.logout)
	app.get('/api/ping', requiresLogin, users.ping)

	app.get('/login', admin.renderLogin)
	app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), admin.login)
	app.get('/admin/panel', requiresAdmin, admin.renderPanel)
	app.get('/logout', users.logout)
	app.get('/register', register.renderRegister)
	app.post('/register', register.register)
	app.get('/health', monitoring.health(db))
	app.get('/allUsers',requiresAdmin, monitoring.allUsers(db))

	app.get('/home', requiresLogin, users.home)

	app.get('/', function (req, res) {
		res.redirect('/login');
	  })



	app.use(function (err, req, res, next) {
		if (err.message && (~err.message.indexOf('not found'))) {
			return next()
		}

		winston.error(err.stack)

		return res.status(500).json({error: 'Error on backend occurred.'})
	})

	app.use(function (req, res) {
		//const payload = {
		//	url: req.originalUrl,
		//	error: 'Not found'
		//}
		//if (req.accepts('json')) return res.status(404).json(payload)

		//res.status(404).render('404', payload)
		res.status(404);
		res.render('404');
	})
}

