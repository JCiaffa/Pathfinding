export function boardInit(grid, startNode, finishNode) {
  startNode.weight = 0;
  finishNode.weight = 0;
  const allNodes = getAllNodes(grid);
  return allNodes;
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
