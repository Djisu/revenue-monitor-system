var aggregatePaymentsByElectoralArea = function (data) {
    var result = {};
    data.forEach(function (payment) {
        var area = payment.electroral_area;
        var amount = Number(payment.paidamount); // Convert string to number
        console.log('Processing payment:', { area: area, amount: amount }); // Log each payment
        if (area) {
            if (!result[area]) {
                result[area] = 0;
            }
            if (!isNaN(amount)) {
                result[area] += amount; // Only add valid numbers
            }
            else {
                console.warn('Invalid payment value for area:', area, amount);
            }
        }
        else {
            console.warn('Undefined electoral area for payment:', payment);
        }
    });
    return result;
};
export default aggregatePaymentsByElectoralArea;
