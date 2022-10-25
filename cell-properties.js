let cells = document.querySelectorAll(".cell")
let formulaBar = document.querySelector(".formula-bar");

// storage
let collectedSheetDB = [];       // contains all sheet DB
let sheetDB = [];

addSheetBtn.click();

// // we can get access of variable "rows" becasue in index.html this file is BELOW grid.js in which this variable was declared. You can access variables in files above current file.
// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < cols; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "15",
//             fontColor: "#000000",
//             BGcolor: "#ffffff",
//             value: "",
//             formula: "",
//             children: []
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }


// selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


let activeColorProp = "#e4e0e0";
let inactiveColorProp = "#f9f7f7";

let removeFormat = document.querySelector(".remove-format");
// we already have access to address bar from grid.js
// let addressBar = document.querySelector(".address-bar");

// Application of two-way binding --
// attach propertiy listeners
bold.addEventListener("click", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // modification
    cellProp.bold = !cellProp.bold;  // data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI change (1)
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // UI change (2)
    cell.focus();
})

italic.addEventListener("click", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // modification
    cellProp.italic = !cellProp.italic;  // data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI change (1)
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // UI change (2)
    cell.focus();
})

underline.addEventListener("click", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // modification
    cellProp.underline = !cellProp.underline;  // data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI change (1)
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; // UI change (2)
    cell.focus();
})

fontSize.addEventListener("change", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // modification
    if (fontSize.value == "--") {
        cellProp.fontSize = "16";  // data change
        cell.style.fontSize = cellProp.fontSize + "px"; // UI change (1)
        fontSize.value = cellProp.fontSize; // UI change (2)
    }
    cellProp.fontSize = fontSize.value;  // data change
    cell.style.fontSize = cellProp.fontSize + "px"; // UI change (1)
    fontSize.value = cellProp.fontSize; // UI change (2)
    cell.focus();
})
fontFamily.addEventListener("change", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // modification
    cellProp.fontFamily = fontFamily.value;  // data change
    cell.style.fontFamily = cellProp.fontFamily; // UI change (1)
    fontFamily.value = cellProp.fontFamily; // UI change (2)
    cell.focus();
})
fontColor.addEventListener("change", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    cellProp.fontColor = fontColor.value; // data change
    cell.style.color = cellProp.fontColor; // UI change (1)
    fontColor.value = cellProp.fontColor; // UI change (2)
    cell.focus();
})
BGcolor.addEventListener("change", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    cellProp.BGcolor = BGcolor.value; // data change
    cell.style.backgroundColor = cellProp.BGcolor; // UI change (1)
    BGcolor.value = cellProp.BGcolor; // UI change (2)
    cell.focus();
})
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let [cell, cellProp] = activeCell(addressBar.value);
        let alignValue = e.target.classList[1];
        cellProp.alignment = alignValue; // data change
        cell.style.textAlign = cellProp.alignment; // UI change (1)
        switch (alignValue) {  // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeColorProp
                centerAlign.style.backgroundColor = inactiveColorProp
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp
                centerAlign.style.backgroundColor = activeColorProp
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp
                centerAlign.style.backgroundColor = inactiveColorProp
                rightAlign.style.backgroundColor = activeColorProp
                break;
        }
        cell.focus();
    })
})


// to remove the background from icons when other cell is clicked
let prevCell = [];
cells.forEach((cell) => {
    // when other cells are focused by clicking.
    cell.addEventListener("click", () => {
        keepCellPropInSync(addressBar.value);
    })
    // when other cells are focused by pressing tab.
    cell.addEventListener("keyup", (e) => {
        let code = e.keyCode || e.which;
        if (code === 9) {
            keepCellPropInSync(addressBar.value);

            if (prevCell.length) {
                let [address, Cell, cellProp] = prevCell[0];
                let enteredData = Cell.innerText;
                // console.log(address);
                // console.log(enteredData);
                if (enteredData == cellProp.value) return;

                cellProp.value = enteredData;
                removeChildFromParent(cellProp.formula);
                cellProp.formula = "";
                updateChildrenCells(address);
            }
        } else {
            let address = addressBar.value;
            let [Cell, cellProp] = activeCell(address)
            prevCell.pop();
            prevCell.push([address, Cell, cellProp]);

        }
    })
})

// to remove all formatting on the cell
removeFormat.addEventListener("click", () => {
    let [cell, cellProp] = activeCell(addressBar.value);
    // let Value = cellProp.value;
    // let Formula = cellProp.formula;
    // let Children = cellProp.children;
    // DB change
    cellProp.bold = false;
    cellProp.italic = false;
    cellProp.underline = false;
    cellProp.alignment = "left";
    cellProp.fontFamily = "monospace";
    cellProp.fontSize = "15";
    cellProp.fontColor = "#000000";
    cellProp.BGcolor = "#ffffff";
    // cellProp.value = Value;
    // cellProp.formula = Formula;
    // cellProp.children = Children;
    
    // change in UI (1)
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;
    formulaBar.value = cellProp.formula;

    // change in UI (2)
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
    switch (cellProp.alignment) {
        case "left":
            leftAlign.style.backgroundColor = activeColorProp
            centerAlign.style.backgroundColor = inactiveColorProp
            rightAlign.style.backgroundColor = inactiveColorProp
            break;
        case "center":
            leftAlign.style.backgroundColor = inactiveColorProp
            centerAlign.style.backgroundColor = activeColorProp
            rightAlign.style.backgroundColor = inactiveColorProp
            break;
        case "right":
            leftAlign.style.backgroundColor = inactiveColorProp
            centerAlign.style.backgroundColor = inactiveColorProp
            rightAlign.style.backgroundColor = activeColorProp
            break;
    }
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    cell.focus();
})

function activeCell(address) {  //activeCell = getCellAndCellProp
    // console.log(address);
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    // access cell & storage obj
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    // address -> "A1"
    let rid = Number(address.slice(1) - 1); // "1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65
    return [rid, cid];
}

function keepCellPropInSync(address) {
    let [cell, cellProp] = activeCell(address);
    // UI change(1)
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;
    formulaBar.value = cellProp.formula;

    // UI change (2)
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    switch (cellProp.alignment) {
        case "left":
            leftAlign.style.backgroundColor = activeColorProp
            centerAlign.style.backgroundColor = inactiveColorProp
            rightAlign.style.backgroundColor = inactiveColorProp
            break;
        case "center":
            leftAlign.style.backgroundColor = inactiveColorProp
            centerAlign.style.backgroundColor = activeColorProp
            rightAlign.style.backgroundColor = inactiveColorProp
            break;
        case "right":
            leftAlign.style.backgroundColor = inactiveColorProp
            centerAlign.style.backgroundColor = inactiveColorProp
            rightAlign.style.backgroundColor = activeColorProp
            break;
    }
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
}