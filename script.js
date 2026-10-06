const referenceData = [
    { weight: "Cobweb (1 ply)", handMg: 14.0, indMg: null },
    { weight: "Lace (2 ply)", handMg: 8.0, indMg: 14.0 },
    { weight: "Light Fingering (3 ply)", handMg: 5.0, indMg: 9.3 },
    { weight: "Fingering (4 ply)", handMg: 4.0, indMg: 7.0 },
    { weight: "Sport (5 ply)", handMg: 3.2, indMg: 4.7 },
    { weight: "DK (8 ply)", handMg: 2.2, indMg: 3.5 },
    { weight: "Worsted (10 ply)", handMg: 1.8, indMg: 1.80 },
    { weight: "Aran (10 ply)", handMg: 1.6, indMg: 1.75 },
    { weight: "Bulky / Chunky (12 ply)", handMg: 1.2, indMg: 1.2 },
    { weight: "Super Bulky (14 - 16 ply)", handMg: 0.6, indMg: null },
    { weight: "Jumbo (20+ ply)", handMg: 0.2, indMg: null }
];

document.addEventListener('DOMContentLoaded', () => {
    const weightSelect = document.getElementById('patternWeight');
    referenceData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.weight;
        option.textContent = item.weight;
        weightSelect.appendChild(option);
    });
});

document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Inputs
    const patternMeters = parseFloat(document.getElementById('patternMeters').value);
    const weightCategory = document.getElementById('patternWeight').value;
    const standardType = document.getElementById('targetStandard').value;
    
    const nmPlies = parseFloat(document.getElementById('nmPlies').value);
    const nmMeterage = parseFloat(document.getElementById('nmMeterage').value);
    const coneGrams = parseFloat(document.getElementById('coneGrams').value);
    const conePrice = parseFloat(document.getElementById('conePrice').value);

    // Look up target m/g
    const weightObj = referenceData.find(w => w.weight === weightCategory);
    let targetMg = standardType === 'industrial' ? weightObj.indMg : weightObj.handMg;
    
    // Fallback if industrial is not defined for a category
    if (!targetMg) {
        targetMg = weightObj.handMg;
        alert("Industrial standard not available for this weight. Falling back to hand-knitting standard.");
    }

    // Calculations (replicating the spreadsheet)
    const originalMg = nmMeterage / nmPlies;
    const strandsToHold = Math.ceil(originalMg / targetMg);
    const workingMg = originalMg / strandsToHold;
    
    const totalStrandMeters = patternMeters * strandsToHold;
    const totalGramsNeeded = totalStrandMeters / originalMg;
    const conesToOrder = Math.ceil(totalGramsNeeded / coneGrams);
    const totalPrice = conesToOrder * conePrice;
    const pricePer1000m = (totalPrice / patternMeters) * 1000;

    // Display Results
    document.getElementById('resStrands').textContent = strandsToHold;
    document.getElementById('resCones').textContent = conesToOrder;
    document.getElementById('resTotalCost').textContent = "€" + totalPrice.toFixed(2);
    
    document.getElementById('resTargetMg').textContent = targetMg.toFixed(2);
    document.getElementById('resOrigMg').textContent = originalMg.toFixed(2);
    document.getElementById('resWorkingMg').textContent = workingMg.toFixed(2);
    
    document.getElementById('resTotalMeters').textContent = Math.round(totalStrandMeters);
    document.getElementById('resTotalGrams').textContent = Math.round(totalGramsNeeded);
    document.getElementById('resPricePer1000').textContent = "€" + pricePer1000m.toFixed(2);

    document.getElementById('resultsCard').classList.remove('d-none');
});