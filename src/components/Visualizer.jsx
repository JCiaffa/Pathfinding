import React, { Component } from "react";
import Node from "./Node/Node";
import "./Visualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      speed: 2,
      play: false,
      shortestPath: null,
      movingStartNode: false,
      movingEndNode: false,
      startNodeRow: 10,
      startNodeCol: 10,
      finishNodeRow: 10,
      finishNodeCol: 40,
      currentRow: null,
      currentCol: null,
    };
  }

  handleReset() {
    window.location.reload(false);
  }

  // handleClear() {
  //   const grid = clearGrid(this.state.grid);
  //   this.setState({ grid });
  // }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleSpeed(speedConstant) {
    if (!this.state.play) {
      this.setState({ speed: speedConstant }, this.speed);
    }
  }

  handleMouseDown(row, col, isStart, isFinish) {
    if (!isStart && !isFinish && !this.state.play) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    if (isStart) {
      this.setState({ movingStartNode: true });
      moveStartNode(this.state.grid, row, col);
    }
    if (isFinish) {
      this.setState({ movingEndNode: true });
      moveEndNode(this.state.grid, row, col);
    }
  }

  handleMouseEnter(row, col, isStart, isFinish) {
    this.setState({ currentRow: row, currentCol: col });
    if (!this.state.mouseIsPressed) return;
    if (!isStart && !isFinish) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
    if (this.state.movingStartNode) {
      this.setState({ movingStartNode: false });
      const newGrid = getNewStartNode(
        this.state.grid,
        this.state.currentRow,
        this.state.currentCol
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: false,
        movingStartNode: false,
        startNodeRow: this.state.currentRow,
        startNodeCol: this.state.currentCol,
      });
    }
    if (this.state.movingEndNode) {
      this.setState({ movingEndNode: false });
      const newGrid = getNewEndNode(
        this.state.grid,
        this.state.currentRow,
        this.state.currentCol
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: false,
        movingEndNode: false,
        finishNodeRow: this.state.currentRow,
        finishNodeCol: this.state.currentCol,
      });
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    if (!this.state.play) {
      this.setState({ play: true });
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder);
          }, this.state.speed * i);
          return;
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }, this.state.speed * i);
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
    this.setState({ play: false });
    this.setState({ shortestPath: nodesInShortestPathOrder.length });
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    let startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
    let finishNode = grid[this.state.finishNodeRow][this.state.finishNodeCol];
    let visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    let nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    let backgroundcolor;
    if (
      this.state.play === true
        ? (backgroundcolor = "grey")
        : (backgroundcolor = "#ADD8E6")
    ) {
    }
    return (
      <>
        <div className="controls">
          <div className="algoControls">
            <div>Controls</div>
            <div>
              <button
                className="play-btn"
                onClick={() => this.visualizeDijkstra()}
                style={{ backgroundColor: backgroundcolor }}
              >
                Run Dijkstra's
              </button>
              {/* <button className="play-btn" onClick={() => this.handleClear()}>
                Clear
              </button> */}
              <button onClick={() => this.handleReset()}>Reset</button>
            </div>
          </div>
          <div className="speedControls">
            <div> Speed {this.state.speed}</div>
            <div>
              <button
                className="speed-btn"
                value={2}
                onClick={(e) => this.handleSpeed(e.target.value)}
                style={{ backgroundColor: backgroundcolor }}
              >
                Fast
              </button>

              <button
                className="speed-btn"
                value={10}
                onClick={(e) => this.handleSpeed(e.target.value)}
                style={{ backgroundColor: backgroundcolor }}
              >
                Normal
              </button>
              <button
                className="speed-btn"
                value={15}
                onClick={(e) => this.handleSpeed(e.target.value)}
                style={{ backgroundColor: backgroundcolor }}
              >
                Slow
              </button>
            </div>
          </div>
          <div>
            {this.state.shortestPath == null
              ? `Shortest Path: `
              : this.state.shortestPath !== 1
              ? `Shortest Path: ${this.state.shortestPath}`
              : `Shortest Path: none`}
          </div>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) =>
                        this.handleMouseDown(row, col, isStart, isFinish)
                      }
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col, isStart, isFinish)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const moveStartNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewStartNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const moveEndNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewEndNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// LEFT OFF HERE
// const clearGrid = (grid) => {

// };

const createNode = (col, row) => {
  let snr = 10;
  let snc = 10;
  let fnr = 10;
  let fnc = 40;
  return {
    col,
    row,
    isStart: row === snr && col === snc,
    isFinish: row === fnr && col === fnc,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
    weight: 5,
  };
  newGrid[row][col] = newNode;
  console.log(newNode.weight);
  return newGrid;
};
