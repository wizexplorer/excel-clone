for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [Cell, cellProp] = activeCell(address)
            let enteredData = Cell.innerText;

            if (enteredData == cellProp.value) return;

            cellProp.value = enteredData;
            // if cells are modifies directly(without formula bar) -
            // remove parent-child relationship (remove all parents of cell but keep its children)
            removeChildFromParent(cellProp.formula);
            // empty formula since it is no longer depended on it (including the parents in it)
            cellProp.formula = "";
            // update all children of cell
            updateChildrenCells(address);
        })
    }
}

// let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (inputFormula === "") {
        let [cell, cellProp] = activeCell(addressBar.value);
        cellProp.formula = "";
    }
    if (e.key === "Enter" && inputFormula) {
        // if formula changed -> break old parent-child relation
        let [cell, cellProp] = activeCell(addressBar.value);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        // append child in parent in graphComponentMatrix arr
        addChildToGraphComponent(inputFormula, addressBar.value);

        // check if formula is cyclic or not, only evaluate if not cyclic.
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if (cycleResponse) {
            // ("Your formula is cyclic");
            let response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            while (response) {
                // keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse); // we want to complete full iteration of color tracking, so we will attach wait here also
                response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            }

            removeChildFromGraphComponent(inputFormula);
            return;
        }

        // evaluate new formula
        let evaluatedValue = evaluateFormula(inputFormula);

        // update UI and DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, addressBar.value);

        // add new parent-child relation
        addChildToParent(inputFormula);

        // update all children cells
        updateChildrenCells(addressBar.value);
    }
})


function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = activeCell(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = activeCell(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedVal = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedVal, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = activeCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
            // cell.focus();
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = activeCell(address);
    cell.innerText = evaluatedValue; // UI update
    cellProp.value = evaluatedValue;  //DB update
    cellProp.formula = formula; // DB update
    // setTimeout bec without setTimeout, the evaluatedValue is set AFTER cell has been focused causing the evaluatedValue to shift to a new line creating y-overflow in the cell. setTimeout ensures that cell.focus runs only after the value has been changed.
    setTimeout(() => {
        cell.focus();
    }, 1);
}


function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}