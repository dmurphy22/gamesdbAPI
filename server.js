const PORT = 8080;
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const { getAllGames, getGameById } = require('./db/queries/API/games');
const { connectToDatabase } = require('./db/connect');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/games', (req, res) => {
  connectToDatabase()
    .then(db => getAllGames(db))
    .then(games => {
      res.json(games);
    })
    .catch(err => {
      console.error('Error retrieving game data:', err);
      res.status(500).json({ error: 'Failed to retrieve game data' });
    });
});

app.get('/games/:id', (req, res) => {
  const gameId = req.params.id;

  connectToDatabase()
    .then(db => getGameById(db, gameId))
    .then(game => {
      if (game) {
        res.json(game);
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    })
    .catch(err => {
      console.error('Error retrieving game data:', err);
      res.status(500).json({ error: 'Failed to retrieve game data' });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
