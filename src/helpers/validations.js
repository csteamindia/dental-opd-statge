export const validateBodyTemperature = (temp) => {
    if (temp === null || temp === undefined || temp === '') return "Temperature is required";
    if (isNaN(temp)) return "Temperature must be a number";
    if (temp < 30 || temp > 45) return "Temperature must be between 30°C and 45°C";
    return "Valid";
}

export const validateBloodSugar = (value, type = 'fasting') => {
    if (value === null || value === '') {
        return "Blood sugar is required";
    }

    if (isNaN(value)) {
        return "Blood sugar must be a number";
    }

    value = Number(value);

    if (value < 30 || value > 600) {
        // Reject unrealistic values
        return "Blood sugar must be between 30 and 600 mg/dL";
    }

    // Optional: check ranges based on type
    if (type === 'fasting' && (value < 70 || value > 125)) {
        return "Fasting blood sugar is usually 70–125 mg/dL";
    }

    if (type === 'postprandial' && (value < 70 || value > 199)) {
        return "Post-meal blood sugar is usually 70–199 mg/dL";
    }

    return "Valid";
}
