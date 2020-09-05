let myChart = document.getElementById('myChart').getContext('2d');
let loginForm = document.getElementById("login-form")
let loginContainger = document.getElementById("login-container")
let dataContainer = document.getElementById("data-container")

let canvas = document.querySelector("#myChart")

let url = "http://localhost:3000/users/"
let transactions = "http://localhost:3000/transactions/"

loginForm.addEventListener("submit", () => {
    event.preventDefault()
    loginContainger.style.display = "none"
    dataContainer.style.display = "block"
    username = event.target[0].value
    fetch(url+username)
    .then(resp => resp.json())
    .then(userData => loadUserData(userData.transactions))
})

let filterMonth = document.getElementById("filter-month")
filterMonth.addEventListener("change", ()=>{
    let month = event.target.value
    fetch(transactions+`${username}/${month}`)
    .then(resp => resp.json())
    .then(transactions => {
        canvas.innerHTML = ""
        loadUserData(transactions)
    })
})


function round(value, decimals){
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
    
    
function loadUserData(transactions){
    let categories = transactions.map(transaction => transaction.category)
    let labels = [...new Set(categories)]
    costs = []
    labels.forEach(label =>{
        let transactionsForLabel = transactions.filter(transaction => transaction.category === label)
        let prices = transactionsForLabel.map(transaction => transaction.price)
        let total = prices.reduce((acc, current_value) => acc + current_value)
        costs.push(round(total,2))
    })
    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
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
                text: 'Spending Summary',
                fonstSize: 70
            },
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


