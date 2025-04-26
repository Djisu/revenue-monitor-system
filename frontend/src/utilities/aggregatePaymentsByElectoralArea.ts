


interface BusPaymentsData {
    electroral_area: string; // Ensure this is correct
    paidamount: string;   // Change this to string if values are stored as strings
}

const aggregatePaymentsByElectoralArea = (data: BusPaymentsData[]): { [key: string]: number } => {
    const result: { [key: string]: number } = {};

    data.forEach((payment) => {
        const area = payment.electroral_area;
        const amount = Number(payment.paidamount); // Convert string to number

        console.log('Processing payment:', { area, amount }); // Log each payment

        if (area) {
            if (!result[area]) {
                result[area] = 0;
            }
            if (!isNaN(amount)) {
                result[area] += amount; // Only add valid numbers
            } else {
                console.warn('Invalid payment value for area:', area, amount);
            }
        } else {
            console.warn('Undefined electoral area for payment:', payment);
        }
    });

    return result;
};

export default aggregatePaymentsByElectoralArea;