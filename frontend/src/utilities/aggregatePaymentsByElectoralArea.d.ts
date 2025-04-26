interface BusPaymentsData {
    electroral_area: string;
    paidamount: string;
}
declare const aggregatePaymentsByElectoralArea: (data: BusPaymentsData[]) => {
    [key: string]: number;
};
export default aggregatePaymentsByElectoralArea;
