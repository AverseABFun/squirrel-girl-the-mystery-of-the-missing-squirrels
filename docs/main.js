function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
const hints = await fetch("./hints.json").then(res => res.json());

docReady(function () {
    var resultContainer = document.getElementById('qr-reader-results');
    var lastResult, countResults = 0;
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            resultContainer.innerText += decodedText;
            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
            // QR-GAME:TCOTMV=VHVuaXAtMDE=
            if (!decodedText.split(":")[0] == "QR-GAME") {
                console.log("Not a QR-GAME code");
                return;
            }
            if (!decodedText.split(":")[1].split("=")[0] == "SGTMOTMS") {
                console.log("Not a SGTMOTMS code");
                return;
            }
            try {
            const qrData = atob(decodedText.split(":")[1].split("=")[1]).split("-");
            console.log(qrData);
            const squirrel = qrData[0];
            const squirrelNumber = qrData[1];
            if (!localStorage.getItem("squirrels")) {
                localStorage.setItem("squirrels", "");
            }
            if (!localStorage.getItem("squirrelNums")) {
                localStorage.setItem("squirrelNums", "");
            }
            if (localStorage.getItem("squirrels").split(",").includes(squirrel) || localStorage.getItem("squirrelNums").split(",").includes(squirrelNumber)) {
                alert("You already found this squirrel!")
                return;
            }
            localStorage.setItem("squirrels", localStorage.getItem("squirrels")+","+squirrel);
            localStorage.setItem("squirrelNums", localStorage.getItem("squirrelNums")+","+squirrelNumber);
            if (localStorage.getItem("squirrels").startsWith(",")) {
                localStorage.setItem("squirrels", localStorage.getItem("squirrels").replace(",", ""));
            }
            if (localStorage.getItem("squirrelNums").startsWith(",")) {
                localStorage.setItem("squirrelNums", localStorage.getItem("squirrelNums").replace(",", ""));
            }
            const newEl = document.createElement("li");
            newEl.innerHTML = `<b>squirrel #${squirrelNumber}: ${squirrel}</b>`;
            document.getElementById("found-squirrels").appendChild(newEl);
            const newHint = document.createElement("li");
            newHint.innerHTML = `<b>#${parseInt(squirrelNumber)+1}: ${hints[(parseInt(squirrelNumber)+1).toString()]}</b>`
            document.getElementById("hints").appendChild(newHint);
            } catch (e) {
                console.error(e);
            }
        }
    }
    if (!localStorage.getItem("squirrels")) {
        localStorage.setItem("squirrels", "");
    }
    if (!localStorage.getItem("squirrelNums")) {
        localStorage.setItem("squirrelNums", "");
    }
    for (var i = 0; i < localStorage.getItem("squirrels").split(",").length; i++) {
        const newEl = document.createElement("li");
        newEl.innerHTML = `<b>squirrel #${localStorage.getItem("squirrelNums").split(",")[i]}: ${localStorage.getItem("squirrels").split(",")[i]}</b>`;
        document.getElementById("found-squirrels").appendChild(newEl);
        
        const newHint = document.createElement("li");
        newHint.innerHTML = `<b>#${parseInt(localStorage.getItem("squirrelNums").split(",")[i])+1}: ${hints[(parseInt(localStorage.getItem("squirrelNums").split(",")[i])+1).toString()]}</b>`
        document.getElementById("hints").appendChild(newHint);
    }
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});