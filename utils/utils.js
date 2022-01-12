// formatDate(d.From)

/**
 * 
 * @param {Date} dateInput Takes columns "From" and "To" from clean_sleep_data.csv
 * @returns Formatted date in JS European Date Format
 */
export let formatDate = (dateInput) => {
    let date = dateInput.replaceAll(".", "").split(" ")
    date = new Date(date[2], date[1], date[0], date[3].split(":")[0], date[3].split(":")[1])
    return date
}

