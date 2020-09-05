let myChart = document.getElementById('myChart').getContext('2d');
let loginForm = document.getElementById("login-form")
let loginContainger = document.getElementById("login-container")
let url = "http://localhost:3000/users/"

loginForm.addEventListener("submit", () => {
    event.preventDefault()
    loginContainger.style.display = "none"
    let username = event.target[0].value
    fetch(url+username)
    .then(resp => resp.json())
    .then(console.log)
})



    
    
    
    
    // Global Options
    // Chart.defaults.global.defaultFontFamily = 'Lato';
    // Chart.defaults.global.defaultFontSize = 18;
    // Chart.defaults.global.defaultFontColor = '#777';
    
    // let budgetPieChart = new Chart(myChart, {
    //     type: 'pie',
    //     data: {
    //         labels: ,
    //         datasets: [{
    //             label: 'Total',
    //             data: ,
    //             backgroundColor: [
    //                 "green",
    //                 "blue",
    //                 "grey",
    //                 "orange",
    //                 "red",
    //                 "purple",
    //                 "yellow",
    //                 "pink"
    //             ],
    //             borderWidth: 1,
    //             borderColor: '#777',
    //             hoverBorderWidth: 3,
    //             hoverBorderColor: '#000'
    //         }]
    //     },
    //     options: {
    //         title:{
    //             display: true,
    //             text: 'Spending Summary',
    //             fonstSize: 25
    //         },
    //         legend:{
    //             display: true,
    //             position: 'right',
    //             labels: {
    //                 fontColor: '#000'
    //             }
    //         },
    //         layout: {
    //             padding: {
    //                 left: 50,
    //                 right: 0,
    //                 bottom: 0,
    //                 top: 0
    //             }
    //         },
    //         tooltips:{
    //             enabled: true
    //         }
    //     }
    // })
                            
