const arrayToCSV = (arr: string[] ) => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    
    // Convert array to CSV format
    return arr.join(', ');
}
export{arrayToCSV};