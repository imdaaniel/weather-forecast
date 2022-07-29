import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';

import './assets/css/App.css';

import CitySuggestion from './interfaces/CitySuggestion';
import WeatherApiParams from './interfaces/WeatherApiParams';
import CurrentCityWeather from './interfaces/CurrentCityWeather';
import NextDaysData from './interfaces/NextDaysData';
import CapitalData from './interfaces/CapitalData';
import ForecastApiResponse from './interfaces/ForecastApiResponse';

import SuggestionList from './components/SuggestionList/SuggestionList';
import RadioSelector from './components/RadioSelector/RadioSelector';
import Loading from './components/Loading/Loading';

import countrySettings from './settings/countrySettings';
import displayFahrenheitTempHelper from './helpers/displayFahrenheitTempHelper';
import displaySpeedHelper from './helpers/displaySpeedHelper';
import displayTemperatureHelper from './helpers/displayTemperatureHelper';

function App() {
  const openWeatherAppId = '4d1b55062e29a4b921f97d8a9c484973';
  const weatherApiUrl = 'https://api.openweathermap.org';

  const [searchInputValue, setSearchInputValue]= useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  const [showCityWeatherData, setShowCityWeatherData] = useState(false);
  
  const [currentCity, setCurrentCity] = useState<CitySuggestion | null>(null);
  const [currentCityWeather, setCurrentCityWeather] = useState<CurrentCityWeather | null>(null); 
  const [currentWeatherIsLoading, setCurrentWeatherIsLoading] = useState(false);

  const [nextDaysForecastData, setNextDaysForecastData] = useState<NextDaysData[]>([]);
  const [nextDaysForecastIsLoading, setNextDaysForecastIsLoading] = useState(false);

  const [capitalsWeatherData, setCapitalsWeatherData] = useState<CapitalData[]>([]);
  
  const [currentCountry, setCurrentCountry] = useState('US');
  const lastRequestedCountry = useRef('');
  
  useEffect(() => {
    const capitalsList:CitySuggestion[] = [
      {
        name: 'London, England, GB',
        lat: 51.5073219,
        lon: -0.1276474,
      },
      {
        name: 'Paris, Ile-de-France, FR',
        lat: 48.8588897,
        lon: 2.3200410217200766,
      },
      {
        name: 'Madrid, Community of Madrid, ES',
        lat: 40.4167047,
        lon: -3.7035825,
      },
      {
        name: 'Tokyo, JP',
        lat: 35.6828387,
        lon: 139.7594549,
      },
      {
        name: 'Beijing, Beijing, CN',
        lat: 39.906217,
        lon: 116.3912757,
      },
      {
        name: 'Sao Paulo, Sao Paulo, BR',
        lat: -23.5506507,
        lon: -46.6333824,
      },
      {
        name: 'Berlin, Berlin, DE',
        lat: 52.5170365,
        lon: 13.3888599,
      },
      {
        name: 'Amsterdam, North Holland, NL',
        lat: 52.3727598,
        lon: 4.8936041,
      },
      {
        name: 'Washington, District of Columbia, US',
        lat: 38.8950368,
        lon: -77.0365427,
      },
      {
        name: 'Abu Dhabi, Abu Dhabi Emirate, AE',
        lat: 24.4538352,
        lon: 54.3774014,
      }
    ];
    
    const cityPromises = [];

    for (let i = 0; i < capitalsList.length; i++) {
      const queryParams = prepareQueryParams(capitalsList[i], true);
      
      let cityDataPromise = axios.get(`${weatherApiUrl}/data/2.5/weather?${queryParams}`)
      .then(res => res.data)
      .then((data) => ({
        ...capitalsList[i],
        min: data.main.temp_min,
        max: data.main.temp_max,
      }));

      cityPromises.push(cityDataPromise);
    }

    Promise.all(cityPromises)
    .then(capitalsData => setCapitalsWeatherData(capitalsData))
    .then(() => updateLastRequestedCountry());

    return () => {};
  }, []);

  useEffect(() => {
    const searchLocationSuggestions = async () => {
      interface Location {
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
      }
  
      const locations:Location[] = await axios
      .get(`${weatherApiUrl}/geo/1.0/direct?q=${searchInputValue}&appid=${openWeatherAppId}`
        + '&limit=5')
      .then(res => res.data);
      
      const suggestionsList:CitySuggestion[] = locations.map(location => ({
        name: `${location.name}, ${location.state ? `${location.state}, ` : ''}`
          + location.country,
        lat: location.lat,
        lon: location.lon,
      })).filter((suggestion, index, self) => ( // Remove duplicates
        index === self.findIndex(item => item.name === suggestion.name))
      );

      setSuggestions(suggestionsList);
    }

    if (searchInputValue.length < 3) {
      setSuggestions([]);
      return;
    }

    const searchDelay = setTimeout(() => {
      searchLocationSuggestions();
    }, 250);

    return () => clearTimeout(searchDelay);
  }, [searchInputValue]);

  useEffect(() => {
    if (currentCity) {
      getCurrentWeather(currentCity);
    }
  }, [currentCountry]);

  const prepareQueryParams = (city: CitySuggestion, fixedUnit = false): string => {
    const params:WeatherApiParams = {
      lat: city.lat,
      lon: city.lon,
      units: fixedUnit ? 'imperial' : countrySettings[currentCountry].unitSystem,
      lang: countrySettings[currentCountry].lang,
      appid: openWeatherAppId,
    };

    return new URLSearchParams(params as any).toString();
  }

  const updateLastRequestedCountry = () => {
    if (lastRequestedCountry.current !== currentCountry) {
      lastRequestedCountry.current = currentCountry;
    }
  }

  const getCurrentWeather = async (city: CitySuggestion) => {
    setCurrentWeatherIsLoading(true);
    const queryParams = prepareQueryParams(city);
    
    await axios.get(`${weatherApiUrl}/data/2.5/weather?${queryParams}`)
    .then(res => res.data)
    .then(data => setCurrentCityWeather({
      temp: Math.trunc(data.main.temp),
      current_weather: data.weather[0].description,
      min: Math.trunc(data.main.temp_min),
      max: Math.trunc(data.main.temp_max),
      wind_speed: Math.trunc(data.wind.speed),
      feels_like: Math.trunc(data.main.feels_like),
      air_humidity: data.main.humidity,
    }))
    .then(() => setCurrentWeatherIsLoading(false))
    .then(() => updateLastRequestedCountry())
    .then(() => setSearchInputValue(''));
  }

  const getNextDaysForecast = async (city: CitySuggestion) => {
    setNextDaysForecastIsLoading(true);
    const queryParams = prepareQueryParams(city, true);

    let nextDaysData:NextDaysData[] = [];
    let currentIndex = 1;
    const today = new Date().getUTCDay();

    await axios.get(`${weatherApiUrl}/data/2.5/forecast?${queryParams}`)
    .then(res => res.data.list)
    .then((list:ForecastApiResponse[]) => list.forEach(timestamp => {
      const dayNumber = new Date(timestamp.dt * 1000).getUTCDay();

      if (dayNumber === today) {
        return;
      }

      const dayName = countrySettings[currentCountry].label.days[dayNumber];

      let currentDay = nextDaysData[currentIndex - 1];
      
      if (!currentDay) {
        nextDaysData[currentIndex - 1] = {
          name: dayName,
          index: dayNumber,
          min: timestamp.main.temp_min,
          max: timestamp.main.temp_max,
        };
      } else if (currentDay.name !== dayName) {
        nextDaysData[currentIndex] = {
          name: dayName,
          index: dayNumber,
          min: timestamp.main.temp_min,
          max: timestamp.main.temp_max,
        };
        currentIndex += 1;
      } else if (timestamp.main.temp_min < currentDay.min) {
        nextDaysData[currentIndex - 1] = {
          ...currentDay,
          min: timestamp.main.temp_min,
        };
      } else if (timestamp.main.temp_max > currentDay.max) {
        nextDaysData[currentIndex - 1] = {
          ...currentDay,
          max: timestamp.main.temp_max,
        };
      }
    }))
    .then(() => setNextDaysForecastData(nextDaysData))
    .then(() => setNextDaysForecastIsLoading(false))
    .then(() => updateLastRequestedCountry());
  }

  const handleSuggestionClick = (city: CitySuggestion) => {
    setCurrentCityWeather(null);
    setCurrentCity(city);
    !showCityWeatherData && setShowCityWeatherData(true);

    getCurrentWeather(city);
    getNextDaysForecast(city);
  }

  return (
    <div id='container'>
      <header>
        <h1>{countrySettings[currentCountry].label.title} 🌤️</h1>
      </header>

      <main>
        <RadioSelector
          name='country'
          options={[
            {
              text: 'BR',
              value: 'BR',
            },
            {
              text: 'US',
              value: 'US',
            }
          ]}
          selected={currentCountry}
          onChange={(country: string) => setCurrentCountry(country)}
        />

        { showCityWeatherData && (
        <div id='weather-info'>
          <button
            id='close-weather-info'
            onClick={() => {
              setShowCityWeatherData(false);

              setCurrentCity(null);
              setCurrentCityWeather(null);
              setCurrentWeatherIsLoading(false);
              setNextDaysForecastData([]);
            }}
          >
            <i>
              <Icon icon={faXmark} />
            </i>
          </button>
          
          <span id='city-name'>{currentCity?.name}</span>

          <Loading id='temperature' isLoading={currentWeatherIsLoading}>
            <span>{displayTemperatureHelper(currentCityWeather?.temp, lastRequestedCountry.current, currentCountry)}</span>

            <span id="current-weather-description">
              {currentCityWeather?.current_weather}
            </span>
          </Loading>

          <section id='more-info'>
            <div>
              <Loading isLoading={currentWeatherIsLoading} id='limit-temperatures'>
                <div id='min'>
                  <i>
                    <Icon icon={faArrowDown} />
                  </i>
                  {displayTemperatureHelper(currentCityWeather?.min, lastRequestedCountry.current, currentCountry, false)}
                </div>
                <div id='max'>
                  <i>
                    <Icon icon={faArrowUp} />
                  </i>
                  {displayTemperatureHelper(currentCityWeather?.max, lastRequestedCountry.current, currentCountry, false)}
                </div>
              </Loading>

              <Loading isLoading={currentWeatherIsLoading} id='wind-speed'>
                <span className='light-text'>{countrySettings[currentCountry].label.wind}: </span>
                <span>{displaySpeedHelper(currentCityWeather?.wind_speed, lastRequestedCountry.current, currentCountry)}</span>
              </Loading>
            </div>

            <div>
              <Loading isLoading={currentWeatherIsLoading} id='feels-like'>
                <span className='light-text'>{countrySettings[currentCountry].label.feelsLike}: </span>
                <span>{displayTemperatureHelper(currentCityWeather?.feels_like, lastRequestedCountry.current, currentCountry)}</span>
              </Loading>

              <Loading isLoading={currentWeatherIsLoading} id='air-humidity'>
                <span className='light-text'>{countrySettings[currentCountry].label.humidity}: </span>
                <span>{currentCityWeather?.air_humidity ? `${currentCityWeather?.air_humidity}%` : ''}</span>
              </Loading>
            </div>
          </section>          

          <div className='line-separator' />

          <section id='next-days'>
            {nextDaysForecastIsLoading ? Array(5).fill(null).map((value, index) => (
              <Loading
                key={index}
                isLoading={true}
                tag='div'
              />
            )) : nextDaysForecastData.map((day, index) => (
              <div key={index}>
                <span className='day-name'>{countrySettings[currentCountry].label.days[day.index].slice(0, 3)}</span>
                <div className='temperatures'>
                  <span className='min'>{displayFahrenheitTempHelper(day.min, currentCountry, false)}º</span>
                  <span className='max'>{displayFahrenheitTempHelper(day.max, currentCountry, false)}º</span>
                </div>
              </div>
            ))}
          </section>
        </div>
        )}

        <section id='search'>
          <input
            id='search-input'
            type='text'
            placeholder={countrySettings[currentCountry].label.placeholder}
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
          />
          
          { searchInputValue.length > 0 && (
            <button
              id='search-input-clear-btn'
              onClick={() => setSearchInputValue('')}
            >
              <i>
                <Icon icon={faXmark} />
              </i>
            </button>
          )}

          {suggestions.length > 0 && (
            <SuggestionList
              data={suggestions}
              onClick={(city: CitySuggestion) => handleSuggestionClick(city)}
            />
          )}
        </section>

        <div className='line-separator' />

        <section id='capitals'>
          <h3>{countrySettings[currentCountry].label.capitals}</h3>

          <table>
            <tr>
              <th scope='col'>Min</th>
              <th scope='col'>Max</th>
              <th scope='col'></th>
            </tr>
            {capitalsWeatherData && capitalsWeatherData.map((capital, index) => {
              const lineContent = (
                <tr
                  key={index}
                  onClick={() => handleSuggestionClick({
                    name: capital.name,
                    lat: capital.lat,
                    lon: capital.lon
                  })}
                >
                  <td>{displayFahrenheitTempHelper(capital.min, currentCountry)}</td>
                  <td>{displayFahrenheitTempHelper(capital.max, currentCountry)}</td>
                  <td>{capital.name.substring(0, capital.name.indexOf(','))}</td>
                </tr>
              );
              
              return index === 5 ? ( <>
                <tr id='second-table-title' key='second-table-title'>
                  <th scope='col'>Min</th>
                  <th scope='col'>Max</th>
                  <th scope='col'></th>
                </tr>
                {lineContent}
              </> ) : lineContent;
            })}
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
