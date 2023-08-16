const cityNameEl = document.querySelector('#city-name')
const qInput = document.querySelector('#q')
const searchForm = document.querySelector('#city-search')
const apiKey = 'e15c17ab5737c79cccfc6cb26a3943b2'
const currentTempEl = document.querySelector('#current-temp')
const currentWindSpeedEl = document.querySelector('#current-wind-speed')
const currentHumidityEl = document.querySelector('#current-humidity')
const currentIconImageEl = document.querySelector('#current-icon-image')
const searchHistoryEl = document.querySelector('#search-history')
let q = '';

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];


//for every item saved in localStorage, create a link and display it on page.
function displaySearchHistory() {

    const searchHistoryHeaderEl = document.querySelector('#search-history-header')



    for (let i = 0; i < searchHistory.length; i++) {
        const searchHistoryItem = document.createElement('a')
        searchHistoryItem.className = 'list-group-item list-group-item-action'
        searchHistoryItem.textContent = searchHistory[i]
        searchHistoryEl.appendChild(searchHistoryItem)
        searchHistoryHeaderEl.className = 'd-block';

    }
}


function search() {

    function generateSearchHistory() {

        //if item is not currently saved to localStorage, save it. Prevents reloading of duplicate items if item is re-searched as opposed to clicked.

        if ((searchHistory.indexOf(q) === -1) && (q !== '')) {
            searchHistory.push(q)
        }

        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        //clear search history element to prevent duplicates

        searchHistoryEl.innerHTML = '';

        displaySearchHistory();
    }


    generateSearchHistory();
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${apiKey}`


    //fetch geo api to turn the city name into lat and lon coordinates
    fetch(geoApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const state = data[0].state;

            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

            //using lat and lon coord, fetch the weather api to get current weather data and display it on the page in main card.
            fetch(weatherApiUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const currentCity = data.name;
                    const currentTemp = Math.round(data.main.temp);
                    const currentWindSpeed = Math.round(data.wind.speed);
                    const currentHumidity = data.main.humidity;
                    const iconCode = data.weather[0].icon
                    const iconImage = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

                    currentIconImageEl.setAttribute('src', iconImage)
                    cityNameEl.textContent = `Current Weather for: ${currentCity}, ${state}`;
                    currentTempEl.textContent = `Temp: ${currentTemp} \u00B0F`;
                    currentWindSpeedEl.textContent = `Wind Speed: ${currentWindSpeed} MPH`;
                    currentHumidityEl.textContent = `Humidity: ${currentHumidity}%`;

                    const fiveDayApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

                    //use same lat and lon to fetch the 5day/3hour api to get future weather data.
                    fetch(fiveDayApiUrl)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {

                            //clears the card group element to prevent duplicates
                            document.querySelector('.card-group').innerHTML = '';

                            // Dynamically displays  '5 Day Forecast' header
                            const fiveDayHeaderEl = document.querySelector('#five-day-header');

                            fiveDayHeaderEl.className = '';
                            fiveDayHeaderEl.className = 'd-block';

                            //increments by 8, since there are 40 responses for the api call - 8 per day. This pulls 5 different days spaced 24 hours apart. Dynamically creates cards for each day with their respective information.
                            for (let i = 0; i < 40; i += 8) {
                                const temp = Math.round(data.list[i].main.temp);
                                const wind = Math.round(data.list[i].wind.speed);
                                const humidity = data.list[i].main.humidity;
                                const icon = data.list[i].weather[0].icon;

                                //build each individual card
                                const cardTitleEl = document.createElement('h5');
                                const cardIcon = document.createElement('img');
                                const cardTempEl = document.createElement('p');
                                const cardWindEl = document.createElement('p');
                                const cardHumidityEl = document.createElement('p');
                                const cardBodyEl = document.createElement('div');
                                const cardEl = document.createElement('div');

                                cardTitleEl.className = 'card-title';
                                cardIcon.className = 'card-icon';
                                cardTempEl.className = 'card-temp';
                                cardWindEl.className = 'card-wind';
                                cardHumidityEl.className = 'card-humidity';
                                cardBodyEl.className = 'card-body';
                                cardEl.className = 'card mx-1';

                                cardTitleEl.textContent = dayjs(data.list[i].dt_txt).format('dddd');
                                cardIcon.setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`)
                                cardTempEl.textContent = `Temp: ${temp} \u00B0F`;
                                cardWindEl.textContent = `Wind: ${wind} MPH`;
                                cardHumidityEl.textContent = `Humidity: ${humidity}%`;

                                cardBodyEl.appendChild(cardTitleEl)
                                cardBodyEl.appendChild(cardTempEl)
                                cardBodyEl.appendChild(cardWindEl)
                                cardBodyEl.appendChild(cardHumidityEl)
                                cardBodyEl.appendChild(cardIcon)
                                cardEl.appendChild(cardBodyEl);
                                document.querySelector('.card-group').appendChild(cardEl);

                                //change card background-color based on selected temperature rules
                                if (temp >= 80) {
                                    cardBodyEl.className = 'card-body hot';
                                } else if (temp >= 70 && temp < 80) {
                                    cardBodyEl.className = 'card-body warm';
                                } else if (temp > 60 && temp < 70) {
                                    cardBodyEl.className = 'card-body less-warm';
                                } else if (temp <= 60) {
                                    cardBodyEl.className = 'card-body light-jacket';
                                } else if (temp > 45 && temp < 60) {
                                    cardBodyEl.className = 'card-body cold';
                                } else if (temp <= 45) {
                                    cardBodyEl.className = 'card-body freezing';
                                }

                            }
                        })

                })
        })
}

let newSearch = function (event) {
    event.preventDefault();

    q = qInput.value.trim();

    search();

}

function displayFromHistory(event) {
    q = event.target.innerText;
    search();
}



//respond to submit click on search form.

displaySearchHistory();
searchForm.addEventListener('submit', newSearch);
searchHistoryEl.addEventListener('click', displayFromHistory);