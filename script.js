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
const $body = document.getElementsByTagName('body')[0];
const $container = document.createElement('table');
const $tbody = document.createElement('tbody');

$container.appendChild($tbody);
$body.appendChild($container);

const ROWS = 30;
const COLS = 30;

// Setup
for (let r = 0; r < ROWS; r++) {

  const $tr = document.createElement('tr');
  $tr.id = `r${r}`;

  for (let c = 0; c < COLS; c++) {
    const $td = document.createElement('td');
    $td.id = `${r}-${c}`;
    $td.addEventListener('click', onClick);
    $tr.appendChild($td);
  }

  $tbody.appendChild($tr);
}

function getNeighbours(cell, ROWS, COLS) {
  let [r, c] = cell.id.split('-').map(i => parseInt(i, 10));
  const _left = c - 1 < 0 ? COLS - 1 : c - 1;
  const _top = r - 1 < 0 ? ROWS - 1 : r - 1;
  const _right = c + 1 >= COLS ? 0 : c + 1;
  const _bottom = r + 1 >= ROWS ? 0 : r + 1;

  let idTopLeft = `${_top}-${_left}`;
  let idTopCenter = `${_top}-${c}`;
  let idTopRight = `${_top}-${_right}`;
  let idLeftCenter = `${r}-${_left}`;
  let idRightCenter = `${r}-${_right}`;
  let idBottomLeft = `${_bottom}-${_left}`;
  let idBottomCenter = `${_bottom}-${c}`;
  let idBottomRight = `${_bottom}-${_right}`;

  const neighbours = [
    $e(idTopLeft), $e(idTopCenter), $e(idTopRight),

    $e(idLeftCenter), $e(idRightCenter),

    $e(idBottomLeft), $e(idBottomCenter), $e(idBottomRight),
  ];

  let liveCount = 0;

  var isAlive = cell.className === 'live';

  neighbours.forEach(function(cell) {
    if (cell.className === 'live') {
      liveCount += 1;
    }
  });

  // Rule-1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  if (isAlive && liveCount < 2) {
    cell.setAttribute('next-life', 'dead');
    return;
  }

  // Rule-2. Any live cell with two or three live neighbours lives on to the next generation.
  if (isAlive && (liveCount === 2 || liveCount === 3)) {
    cell.setAttribute('next-life', 'live');
    return;
  }

  // Rule-3. Any live cell with more than three live neighbours dies, as if by overpopulation.
  if (isAlive && liveCount > 3) {
    cell.setAttribute('next-life', 'dead');
    return;
  }

  // Rule-4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  if (!isAlive && liveCount === 3) {
    cell.setAttribute('next-life', 'live');
    return;
  }

  function $e(id) {
    return document.getElementById(id);
  }
}

function getLives() {
  return document.getElementsByClassName('live');
}

function onClick(e) {
  e.target.className = 'live';
}

function loop() {
  document.querySelectorAll('td').forEach(function (cell) {
    getNeighbours(cell, ROWS, COLS);
  });

  document.querySelectorAll('td').forEach(function (cell) {
    cell.className = cell.getAttribute('next-life');
  });
}

let timer;

function start() {
  timer = setInterval(loop, 50);
}

function stop() {
  if (timer) {
    clearInterval(timer);
  }
}

const startBtn = document.getElementById('start')
startBtn.addEventListener('click', start);

const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', stop);
