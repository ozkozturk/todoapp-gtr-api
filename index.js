const restify = require('restify');
const dayjs = require('dayjs');
const corsMiddleware = require('restify-cors-middleware');

require('dayjs/locale/tr');

dayjs.locale('tr');

const cors = corsMiddleware({
  origins: ["*"],
});

const server = restify.createServer();

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

const dateFormat = 'YYYY-MM-DD HH:mm:SS';

let todos = [
  {
    id: 1,
    title: 'Hack it',
    completed: false,
    createdAt: dayjs().format(dateFormat),
    updatedAt: dayjs().format(dateFormat),
  },
];

server.get('/', function(req, res, next) {
  res.send(200, {
    data: {
      todos,
    },
  });
});

server.post('/create', function(req, res, next) {
  const lastTodoId = todos[todos.length - 1].id;
  const newTodo = {
    id: lastTodoId + 1,
    title: req.body.title,
    completed: false,
    createdAt: dayjs().format(dateFormat),
    updatedAt: dayjs().format(dateFormat),
  };

  todos.push(newTodo);

  res.send(200, {
    ...newTodo,
  });
});

server.post('/delete', function(req, res, next) {
  const { id } = req.body;

  todos = todos.filter(todo => todo.id !== parseInt(id));

  res.send(200, {
    id,
  });
});

server.post('/update', function(req, res, next) {
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.body.id));

  const updatedTodo = {
    title: req.body.title,
    completed: !!req.body.completed,
    updatedAt: dayjs().format(dateFormat),
  };

  todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };

  res.send(200, {
    ...updatedTodo,
  });
});

server.listen(8080, function() {
  console.log(server.name, server.url);
});