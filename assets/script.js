var searchResultsEl = document.querySelector('#search-results');
var userSearchEl = document.querySelector('#q');
var searchFormEl = document.querySelector('#search-form');
var submitBtn = document.querySelector('#btn btn-primary');
var currentDate = dayjs().format('MM/DD/YYYY');
var currentDayContainer = document.querySelector('#current-day');
var fiveDay = document.querySelector('#five-day');
var cityLat = 41.85;
var cityLon = -87.65;


function getCityWeather(event) { //this is the first function to get it started
    event.preventDefault();
    var cityInput = userSearchEl.value
    currentWeather(cityInput);
    //call function to create history, save in localstorage and pull from local storage. similar to coding quiz 
    console.log(currentDate);
}

var currentWeather = function (cityName) {
    // event.preventDefault();
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&lastupdate&appid=' + '65aa2c7078fbf368ef9fa2e69bab9001'


    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var nameOfCity = document.createElement("h4")
            nameOfCity.textContent = data.name + " (" + currentDate+ ")"
            currentDayContainer.append(nameOfCity);
            var cityTemp = document.createElement("p");
            cityTemp.textContent = "Temp: " + data.main.temp
            currentDayContainer.append(cityTemp);
            var cityWind = document.createElement("p");
            cityWind.textContent = "Wind: " + data.wind.speed
            currentDayContainer.append(cityWind);
            var cityHumidity = document.createElement("p");
            cityHumidity.textContent = "Humidity: " + data.main.humidity
            currentDayContainer.append(cityHumidity);

            currentDayContainer.className = 'recentSearch'
            // nameOfCity.className = 'recentSearch'
            // cityTemp.className = 'recentSearch'
            // cityWind.className = 'recentSearch'
            // cityHumidity.className = 'recentSearch'

            var cityLat = data.coord.lat
            var cityLon = data.coord.lon
            var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + '&units=imperial&lastupdate&appid='+ 'f30dc0b71f772a037a522282770190be' 

            var iconValue = data.weather[0].icon;
            var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"
            var currentDayIcon = document.createElement("IMG");
            currentDayIcon.setAttribute("src", icon);
            currentDayContainer.append(currentDayIcon);

            fetch(fiveDayForecastURL)
                .then(function (response) {
                    return response.json();

                })
                .then(function (response) {
                    console.log(response);
                    for (let i = 1; i < 6; i++) {
                        var fiveDayContainer = document.createElement("div");
                        var forecastDate = document.createElement("p");
                        forecastDate.textContent = dayjs().add(i,"day").format('MM/DD/YYYY');
                        fiveDayContainer.append(forecastDate)

    
                        //fiveDayContainer.setAttribute("class", "card")
                        var forecastTemp = document.createElement("p");
                        forecastTemp.textContent = "Temp: " + response.daily[i].temp.day
                        fiveDayContainer.append(forecastTemp) 
                        var fiveDayWind = document.createElement("p");
                        fiveDayWind.textContent = "Wind: " + response.daily[i].wind_speed
                        fiveDayContainer.append(fiveDayWind)
                        var fiveDayHumid = document.createElement("p");
                        fiveDayHumid.textContent = "Humidity: " + response.daily[i].humidity
                        fiveDayContainer.append(fiveDayHumid)

                        fiveDay.append(fiveDayContainer)

                        console.log(forecastTemp);
    
                        var iconValue = response.daily[i].weather[0].icon;
                        var icon = "http://openweathermap.org/img/wn/" + iconValue + ".png"
                        var fiveDayIcon = document.createElement("IMG");
                        fiveDayIcon.setAttribute("src", icon);
                        fiveDayContainer.append(fiveDayIcon);

                        fiveDayContainer.className = "fiveDay"

                        localStorage.setItem("Search History", cityName)
                    }
                })
        })
}

function searchHistory() {
    localStorage.setItem("Search History", cityName)
    
}








searchFormEl.addEventListener('submit', getCityWeather);