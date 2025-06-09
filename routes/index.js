var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const pool = require("express");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
sequelize.sync()
    .then(() => {
      console.log("Sequelize successful", PORT);
    });
require.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const existingUser = await User.findOne({where: {name}});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'}); 
    }
    const hashaedPassword = await bcrypt.hash(password, 10);
    // const infoA = await InfoA.create({name, description});
    const user = await User.create({name, email, password: hashaedPassword});
    res.status(200).json({message: 'User registered successfully', user});
  }catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});


require.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерация токена
    const token = jwt.sign({ user:name,password:password }, process.env.JWT_SECRET || "WTF", { expiresIn: '1h' });
    console.log('Generated Token:', token); // Логирование сгенерированного токена
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


require.get('/api/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({message: 'No token provided'});
  }

  try {
    const token = jwt.sign({id: user.name}, process.env.JWT_SECRET, {expiresIn: '1h'});
    console.log('Generated token',token);
    res.json({message: 'User registered successfully.', token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});


require.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);  // Должно быть в консоли
});




require.get('/infoA', async (req, res) => {
  try {
    const allInfoA = await InfoA.findAll();
    res.status(200).json(allInfoA);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

require.get('/infoA/:id', async (req, res) => {
  try {
    const info = await InfoA.findByPk(req.params.id);
    if (info) {
      res.status(200).json(info);
    } else {
      res.status(404).json({ message: 'Запись не найдена' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

require.post('/infoA', async (req, res) => {
  try {
    const newInfo = await InfoA.create({
      name: req.body.name,
      description: req.body.description
    });
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

require.put('/infoA/:id', async (req, res) => {
  try {
    const [updated] = await InfoA.update({
      name: req.body.name,
      description: req.body.description
    }, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedInfo = await InfoA.findByPk(req.params.id);
      res.status(200).json(updatedInfo);
    } else {
      res.status(404).json({ message: 'Запись не найдена' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

require.delete('/infoA/:id', async (req, res) => {
  try {
    const deleted = await InfoA.destroy({
      where: { id: req.params.id }
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Запись не найдена' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
