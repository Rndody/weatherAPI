//& #############+++++++ API Variables +++++++#############
const baseURL = "https://api.weatherapi.com/v1";
const myKey = "13b4864ff12d4a41bad114252231208";


//& #############+++++++ search Variable +++++++#############

let searchInput = document.getElementById("search");
let getLocationBtn = document.getElementById("getLocationBtn");
//& #############+++++++ geolocation Variables +++++++#############
let latitude;
let longitude;

//& #############+++++++ Card One Variables +++++++#############

let dayP = document.getElementById("dayP");
let dateP = document.getElementById("dateP");

let cityName = document.getElementById("cityName");
let temperature = document.getElementById("temperature");
let iconImg = document.getElementById("iconImg");
let WeatherInfo = document.getElementById("WeatherInfo");

let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let direction = document.getElementById("direction");


//& #############+++++++ Next Cards Variables +++++++#############

let followingDayImg = document.getElementsByClassName("followingDayImg")
let maxTemp = document.getElementsByClassName("maxTemp")
let minTemp = document.getElementsByClassName("minTemp")
let followingDayWeatherInfo = document.getElementsByClassName("followingDayWeatherInfo")
let followingDayName = document.getElementsByClassName("followingDayName")

// let ourData;
//^#########################+++++++ Events ++++++++++++++++++########################
searchInput.addEventListener("keyup", function () {
    playApp(searchInput.value);

})

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude,longitude)
}
getLocationBtn.addEventListener("click", function () {
    let statusP = document.getElementById("status");
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, checkError);
        } else {
            statusP.innerHTML = "Geolocation is not supported by this browser. Please use the search bar";
        }
    }

    getLocation();
    geolocationFetch();

})

//! ############+++++ fetch geolocation function ++++++++++########### 
async function geolocationFetch() {
    let fetchResponse = await fetch(`${baseURL}/forecast.json?key=${myKey}&q=${latitude},${longitude}&days=3`);
    let jsonObject = await fetchResponse.json();
    return jsonObject;
}

const checkError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationDiv.innerText = "Please allow access to location";
            break;
        case error.POSITION_UNAVAILABLE:
            //usually fired for firefox
            locationDiv.innerText = "Location Information unavailable";
            break;
        case error.TIMEOUT:
            locationDiv.innerText = "The request to get user location timed out";
    }
};

//! ############+++++ fetch function ++++++++++########### 

async function fetchWeather(cityName) {
    let fetchResponse = await fetch(`${baseURL}/forecast.json?key=${myKey}&q=${cityName}&days=3`);
    let jsonObject = await fetchResponse.json();
    // ourData=jsonObject;
    return jsonObject;
}

//! ############+++++ Today Wether function ++++++++++########### 
function todayWeather(data) {

    let todayDate = new Date();
    dayP.innerHTML = todayDate.toLocaleDateString("en-US", { weekday: "long" });
    dateP.innerHTML = todayDate.getDate() + " " + todayDate.toLocaleDateString("en-US", { month: "long" });

    cityName.innerHTML = data.location.name;
    temperature.innerHTML = data.current.temp_c + "&deg;C";
    WeatherInfo.innerHTML = data.current.condition.text;

    humidity.innerHTML = data.current.humidity + " %";
    wind.innerHTML = data.current.wind_kph + " Km/H";
    direction.innerHTML = data.current.wind_dir;
    iconImg.setAttribute("scr", data.current.condition.icon);

}

//! ############+++++ following days Wether function ++++++++++########### 
function followingDaysWeather(data) {
    let ourData = data.forecast.forecastday;
    for (let i = 0; i < 2; i++) {

        let folowingDayNameDate = new Date(ourData[i + 1].date);
        followingDayName[i].innerHTML = folowingDayNameDate.toLocaleDateString("en-US", { weekday: "long" });

        followingDayImg[i].setAttribute = ("scr", ourData[i + 1].day.condition.icon);
        maxTemp[i].innerHTML = ourData[i + 1].day.maxtemp_c + "&deg;C";
        minTemp[i].innerHTML = ourData[i + 1].day.mintemp_c + "&deg;C";
        followingDayWeatherInfo[i].innerHTML = ourData[i + 1].day.condition.text;
    }
}

//! ############+++++ Play Application function ++++++++++########### 

async function playApp(city = "cairo") {
    // let jsonObject=await geolocationFetch();
    jsonObject = await fetchWeather(city);
    if (jsonObject) {
        todayWeather(jsonObject)
        followingDaysWeather(jsonObject)
    }

    //    console.log(jsonObject)
}
playApp()




