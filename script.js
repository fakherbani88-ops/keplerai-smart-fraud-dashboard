
// =====================================
// KEPLERAI - SMART FRAUD DETECTION
// =====================================

// 1. Transaction chart

function drawChart() {
    const canvas = document.getElementById("transactionChart");
    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;
    const height = 230;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.scale(ratio, ratio);

    const values = [120, 180, 150, 230, 190, 280, 240];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const padding = 30;
    const max = 300;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "#edf0f5";
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
        const y = padding + i * 40;

        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Transaction line
    ctx.beginPath();
    ctx.strokeStyle = "#168bd2";
    ctx.lineWidth = 3;

    values.forEach((value, index) => {
        const x = padding + index * (width - 2 * padding) / 6;
        const y = height - padding - (value / max) * (height - 2 * padding);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Points and labels
    values.forEach((value, index) => {
        const x = padding + index * (width - 2 * padding) / 6;
        const y = height - padding - (value / max) * (height - 2 * padding);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#168bd2";
        ctx.fill();

        ctx.fillStyle = "#8793a8";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        ctx.fillText(labels[index], x, height - 5);
    });
}

drawChart();

window.addEventListener("resize", drawChart);


// 2. Fraud detection simulator

const fraudForm = document.getElementById("fraudForm");

fraudForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const oldBalance = Number(document.getElementById("oldBalance").value);
    const newBalance = Number(document.getElementById("newBalance").value);
    const category = Number(document.getElementById("category").value);

    const result = document.getElementById("result");

    if (
        !Number.isFinite(amount) ||
        !Number.isFinite(oldBalance) ||
        !Number.isFinite(newBalance) ||
        amount < 0 ||
        oldBalance < 0 ||
        newBalance < 0
    ) {
        alert("Please enter valid positive numbers.");
        return;
    }

    // Simple illustrative rules, NOT a trained AI model
    let suspicious = false;
    let reasons = [];

    if (amount > 10000) {
        suspicious = true;
        reasons.push("Unusually high transaction amount");
    }

    if (amount > oldBalance) {
        suspicious = true;
        reasons.push("Transaction exceeds the available old balance");
    }

    if (category === 1 && amount > 5000) {
        suspicious = true;
        reasons.push("High-value transfer requires verification");
    }

    if (category === 2 && amount > 5000) {
        suspicious = true;
        reasons.push("High-value cash withdrawal requires verification");
    }

    if (oldBalance - amount !== newBalance &&
        Math.abs((oldBalance - amount) - newBalance) > 1) {
        reasons.push("Balance variation does not match the transaction amount");
    }

    result.classList.remove("hidden", "safe", "fraud");

    if (suspicious) {

        result.classList.add("fraud");

        result.innerHTML = `
            <h3>⚠ Suspicious Transaction Detected!</h3>
            <p><strong>Amount:</strong> ${amount.toLocaleString()} DT</p>
            <p><strong>Status:</strong> Potential Fraud</p>
            <p><strong>Reasons:</strong></p>
            <ul>${reasons.map(reason => `<li>${reason}</li>`).join("")}</ul>
            <p>Further verification is recommended.</p>
        `;

        addTransaction(amount, "Fraud");

    } else {

        result.classList.add("safe");

        result.innerHTML = `
            <h3>✓ Transaction Appears Legitimate</h3>
            <p><strong>Amount:</strong> ${amount.toLocaleString()} DT</p>
            <p><strong>Status:</strong> No suspicious rule triggered</p>
            <p>Transaction passed the demonstration checks.</p>
        `;

        addTransaction(amount, "Legitimate");
    }

    updateStatistics();
});


// 3. Add transaction to the table

let transactionID = 4;

function addTransaction(amount, status) {

    const table = document.getElementById("transactionTable");

    const row = document.createElement("tr");

    const categorySelect = document.getElementById("category");

    const category = categorySelect.options[
        categorySelect.selectedIndex
    ].text;

    const badgeClass = status === "Fraud" ? "danger" : "success";

    row.innerHTML = `
        <td>#TR00${transactionID}</td>
        <td>${amount.toLocaleString()} DT</td>
        <td>${category}</td>
        <td><span class="badge ${badgeClass}">${status}</span></td>
    `;

    table.prepend(row);

    transactionID++;
}


// 4. Update statistics

function updateStatistics() {

    const total = document.getElementById("totalTransactions");
    const fraud = document.getElementById("fraudCount");
    const legitimate = document.getElementById("legitimateCount");
    const rate = document.getElementById("detectionRate");

    let totalValue = Number(total.textContent.replace(",", ""));
    let fraudValue = Number(fraud.textContent.replace(",", ""));
    let legitimateValue = Number(legitimate.textContent.replace(",", ""));

    totalValue++;

    const latestRow = document.getElementById("transactionTable").firstElementChild;

    if (latestRow && latestRow.textContent.includes("Fraud")) {
        fraudValue++;
    } else {
        legitimateValue++;
    }

    total.textContent = totalValue.toLocaleString();
    fraud.textContent = fraudValue.toLocaleString();
    legitimate.textContent = legitimateValue.toLocaleString();

    rate.textContent =
        ((legitimateValue / totalValue) * 100).toFixed(2) + "%";
}
