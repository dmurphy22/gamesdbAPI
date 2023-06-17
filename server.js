const PORT = 8080;
const express = require('express');
const app = express();
let morgan = require('morgan');

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
