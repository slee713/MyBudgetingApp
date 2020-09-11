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
let filterCategory = document.querySelector("select#filter")
let summaryDiv = document.querySelector("#summary")
let editFormDiv = document.querySelector("#edit")
let editForm = document.querySelector("#edit-form")
let home = document.querySelector("#home")
//url
let url = "http://localhost:3000/users/"
let transactions = "http://localhost:3000/transactions/"
let now = new Date()
let editUsernameForm = document.querySelector("#edit-username")

//load info based on new user form submission
let createUserForm = document.querySelector("#create-user-form")
createUserForm.addEventListener("submit", ()=>{
    event.preventDefault()
    let userformModal = document.getElementById("create-user-modal")
    closeModal(userformModal)
    loginContainer.style.display = "none"
    navBar.style.display = "flex"
    dataContainer.style.display = "flex"
    summaryDiv.style.display = "flex"
    tableContainer.style.display = "flex"
    username = event.target[0].value
    editUsernameForm.children[1].value = username
    
    config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username
        })
    }
    fetch(url, config)
    .then(()=>{
        fetchUserData(username)
    })
    createUserForm.reset()
})


//load chart based on user data
loginForm.addEventListener("submit", () => {
    event.preventDefault()
    loginContainer.style.display = "none"
    navBar.style.display = "flex"
    dataContainer.style.display = "flex"
    summaryDiv.style.display = "flex"
    tableContainer.style.display = "flex"
    username = event.target[0].value
    editUsernameForm.children[1].value = username
    fetchUserData(username)
    loadChartWithCurrentMonth(username)
    loginForm.reset()
})

//fetch userdata based on username
function fetchUserData(username){
    fetch(url+username)
    .then(resp => resp.json())
    .then(userData => {
        id = userData.id
        let emptyOption = document.createElement("option")
        emptyOption.innerText = "Select Year"
        filterYear.append(emptyOption)
        if (userData.transactions.length > 0){
            // loadUserData(userData.transactions)
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
            year.forEach(yr => {
                let option = document.createElement("option")
                option.setAttribute("value", `${yr}`)
                option.innerText = yr
                filterYear.append(option)
            })

            //set year filter to current year and remove options for months that are past current month
            filterYear.value = `${now.getFullYear()}`
            // let last = filterMonth.lastElementChild
            // while (last.value > now.getMonth()+1){
            //     filterMonth.lastElementChild.remove()
            //     last = filterMonth.lastElementChild
            // }
        } else {
            let currentYearOption = document.createElement("option")
            currentYearOption.setAttribute("value", `${now.getFullYear()}`)
            currentYearOption.innerText = now.getFullYear()
            filterYear.append(currentYearOption)
            filterYear.value = `${now.getFullYear()}`
        }
        let last = filterMonth.lastElementChild
        while (last.value > now.getMonth()+1){
            filterMonth.lastElementChild.remove()
            last = filterMonth.lastElementChild
        }
        filterMonth.value = now.getMonth()+1
    })
}

//load chart with transactions for the current year and month for user
function loadChartWithCurrentMonth(username){
    fetch(transactions+`${username}/${now.getFullYear()}/${now.getMonth()+1}`)
    .then(res => res.json())
    .then(transactions => {
        filterMonth.value = now.getMonth()+1
        loadUserData(transactions)
        loadTableData(transactions)
    })
}

//filter year event listener adds month options to filter Month based on current year
filterYear.addEventListener("change", ()=>{
    tableContainer.style.display = "none"
    filterMonth.innerHTML = ""
    let emptyOption = document.createElement("option")
    emptyOption.innerText = "Select Month"
    filterMonth.append(emptyOption)
    let selectedYear = event.target.value
    let now = new Date()
    let months = {
        "1": "January",
        "2": "February",
        "3": "March",
        "4": "April",
        "5": "May",
        "6": "June",
        "7": "July",
        "8": "August",
        "9": "September",
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
    // fetch(transactions+username+`/${event.target.value}`)
    // .then(resp => resp.json())
    // .then(selectedData => loadUserData(selectedData))
})


//load userdata for specific month for the user
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
                position: 'bottom',
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
    // start populating category filter based on categories for specific data set
    filterCategory.innerHTML = ""
    let empty = document.createElement("option")
    empty.innerText = "Select Category"
    let all = document.createElement("option")
    all.setAttribute("value", "All")
    all.innerText = "All"
    filterCategory.append(empty, all)
    //create option for each label available in the dataset
    labels.forEach(l => createOption(l))

    //resets the inner span element for the summary page to 0 so old data is removed
    let total = document.querySelector("#period-total")
    total.lastElementChild.innerText=summary
    let monthlyBudgetForm = document.querySelector("#set-monthly-budget")
    let travel = document.querySelector("#Travel")
    travel.lastElementChild.innerText = "0"
    let entertainment = document.querySelector("#Entertainment")
    entertainment.lastElementChild.innerText = "0"
    let groceries = document.querySelector("#Groceries")
    groceries.lastElementChild.innerText = "0"
    let transportation = document.querySelector("#Transportation")
    transportation.lastElementChild.innerText = "0"
    let shopping = document.querySelector("#Shopping")
    shopping.lastElementChild.innerText = "0"
    let bills = document.querySelector("#Bills")
    bills.lastElementChild.innerText = "0"
    let foodDrink = document.querySelector("#FoodDrink")
    foodDrink.lastElementChild.innerText = "0"
    let health = document.querySelector("#Health")
    health.lastElementChild.innerText = "0"

    //get sum of budget based on budget form
    let budgetTotal = 0
    for(i=0; i<8; i++){
        budgetTotal += parseFloat(monthlyBudgetForm.elements[i].value)
    }
    let remaining = document.querySelector("#remaining")
    remaining.lastElementChild.innerText = round(budgetTotal,2)
    
    //calculate the percentage of cost spent for that particular category and add to corrent summary line
    for (i=0; i<costs.length; i++){
        let element=document.querySelector(`#${labels[i].split(" & ").join("")}`)
        element.lastElementChild.innerText = round((costs[i]/budgetTotal)*100,0)
    }
    
} 

//create filter option
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
    editBtn.innerText = "Edit"
    editBtn.setAttribute("data-modal-target","#edit-transaction-modal")
    let deleteBtn = document.createElement("button")
    deleteBtn.innerText = "Delete"
    actionBtns.append(editBtn, deleteBtn)
    tableRow.append(date,category,description, price, actionBtns)
    table.append(tableRow)

    // add event listener to edit button so it opens the edit form and preloads the data
    editBtn.addEventListener("click", () => {
        let editTransactionModal = document.getElementById("edit-transaction-modal")
        openModal(editTransactionModal)
        editForm.children[0].value = transaction.id
        editForm.children[2].value = transaction.date_of_transaction
        editForm.children[5].value = transaction.category
        editForm.children[8].value = transaction.description
        editForm.children[11].value = transaction.price
    })

    // add event listener to delete button so it deletes row and updates chart and table
    deleteBtn.addEventListener("click", () => {
        let transactionID = parseInt(tableRow.dataset.num, 10)
        config = {
            method: 'DELETE'
        }
        fetch(transactions+transactionID, config)
        .then(()=>{
            let year = filterYear.value
            let month = filterMonth.value
            fetch(transactions+`${username}/${year}/${month}`)
            .then(res=> res.json())
            .then(updatedData => {
            loadUserData(updatedData)
             })
            tableRow.remove()
        })
    })
}

//submit a transaction and reload data for the transaction month and year
let transactionForm = document.querySelector("#transaction-form")
transactionForm.addEventListener("submit", ()=> {
    event.preventDefault();
    let date_of_transaction = event.target[0].value
    let category = event.target[1].value
    let description = event.target[2].value
    let price = parseFloat(event.target[3].value, 10)
    let addTransactionModal = document.getElementById("transaction-modal")
    closeModal(addTransactionModal)
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
    //post transaction 
    fetch(transactions, config)
    .then(()=>{
        let date = new Date(date_of_transaction)
        let year = date.getFullYear()
        let month = date.getMonth()+1
        filterYear.value = year
        filterMonth.value = month
        //fetch data for the transaction year and month
        fetch(transactions+`${username}/${year}/${month}`)
        .then(res => res.json())
        .then(transactions =>{
            tableContainer.style.display = "flex"
            loadUserData(transactions)
            loadTableData(transactions)
            transactionForm.reset()
            let addTransactionModal = document.getElementById("transaction-modal")
            closeModal(addTransactionModal)
        })
    })
})

// return to login page and hide all elements
let logout = document.querySelector("#logout")
logout.addEventListener("click", ()=>{
    loginContainer.style.display = "flex"
    navBar.style.display = "none"
    dataContainer.style.display = "none"
    tableContainer.style.display = "none"
    filterMonthDiv.style.display = "none"
    summaryDiv.style.display = "none"
    table.innerHTML = ""
    let canvas = document.querySelector("canvas")
    canvas.remove()
    filterYear.innerHTML = ""
    filterMonth.innerHTML = ""
    //need to fix budgets belonging to specific user
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


//click on home to display main page (might want to make it the current month)
home.addEventListener("click", ()=>{
    loadChartWithCurrentMonth(username)
})

//submit edit form to database and save. Load new data in chart and 
editForm.addEventListener("submit", ()=>{
    event.preventDefault()
    let newDate = event.target[1].value
    let revisedDate = new Date(newDate)
    let year = revisedDate.getFullYear()
    let month = revisedDate.getMonth() + 1
    let editTransactionModal = document.getElementById("edit-transaction-modal")
    closeModal(editTransactionModal)
    config = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            user_id: id,
            date_of_transaction: event.target[1].value,
            category: event.target[2].value,
            description: event.target[3].value,
            price: event.target[4].value
        })
    }
    fetch(transactions+event.target[0].value, config)
    .then(() => {
        fetch(transactions+`${username}/${year}/${month}`)
        .then(res=>res.json())
        .then(transactions =>{
            loadUserData(transactions)
            loadTableData(transactions)
            filterMonth.value = month
        })
        // loadChartWithCurrentMonth(username)
    })
})

//set monthly budget and add the values and change monthly budget total
let monthlyBudgetForm = document.querySelector("#set-monthly-budget")
monthlyBudgetForm.addEventListener("submit", ()=>{
    event.preventDefault()
    let budgetModal = document.getElementById("budget-modal")
    closeModal(budgetModal)
    loadChartWithCurrentMonth(username)
    let total = 0
    for (i = 0; i<8; i++){
        total = total + parseFloat(event.target[i].value)
    }
    let remaining = document.querySelector("#remaining")
    remaining.lastElementChild.innerText = total
})

// delete user account
let deleteUserBtn = document.querySelector("#delete-user")
deleteUserBtn.addEventListener("click", () => {
    config = {
        method: "DELETE"
    }
    fetch(url+id, config)
    loginContainer.style.display = "flex"
    navBar.style.display = "none"
    dataContainer.style.display = "none"
    tableContainer.style.display = "none"
    filterMonthDiv.style.display = "none"
    summaryDiv.style.display = "none"
    filterYear.innerHTML = ""
    filterMonth.innerHTML = ""
})

// select all modal buttons
const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById('overlay')

//iterate through all modal buttons and add event listeners to open Modal
openModalButtons.forEach(button => {
    button.addEventListener("click", ()=>{
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

//iterate through all close buttons to add event listeneres to close modal
closeModalButtons.forEach(button => {
    button.addEventListener("click", ()=>{
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

//open modal 
function openModal(modal){
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

//close modal
function closeModal(modal){
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

//add eventlistener to close modal whenever you click outside of modal
overlay.addEventListener("click", ()=>{
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
})

//edit current username
editUsernameForm.addEventListener("submit",()=> {
    event.preventDefault()
    let editModal = document.getElementById("user-modal")
    closeModal(editModal)
    username = event.target[0].value
    config = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username: event.target[0].value
        })
    }
    fetch(url+id, config)
})