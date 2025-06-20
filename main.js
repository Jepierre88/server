const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

// Clave secreta para firmar los tokens (¡mantenla segura!)
const SECRET_KEY = 'mi_clave_secreta';

// Middleware para parsear JSON
app.use(bodyParser.json());

// Ruta pública (no requiere autenticación)
app.get('/public', (req, res) => {
  res.json({ message: 'Esta es una ruta pública, no necesitas autenticación.' });
});

// Ruta para iniciar sesión y obtener un token
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validación básica (en un caso real, verifica en tu base de datos)
  if (email === 'usuario@gmail.com' && password === 'pass123') {
    // Crear el token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Credenciales inválidas.' });
});

// Middleware para verificar el token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Token no proporcionado.' });
  }
};

// Ruta protegida (requiere autenticación)
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Bienvenido, ${req.user.email}. Esta es una ruta protegida.` });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
