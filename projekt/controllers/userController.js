const bcrypt = require('bcrypt');

module.exports = (User) => {
  const getUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.render('user', { users });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

  const editUser = async (req, res) => {
    const userId = req.body.id;
    const { username, email, phone, role, password } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.role = role;

        if (password && password.trim() !== '') {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password_hash = hashedPassword;
        }

        await user.save();
        res.redirect('/users');
      } else {
        res.status(404).send('Uzytkownik nie znaleziony');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

  const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
        res.redirect('/users');
      } else {
        res.status(404).send('Uzytkownik nie znaleziony');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

  return {
    getUsers,
    editUser,
    deleteUser
  };
};
