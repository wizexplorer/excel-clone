let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
const activeSheetBGColor = "#e9e9e9";
// const activeSheetTextColor = "-webkit-linear-gradient(0deg, #fd0303 0%, #001aff 99%);";

let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click", () => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetsFolder.length);

    sheet.innerHTML = `
    <div class="sheet-cont">Sheet ${allSheetsFolder.length + 1}</div>
    `
    sheetsFolderCont.appendChild(sheet);
sheet.scrollIntoView();

    //  DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetDBRemoval(sheet);
    sheet.click();
})

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx]
}

function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetsFolder.length; i++) {
        allSheetsFolder[i].style.backgroundColor = "transparent";
        let sheetCont = allSheetsFolder[i].querySelector(".sheet-cont");
        // sheetCont.style.webkitTextFillColor = "black";
        allSheetsFolder[i].style.textDecoration = "underline 2px black";
        allSheetsFolder[i].style.color = "black";
    }
    let sheetCont = sheet.querySelector(".sheet-cont");
    sheet.style.backgroundColor = activeSheetBGColor;
    // sheetCont.style.webkitTextFillColor = "transparent";
    sheet.style.textDecoration = "underline 5px #FF9F29";
    sheet.style.color = "#1A4D2E";

}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", () => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

function handleSheetDBRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // e.button // 0 -> left  1 -> middle 2 -> right
        if (e.button !== 2) return;
        let allSheetsFolder = document.querySelectorAll(".sheet-folder");
        if (allSheetsFolder.length === 1) {
            alert("You need to have at least one sheet !!");
            return;
        }
        let response = confirm("Your sheet will be removed permanentaly. Are you sure?");
        if (!response) return;
        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB removal
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // UI
        // sheet.remove();
        handleSheetUIRemoval(sheet, sheetIdx);
        //  by default bring previous sheet DB to active
        // sheetDB = collectedSheetDB[sheetIdx - 1];
        // graphComponentMatrix = collectedGraphComponent[sheetIdx - 1];
        // let lastSheet = allSheetsFolder[sheetIdx - 1];
        // lastSheet.click();
    })
}

function handleSheetUIRemoval(sheet, sheetIdx) {
    // UI
    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetsFolder.length; i++) {
        allSheetsFolder[i].setAttribute("id", i);
        let sheetContent = allSheetsFolder[i].querySelector(".sheet-cont");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetsFolder[i].style.backgroundColor = "transparent";
        let sheetCont = allSheetsFolder[i].querySelector(".sheet-cont");
        sheetCont.style.webkitTextFillColor = "black";
    }
    let lastSheet = allSheetsFolder[sheetIdx - 1];
    lastSheet.click();
    sheet.remove();
}

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "15",
                fontColor: "#000000",
                BGcolor: "#ffffff",
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // why array & not obj?? bec there can be more than 1 child of a cell
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}