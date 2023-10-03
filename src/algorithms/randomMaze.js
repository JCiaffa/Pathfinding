export function GenerateRandomMaze(grid) {
  const allNodes = getAllNodes(grid);
  for (let i = 0; i < allNodes.length; i++) {
    const currentNode = allNodes[i];
    if (Math.floor(Math.random() * 8) <= 1) {
      if (currentNode.isStart || currentNode.isFinish) {
        continue;
      }
      currentNode.isWall = true;
    }
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
