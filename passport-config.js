const localPassports = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getElementByEmail) {
    const authenticateUsers = async (email, password, done) => {
        const user = getElementByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'Nenhum usuário encontrado com esse e-mail.'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: 'Senha de usuário incorreta.'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new localPassports({ usernameField: 'email' }, authenticateUsers))
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})

}

module.exports = initialize