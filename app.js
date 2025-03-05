/** Dotenv && MongoDB */
require("dotenv").config();
require("./configs/db");
/** END OF Dotenv && MongoDB */

/** Express &&  */
var express = require('express');
const helmet = require("helmet");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

/** Routes */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const charactersRouter = require('./routes/characters');
const messagesRouter = require('./routes/messages');
const racesRouter = require('./routes/races');
const spellsRouter = require('./routes/spells');
const roomsRouter = require('./routes/rooms');
const partiesRouter = require('./routes/parties');
const gamesRouter = require('./routes/games');
const messagesRoomsRouter = require('./routes/messages_rooms');
/** END OF Routes */

var app = express();

/** Middleware */
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/** END OF Middlewares */

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/characters', charactersRouter);
app.use('/messages', messagesRouter);
app.use('/races', racesRouter);
app.use('/spells', spellsRouter);
app.use('/rooms', roomsRouter);
app.use('/parties', partiesRouter);
app.use('/games', gamesRouter);
app.use('/messages-rooms', messagesRoomsRouter);
module.exports = app;
