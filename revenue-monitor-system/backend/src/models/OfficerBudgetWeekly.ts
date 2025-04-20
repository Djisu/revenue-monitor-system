export interface OfficerBudgetWeekly {
    officer_no: string;                     // Officer number
    officer_name: string;                   // Officer name
    no_of_clients_served: number;           // Number of clients served
    value_of_bills_distributed: number;     // Value of bills distributed
    bus_year: number;                       // Business year

    january_amount_week1?: number;         // January Week 1 Amount
    january_amount_week2?: number;         // January Week 2 Amount
    january_amount_week3?: number;         // January Week 3 Amount
    january_amount_week4?: number;         // January Week 4 Amount
    
    february_amount_week1?: number;        // February Week 1 Amount
    february_amount_week2?: number;        // February Week 2 Amount
    february_amount_week3?: number;        // February Week 3 Amount
    february_amount_week4?: number;        // February Week 4 Amount
    
    march_amount_week1?: number;           // March Week 1 Amount
    march_amount_week2?: number;           // March Week 2 Amount
    march_amount_week3?: number;           // March Week 3 Amount
    march_amount_week4?: number;           // March Week 4 Amount
    
    april_amount_week1?: number;           // April Week 1 Amount
    april_amount_week2?: number;           // April Week 2 Amount
    april_amount_week3?: number;           // April Week 3 Amount
    april_amount_week4?: number;           // April Week 4 Amount
    
    may_amount_week1?: number;             // May Week 1 Amount
    may_amount_week2?: number;             // May Week 2 Amount
    may_amount_week3?: number;             // May Week 3 Amount
    may_amount_week4?: number;             // May Week 4 Amount
    
    june_amount_week1?: number;            // June Week 1 Amount
    june_amount_week2?: number;            // June Week 2 Amount
    june_amount_week3?: number;            // June Week 3 Amount
    june_amount_week4?: number;            // June Week 4 Amount
    
    july_amount_week1?: number;            // July Week 1 Amount
    july_amount_week2?: number;            // July Week 2 Amount
    july_amount_week3?: number;            // July Week 3 Amount
    july_amount_week4?: number;            // July Week 4 Amount
    
    august_amount_week1?: number;          // August Week 1 Amount
    august_amount_week2?: number;          // August Week 2 Amount
    august_amount_week3?: number;          // August Week 3 Amount
    august_amount_week4?: number;          // August Week 4 Amount
    
    september_amount_week1?: number;       // September Week 1 Amount
    september_amount_week2?: number;       // September Week 2 Amount
    september_amount_week3?: number;       // September Week 3 Amount
    september_amount_week4?: number;       // September Week 4 Amount
    
    october_amount_week1?: number;         // October Week 1 Amount
    october_amount_week2?: number;         // October Week 2 Amount
    october_amount_week3?: number;         // October Week 3 Amount
    october_amount_week4?: number;         // October Week 4 Amount
    
    november_amount_week1?: number;        // November Week 1 Amount
    november_amount_week2?: number;        // November Week 2 Amount
    november_amount_week3?: number;        // November Week 3 Amount
    november_amount_week4?: number;        // November Week 4 Amount
    
    december_amount_week1?: number;        // December Week 1 Amount
    december_amount_week2?: number;        // December Week 2 Amount
    december_amount_week3?: number;        // December Week 3 Amount
    december_amount_week4?: number;        // December Week 4 Amount
    
    total_receipt_to_date?: number;       // Total receipt to date
    balance?: number;                      // Balance
    remarks?: string;                      // Remarks
}