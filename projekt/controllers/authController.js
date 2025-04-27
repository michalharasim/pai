const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports = (User) => {
  const getLogin = (req, res) => {
    res.render('login');
  };

  const postLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({
        where: {
          email: email,
        },
      });
  
      if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);
  
        if (passwordMatch) {
          req.session.user = {
            id: existingUser.id,
            username: existingUser.username,
            role: existingUser.role
          };
  
          res.redirect('/machines'); 
        } else {
          res.render('login');
        }
      } else {
        res.render('login');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

  const getRegister = (req, res) => {
    res.render('register');
  };

  const postRegister = async (req, res) => {
    const { username, password, email, phone, role } = req.body;

    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: username },
            { email: email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).send('Nazwa uzytkownika lub email juz istnieje.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        password_hash: hashedPassword,
        email,
        phone,
        role
      });

      res.redirect('/machines');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

  const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Nieudany logout');
      }
      res.redirect('/login');
    });
  };

  return {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    logout
  };
};
