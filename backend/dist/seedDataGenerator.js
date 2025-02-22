export const generateBusinessData = (startNumber, count) => {
    const towns = ['Saltpond', 'Mankessim', 'Abandze', 'Egya1', 'Egya2', 'Yamoransa'];
    const propertyClasses = ['Residential', 'Mixed-Use', 'Industrial', 'Commercial', 'Agricultural'];
    const businessTypes = ['Hairdressing', 'Financial Institution', 'General Goods', 'Pharmacy', 'Automobile Repair', 'Bakery', 'Tailoring', 'Grocery Store', 'Fish Market', 'Barbershop'];
    const strategicLocations = ['Excellent', 'Very good', 'Good', 'Average', 'L-Average'];
    const locationValues = { Excellent: 5, 'Very good': 4, Good: 3, Average: 2, 'L-Average': 1 };
    const propertyRates = { Residential: 100, 'Mixed-Use': 500, Industrial: 300, Commercial: 200, Agricultural: 400 };
    const generateRandomName = (parts) => {
        return parts[Math.floor(Math.random() * parts.length)];
    };
    const generateRandomDate = (year) => {
        const day = Math.floor(Math.random() * 365) + 1;
        return new Date(year, 0, day);
    };
    const generateRandomAfricanName = () => {
        const firstNames = ['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Mintah'];
        const lastNames = ['Adjei', 'Asante', 'Kusi', 'Dankwa', 'Nti', 'Kwakye', 'Agyei', 'Amoah', 'Opoku', 'Boadu'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    };
    const generateRandomGPSAddress = () => {
        const generateRandomNumber = () => Math.floor(Math.random() * 10).toString();
        return `GT-${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}-${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}`;
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
        const productVariety = generateRandomNumberInRange(1, 5);
        const businessPopularity = generateRandomNumberInRange(1, 5);
        const businessEnvironment = generateRandomNumberInRange(1, 5);
        const sizeofBusiness = generateRandomNumberInRange(1, 5);
        const numberOfWorkingDays = generateRandomNumberInRange(1, 5);
        const businessOperatingPeriod = generateRandomNumberInRange(1, 5);
        const competitorsAvailable = generateRandomNumberInRange(1, 5);
        const strategicLocation = generateRandomNumberInRange(1, 5);
        const totalmarks = (productVariety + businessPopularity +
            businessEnvironment + sizeofBusiness + numberOfWorkingDays +
            businessOperatingPeriod + competitorsAvailable + strategicLocation);
        const bussData = {
            buss_no: i,
            buss_name: `${generateRandomEnumValue(['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Ghana'])}'s ${generateRandomEnumValue(['Shop', 'Market', 'Institution', 'Company', 'Enterprise', 'Venture', 'Centre', 'Boutique', 'Mall', 'Factory', 'Agency', 'Association', 'Society', 'Club', 'Syndicate', 'Group', 'Network', 'Union'])}`,
            buss_address: `P O Box ${generateRandomNumberInRange(1, 1000)}, ${town}`,
            buss_type: generateRandomEnumValue(businessTypes),
            buss_town: town,
            street_name: `Africa ${generateRandomEnumValue(['Street', 'Avenue', 'Road', 'Lane', 'Cresent', 'Place', 'Park'])}`,
            landmark: `adjacent to ${generateRandomEnumValue(['Main Market', 'Church', 'Hospital', 'School', 'Government Building', 'Close to School'])}`,
            electroral_area: generateRandomEnumValue(towns.filter(area => area !== town)),
            property_class: propertyClass,
            ceo: generateRandomAfricanName(),
            telno: `+2335${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}`,
            strategiclocation: strategicLocation,
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
            current_rate: generateRandomNumberInRange(100, 500),
            property_rate: propertyRates[propertyClass] || 100,
            totalmarks: (productVariety + businessPopularity +
                businessEnvironment + sizeofBusiness + numberOfWorkingDays +
                businessOperatingPeriod + competitorsAvailable + strategicLocation),
            tot_grade: findTotalGrade(totalmarks),
            emailaddress: `business${i}@example.com`,
            noofemployees: generateRandomNumberInRange(1, 4),
            noofbranches: generateRandomNumberInRange(1, 4),
            BALANCENEW: 0,
            gps_address: generateRandomGPSAddress()
        };
        bussData.totalmarks = calculateTotalMarks(bussData);
        businessData.push(bussData);
    }
    return businessData;
};
function findTotalGrade(totalmarks) {
    if (totalmarks >= 40) {
        return 'Cat A';
    }
    else if (totalmarks >= 32) {
        return 'Cat B';
    }
    else if (totalmarks >= 24) {
        return 'Cat C';
    }
    else if (totalmarks >= 16) {
        return 'Cat D';
    }
    else {
        return 'Cat E';
    }
}
// Function to convert strategic location to marks
function getStrategicLocationMarks(location) {
    const marksMap = {
        'Excellent': 5,
        'Very good': 4,
        'Good': 3,
        'Average': 2,
        'L-Average': 1
    };
    return marksMap[location] || 0;
}
// Function to get marks for a given rating (1 to 5)
function getRatingMarks(rating) {
    return rating || 0;
}
// Define locationValues here or import from another module
const locationValues = {
    'location1': 1,
    'location2': 2,
    // other locations with number values
};
// Function to calculate total marks
// Function to calculate total marks
function calculateTotalMarks(data) {
    if (!data.hasOwnProperty('buss_no')) {
        throw new Error('Missing required property: buss_no');
    }
    let totalMarks = 0;
    // Convert strategic location string to marks
    const isLocationKey = (key) => {
        return key in locationValues;
    };
    // const strategicLocationKey = Object.keys(locationValues)
    // .filter(isLocationKey)
    // .find(key => locationValues[key] === data.strategiclocation);
    totalMarks += getRatingMarks(data.strategiclocation ?? 0);
    totalMarks += getRatingMarks(data.productvariety ?? 0);
    totalMarks += getRatingMarks(data.businesspopularity ?? 0);
    totalMarks += getRatingMarks(data.businessenvironment ?? 0);
    totalMarks += getRatingMarks(data.sizeofbusiness ?? 0);
    totalMarks += getRatingMarks(data.numberofworkingdays ?? 0);
    totalMarks += getRatingMarks(data.businessoperatingperiod ?? 0);
    totalMarks += getRatingMarks(data.competitorsavailable ?? 0);
    return totalMarks;
}
// // Function to convert transaction date to MySQL date format
// function convertToMySQLDate(dateStr: Date): string {
//     return dateStr.toISOString().split('T')[0];
// }
// // Example data
// const exampleData = {
//     strategiclocation: 'Excellent',
//     productvariety: 5,
//     businesspopularity: 5,
//     businessenvironment: 5,
//     sizeofbusiness: 5,
//     numberofworkingdays: 5,
//     businessoperatingperiod: 5,
//     competitorsavailable: 5,
//     assessmentby: 'John Doe',
//     transdate: new Date('2025-12-25'),
//     balance: 0,
//     status: 'Active',
//     current_rate: 150,
//     property_rate: 500,
//     buss_no: 12345, // Add this line
// };
// // Calculate total marks
// const totalMarks = calculateTotalMarks(exampleData);
// // Convert transaction date to MySQL format
// const mysqlDate = convertToMySQLDate(exampleData.transdate);
// console.log('Total Marks:', totalMarks);
// console.log('Transaction Date in MySQL format:', mysqlDate);
// // // seedDataGenerator.ts
// // import fs from 'fs';
// // export interface BusinessData {
// //     buss_no: number;
// //     buss_name?: string;
// //     buss_address?: string;
// //     buss_type?: string;
// //     buss_town?: string;
// //     street_name?: string;
// //     landmark?: string;
// //     electroral_area?: string;
// //     property_class?: string;
// //     tot_grade?: string;
// //     ceo?: string;
// //     telno?: string;
// //     strategiclocation?: number;
// //     productvariety?: number;
// //     businesspopularity?: number;
// //     businessenvironment?: number;
// //     sizeofbusiness?: number;
// //     numberofworkingdays?: number;
// //     businessoperatingperiod?: number;
// //     competitorsavailable?: number;
// //     assessmentby?: string;
// //     transdate?: Date;
// //     balance?: number;
// //     status?: string;
// //     current_rate?: number;
// //     property_rate?: number;
// //     totalmarks?: number;
// //     emailaddress?: string; 
// //     noofemployees?: number;
// //     noofbranches?: number;
// //     BALANCENEW?: number;
// //     gps_address?: string; 
// // }
// // export const generateBusinessData = (startNumber: number, count: number): BusinessData[] => {
// //     const towns = ['Saltpond', 'Mankessim', 'Abandze', 'Egya1', 'Egya2', 'Yamoransa'];
// //     const propertyClasses = ['Residential', 'Mixed-Use', 'Industrial', 'Commercial', 'Agricultural'];
// //     const businessTypes = ['Hairdressing', 'Financial Institution', 'General Goods', 'Pharmacy', 'Automobile Repair', 'Bakery', 'Tailoring', 'Grocery Store', 'Fish Market', 'Barbershop'];
// //     const strategicLocations = ['Excellent', 'Very good', 'Good', 'Average', 'L-Average'];
// //     const locationValues = { Excellent: 5, 'Very good': 4, Good: 3, Average: 2, 'L-Average': 1 };
// //     const propertyRates = { Residential: 100, 'Mixed-Use': 500, Industrial: 300, Commercial: 200, Agricultural: 400 };
// //     // const generateRandomName = (parts: string[]): string => {
// //     //     const randomPart = () => parts[Math.floor(Math.random() * parts.length)];
// //     //     return `${randomPart()} ${randomPart()}`;
// //     // };
// //     const generateRandomName = (parts: string[]): string => {
// //         return parts[Math.floor(Math.random() * parts.length)];
// //     };
// //     const generateRandomDate = (year: number): Date => {
// //         const day = Math.floor(Math.random() * 365) + 1;
// //         return new Date(year, 0, day);
// //     };
// //     const generateRandomAfricanName = (): string => {
// //         const firstNames = ['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Ghana'];
// //         const lastNames = ['Adjei', 'Asante', 'Kusi', 'Dankwa', 'Nti', 'Kwakye', 'Agyei', 'Amoah', 'Opoku', 'Boadu'];
// //         return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
// //     };
// //     const generateRandomGPSAddress = (): string => {
// //         const generateRandomNumber = () => Math.floor(Math.random() * 10).toString();
// //         return `GT-${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}-${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}`;
// //     };
// //     const generateRandomEnumValue = (values: string[]): string => {
// //         return values[Math.floor(Math.random() * values.length)];
// //     };
// //     const generateRandomNumberInRange = (min: number, max: number): number => {
// //         return Math.floor(Math.random() * (max - min + 1)) + min;
// //     };
// //     type PropertyClassKey = 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural'; // Example keys, adjust as needed
// //     // Uncomment and define the type guard function if needed
// //     function isPropertyClassKey(key: string): key is PropertyClassKey {
// //         return key in propertyRates;
// //     }
// //     const businessData: BusinessData[] = [];
// //     for (let i = startNumber; i < startNumber + count; i++) {
// //         const town = generateRandomEnumValue(towns);
// //         const propertyClass = generateRandomEnumValue(propertyClasses);
// //         const productVariety = generateRandomNumberInRange(1, 5);
// //         const businessPopularity = generateRandomNumberInRange(1, 5);
// //         const businessEnvironment = generateRandomNumberInRange(1, 5);
// //         const sizeofBusiness = generateRandomNumberInRange(1, 5);
// //         const numberOfWorkingDays = generateRandomNumberInRange(1, 5);
// //         const businessOperatingPeriod = generateRandomNumberInRange(1, 5);
// //         const competitorsAvailable = generateRandomNumberInRange(1, 5);
// //         const strategicLocation = generateRandomEnumValue(strategicLocations) as LocationKeys;
// //         type LocationKeys = keyof typeof locationValues;
// //         let totalMarks = generateRandomNumberInRange(0, 100); // Initialize totalMarks here
// //         if (strategicLocation in locationValues) {
// //             totalMarks = 
// //                 locationValues[strategicLocation] + 
// //                 productVariety + 
// //                 businessPopularity + 
// //                 businessEnvironment + 
// //                 sizeofBusiness + 
// //                 numberOfWorkingDays + 
// //                 businessOperatingPeriod + 
// //                 competitorsAvailable;
// //         }
// //         const bussData: BusinessData = {
// //             buss_no: i,
// //             buss_name: `${generateRandomEnumValue(['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Ghana'])}'s ${generateRandomEnumValue(['Shop', 'Market', 'Institution', 'Company'])}`,
// //             buss_address: `P O Box ${generateRandomNumberInRange(1, 1000)}, ${town}`,
// //             buss_type: generateRandomEnumValue(businessTypes),
// //             buss_town: town,
// //             street_name: `Africa ${generateRandomEnumValue(['Street', 'Avenue', 'Road', 'Lane'])}`,
// //             landmark: `adjacent to ${generateRandomEnumValue(['Main Market', 'Church', 'Hospital', 'School', 'Government Building'])}`,
// //             electroral_area: generateRandomEnumValue(towns.filter(area => area !== town)),
// //             property_class: propertyClass,
// //             tot_grade: 'Grade 1', // Example grade
// //             ceo: generateRandomAfricanName(),
// //             telno: `+2335${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}`,
// //             strategiclocation: locationValues[strategicLocation],
// //             productvariety: productVariety,
// //             businesspopularity: businessPopularity,
// //             businessenvironment: businessEnvironment,
// //             sizeofbusiness: sizeofBusiness,
// //             numberofworkingdays: numberOfWorkingDays,
// //             businessoperatingperiod: businessOperatingPeriod,
// //             competitorsavailable: competitorsAvailable,
// //             assessmentby: generateRandomAfricanName(),
// //             transdate: generateRandomDate(2025),
// //             balance: 0,
// //             status: 'Active',
// //             current_rate: generateRandomNumberInRange(1, 299),
// //             property_rate: propertyRates[propertyClass as keyof typeof propertyRates] || 100, // Default to Residential rate if not found
// //             totalmarks: totalMarks,
// //             emailaddress: `business${i}@example.com`,
// //             noofemployees: generateRandomNumberInRange(1, 4),
// //             noofbranches: generateRandomNumberInRange(1, 4),
// //             BALANCENEW: generateRandomNumberInRange(0, 10000), // Ensure BALANCENEW is always a number
// //             gps_address: generateRandomGPSAddress()
// //         };
// //         businessData.push(bussData);
// //     }
// //     return businessData;
// // };
// // // export const generateBusinessData = (startNumber: number, count: number): BusinessData[] => {
// // //     const towns = ['Saltpond', 'Mankessim', 'Abandze', 'Egya1', 'Egya2', 'Yamoransa'];
// // //     const propertyClasses = ['Residential', 'Mixed-Use', 'Industrial', 'Commercial', 'Agricultural'];
// // //     const businessTypes = ['Hairdressing', 'Financial Institution', 'General Goods', 'Pharmacy', 'Automobile Repair', 'Bakery', 'Tailoring', 'Grocery Store', 'Fish Market', 'Barbershop'];
// // //     const strategicLocations = ['Excellent', 'Very good', 'Good', 'Average', 'L-Average'];
// // //     const locationValues = { Excellent: 5, 'Very good': 4, Good: 3, Average: 2, 'L-Average': 1 };
// // //     const propertyRates = { Residential: 100, 'Mixed-Use': 500, Industrial: 300, Commercial: 200, Agricultural: 400 };
// // //     const generateRandomName = (parts: string[]): string => {
// // //         const randomPart = () => parts[Math.floor(Math.random() * parts.length)];
// // //         return `${randomPart()} ${randomPart()}`;
// // //     };
// // //     const generateRandomDate = (year: number): Date => {
// // //         const day = Math.floor(Math.random() * 365) + 1;
// // //         return new Date(year, 0, day);
// // //     };
// // //     const generateRandomAfricanName = (): string => {
// // //         const firstNames = ['Kwame', 'Akwasi', 'Kofi', 'Yaa', 'Ama', 'Esi', 'Kwabena', 'Akosua', 'Yaw', 'Ghana'];
// // //         const lastNames = ['Adjei', 'Asante', 'Kusi', 'Dankwa', 'Nti', 'Kwakye', 'Agyei', 'Amoah', 'Opoku', 'Boadu'];
// // //         return `${generateRandomName(firstNames)} ${generateRandomName(lastNames)}`;
// // //     };
// // //     const generateRandomGPSAddress = (): string => {
// // //         const generateRandomNumber = () => Math.floor(Math.random() * 10).toString();
// // //         return `GT-${generateRandomNumber()}${generateRandomNumber()}-${generateRandomNumber()}${generateRandomNumber()}`;
// // //     };
// // //     const generateRandomEnumValue = (values: string[]): string => {
// // //         return values[Math.floor(Math.random() * values.length)];
// // //     };
// // //     const generateRandomNumberInRange = (min: number, max: number): number => {
// // //         return Math.floor(Math.random() * (max - min + 1)) + min;
// // //     };
// // //     type PropertyClassKey = 'Residential' | 'Commercial' | 'Industrial'; // Example keys, adjust as needed
// // //     // Uncomment and define the type guard function if needed
// // //     function isPropertyClassKey(key: string): key is PropertyClassKey {
// // //         return key in propertyRates;
// // //     }
// // //     const businessData: BusinessData[] = [];
// // //     for (let i = startNumber; i < startNumber + count; i++) {
// // //         const town = generateRandomEnumValue(towns);
// // //         const propertyClass = generateRandomEnumValue(propertyClasses);
// // //        // const strategicLocation = generateRandomEnumValue(strategicLocations);
// // //         const productVariety = generateRandomNumberInRange(1, 5);
// // //         const businessPopularity = generateRandomNumberInRange(1, 5);
// // //         const businessEnvironment = generateRandomNumberInRange(1, 5);
// // //         const sizeofBusiness = generateRandomNumberInRange(1, 5);
// // //         const numberOfWorkingDays = generateRandomNumberInRange(1, 5);
// // //         const businessOperatingPeriod = generateRandomNumberInRange(1, 5);
// // //         const competitorsAvailable = generateRandomNumberInRange(1, 5);
// // //         const strategicLocation = generateRandomEnumValue(strategicLocations) as LocationKeys;
// // //          // Initialize totalMarks here
// // //         const totalMarks = generateRandomNumberInRange(0, 100); // Example initialization, adjust range as needed
// // //         type LocationKeys = keyof typeof locationValues;
// // //         if (strategicLocation in locationValues) {
// // //             const totalMarks = 
// // //                 locationValues[strategicLocation] + 
// // //                 productVariety + 
// // //                 businessPopularity + 
// // //                 businessEnvironment + 
// // //                 sizeofBusiness + 
// // //                 numberOfWorkingDays + 
// // //                 businessOperatingPeriod + 
// // //                 competitorsAvailable;
// // //         }
// // //         const bussData: BusinessData = {
// // //             buss_no: i,
// // //             buss_name: `Business ${i} Co.`,
// // //             buss_address: `P O Box ${generateRandomNumberInRange(1, 1000)}, Saltpond`,
// // //             buss_type: generateRandomEnumValue(businessTypes),
// // //             buss_town: town,
// // //             street_name: `Africa ${generateRandomEnumValue(['Street', 'Avenue', 'Road', 'Lane'])}`,
// // //             landmark: `adjacent to ${generateRandomEnumValue(['Main Market', 'Church', 'Hospital', 'School', 'Government Building'])}`,
// // //             electroral_area: generateRandomEnumValue(towns.filter(area => area !== town)),
// // //             property_class: propertyClass,
// // //             tot_grade: 'Grade 1', // Example grade
// // //             ceo: generateRandomAfricanName(),
// // //             telno: `+2335${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}${generateRandomNumberInRange(0, 9)}`,
// // //             strategiclocation: locationValues[strategicLocation],
// // //             productvariety: productVariety,
// // //             businesspopularity: businessPopularity,
// // //             businessenvironment: businessEnvironment,
// // //             sizeofbusiness: sizeofBusiness,
// // //             numberofworkingdays: numberOfWorkingDays,
// // //             businessoperatingperiod: businessOperatingPeriod,
// // //             competitorsavailable: competitorsAvailable,
// // //             assessmentby: generateRandomAfricanName(),
// // //             transdate: generateRandomDate(2025),
// // //             balance: 0,
// // //             status: 'Active',
// // //             current_rate: generateRandomNumberInRange(1, 299),
// // //             property_rate: propertyRates[propertyClass as keyof typeof propertyRates] || 100, // Default to Residential rate if not found
// // //             totalmarks: totalMarks,
// // //             emailaddress: `business${i}@example.com`,
// // //             noofemployees: generateRandomNumberInRange(1, 4),
// // //             noofbranches: generateRandomNumberInRange(1, 4),
// // //             BALANCENEW: 0,
// // //             gps_address: generateRandomGPSAddress()
// // //         };
// // //         businessData.push(bussData);
// // //     }
// // //     // Uncomment and define the type guard function if needed
// // //     // Ensure you have the necessary types and functions defined
// // // // type PropertyClassKey = 'Residential' | 'Commercial' | 'Industrial'; // Example keys, adjust as needed
// // // // const propertyRates: { [key in PropertyClassKey]: number } = {
// // // //     Residential: 100,
// // // //     Commercial: 200,
// // // //     Industrial: 300
// // // // }; // Example property rates, adjust as needed
// // // // function generateRandomAfricanName(): string {
// // // //     // Example implementation, adjust as needed
// // // //     const names = ['Akwasi', 'Chika', 'Ziva', 'Kwame', 'Yasmin'];
// // // //     return generateRandomEnumValue(names);
// // // // }
// // // // function generateRandomDate(year: number): string {
// // // //     // Example implementation, adjust as needed
// // // //     const month = generateRandomNumberInRange(1, 12);
// // // //     const day = generateRandomNumberInRange(1, 30);
// // // //     return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// // // // }
// // // // function generateRandomGPSAddress(): string {
// // // //     // Example implementation, adjust as needed
// // // //     const latitude = generateRandomNumberInRange(-90, 90);
// // // //     const longitude = generateRandomNumberInRange(-180, 180);
// // // //     return `${latitude},${longitude}`;
// // // // }
// // //     return businessData;
// // // };
//# sourceMappingURL=seedDataGenerator.js.map