var currentDate = moment().format('l');
var tomorrow = moment().add(1, 'days').calendar();
var twoDay = moment().add(2, 'days').calendar();
var threeDay = moment().add(3, 'days').calendar();
var fourDay = moment().add(4, 'days').calendar();
var fiveDay = moment().add(5, 'days').calendar();
var apiKey = "8cb01bef996e472065e7a3539994986e"
var lat = ""
var lon = ""
var cityInput = ""
var currentContainer = document.getElementById("current-container");
var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHumidity = document.getElementById("humidity");
var currentUv = document.getElementById("uv-index");
var indexContainer = document.getElementById("index-container");
var forecastContainer = document.getElementById("forecast-container");
var cityList = document.getElementById("city-list")
var cityArray = []
var cities = JSON.parse(localStorage.getItem("city"))

// populate historical cities
function populateCities(){
for(var i=0; i < cities.length; i++){
    var historicalCity = document.createElement("li");
    historicalCity.classList = "city list-inline-item w-100 text-center mt-2";
    historicalCity.textContent = cities[i];
    historicalCity.addEventListener("click", currentForecast)
    cityList.appendChild(historicalCity);
}
}
function populateNewCity(){
    var cityInput = document.getElementById("city-input").value;
    for(var i=0; i < cityList.children.length; i++){
        if(cityInput === cityList.children[i].textContent){
            console.log(cityInput, cityList.children[i])
            return
        }
    }
    var historicalCity = document.createElement("li");
    historicalCity.classList = "city list-inline-item w-100 text-center mt-2";
    historicalCity.textContent = cityInput;
    cityList.appendChild(historicalCity);
}

// generate current forecast
var currentForecast = function(e) {
    if(document.getElementById("city-input").value){
    var cityInput = document.getElementById("city-input").value;
    console.log(cityInput);
    } else {
        var cityInput = e.target.textContent;
    }
    // display city and date
    var currentDate = moment().format('l');
    document.getElementById("city-displayed").textContent = cityInput + " " + currentDate;
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + apiKey + "&units=imperial"
    fetch(apiURL).then(function(response){
        response.json().then(function(data){
            console.log(data);
        currentTemp.textContent = "Temp: " + data.main.temp + "°F";
        currentWind.textContent = "Wind: " + data.wind.speed + " MPH";
        currentHumidity.textContent = "Humidity: " + data.main.humidity + "%";
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        // add historical city to city array
        cityArray.push(cityInput);
        localStorage.setItem("city", JSON.stringify(cityArray));
        // reset input
        document.getElementById("city-input").value = "";
        futureForecast(lon, lat);
        });
    })
    // generate 5 day forecast
var futureForecast = function(lon, lat){
    var api5day = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey + "&units=imperial";
    fetch(api5day).then(function(response){
        response.json().then(function(data){
            console.log(data);
        forecastContainer.innerHTML = "";
        for(var i = 0; i < 5;i++ ){
        var cardWrapper = document.createElement("div");
        cardWrapper.classList = "card-wrapper";
        var date = document.createElement("p");
        date.textContent = moment().add((i+1), 'days').format('LL');
        date.classList = "date";
        var icon = document.createElement("img");
        var iconCode = data.daily[i].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        icon.setAttribute("src", iconUrl);
        var futureTemp = document.createElement("p");
        futureTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F"
        var futureWind = document.createElement("p");
        futureWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH"
        var futureHumidity = document.createElement("p");
        futureHumidity.textContent = "Humidity: " + data.daily[i].humidity + " %";
        indexContainer.textContent = data.current.uvi
        currentUv.textContent = "UV Index: ";
        // add background color for favorable, moderate, to severe
        if(indexContainer.textContent < 3) {
            indexContainer.style.backgroundColor = "green";
        } else if(indexContainer.textContent > 3 && indexContainer.textContent < 5){
            indexContainer.style.backgroundColor = "yellow";
        } else {
            indexContainer.style.backgroundColor = "red"
        }
        cardWrapper.appendChild(date);
        cardWrapper.appendChild(icon);
        cardWrapper.appendChild(futureTemp);
        cardWrapper.appendChild(futureWind);
        cardWrapper.appendChild(futureHumidity);
        forecastContainer.appendChild(cardWrapper);
        }
        })
    });
}
}

// add event listener to search button
document.getElementById("search-btn").addEventListener("click", currentForecast)
document.getElementById("search-btn").addEventListener("click", populateNewCity)

populateCities();
console.log("hey Griffin :)")