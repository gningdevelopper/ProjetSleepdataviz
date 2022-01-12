let formatDate = (dateInput) => {
    let date = dateInput.replaceAll(".", "").split(" ")
    date = new Date(date[2], date[1], date[0], date[3].split(":")[0], date[3].split(":")[1])
    return date
}

