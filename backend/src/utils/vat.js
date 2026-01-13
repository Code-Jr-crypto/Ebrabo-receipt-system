exports.calculateVAT = (exclusive) => {
    const vat = exclusive * 0.18;
    const total = exclusive + vat;
    return {
        vat: vat.toFixed(2),
        total: total.toFixed(2)
    };
};
