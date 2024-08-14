import React, { useState } from 'react';

const Grid = () => {
  // Initial grid setup
  const createInitialGrid = () => Array.from({ length: 100 }, () => Array(100).fill(0));

  const [grid, setGrid] = useState(createInitialGrid());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  // Handle click to set start and end positions
  const handleClick = (x, y) => {
    if (!start) {
      setStart({ x, y });
    } else if (!end) {
      setEnd({ x, y });
    }
  };

  // Find the shortest path using Dijkstra's algorithm
  const dijkstra = () => {
    if (!start || !end) return;

    const queue = [{ x: start.x, y: start.y, distance: 0 }];
    const distances = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(Infinity));
    const previous = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
    distances[start.x][start.y] = 0;

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.x === end.x && current.y === end.y) {
        const path = [];
        let { x, y } = end;

        while (x !== start.x || y !== start.y) {
          path.unshift({ x, y });
          ({ x, y } = previous[x][y]);
        }
        path.unshift(start);
        setPath(path);
        return;
      }

      const neighbors = getNeighbors(current.x, current.y);
      for (const neighbor of neighbors) {
        const { x, y } = neighbor;
        const newDistance = current.distance + 1;
        if (newDistance < distances[x][y]) {
          distances[x][y] = newDistance;
          previous[x][y] = { x: current.x, y: current.y };
          queue.push({ x, y, distance: newDistance });
        }
      }
    }
  };

  // Get valid neighboring cells
  const getNeighbors = (x, y) => {
    const neighbors = [];
    if (x > 0) neighbors.push({ x: x - 1, y });
    if (x < grid.length - 1) neighbors.push({ x: x + 1, y });
    if (y > 0) neighbors.push({ x, y: y - 1 });
    if (y < grid[0].length - 1) neighbors.push({ x, y: y + 1 });
    return neighbors.filter(neighbor => grid[neighbor.x][neighbor.y] === 0);
  };

  // Reset the grid and state
  const reset = () => {
    setGrid(createInitialGrid());
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <div>
      <button onClick={dijkstra}>Find Path</button>
      <button onClick={reset}>Reset</button>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${100}, 10px)` }}>
        {grid.map((row, x) => (
          <React.Fragment key={x}>
            {row.map((cell, y) => (
              <div
                key={y}
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor:
                    x === start?.x && y === start?.y
                      ? 'green'
                      : x === end?.x && y === end?.y
                      ? 'red'
                      : path.some(point => point.x === x && point.y === y)
                      ? 'blue'
                      : 'white',
                  border: '1px solid black',
                  cursor: 'pointer'
                }}
                onClick={() => handleClick(x, y)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Grid;
