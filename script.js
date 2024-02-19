const weatherApi = 'http://api.weatherapi.com/v1/forecast.json?key=600869ee39c24203868113610241802&q=London&days=1&aqi=no&alerts=no';

const app = document.querySelector('.app'),
    geo = app.querySelector('.location__geo'),
    avgTemp = app.querySelector('#avg__temp'),
    minTemp = app.querySelector('#min__digit'),
    maxTemp = app.querySelector('#max__digit'),
    descrIcon = app.querySelector('.descr__icon'),
    descrText = app.querySelector('.descr__text'),
    sunUp = app.querySelector('.up'),
    sunDown = app.querySelector('.down'),
    hourItems = document.querySelectorAll('.hourly__weather--item');

let weatherDB = {
    date: 0,
    avgTemp: 0,
    maxTemp: 0,
    minTemp: 0,
    sunrise: 0,
    sunset: 0,
    dayDescr: 0,
    icon: 0
};

let weatherDayDB = [];


function dataRender() {
    avgTemp.innerHTML = `${weatherDB[0].avgTemp}°C`;
    maxTemp.innerHTML = `${weatherDB[0].maxTemp}°C`;
    minTemp.innerHTML = `${weatherDB[0].minTemp}°C`;
    sunUp.innerHTML = `${weatherDB[0].sunrise}`;
    sunDown.innerHTML = `${weatherDB[0].sunset}`;
    descrText.innerHTML = `${weatherDB[0].dayDescr}`;

    let k = 6;

    function convertImg(description) {
        if (description === 'Sunny' || description === 'Partly cloudy' || description === 'Overcast' || description === 'Mist') {
            return '<img src="resources/img/icons/sun.svg" alt="">'
        } else {
            return '<img src="resources/img/icons/Drizzle.svg" alt="">'
        }

    }


    hourItems.forEach((item, i) => {
        item.innerHTML = `
            <p class="hourly__weather--time">${k}:00</p>
                <div class="hourly__weather--icon">
                    ${convertImg(weatherDB[1][i]["icon"])}            
                </div>
                <div class="hourly__weather--temperature">${weatherDB[1][i]["temp"]}°C</div>
        `;

        k += 3;
    });
}

const getInfo = async () => {
    let result = await fetch(weatherApi),
        convertedResult = await result.json();

    let weatherInfo = convertedResult.forecast.forecastday[0];

    weatherDB = [{
        date: weatherInfo["date"],
        avgTemp: weatherInfo["day"]["avgtemp_c"],
        maxTemp: weatherInfo["day"]["maxtemp_c"],
        minTemp: weatherInfo["day"]["mintemp_c"],
        sunrise: weatherInfo["astro"]["sunrise"],
        sunset: weatherInfo["astro"]["sunset"],
        dayDescr: weatherInfo["day"]["condition"]["text"],
        icon: weatherInfo["day"]["condition"]["icon"],
    },

        [{
            temp: weatherInfo["hour"][6]["temp_c"],
            icon: weatherInfo["hour"][6]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][9]["temp_c"],
            icon: weatherInfo["hour"][9]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][12]["temp_c"],
            icon: weatherInfo["hour"][12]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][15]["temp_c"],
            icon: weatherInfo["hour"][15]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][18]["temp_c"],
            icon: weatherInfo["hour"][18]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][21]["temp_c"],
            icon: weatherInfo["hour"][21]["condition"]["text"]
        },
        ]
    ];

    dataRender();

    console.log(weatherDB);
}

getInfo();

function showRightMenu() {
    const hourlyMenu = document.querySelector('.hourly__weather');
    let x1,
        y1;

    app.addEventListener('touchstart', (event) => {
        x1 = event.touches[0].clientX;
        y1 = event.touches[0].clientY;
    });

    app.addEventListener('touchmove', (event) => {
        if (!x1 || !y1) {
            return false;
        }

        let x2 = event.touches[0].clientX,
            y2 = event.touches[0].clientY,
            horizontalDifference = x1 - x2,
            reverseHorizontalDifference = x2 - x1,
            verticalDifference = Math.abs(y2 - y1);

        if (Math.abs(horizontalDifference) > verticalDifference) {
            if (horizontalDifference <= -60) {
                hourlyMenu.classList.remove('hourly__weather--active');
                horizontalDifference = 0;
            }
            if (horizontalDifference >= 60) {
                hourlyMenu.classList.add('hourly__weather--active');
                horizontalDifference = 0;
            }
        }

        if (verticalDifference > Math.abs(horizontalDifference) && verticalDifference >= 60) {
            console.log('Go Ghoul top!!!');
            app.classList.add('top');
            verticalDifference = 0;
        }

    });
}

showRightMenu();
