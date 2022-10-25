let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

// download
downloadBtn.addEventListener("click", (e) => {
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})

// upload
uploadBtn.addEventListener("click", (e) => {
    // opens file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fr = new FileReader();
        let fileObj = input.files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e) => {
            let sheetData = JSON.parse(fr.result);

            // basic sheet with default data will be created
            addSheetBtn.click();

            // sheetDB, graphComponent
            sheetDB = sheetData[0];
            graphComponentMatrix = sheetData[1];

            // override default data
            collectedSheetDB[collectedSheetDB.length-1] = sheetDB
            collectedGraphComponent[collectedGraphComponent.length-1] = graphComponentMatrix;

            // UI (AFTER the data has been changed)
            handleSheetProperties();
        })
    })
})






