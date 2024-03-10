let weatherApi = 'https://api.weatherapi.com/v1/forecast.json?key=600869ee39c24203868113610241802&q=Yaroslavl&days=1&aqi=no&alerts=no';

document.querySelector('.search__container').addEventListener('submit', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('.search__input');
    geoStatus.innerHTML = `${searchInput.value}`
    weatherApi = `https://api.weatherapi.com/v1/forecast.json?key=600869ee39c24203868113610241802&q=${searchInput.value}&days=1&aqi=no&alerts=no`;
    getInfo();
    searchInput.value = '';
});

const app = document.querySelector('.app'),
    hourItems = document.querySelectorAll('.hourly__weather--item'),
    geoStatus = app.querySelector('.location__geo'),
    hourlyMenu = document.querySelector('.hourly__weather'),
    detailsMenu = document.querySelector('.details'),
    searchMenu = document.querySelector('.search__container'),
    shadowContainer = document.querySelector('.app__shadow');

let weatherDB = {
    date: 0, avgTemp: 0, maxTemp: 0, minTemp: 0, sunrise: 0, sunset: 0, dayDescr: 0, icon: 0
};

function dataRender() {

    let k = 6;

    function convertImg(description) {
        if (description === 'Sunny' || description === 'Partly cloudy' || description === 'Overcast' || description === 'Mist') {
            return `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_19_168)">
<path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 1V3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 21V23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.21997 4.21997L5.63997 5.63997" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.36 18.36L19.78 19.78" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 12H3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 12H23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.21997 19.78L5.63997 18.36" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.36 5.63997L19.78 4.21997" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_19_168">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
            `
        } else {
            return `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_19_136)">
<path d="M8 19V21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 13V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0001 19V21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0001 13V15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 21V23" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 15V17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 16.58C21.0513 16.1195 21.9121 15.3115 22.4381 14.2915C22.9641 13.2715 23.1232 12.1016 22.8886 10.9781C22.6541 9.85472 22.0402 8.84617 21.1501 8.12179C20.2599 7.39742 19.1477 7.00131 18 6.99996H16.74C16.4231 5.77248 15.8189 4.63791 14.9773 3.68976C14.1358 2.74161 13.081 2.00703 11.8998 1.54658C10.7186 1.08612 9.44494 0.912974 8.18372 1.0414C6.92249 1.16983 5.70984 1.59615 4.64573 2.28524C3.58161 2.97433 2.6965 3.90644 2.06334 5.00475C1.43018 6.10307 1.06711 7.33613 1.00404 8.60231C0.940984 9.86848 1.17974 11.1315 1.70064 12.2873C2.22153 13.4431 3.00965 14.4585 4.00003 15.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_19_136">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
            `
        }

    }

    document.querySelector('.content__box').innerHTML = `
        <p class="insync">in sync</p>
        <div id="date">${weatherDB[0].date}</div>
        <div id="avg__temp">${weatherDB[0].avgTemp}°C</div>
        <div class="temp__container">
            <div class="min__temp">
                <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M1.09787 9.66033C1.15883 9.59921 1.23125 9.55073 1.31098 9.51764C1.39071 9.48456 1.47618 9.46753 1.5625 9.46753C1.64882 9.46753 1.73429 9.48456 1.81402 9.51764C1.89375 9.55073 1.96616 9.59921 2.02712 9.66033L5.5 13.1345L8.97287 9.66033C9.0961 9.5371 9.26323 9.46787 9.4375 9.46787C9.61176 9.46787 9.7789 9.5371 9.90212 9.66033C10.0253 9.78355 10.0946 9.95068 10.0946 10.125C10.0946 10.2992 10.0253 10.4664 9.90212 10.5896L5.96462 14.5271C5.90366 14.5882 5.83124 14.6367 5.75152 14.6698C5.67179 14.7028 5.58632 14.7199 5.5 14.7199C5.41368 14.7199 5.32821 14.7028 5.24848 14.6698C5.16875 14.6367 5.09633 14.5882 5.03537 14.5271L1.09787 10.5896C1.03676 10.5286 0.988271 10.4562 0.955187 10.3765C0.922104 10.2967 0.905075 10.2113 0.905075 10.125C0.905075 10.0386 0.922104 9.95316 0.955187 9.87343C0.988271 9.79371 1.03676 9.72129 1.09787 9.66033Z"
                          fill="#616161"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M5.5 0.28125C5.67405 0.28125 5.84097 0.350391 5.96404 0.473461C6.08711 0.596532 6.15625 0.763452 6.15625 0.9375V12.75C6.15625 12.924 6.08711 13.091 5.96404 13.214C5.84097 13.3371 5.67405 13.4062 5.5 13.4062C5.32595 13.4062 5.15903 13.3371 5.03596 13.214C4.91289 13.091 4.84375 12.924 4.84375 12.75V0.9375C4.84375 0.763452 4.91289 0.596532 5.03596 0.473461C5.15903 0.350391 5.32595 0.28125 5.5 0.28125Z"
                          fill="#616161"/>
                </svg>
                <p id="min__digit">${weatherDB[0].minTemp}°C</p>
            </div>
            <div class="max__temp">
                <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M9.90213 5.33967C9.84117 5.40079 9.76875 5.44927 9.68902 5.48236C9.60929 5.51544 9.52382 5.53247 9.4375 5.53247C9.35118 5.53247 9.26571 5.51544 9.18598 5.48236C9.10625 5.44927 9.03384 5.40079 8.97288 5.33967L5.5 1.86548L2.02713 5.33967C1.9039 5.4629 1.73677 5.53213 1.5625 5.53213C1.38824 5.53213 1.2211 5.4629 1.09788 5.33967C0.974651 5.21645 0.905424 5.04932 0.905424 4.87505C0.905424 4.70078 0.974651 4.53365 1.09788 4.41042L5.03538 0.472921C5.09634 0.411807 5.16876 0.36332 5.24848 0.330236C5.32821 0.297153 5.41368 0.280124 5.5 0.280124C5.58632 0.280124 5.67179 0.297153 5.75152 0.330236C5.83125 0.36332 5.90367 0.411807 5.96463 0.472921L9.90213 4.41042C9.96324 4.47138 10.0117 4.5438 10.0448 4.62353C10.0779 4.70326 10.0949 4.78873 10.0949 4.87505C10.0949 4.96137 10.0779 5.04684 10.0448 5.12657C10.0117 5.20629 9.96324 5.27871 9.90213 5.33967Z"
                          fill="#616161"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M5.5 14.7188C5.32595 14.7188 5.15903 14.6496 5.03596 14.5265C4.91289 14.4035 4.84375 14.2365 4.84375 14.0625L4.84375 2.25C4.84375 2.07595 4.91289 1.90903 5.03596 1.78596C5.15903 1.66289 5.32595 1.59375 5.5 1.59375C5.67405 1.59375 5.84097 1.66289 5.96404 1.78596C6.08711 1.90903 6.15625 2.07595 6.15625 2.25L6.15625 14.0625C6.15625 14.2365 6.08711 14.4035 5.96404 14.5265C5.84097 14.6496 5.67405 14.7188 5.5 14.7188Z"
                          fill="#616161"/>
                </svg>
                <p id="max__digit">${weatherDB[0].maxTemp}°C</p>

            </div>
        </div>
        <div class="descr__container">
            <div class="descr__icon">
                ${convertImg(weatherDB[0].dayDescr)}
            </div>
            <p class="descr__text">${weatherDB[0].dayDescr}</p>
        </div>
        <div class="sun__status">
            <div class="sun__up">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_19_42)">
                        <path d="M14.875 15.75C14.875 14.5897 14.4141 13.4769 13.5936 12.6564C12.7731 11.8359 11.6603 11.375 10.5 11.375C9.33968 11.375 8.22688 11.8359 7.40641 12.6564C6.58594 13.4769 6.125 14.5897 6.125 15.75"
                              stroke="#616161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 1.75V7.875" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M3.6925 8.9425L4.935 10.185" stroke="#616161" stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M0.875 15.75H2.625" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M18.375 15.75H20.125" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M16.065 10.185L17.3075 8.9425" stroke="#616161" stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M20.125 19.25H0.875" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M7 5.25L10.5 1.75L14 5.25" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_19_42">
                            <rect width="21" height="21" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <p class="up">${weatherDB[0].sunrise}</p>
            </div>
            <div class="sun__down">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_19_53)">
                        <path d="M14.875 15.75C14.875 14.5897 14.4141 13.4769 13.5936 12.6564C12.7731 11.8359 11.6603 11.375 10.5 11.375C9.33968 11.375 8.22688 11.8359 7.40641 12.6564C6.58594 13.4769 6.125 14.5897 6.125 15.75"
                              stroke="#616161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 7.875V1.75" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M3.6925 8.9425L4.93501 10.185" stroke="#616161" stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M0.875 15.75H2.625" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M18.375 15.75H20.125" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M16.065 10.185L17.3075 8.9425" stroke="#616161" stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M20.125 19.25H0.875" stroke="#616161" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M14 4.375L10.5 7.875L7 4.375" stroke="#616161" stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_19_53">
                            <rect width="21" height="21" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <p class="down">${weatherDB[0].sunset}</p>
            </div>
        </div>        
    `;
    detailsMenu.querySelector('.details__list').innerHTML = `
        <div onclick="" data-arrow="details" onclick="" class="arrow details__button">
                <svg onclick="" class="details__arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20"
                     height="20">
                    <g onclick="" class="details__arrow" id="_01_align_center" data-name="01 align center">
                        <polygon class="details__arrow" points="24 1.414 22.586 0 12 10.586 1.414 0 0 1.414 10.586 12 0 22.586 1.414 24 12 13.414 22.586 24 24 22.586 13.414 12 24 1.414"/>
                    </g>
                </svg>
            </div>
            <li class="details__item">
                <p class="details__item--title">Precipitation</p>
                <p class="details__item--value">${weatherDB[0].precipitation}mm</p>
            </li>
            <li class="details__item">
                <p class="details__item--title">SE Wind</p>
                <p class="details__item--value">${weatherDB[0].windSpeed}</p>
            </li>
            <li class="details__item">
                <p class="details__item--title">Humidity</p>
                <p class="details__item--value">${weatherDB[0].humidity}mm</p>
            </li>
            <li class="details__item">
                <p class="details__item--title">Moon</p>
                <p class="details__item--value">${weatherDB[0].moon}</p>
            </li>
            <li class="details__item">
                <p class="details__item--title">UV</p>
                <p class="details__item--value">${weatherDB[0].uv}</p>
            </li>
            <li class="details__item">
                <p class="details__item--title">Pressure</p>
                <p class="details__item--value">${weatherDB[0].is}</p>
            </li>
    `;

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
        convertedResult = await result.json(),
        weatherInfo = convertedResult.forecast.forecastday[0];

    weatherDB = [{
        date: weatherInfo["date"],
        avgTemp: weatherInfo["day"]["avgtemp_c"],
        maxTemp: weatherInfo["day"]["maxtemp_c"],
        minTemp: weatherInfo["day"]["mintemp_c"],
        sunrise: weatherInfo["astro"]["sunrise"],
        sunset: weatherInfo["astro"]["sunset"],
        dayDescr: weatherInfo["day"]["condition"]["text"],
        icon: weatherInfo["day"]["condition"]["icon"],
        windSpeed: weatherInfo["day"]["maxwind_mph"],
        uv: weatherInfo["day"]["uv"],
        humidity: weatherInfo["day"]["avghumidity"],
        precipitation: weatherInfo["day"]["totalprecip_mm"],
        is: weatherInfo["day"]["avgvis_km"],
        moon: weatherInfo["astro"]["is_moon_up"],
    },

        [{
            temp: weatherInfo["hour"][6]["temp_c"], icon: weatherInfo["hour"][6]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][9]["temp_c"], icon: weatherInfo["hour"][9]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][12]["temp_c"], icon: weatherInfo["hour"][12]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][15]["temp_c"], icon: weatherInfo["hour"][15]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][18]["temp_c"], icon: weatherInfo["hour"][18]["condition"]["text"]
        }, {
            temp: weatherInfo["hour"][21]["temp_c"], icon: weatherInfo["hour"][21]["condition"]["text"]
        },]];

    dataRender();
}

getInfo();

function showRightMenu() {
    let x1, y1;

    app.addEventListener('touchstart', (event) => {
        x1 = event.touches[0].clientX;
        y1 = event.touches[0].clientY;
    });

    app.addEventListener('touchmove', (event) => {
        if (!x1 || !y1) {
            return false;
        }

        let x2 = event.touches[0].clientX, y2 = event.touches[0].clientY,
            horizontalDifference = x1 - x2,
            verticalDifference = Math.abs(y2 - y1);

        if (Math.abs(horizontalDifference) > verticalDifference) {
            let index = 0;
            if (horizontalDifference <= -60 && !hourlyMenu.classList.contains('hourly__weather--active') && !searchMenu.classList.contains('search--active')) {
                detailsMenu.classList.add('details__menu--active');
                document.querySelector('.app__shadow').classList.add('app__shadow--on');
                horizontalDifference = 0;
            }
            if (horizontalDifference >= 60 && !detailsMenu.classList.contains('details__menu--active') && !searchMenu.classList.contains('search--active')) {
                hourlyMenu.classList.add('hourly__weather--active');
                document.querySelector('.app__shadow').classList.add('app__shadow--on');
                horizontalDifference = 0;
            }
        }

        if (verticalDifference > Math.abs(horizontalDifference) && verticalDifference >= 100 && !detailsMenu.classList.contains('details__menu--active') && !hourlyMenu.classList.contains('hourly__weather--active')) {
            searchMenu.classList.add('search--active');
            document.querySelector('.app__shadow').classList.add('app__shadow--on');
            document.querySelector('.search__arrow').classList.add('search__arrow--active');
            verticalDifference = 0;
        }

    });
}

window.addEventListener('click', (event) => {
    if (event.target.closest('[data-arrow]')) {
        switch (event.target.closest('[data-arrow]').getAttribute('data-arrow')) {
            case 'hourly':
                hourlyMenu.classList.remove('hourly__weather--active');
                shadowContainer.classList.remove('app__shadow--on');
                shadowContainer.classList.remove('search__arrow--active');
                break

            case 'none':
                break

            case 'details':
                detailsMenu.classList.remove('details__menu--active');
                shadowContainer.classList.remove('app__shadow--on');
                shadowContainer.classList.remove('search__arrow--active');
                break

            case 'search':
                searchMenu.classList.remove('search--active');
                document.querySelector('.search__arrow').classList.remove('search__arrow--active');
                shadowContainer.classList.remove('app__shadow--on');
                break
        }
    } else if(event.target.closest('.app__shadow').classList.contains('app__shadow--on')) {
        console.log(event.target.closest('.app__shadow').classList.contains('app__shadow--on'))
        shadowContainer.classList.remove('app__shadow--on');
        hourlyMenu.classList.remove('hourly__weather--active');
        detailsMenu.classList.remove('details__menu--active');
        searchMenu.classList.remove('search--active');
        shadowContainer.classList.remove('search__arrow--active');
    }
});

showRightMenu();