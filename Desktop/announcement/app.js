import express from 'express';
import routes from './routes/index.js';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(session({
  secret: '1234567890',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use('/', routes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});