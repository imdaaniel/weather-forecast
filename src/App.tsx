import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import './assets/css/App.css';
import SuggestionList from './components/SuggestionList/SuggestionList';
import CitySuggestion from './interfaces/CitySuggestion';
import RadioSelector from './components/RadioSelector/RadioSelector';
import Loading from './components/Loading/Loading';

interface ICurrentWeatherData {
  temp: number;
  current_weather: string;
  min: number;
  max: number;
  wind_speed: number;
  feels_like: number;
  air_humidity: number;
}

interface NextDaysData {
  name: string;
  index: number;
  min: number;
  max: number;
}

interface CapitalData {
  name: string;
  lat: number;
  lon: number;
  min: number;
  max: number;
}

interface WeatherApiParams {
  lat: number;
  lon: number;
  appid: string;
  units: 'imperial' | 'metric';
  lang: 'en' | 'pt_br';
};

interface CountrySettings {
  [key: string]: {
    label: {
      title: string;
      capitals: string;
      placeholder: string;
      wind: string;
      feelsLike: string;
      humidity: string;
      days: string[];
    };
    temperature: string;
    speed: string;
    unitSystem: WeatherApiParams['units'];
    lang: WeatherApiParams['lang'];
  };
};

function App() {
  const openWeatherAppId = '4d1b55062e29a4b921f97d8a9c484973';
  const weatherApiUrl = 'https://api.openweathermap.org';

  const [searchInputValue, setSearchInputValue]= useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  const [showCityWeatherData, setShowCityWeatherData] = useState(false);
  
  const [currentCity, setCurrentCity] = useState<CitySuggestion | null>(null);
  const [currentCityWeather, setCurrentCityWeather] = useState<ICurrentWeatherData | null>(null); 
  const [currentWeatherIsLoading, setCurrentWeatherIsLoading] = useState(false);

  const [nextDaysForecastData, setNextDaysForecastData] = useState<NextDaysData[]>([]);
  const [capitalsWeatherData, setCapitalsWeatherData] = useState<CapitalData[]>([]);
  
  const [currentCountry, setCurrentCountry] = useState('US');
  const lastRequestedCountry = useRef('');

  const countrySettings:CountrySettings = {
    BR: {
      temperature: 'C',
      speed: 'km/h',
      unitSystem: 'metric',
      lang: 'pt_br',
      label: {
        title: 'Previsão do tempo',
        capitals: 'Capitais',
        placeholder: 'Digite o nome da cidade',
        wind: 'Vento',
        feelsLike: 'Sensação',
        humidity: 'Umidade',
        days: [
          'Domingo',
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
        ],
      }
    },
    US: {
      temperature: 'F',
      speed: 'mph',
      unitSystem: 'imperial',
      lang: 'en',
      label: {
        title: 'Weather forecast',
        capitals: 'Capitals',
        placeholder: 'Enter the city name',
        wind: 'Wind',
        feelsLike: 'Feels Like',
        humidity: 'Humidity',
        days: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
      }
    },
  }

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
      const queryParams = prepareQueryParams(capitalsList[i]);
      
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
    .then(() => lastRequestedCountry.current = currentCountry);

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
      handleSuggestionClick(currentCity);
    }
  }, [currentCountry]);

  const displayFahrenheitTemp = (temp: number, showUnit = true): string => {
    // F to C
    temp = currentCountry === 'BR' ? (temp - 32) * (5/9) : temp;
    temp = Math.trunc(temp);

    return showUnit ? `${temp}º${countrySettings[currentCountry].temperature}` : `${temp}`;
  }

  const displayTemperature = (temp: number | undefined, showUnit = true): string => {
    if (!temp) return '';

    if (lastRequestedCountry.current === 'US' && currentCountry === 'BR') {
      // F to C
      return displayFahrenheitTemp(temp, showUnit);
    } else if (lastRequestedCountry.current === 'BR' && currentCountry === 'US') {
      // C to F
      temp = temp * (9/5) + 32;
    }
    temp = Math.trunc(temp);

    return showUnit ? `${temp}º${countrySettings[currentCountry].temperature}` : temp.toString();
  }

  const displaySpeed = (speed: number | undefined): string => {
    if (!speed) return '';

    if (lastRequestedCountry.current === 'US' && currentCountry === 'BR') {
      // Mph to Km/h
      speed *= 1.609344;
    } else if (lastRequestedCountry.current === 'BR' && currentCountry === 'US') {
      // Km/h to Mph
      speed /= 1.609344;
    }

    return `${Math.trunc(speed)}${countrySettings[currentCountry].speed}`;
  }

  const prepareQueryParams = (city: CitySuggestion): string => {
    const params:WeatherApiParams = {
      lat: city.lat,
      lon: city.lon,
      units: countrySettings[currentCountry].unitSystem,
      lang: countrySettings[currentCountry].lang,
      appid: openWeatherAppId,
    };

    return new URLSearchParams(params as any).toString();
  }

  const handleSuggestionClick = (city: CitySuggestion) => {
    const queryParams = prepareQueryParams(city);
    
    const getCurrentWeather = async () => {
      setCurrentWeatherIsLoading(true);
      
      // remove
      setTimeout(async () => {
  
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
        .then(() => lastRequestedCountry.current = currentCountry)
        .then(() => setSearchInputValue(''));
      }, 4000);
    }

    const getNextDaysForecast = async () => {
      const getDayName = (index: number): string => countrySettings[currentCountry].label.days[index] || '';

      interface ForecastApiResponse {
        dt: number;
        main: {
          temp_min: number;
          temp_max: number;
        }
      }

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

        const dayName = getDayName(dayNumber);

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
      .then(() => lastRequestedCountry.current = currentCountry)
      .then(() => setShowCityWeatherData(true));
    }

    setCurrentCityWeather(null);
    setCurrentCity(city);
    !showCityWeatherData && setShowCityWeatherData(true);

    getCurrentWeather();
    getNextDaysForecast();
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
            <span>{displayTemperature(currentCityWeather?.temp)}</span>

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
                  {displayTemperature(currentCityWeather?.min, false)}
                </div>
                <div id='max'>
                  <i>
                    <Icon icon={faArrowUp} />
                  </i>
                  {displayTemperature(currentCityWeather?.max, false)}
                </div>
              </Loading>

              <Loading isLoading={currentWeatherIsLoading} id='wind-speed'>
                <span className='light-text'>{countrySettings[currentCountry].label.wind}: </span>
                <span>{displaySpeed(currentCityWeather?.wind_speed)}</span>
              </Loading>
            </div>

            <div>
              <Loading isLoading={currentWeatherIsLoading} id='feels-like'>
                <span className='light-text'>{countrySettings[currentCountry].label.feelsLike}: </span>
                <span>{displayTemperature(currentCityWeather?.feels_like)}</span>
              </Loading>

              <Loading isLoading={currentWeatherIsLoading} id='air-humidity'>
                <span className='light-text'>{countrySettings[currentCountry].label.humidity}: </span>
                <span>{currentCityWeather?.air_humidity ? `${currentCityWeather?.air_humidity}%` : ''}</span>
              </Loading>
            </div>
          </section>          

          <div className='line-separator' />

          {nextDaysForecastData && (
            <section id='next-days'>
              {nextDaysForecastData.map((day, index) => (
                <div key={index}>
                  <span className='day-name'>{countrySettings[currentCountry].label.days[day.index].slice(0, 3)}</span>
                  <div className='temperatures'>
                    <span className='min'>{displayTemperature(day.min, false)}º</span>
                    <span className='max'>{displayTemperature(day.max, false)}º</span>
                  </div>
                </div>
              ))}
            </section>
          )}
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
                  <td>{displayFahrenheitTemp(capital.min)}</td>
                  <td>{displayFahrenheitTemp(capital.max)}</td>
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
