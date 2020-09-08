// grab different nodes from index.html
let loginForm = document.getElementById("login-form")
let loginContainer = document.getElementById("login-container")
let dataContainer = document.getElementById("data-container")
let chartDiv = document.querySelector("#chart-container")
let tableContainer = document.querySelector("div#table-container")
let navBar = document.querySelector("div.nav-bar")
let table = document.querySelector("#table")
let page = 1
let filterYear = document.querySelector("#filter-year")
let filterMonth = document.getElementById("filter-month")
let filterMonthDiv = document.querySelector("div#month")
let filterCategory = document.querySelector("#filter")
let summaryDiv = document.querySelector("#summary")
//url
let url = "http://localhost:3000/users/"
let transactions = "http://localhost:3000/transactions/"

//load chart based on user data
loginForm.addEventListener("submit", () => {
    event.preventDefault()
    loginContainer.style.display = "none"
    navBar.style.display = "flex"
    dataContainer.style.display = "flex"
    summaryDiv.style.display = "flex"
    username = event.target[0].value
    fetchUserData(username)
    loginForm.reset()
})

function fetchUserData(username){
    fetch(url+username)
    .then(resp => resp.json())
    .then(userData => {
        loadUserData(userData.transactions)
        id = userData.id
        // create options for filter based on year of transactions for user
        let year= []
        userData.transactions.forEach(transaction =>{
            let date = new Date(transaction.date_of_transaction)
            if (year.includes(date.getFullYear())){
            } else {
                year.push(date.getFullYear())
            }
        })
        filterYear.innerHTML=""
        let emptyOption = document.createElement("option")
        emptyOption.innerText = "Select Year"
        filterYear.append(emptyOption)
        year.forEach(yr => {
            let option = document.createElement("option")
            option.setAttribute("value", `${yr}`)
            option.innerText = yr
            filterYear.append(option)
        })
    })
}

//filter year event listener
filterYear.addEventListener("change", ()=>{
    filterMonthDiv.style.display = "block"
    filterMonth.innerHTML = ""
    let emptyOption = document.createElement("option")
    emptyOption.innerText = "Select Month"
    filterMonth.append(emptyOption)
    let selectedYear = event.target.value
    let now = new Date()
    let months = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }
    if (selectedYear!=now.getFullYear()){
        for (let key in months){
            let option = document.createElement("option")
            option.setAttribute("value", key)
            option.innerText = months[key]
            filterMonth.append(option)
        }
    } else {
        for (let key in months){
            if (key <= now.getMonth()+1){
                let option = document.createElement("option")
                option.setAttribute("value", key)
                option.innerText = months[key]
                filterMonth.append(option)
            }
        }
    }
    fetch(transactions+username+`/${event.target.value}`)
    .then(resp => resp.json())
    .then(selectedData => {
        loadUserData(selectedData)
    })

})


//load data for specific month for the user
filterMonth.addEventListener("change", ()=>{
    tableContainer.style.display = "flex"
    let year = filterYear.value
    let month = event.target.value
    fetch(transactions+`${username}/${year}/${month}`)
    .then(resp => resp.json())
    .then(transactions => {
        loadUserData(transactions)
        loadTableData(transactions)
    })
})

//round values from api data
function round(value, decimals){
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
    
//grab transaction category info and costs and load into chart
function loadUserData(transactions){
    let canvas = document.querySelector("canvas")
    canvas.remove()
    let newCanvas = document.createElement("canvas")
    newCanvas.setAttribute("id", "myChart")
    chartDiv.append(newCanvas)
    let categories = transactions.map(transaction => transaction.category)
    let labels = [...new Set(categories)]
    costs = []
    labels.forEach(label =>{
        let transactionsForLabel = transactions.filter(transaction => transaction.category === label)
        let prices = transactionsForLabel.map(transaction => transaction.price)
        let total = prices.reduce((acc, current_value) => acc + current_value)
        costs.push(round(total,2))
    })
    let summary = round(costs.reduce((acc, current) => acc + current),2)
    let budgetPieChart = new Chart(myChart, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total',
                data: costs,
                backgroundColor: [
                    "green",
                    "blue",
                    "grey",
                    "orange",
                    "red",
                    "purple",
                    "yellow",
                    "pink"
                ],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            }]
        },
        options: {
            title:{
                display: true,
                text: `Spending Summary - Total: $${summary}`,
                fonstSize: 70
            },
            // maintainAspectRatio: false,
            legend:{
                display: true,
                position: 'right',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips:{
                enabled: true
            }
        }
    })
    filterCategory.innerHTML = ""
    let empty = document.createElement("option")
    empty.innerText = "Select Category"
    let all = document.createElement("option")
    all.setAttribute("value", "All")
    all.innerText = "All"
    filterCategory.append(empty)
    filterCategory.append(all)
    labels.forEach(l => createOption(l))
} 

function createOption(l){
    let option = document.createElement("option")
    option.setAttribute("value", l)
    option.innerText = l
    filterCategory.append(option)
}

// create table headers and add each transaction using addTableRow
function loadTableData(data){
    table.innerHTML = ""
    let tableColumnHeader = document.createElement("tr")
    let dateHeader = document.createElement("th")
    dateHeader.innerText = "Date"
    let categoryHeader = document.createElement("th")
    categoryHeader.innerText = "Category"
    let descriptionHeader = document.createElement("th")
    descriptionHeader.innerText = "Description"
    let priceHeader = document.createElement("th")
    priceHeader.innerText = "Price"

    let actionHeader = document.createElement("th")
    actionHeader.innerText = "Action"
    
    tableColumnHeader.append(dateHeader, categoryHeader, descriptionHeader, priceHeader, actionHeader)
    table.append(tableColumnHeader)
    data.forEach(transaction => addTableRow(transaction))
}

// create Table Row for each transaction
function addTableRow(transaction){
    let tableRow = document.createElement("tr")
    tableRow.setAttribute("data-num", transaction.id)
    let date = document.createElement("td")
    date.innerText = `${transaction.date_of_transaction}`
    let category = document.createElement("td")
    category.innerText = transaction.category
    let description = document.createElement("td")
    description.innerText = `${transaction.description}`
    let price = document.createElement("td")
    price.innerText = `$${transaction.price}`
    let actionBtns = document.createElement("td")
    let editBtn = document.createElement("button")
    let deleteBtn = document.createElement("button")
    editBtn.innerText = "Edit"
    deleteBtn.innerText = "Delete"
    actionBtns.append(editBtn, deleteBtn)
    tableRow.append(date,category,description, price, actionBtns)
    table.append(tableRow)


    editBtn.addEventListener("click", () => {
        
    })

    deleteBtn.addEventListener("click", () => {
        let transactionID = parseInt(tableRow.dataset.num, 10)
        config = {
            method: 'DELETE'
        }
        fetch(transactions+transactionID)
        tableRow.remove()
    })
}

// click next button to increment page and load table
let nextBtn = document.querySelector("#next")
nextBtn.addEventListener("click", () => {
    page = page + 1
    fetchTable(page)
})

// click previous button to decrement page and load table
let previousBtn = document.querySelector("#previous")
previousBtn.addEventListener("click", ()=>{
    if (page>1){
        page -= 1
        fetchTable(page)
    }
})

//show add transaction form
let addTransactionBtn = document.querySelector("#add-transaction")
let transactionFormDiv = document.querySelector("#add-transaction-form")
let transactionForm = document.querySelector("#transaction-form")
let show = false
addTransactionBtn.addEventListener("click", ()=>{
    if (show!=false){
        show = !show
        transactionFormDiv.style.display = "flex";
    } else {
        show = !show
        transactionFormDiv.style.display = "none";
    }
})

//submit a transaction and reload data
transactionForm.addEventListener("submit", ()=> {
    event.preventDefault();
    let date_of_transaction = event.target[0].value
    let category = event.target[1].value
    let description = event.target[2].value
    let price = parseFloat(event.target[3].value, 10)
    config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            user_id: id,
            date_of_transaction,
            category,
            description,
            price
        })
    }

    

    fetch(transactions, config)
        .then(res => res.json())
        .then(transaction => {
            addTableRow(transaction)
            fetchUserData(username)
        })
})

// return to login page
let logout = document.querySelector("#logout")
logout.addEventListener("click", ()=>{
    loginContainger.style.display = "flex"
    navBar.style.display = "none"
    dataContainer.style.display = "none"
    tableContainer.style.display = "none"
    filterMonthDiv.style.display = "none"
    filterYear.innerHTML = ""
    filterMonth.innerHTML = ""
})

//category filter for table
filterCategory.addEventListener("change", ()=>{
    let year = filterYear.value
    let month = filterMonth.value
    let category = event.target.value
    fetch(transactions+`${username}/${year}/${month}/${category}`)
    .then(res => res.json())
    .then(categoryData => loadTableData(categoryData))
})