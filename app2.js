const iconElement = document.querySelector(".icon");
const tempElement = document.querySelector(".Temperature");
const descElement = document.querySelector(".description");
const locationElement = document.querySelector(".Location");
const notificationElement = document.querySelector(".notification");

const humidityElement = document.querySelector(".Humidity");
const windElement = document.querySelector(".Wind");


// API data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

const KELVIN = 273;

// API KEY
const key = "292cbfb8af33950664e9c64cfb438a8d";

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.wind_speed = data.wind.speed;
            weather.humidity = data.main.humidity;
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    //console.log(`${weather.temperature.value}`);
    tempElement.innerHTML = `${weather.temperature.value}${String.fromCharCode(176)}<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    humidityElement.innerHTML = weather.humidity;
    windElement.innerHTML = weather.wind_speed;
}

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}${String.fromCharCode(176)}<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}${String.fromCharCode(176)}<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

document.getElementById("location-button").onclick = function() {weatherOnClick()};

function weatherOnClick() {
  let city = document.getElementById("city-input").value;
  let txt = city;
  city = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //console.log(city);
  let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  fetch(api)
      .then(function(response){
          let data = response.json();
          return data;
      })
      .then(function(data){
          weather.temperature.value = Math.floor(data.main.temp - KELVIN);
          weather.description = data.weather[0].description;
          weather.iconId = data.weather[0].icon;
          weather.city = data.name;
          weather.country = data.sys.country;
          weather.wind_speed = data.wind.speed;
          weather.humidity = data.main.humidity;
      })
      .then(function(){
          displayWeather();
      });
}
