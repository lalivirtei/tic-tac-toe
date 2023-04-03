import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
      <button className="square"
              onClick={props.onClick}
              data-num={props.num}>
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        num={i}
    />);
  }

  render() {
    let rows = [];
    let key = 0;

    for (let i = 0; i < 9; i = i + 3) {
      let squares = [];

      for (let j = i; j < (i + 3); j++) {
        squares.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={key}>{squares}</div>)
      key++;
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coords: '0:0',
        squareNum: 0,
      }],
      sort: 'ascending',
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }
    let coords = getMoveCoords(i);

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords,
        squareNum: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
    this.resetBg();
  }

  highlightMove(squareNum) {
    let square = document.querySelector(`[data-num="${squareNum}"]`);
    square.style.background = '#08f2ab';
  }

  removeHighlight(squareNum) {
    let square = document.querySelector(`[data-num="${squareNum}"]`);
    square.style.background = 'white';
  }

  resetBg() {
    document.querySelectorAll('.square')
        .forEach(el => el.style.backgroundColor = 'white');
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move + ` (${step.coords})` : 'To the game start';
      return (
          <li key={move} num={move}>
            <button
                onClick={() => this.jumpTo(move)}
                onMouseEnter={() => this.highlightMove(step.squareNum)}
                onMouseLeave={() => this.removeHighlight(step.squareNum)}
            >{desc}</button>
          </li>
      )
    })

    if (this.state.sort === 'descending') {
      moves.sort((a, b) => b.props.num - a.props.num)
    }

    let status;

    if (winner?.player === 'X' || winner?.player === 'O') {
      status = 'Winner is:  ' + winner.player;
      highlightLine(winner.lines);
    } else if (winner === '=') {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div className="sorter">
            <button onClick={() => this.setState({sort: 'ascending'})}>Sort ascending</button>
            <button onClick={() => this.setState({sort: 'descending'})}>Sort descending</button>
          </div>
        </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        lines: lines[i],
        player: squares[a],
      };
    }
  }

  let isDraw = squares.every(i => i !== null);

  if (isDraw) return '=';
  return null;
}

function getMoveCoords(i) {
  let cell = i + 1;

  if (cell <= 3) {
    return `1:${cell}`;
  } else if (cell <= 6) {
    return `2:${cell - 3}`;
  } else {
    return `3:${cell - 6}`;
  }
}

function highlightLine(nums) {
  let square0 = document.querySelector(`[data-num="${nums[0]}"]`)
  let square1 = document.querySelector(`[data-num="${nums[1]}"]`)
  let square2 = document.querySelector(`[data-num="${nums[2]}"]`)
  let els = [square0, square1, square2];
  els.forEach(el => el.style.backgroundColor = '#52ff35');
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
