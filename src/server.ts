import express from 'express';
import router from './routes/todos.js';
import logRequest from './middleware/logRequest.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logRequest);
app.use('/api', router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} port`);
});
