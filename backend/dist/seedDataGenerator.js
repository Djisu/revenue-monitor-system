// seedDataGenerator.ts
//type PropertyClassKey = keyof typeof propertyRates;
export const generateBusinessData = (startNumber, count) => {
    const towns = ['Saltpond', 'Mankessim', 'Abandze', 'Egya1', 'Egya2', 'Yamoransa'];
    const propertyClasses = ['Residential', 'Mixed-Use', 'Industrial', 'Commercial', 'Agricultural'];
    const businessTypes = ['Hairdressing', 'Financial Institution', 'General Goods', 'Pharmacy', 'Automobile Repair', 'Bakery', 'Tailoring', 'Grocery Store', 'Fish Market', 'Barbershop'];
    const strategicLocations = ['Excellent', 'Very good', 'Good', 'Average', 'L-Average'];
    const locationValues = { Excellent: 5, 'Very good': 4, Good: 3, Average: 2, 'L-Average': 1 };
    const propertyRates = { Residential: 100, 'Mixed-Use': 500, Industrial: 300, Commercial: 200, Agricultural: 400 };
    const generateRandomName = (parts) => {
        const randomPart = () => parts[Math.floor(Math.random() * parts.length)];
        return `${randomPart()} ${randomPart()}`;
    };
    const generateRandomDate = (year) => {
        const day = Math.floor(Math.random() * 365) + 1;
        return new Date(year, 0, day);
    };
    const generateRandomAfricanName = () => {
        const firstNames = ['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Ghana'];
        const lastNames = ['Adjei', 'Asante', 'Kusi', 'Dankwa', 'Nti', 'Kwakye', 'Agyei', 'Amoah', 'Opoku', 'Boadu'];
        return `${generateRandomName(firstNames)} ${generateRandomName(lastNames)}`;
    };
    const generateRandomGPSAddress = () => {
        const generateRandomNumber = () => Math.floor(Math.random() * 10).toString();
        return `GT-${generateRandomNumber()}${generateRandomNumber()}-${generateRandomNumber()}${generateRandomNumber()}`;
    };
    const generateRandomEnumValue = (values) => {
        return values[Math.floor(Math.random() * values.length)];
    };
    const generateRandomNumberInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    // Uncomment and define the type guard function if needed
    function isPropertyClassKey(key) {
        return key in propertyRates;
    }
    const businessData = [];
    for (let i = startNumber; i < startNumber + count; i++) {
        const town = generateRandomEnumValue(towns);
        const propertyClass = generateRandomEnumValue(propertyClasses);
        // const strategicLocation = generateRandomEnumValue(strategicLocations);
        const productVariety = generateRandomNumberInRange(1, 5);
        const businessPopularity = generateRandomNumberInRange(1, 5);
        const businessEnvironment = generateRandomNumberInRange(1, 5);
        const sizeofBusiness = generateRandomNumberInRange(1, 5);
        const numberOfWorkingDays = generateRandomNumberInRange(1, 5);
        const businessOperatingPeriod = generateRandomNumberInRange(1, 5);
        const competitorsAvailable = generateRandomNumberInRange(1, 5);
        const strategicLocation = generateRandomEnumValue(strategicLocations);
        // Initialize totalMarks here
        const totalMarks = generateRandomNumberInRange(0, 100); // Example initialization, adjust range as needed
        if (strategicLocation in locationValues) {
            const totalMarks = locationValues[strategicLocation] +
                productVariety +
                businessPopularity +
                businessEnvironment +
                sizeofBusiness +
                numberOfWorkingDays +
                businessOperatingPeriod +
                competitorsAvailable;
        }
        const bussData = {
            buss_no: i,
            buss_name: `Business ${i} Co.`,
            buss_address: `P O Box ${generateRandomNumberInRange(1, 1000)}, Saltpond`,
            buss_type: generateRandomEnumValue(businessTypes),
            buss_town: town,
            street_name: `Africa ${generateRandomEnumValue(['Street', 'Avenue', 'Road', 'Lane'])}`,
            landmark: `adjacent to ${generateRandomEnumValue(['Main Market', 'Church', 'Hospital', 'School', 'Government Building'])}`,
            electroral_area: generateRandomEnumValue(towns.filter(area => area !== town)),
            property_class: propertyClass,
            tot_grade: 'Grade 1',
            ceo: generateRandomAfricanName(),
            telno: `+2335${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}`,
            strategiclocation: locationValues[strategicLocation],
            productvariety: productVariety,
            businesspopularity: businessPopularity,
            businessenvironment: businessEnvironment,
            sizeofbusiness: sizeofBusiness,
            numberofworkingdays: numberOfWorkingDays,
            businessoperatingperiod: businessOperatingPeriod,
            competitorsavailable: competitorsAvailable,
            assessmentby: generateRandomAfricanName(),
            transdate: generateRandomDate(2025),
            balance: 0,
            status: 'Active',
            current_rate: generateRandomNumberInRange(1, 299),
            property_rate: propertyRates[propertyClass] || 100,
            totalmarks: totalMarks,
            emailaddress: `business${i}@example.com`,
            noofemployees: generateRandomNumberInRange(1, 4),
            noofbranches: generateRandomNumberInRange(1, 4),
            BALANCENEW: 0,
            gps_address: generateRandomGPSAddress()
        };
        businessData.push(bussData);
    }
    // Uncomment and define the type guard function if needed
    // Ensure you have the necessary types and functions defined
    // type PropertyClassKey = 'Residential' | 'Commercial' | 'Industrial'; // Example keys, adjust as needed
    // const propertyRates: { [key in PropertyClassKey]: number } = {
    //     Residential: 100,
    //     Commercial: 200,
    //     Industrial: 300
    // }; // Example property rates, adjust as needed
    // function generateRandomAfricanName(): string {
    //     // Example implementation, adjust as needed
    //     const names = ['Akwasi', 'Chika', 'Ziva', 'Kwame', 'Yasmin'];
    //     return generateRandomEnumValue(names);
    // }
    // function generateRandomDate(year: number): string {
    //     // Example implementation, adjust as needed
    //     const month = generateRandomNumberInRange(1, 12);
    //     const day = generateRandomNumberInRange(1, 30);
    //     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    // }
    // function generateRandomGPSAddress(): string {
    //     // Example implementation, adjust as needed
    //     const latitude = generateRandomNumberInRange(-90, 90);
    //     const longitude = generateRandomNumberInRange(-180, 180);
    //     return `${latitude},${longitude}`;
    // }
    return businessData;
};
//# sourceMappingURL=seedDataGenerator.js.map