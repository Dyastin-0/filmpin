const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		console.log("good");
		console.log(req.roles);
		if (!req?.roles) return res.sendStatus(401);
		const roles = [...allowedRoles];
		console.log(roles, req.roles);
		const result = req.roles.map(role => (roles.includes(role))).find(value => value === true);
		if (!result) return res.sendStatus(401);
		console.log("good");
		next(); 
	}
}

module.exports = verifyRoles;