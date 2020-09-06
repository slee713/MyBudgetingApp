// grab different nodes from index.html
let loginForm = document.getElementById("login-form")
let loginContainger = document.getElementById("login-container")
let dataContainer = document.getElementById("data-container")
let chartDiv = document.querySelector("#chart-container")
let tableContainer = document.getElementById("div.table")
let navBar = document.querySelector("div.nav-bar")
//url
let url = "http://localhost:3000/users/"
let transactions = "http://localhost:3000/transactions/"

//load chart based on user data
loginForm.addEventListener("submit", () => {
    event.preventDefault()
    loginContainger.style.display = "none"
    navBar.style.display = "flex"
    dataContainer.style.display = "flex"
    username = event.target[0].value
    fetch(url+username)
    .then(resp => resp.json())
    .then(userData => loadUserData(userData.transactions))
})

//load data for specific month for the user
let filterMonth = document.getElementById("filter-month")
filterMonth.addEventListener("change", ()=>{
    let month = event.target.value
    fetch(transactions+`${username}/${month}`)
    .then(resp => resp.json())
    .then(transactions => {
        loadUserData(transactions)
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
}                    




