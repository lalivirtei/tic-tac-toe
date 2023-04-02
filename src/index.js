import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
      <button className="square"
              onClick={props.onClick}
              data-num={props.num}
      >
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        num={i}
    />);
  }

  render() {
    return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
    );
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
    })
  }

  highlightMove(squareNum) {
    let square = document.querySelector(`[data-num="${squareNum}"]`);
    square.style.background = '#08f2ab';
  }

  takeHighlightOff(squareNum) {
    let square = document.querySelector(`[data-num="${squareNum}"]`);
    square.style.background = 'white';
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move + ` (${step.coords})` : 'To the game start';
      return (
          <li key={move}>
            <button
                onClick={() => this.jumpTo(move)}
                onMouseEnter={() => this.highlightMove(step.squareNum)}
                onMouseLeave={() => this.takeHighlightOff(step.squareNum)}
            >{desc}</button>
          </li>
      )
    })

    let status;

    if (winner) {
      status = 'Winner is:  ' + winner;
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
      return squares[a];
    }
  }

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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game/>);
