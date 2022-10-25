// for delay and wait
function colorPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}


async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    let [srcRow, srcCol] = cycleResponse;
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

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         if (!visited[i][j]) {
    //             let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
    //             if (response) return true;
    //         }
    //     }
    // }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited);
    if (response) return Promise.resolve(true);
    return Promise.resolve(false);
}


// coloring cells for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited) {
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;
    let cell = document.querySelector(`.cell[rid="${srcRow}"][cid="${srcCol}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise();


    for (let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++) {
        let [childRid, childCid] = graphComponentMatrix[srcRow][srcCol][children];
        if (!visited[childRid][childCid]) {
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix, childRid, childCid, visited, dfsVisited);
            if (response) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        }
        else if (dfsVisited[childRid][childCid]) {
            let cyclicCell = document.querySelector(`.cell[rid="${childRid}"][cid="${childCid}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);
        }
    }

    dfsVisited[srcRow][srcCol] = false;
    return Promise.resolve(false);
}