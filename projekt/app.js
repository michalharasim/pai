const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config.js');
const session = require('express-session');
const { isAdmin, isLoggedIn } = require('./middleware');



const sequelize = new Sequelize(config.development);


const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('Models synchronized with the database.');
  })
  .catch((err) => {
    console.error('Error synchronizing models with the database:', err);
  });

const User = require('./models/User')(sequelize, DataTypes);
const Machine = require('./models/Machine')(sequelize, DataTypes);
const Reservation = require('./models/Reservation')(sequelize, DataTypes);



app.use(express.json());

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use((req, res, next) => {
    if (req.session && req.session.user) {
      req.user = req.session.user;
    }
    res.locals.user = req.session.user;
    next();
  });
  
  app.get('/', (req, res) => {
    res.render('login');
  });

const userController = require('./controllers/userController')(User);
app.get('/users', isAdmin, userController.getUsers);
app.post('/users/:id/delete', userController.deleteUser);
app.post('/users/:id/edit', userController.editUser);


const machineController = require('./controllers/machineController')(Machine, Reservation, User);
app.get('/machines', machineController.getMachines);
app.post('/machines', machineController.addMachine);
app.get('/machines/:id', machineController.getMachineById);
app.post('/machines/:id/delete', machineController.deleteMachine);
app.post('/machines/:id/edit', machineController.editMachine);

const reservationController = require('./controllers/reservationController')(Reservation, User, Machine);
app.post('/machines/:id/reservations', isLoggedIn, reservationController.addReservation);
app.post('/machines/:machineId/reservations/:id/delete', reservationController.cancelReservation);

const authController = require('./controllers/authController')(User);
app.get('/login', authController.getLogin);
app.post('/login', authController.postLogin);
app.get('/register', authController.getRegister);
app.post('/register', authController.postRegister);
app.get('/logout', authController.logout);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});