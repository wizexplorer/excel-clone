let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})
let gridCont = document.querySelector(".grid-cont");
gridCont.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        defaultSelectedCellsUI();
        rangeStorage = [];
    }
});

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}


let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");
let rangeStorage = [];

function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        // select cells range
        if (!ctrlKey) {
            return;
        }
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI()
            rangeStorage = [];
        };

        // UI
        // cell.style.border = "thin solid #218c74";
        // box-shadow: 0 0 10px 5px rgba(188, 120, 174, 0.65);
        // cell.style.outline = "none";
        cell.style.boxShadow = "0 0 7px 5px rgb(64 59 63 / 31%)"
        cell.style.animation = "pulse 900ms linear infinite";
        cell.style.zIndex = "5";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        // console.log(rangeStorage);

    })
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        // cell.style.border = "thin solid #07070712";
        cell.style.boxShadow = "none";
        cell.style.animation = "none";
        cell.style.zIndex = "auto";
    }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    copyData = [];
    let startRow = rangeStorage[0][0];
    let startCol = rangeStorage[0][1];

    if (rangeStorage.length <= 1) {
        copyData.push([sheetDB[startRow][startCol]]);
        copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-filled/96/000000/copy.png");
        // console.log(copyData);
        return;
    }
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];

    if (startRow == endRow && startCol == endCol) {
        copyData.push([sheetDB[startRow][startCol]]);
        copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-filled/96/000000/copy.png");
        // console.log(copyData);
        return;
    }
    for (let i = startRow; i <= endRow; i++) {
        let copyRow = [];
        for (let j = startCol; j <= endCol; j++) {
            let { ...cellProp } = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    // console.log(copyData);
    copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-filled/96/000000/copy.png");
    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", (e) => {
    let startRow = rangeStorage[0][0];
    let startCol = rangeStorage[0][1];

    if (rangeStorage.length <= 1) {
        copyData.push([sheetDB[startRow][startCol]]);
        cutBtn.setAttribute("src", "https://img.icons8.com/external-febrian-hidayat-basic-outline-febrian-hidayat/96/000000/external-cut-user-interface-febrian-hidayat-basic-outline-febrian-hidayat.png");
        // console.log(copyData);
        return;
    }
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];

    if (startRow == endRow && startCol == endCol) {
        copyData.push([sheetDB[startRow][startCol]]);
        cutBtn.setAttribute("src", "https://img.icons8.com/external-febrian-hidayat-basic-outline-febrian-hidayat/96/000000/external-cut-user-interface-febrian-hidayat-basic-outline-febrian-hidayat.png");
        // console.log(copyData);
        return;
    }

    // copyBtn.click();
    // copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-regular/96/000000/copy.png");
    for (let i = startRow; i <= endRow; i++) {
        let copyRow = [];
        for (let j = startCol; j <= endCol; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            let { ...cellProp } = sheetDB[i][j];
            copyRow.push(cellProp);

            cellProp = sheetDB[i][j];

            // DB
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.alignment = "left";
            cellProp.fontFamily = "monospace";
            cellProp.fontSize = "15";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#ffffff";
            cellProp.value = "";

            // UI
            cell.click();
        }
        copyData.push(copyRow);
    }
    cutBtn.setAttribute("src", "https://img.icons8.com/external-febrian-hidayat-basic-outline-febrian-hidayat/96/000000/external-cut-user-interface-febrian-hidayat-basic-outline-febrian-hidayat.png");
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click", (e) => {
    // paste cells data
    // console.log(rangeStorage);
    if (copyData.length) {
        // target
        let address = addressBar.value;
        let [stRow, stCol] = decodeRIDCIDFromAddress(address);
        if (rangeStorage.length <= 1) {
            let cell = document.querySelector(`.cell[rid="${stRow}"][cid="${stCol}"]`);

            // DB
            let data = copyData[0][0];
            let cellProp = sheetDB[stRow][stCol];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            // UI
            cell.click();
            copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-regular/96/000000/copy.png");
            cutBtn.setAttribute("src", "https://img.icons8.com/external-compact-zufarizal-robiyanto/50/000000/external-cut-compact-ui-essential-vol2-compact-zufarizal-robiyanto.png");
            defaultSelectedCellsUI();
            return;
        }
        let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
        let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

        // if (rowDiff == colDiff == 0) {
        //     let cell = document.querySelector(`.cell[rid="${stRow}"][cid="${stCol}"]`);

        //     // DB
        //     let data = copyData[0][0];
        //     let cellProp = sheetDB[stRow][stCol];

        //     cellProp.value = data.value;
        //     cellProp.bold = data.bold;
        //     cellProp.italic = data.italic;
        //     cellProp.underline = data.underline;
        //     cellProp.fontSize = data.fontSize;
        //     cellProp.fontFamily = data.fontFamily;
        //     cellProp.fontColor = data.fontColor;
        //     cellProp.BGcolor = data.BGcolor;
        //     cellProp.alignment = data.alignment;

        //     // UI
        //     cell.click();
        //     return;
        // }

        // r -> copyData row ; c -> copyData col
        // since in copyData we stored elems based on 0-indexing
        for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
            for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
                let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
                if (!cell) continue;  // if cell doesnt exist don't throw err i.e if we paste on Z99 a data containing more than 1 cell

                // DB
                let data = copyData[r][c];
                let cellProp = sheetDB[i][j];

                cellProp.value = data.value;
                cellProp.bold = data.bold;
                cellProp.italic = data.italic;
                cellProp.underline = data.underline;
                cellProp.fontSize = data.fontSize;
                cellProp.fontFamily = data.fontFamily;
                cellProp.fontColor = data.fontColor;
                cellProp.BGcolor = data.BGcolor;
                cellProp.alignment = data.alignment;

                // UI
                cell.click();
            }

        }
        copyBtn.setAttribute("src", "https://img.icons8.com/fluency-systems-regular/96/000000/copy.png");
        cutBtn.setAttribute("src", "https://img.icons8.com/external-compact-zufarizal-robiyanto/50/000000/external-cut-compact-ui-essential-vol2-compact-zufarizal-robiyanto.png");
    }
    defaultSelectedCellsUI();
})

