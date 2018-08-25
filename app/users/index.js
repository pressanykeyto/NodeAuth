module.exports = {
	login: (req, res) => {
		const { user } = req

		res.json(user)
	},

	logout: (req, res, next) => {
		req.session.destroy((err) => {
			if(err) return next(err)

			req.logout()
			res.render('LoggedOff');
			//res.sendStatus(200)
		})
	},

	ping: function(req, res) {
		res.sendStatus(200)
	},

	home: (req, res) => {
		res.render('home');
	}
}

