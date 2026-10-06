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
    const selectMeters = document.getElementById('patternWeightMeters');
    const selectGrams = document.getElementById('patternWeightGrams');

    referenceData.forEach(item => {
        const opt1 = document.createElement('option');
        opt1.value = item.weight;
        opt1.textContent = item.weight;
        selectMeters.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = item.weight;
        opt2.textContent = item.weight;
        selectGrams.appendChild(opt2);
    });

    // Default selection
    selectMeters.value = "DK (8 ply)";
    selectGrams.value = "DK (8 ply)";

    // Toggle Input Methods
    const radioMeters = document.getElementById('methodMeters');
    const radioGrams = document.getElementById('methodGrams');
    const metersContainer = document.getElementById('metersInputContainer');
    const gramsContainer = document.getElementById('gramsInputContainer');
    const patternMetersInput = document.getElementById('patternMeters');

    function updateMethodVisibility() {
        if (radioMeters.checked) {
            metersContainer.classList.remove('d-none');
            gramsContainer.classList.add('d-none');
            patternMetersInput.setAttribute('required', 'required');
        } else {
            metersContainer.classList.add('d-none');
            gramsContainer.classList.remove('d-none');
            patternMetersInput.removeAttribute('required');
        }
    }

    radioMeters.addEventListener('change', updateMethodVisibility);
    radioGrams.addEventListener('change', updateMethodVisibility);

    // Dynamic g -> m calculator listener
    const patternGramsInput = document.getElementById('patternGrams');
    const refGramsInput = document.getElementById('refGrams');
    const refMetersInput = document.getElementById('refMeters');
    const calcMetersOutput = document.getElementById('calcMetersOutput');

    function calculateGramsToMeters() {
        const pGrams = parseFloat(patternGramsInput.value) || 0;
        const rGrams = parseFloat(refGramsInput.value) || 0;
        const rMeters = parseFloat(refMetersInput.value) || 0;

        if (pGrams > 0 && rGrams > 0 && rMeters > 0) {
            const calculatedMeters = pGrams * (rMeters / rGrams);
            calcMetersOutput.value = Math.round(calculatedMeters) + " m";
            return calculatedMeters;
        } else {
            calcMetersOutput.value = "0 m";
            return 0;
        }
    }

    patternGramsInput.addEventListener('input', calculateGramsToMeters);
    refGramsInput.addEventListener('input', calculateGramsToMeters);
    refMetersInput.addEventListener('input', calculateGramsToMeters);
});

document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const isGramsMode = document.getElementById('methodGrams').checked;
    let patternMeters = 0;
    let weightCategory = "";

    if (isGramsMode) {
        const pGrams = parseFloat(document.getElementById('patternGrams').value) || 0;
        const rGrams = parseFloat(document.getElementById('refGrams').value) || 0;
        const rMeters = parseFloat(document.getElementById('refMeters').value) || 0;

        if (!pGrams || !rGrams || !rMeters) {
            alert("Please fill in all Gram-to-Meter conversion fields (Pattern Grams, Reference Grams, and Reference Meters).");
            return;
        }

        patternMeters = pGrams * (rMeters / rGrams);
        weightCategory = document.getElementById('patternWeightGrams').value;
    } else {
        patternMeters = parseFloat(document.getElementById('patternMeters').value);
        weightCategory = document.getElementById('patternWeightMeters').value;
    }

    const standardType = document.getElementById('targetStandard').value;
    const nmPlies = parseFloat(document.getElementById('nmPlies').value);
    const nmMeterage = parseFloat(document.getElementById('nmMeterage').value);
    const coneGrams = parseFloat(document.getElementById('coneGrams').value);
    const conePriceInput = document.getElementById('conePrice').value.trim();
    const conePrice = conePriceInput !== "" ? parseFloat(conePriceInput) : null;

    // Look up target m/g
    const weightObj = referenceData.find(w => w.weight === weightCategory);
    let targetMg = standardType === 'industrial' ? weightObj.indMg : weightObj.handMg;
    
    if (!targetMg) {
        targetMg = weightObj.handMg;
        alert("Industrial standard not available for this weight. Falling back to hand-knitting standard.");
    }

    // Calculations
    const originalMg = nmMeterage / nmPlies;
    const strandsToHold = Math.ceil(originalMg / targetMg);
    const workingMg = originalMg / strandsToHold;
    
    const totalStrandMeters = patternMeters * strandsToHold;
    const totalGramsNeeded = totalStrandMeters / originalMg;
    const conesToOrder = Math.ceil(totalGramsNeeded / coneGrams);

    const hasPrice = conePrice !== null && !isNaN(conePrice);
    const totalPrice = hasPrice ? conesToOrder * conePrice : null;
    const pricePer1000m = hasPrice ? (totalPrice / patternMeters) * 1000 : null;

    // Display Results
    document.getElementById('resStrands').textContent = strandsToHold;
    document.getElementById('resCones').textContent = conesToOrder;
    document.getElementById('resTotalCost').textContent = hasPrice ? "€" + totalPrice.toFixed(2) : "N/A";
    
    document.getElementById('resPatternRequirement').textContent = isGramsMode 
        ? `${document.getElementById('patternGrams').value}g Reference Yarn (➜ ${Math.round(patternMeters)} meters)`
        : `${patternMeters} meters`;

    document.getElementById('resTargetMg').textContent = targetMg.toFixed(2);
    document.getElementById('resOrigMg').textContent = originalMg.toFixed(2);
    document.getElementById('resWorkingMg').textContent = workingMg.toFixed(2);
    
    document.getElementById('resTotalMeters').textContent = Math.round(totalStrandMeters);
    document.getElementById('resTotalGrams').textContent = Math.round(totalGramsNeeded);
    document.getElementById('resPricePer1000').textContent = hasPrice ? "€" + pricePer1000m.toFixed(2) : "N/A";

    document.getElementById('resultsCard').classList.remove('d-none');
});