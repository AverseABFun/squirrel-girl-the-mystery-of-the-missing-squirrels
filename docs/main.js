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
            if (!decodedText.split(":")[1].split("=")[0] == "TCOTMV") {
                console.log("Not a TCOTMV code");
                return;
            }
            try {
            const qrData = atob(decodedText.split(":")[1].split("=")[1]).split("-");
            console.log(qrData);
            const vegimal = qrData[0];
            const vegimalNumber = qrData[1];
            if (!localStorage.getItem("vegimals")) {
                localStorage.setItem("vegimals", "");
            }
            if (!localStorage.getItem("vegimalNums")) {
                localStorage.setItem("vegimalNums", "");
            }
            if (localStorage.getItem("vegimals").split(",").includes(vegimal) || localStorage.getItem("vegimalNums").split(",").includes(vegimalNumber)) {
                alert("You already found this Vegimal!")
                return;
            }
            localStorage.setItem("vegimals", localStorage.getItem("vegimals")+","+vegimal);
            localStorage.setItem("vegimalNums", localStorage.getItem("vegimalNums")+","+vegimalNumber);
            if (localStorage.getItem("vegimals").startsWith(",")) {
                localStorage.setItem("vegimals", localStorage.getItem("vegimals").replace(",", ""));
            }
            if (localStorage.getItem("vegimalNums").startsWith(",")) {
                localStorage.setItem("vegimalNums", localStorage.getItem("vegimalNums").replace(",", ""));
            }
            const newEl = document.createElement("li");
            newEl.innerHTML = `<b>Vegimal #${vegimalNumber}: ${vegimal}</b>`;
            document.getElementById("found-vegimals").appendChild(newEl);
            const newHint = document.createElement("li");
            newHint.innerHTML = `<b>#${parseInt(vegimalNumber)+1}: ${hints[(parseInt(vegimalNumber)+1).toString()]}</b>`
            document.getElementById("hints").appendChild(newHint);
            } catch (e) {
                console.error(e);
            }
        }
    }
    if (!localStorage.getItem("vegimals")) {
        localStorage.setItem("vegimals", "");
    }
    if (!localStorage.getItem("vegimalNums")) {
        localStorage.setItem("vegimalNums", "");
    }
    for (var i = 0; i < localStorage.getItem("vegimals").split(",").length; i++) {
        const newEl = document.createElement("li");
        newEl.innerHTML = `<b>Vegimal #${localStorage.getItem("vegimalNums").split(",")[i]}: ${localStorage.getItem("vegimals").split(",")[i]}</b>`;
        document.getElementById("found-vegimals").appendChild(newEl);
        const newHint = document.createElement("li");
        newHint.innerHTML = `<b>#${parseInt(localStorage.getItem("vegimalNums").split(",")[i])+1}: ${hints[(parseInt(localStorage.getItem("vegimalNums").split(",")[i])+1).toString()]}</b>`
        document.getElementById("hints").appendChild(newHint);
    }
    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});