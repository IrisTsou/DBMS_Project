import express from 'express';
import session from 'express-session';
import routes from './routes/index.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.json());
app.use(session({
  secret: '1234567890',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});


app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});