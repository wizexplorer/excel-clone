let collectedGraphComponent = [];
// Storage  -> 2D matrix
let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//     let row = [];
//     for (let j = 0; j < cols; j++) {
//         // why array & not obj?? bec there can be more than 1 child of a cell
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }


// returns bool val if graph is cyclic or not
function isGraphCyclic(graphComponentMatrix) {
    // dependency -> visited, dfsVisited (2d array)
    let visited = [];    // Node visit trace
    let dfsVisited = []; // Stack visit trace

    for (let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (response) return [i, j];
            }
        }
    }

    return null;
}

// start -> visited(True) dfsVisited(True)
// end -> dfsVisited(False)
// Cycle condition -> if (visited[i][j] == true && dfsVisited[i][j] == true)
function dfsCycleDetection(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    // A1 -> [ [0,1], [1,0], [5,10], ... ]
    for (let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++) {
        let [childRid, childCid] = graphComponentMatrix[srcRow][srcCol][children];
        if (!visited[childRid][childCid]) {
            let response = dfsCycleDetection(graphComponentMatrix, childRid, childCid, visited, dfsVisited);
            if (response) return true;  // is cycle is found, return immediately, no need to explore more
        }
        // else if (visited[childRid][childCid] && dfsVisited[childRid][childCid])  not using this condition because, from our first condition, else if block will only run if visited[childRid][childCid] is NOT FALSE i.e. TRUE so no need to check that condition
        else if (dfsVisited[childRid][childCid]) {
            return true;
        }
    }

    dfsVisited[srcRow][srcCol] = false;
    return false;
}