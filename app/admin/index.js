module.exports = {
	renderLogin: (req, res) => {
		res.render('login')
	},

	login: (req, res) => {
		if(req.user.type === 'admin') {
			res.redirect('/admin/panel')
		} 
		if(req.user.type === 'user') {
			res.redirect('/home')
		} else {
			res.redirect('/login')
		}
	},

	renderPanel: (req, res) => {
		res.render('admin-panel')
	}


}
