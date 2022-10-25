const rows = 100;
const cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

// create col no. (1, 2, 3, 4, 5, ...)
for (let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div");
    let id = i + 1;
    addressCol.setAttribute("class", "address-col");
    addressCol.setAttribute("id", id);
    addressCol.innerText = id;
    addressColCont.appendChild(addressCol);
}

// create row no. (A, B, C, D, E, ...)
for (let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    let id = String.fromCharCode(65 + i);
    addressRow.setAttribute("class", "address-row");
    addressRow.setAttribute("id", id);
    addressRow.innerText = id;
    addressRowCont.appendChild(addressRow);
}

// create cells -->
// 1) create a large box ( [========]) in col no.
// 2) create a cell inside the large box ([]) in row no.
// eg :- col no. 1 
//            [ row no. A => []
//              row no. B => []
//              row no. C => []
//              ...
//              row no. Z => [] ]
//       add this large box to cells cont.
for (let i = 0; i < rows; i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        // attributes for cell and storage identification.
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);
        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
        addListenerForActiveRowColDisplay(cell);
    }
    cellsCont.appendChild(rowCont);
}


function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowID = i + 1;
        let colID = String.fromCharCode(65 + j);
        addressBar.value = `${colID}${rowID}`;
        if (rangeStorage.length > 1) {
            defaultSelectedCellsUI();
            // rangeStorage = [];
        }
    })
    cell.addEventListener("keydown", (e) => {
        var code = e.keyCode || e.which;
        if (code === 9) { // code === 9 checks if key was 'tab'
            if (e.shiftKey) {
                // chekc if we're on first col 
                if (j > 0) {
                    let rowID = i + 1;
                    // removing 1 to colID now we have moved to new column and are now on (j-1)th col.
                    let colID = String.fromCharCode(65 + j - 1);
                    addressBar.value = `${colID}${rowID}`;
                }
                else {
                    // removing 1 from rowID now we have moved to new row and are now on (i-1)th row.
                    let rowID = i + 1 - 1;
                    // adding 0 to colID now we have moved to new(last) col and are now on col 'Z'.
                    let colID = String.fromCharCode(65 + 25);
                    addressBar.value = `${colID}${rowID}`;
                }
            }
            else {
                // check if we're on last col
                if (j < 25) {
                    let rowID = i + 1;
                    // adding 1 to colID now we have moved to new column and are now on (j+1)th col.
                    let colID = String.fromCharCode(65 + j + 1);
                    addressBar.value = `${colID}${rowID}`;
                }
                else {
                    // adding 1 to rowID now we have moved to new row and are now on (i+1)th row.
                    let rowID = i + 1 + 1;
                    // adding 0 to colID now we have moved to new(first) col and are now on col 'A'.
                    let colID = String.fromCharCode(65 + 0);
                    addressBar.value = `${colID}${rowID}`;
                }
            }

        }
    })
}


let addressRows = document.querySelectorAll(".address-row");
let addressCols = document.querySelectorAll(".address-col");
function addListenerForActiveRowColDisplay(cell) {
    cell.addEventListener("click", (e) => {
        let [rid, cid] = decodeRIDCIDFromAddress(addressBar.value);
        let rowID = rid + 1;
        let colID = String.fromCharCode(65 + cid);
        let row = document.getElementById(rowID);
        let col = document.getElementById(colID);
        for (let i = 0; i < addressRows.length; i++) {
            addressRows[i].style.backgroundColor = "#f9f7f7";
            addressRows[i].style.color = "black";
        }
        for (let i = 0; i < addressCols.length; i++) {
            addressCols[i].style.backgroundColor = "#f9f7f7";
            addressCols[i].style.color = "black";
        }
        row.style.backgroundColor = "#238a74";
        row.style.color = "#f9f7f7";
        col.style.backgroundColor = "#238a74";
        col.style.color = "#f9f7f7";
    })

    cell.addEventListener("keydown", (e) => {
        var code = e.keyCode || e.which;
        if (code === 9) { // code === 9 checks if key was 'tab'
            let [rid, cid] = decodeRIDCIDFromAddress(addressBar.value);
            let rowID = rid + 1;
            let colID = String.fromCharCode(65 + cid);
            let row = document.getElementById(rowID);
            let col = document.getElementById(colID);
            for (let i = 0; i < addressRows.length; i++) {
                addressRows[i].style.backgroundColor = "#f9f7f7";
                addressRows[i].style.color = "black";

            }
            for (let i = 0; i < addressCols.length; i++) {
                addressCols[i].style.backgroundColor = "#f9f7f7";
                addressCols[i].style.color = "black";

            }
            row.style.backgroundColor = "#238a74";
            row.style.color = "white";
            col.style.backgroundColor = "#238a74";
            col.style.color = "white";
        }
    })
}
