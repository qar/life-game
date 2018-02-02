/**
 * Rule-1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
 * Rule-2. Any live cell with two or three live neighbours lives on to the next generation.
 * Rule-3. Any live cell with more than three live neighbours dies, as if by overpopulation.
 * Rule-4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * How it's run:
 * 1. predict every cell's next life condition
 * 2. change to next life
 */
var $body = document.getElementsByTagName('body')[0];
var $container = document.createElement('table');
var $tbody = document.createElement('tbody');

$container.appendChild($tbody);
$body.appendChild($container);

var ROWS = 30;
var COLS = 30;

var pool = [];
for (var r = 0; r < ROWS; r++) {
  pool[r] = [];

  for (var c = 0; c < COLS; c++) {
    pool[r][c] = 0; // dead cell
  }
}

// Setup
for (var r = 0; r < ROWS; r++) {
  var $tr = document.createElement('tr');
  $tr.id = `r${r}`;

  for (var c = 0; c < COLS; c++) {
    var $td = document.createElement('td');
    $td.id = `${r}-${c}`;
    $td.addEventListener('click', function(e) {
      var pos = e.target.id.split('-').map(i => parseInt(i, 10));

      if (e.target.className) {
        pool[pos[0]][pos[1]] = 0;
        e.target.className = '';
      } else {
        pool[pos[0]][pos[1]] = 1;
        e.target.className = 'alive';
      }
    });
    $tr.appendChild($td);
  }

  $tbody.appendChild($tr);
}

function tick(pool) {
  var newPool = [];

  function getCell(pool, r, c) {
    return pool[r][c];
  }

  function setCell(pool, r, c, state) {
    pool[r][c] = state;
  }

  function nextGen(pool, r, c) {
    var isAlive = getCell(pool, r, c);

    var _left = c - 1 < 0 ? COLS - 1 : c - 1;
    var _top = r - 1 < 0 ? ROWS - 1 : r - 1;
    var _right = c + 1 >= COLS ? 0 : c + 1;
    var _bottom = r + 1 >= ROWS ? 0 : r + 1;

    var neighbours = [
      getCell(pool, _top, _left), getCell(pool, _top, c), getCell(pool, _top, _right),

      getCell(pool, r, _left), getCell(pool, r, _right),

      getCell(pool, _bottom, _left), getCell(pool, _bottom, c), getCell(pool, _bottom, _right)
    ];

    var liveCount = neighbours.filter(function(c) { return !!c }).length;

    // Rule-1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
    if (isAlive && liveCount < 2) {
      return 0;
    }

    // Rule-2. Any live cell with two or three live neighbours lives on to the next generation.
    if (isAlive && (liveCount === 2 || liveCount === 3)) {
      return 1;
    }

    // Rule-3. Any live cell with more than three live neighbours dies, as if by overpopulation.
    if (isAlive && liveCount > 3) {
      return 0;
    }

    // Rule-4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if (!isAlive && liveCount === 3) {
      return 1;
    }
  }

  for (var r = 0; r < ROWS; r++) {
    newPool[r] = [];
    for (var c = 0; c < COLS; c++) {
      setCell(newPool, r, c, nextGen(pool, r, c));
    }
  }

  return newPool;
}

function draw(pool) {
  document.querySelectorAll('td').forEach(function (cell) {
    var pos = cell.id.split('-').map(i => parseInt(i, 10));
    cell.className = pool[pos[0]][pos[1]] ? 'alive' : 'dead';
  });
}

function loop() {
  pool = tick(pool);
  draw(pool);
}

let timer;

document.getElementById('start').addEventListener('click', function() {
  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(loop, 50);
});

document.getElementById('stop').addEventListener('click', function() {
  if (timer) {
    clearInterval(timer);
  }
});
