let myChart = document.getElementById('myChart').getContext('2d');
let url = "http://localhost:3000/transaction/"

let labels = []
let totals = []
fetch(url)
.then(res => res.json())
.then(transactions => {
    let foodCost = 0.0
    let entertainmentCost = 0.0
    let incomeCost = 0.0
    let transportationCost = 0.0
    let groceriesCost = 0.0
    let healthCost = 0.0
    let shoppingCost = 0.0
    let travelCost = 0.0
    transactions.forEach(transaction => {
        if (!labels.includes(transaction.category)){
            labels.push(transaction.category)
        }
        if (transaction.category === "Food"){
            foodCost += transaction.price
        } else if (transaction.category === "Entertainment"){
            entertainmentCost += transaction.price
        } else if (transaction.category === "Income"){
            incomeCost += transaction.price
        } else if (transaction.category === "Transportation"){
            transportationCost += transaction.price
        } else if (transaction.category === "Groceries"){
            groceriesCost += transaction.price
        } else if (transaction.category === "Health & Wellness"){
            healthCost += transaction.price
        } else if (transaction.category === "Shopping") {
            shoppingCost += transaction.price
        } else if (transaction.category === "Travel"){
            travelCost += transaction.price
        }
    })
    totals.push(foodCost)
    totals.push(entertainmentCost)
    totals.push(incomeCost)
    totals.push(transportationCost)
    totals.push(groceriesCost)
    totals.push(healthCost)
    totals.push(shoppingCost)
    totals.push(travelCost)
    
    
    
    
    
    
    
    
    
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
                data: totals,
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
                fonstSize: 25
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
                    left: 50,
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
                            
})