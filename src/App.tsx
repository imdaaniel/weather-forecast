import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import './assets/css/App.css';
import SuggestionList from './components/SuggestionList/SuggestionList';
import CitySuggestion from './interfaces/CitySuggestion';

interface ICurrentWeatherData {
  city_name: string;
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
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
};

function App() {
  const openWeatherAppId = '4d1b55062e29a4b921f97d8a9c484973';
  const weatherApiUrl = 'https://api.openweathermap.org';

  const [showWeatherInfo, setShowWeatherInfo] = useState(false);
  const [searchInputValue, setSearchInputValue]= useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [currentWeatherData, setCurrentWeatherData] = useState<ICurrentWeatherData>();
  const [nextDaysForecastData, setNextDaysForecastData] = useState<NextDaysData[]>([]);
  const [capitalsWeatherData, setCapitalsWeatherData] = useState<CapitalData[]>([]);
  
  const [tempUnit, setTempUnit] = useState('C');

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
      const params:WeatherApiParams = {
        lat: capitalsList[i].lat,
        lon: capitalsList[i].lon,
        units: 'metric',
        lang: 'pt_br',
        appid: openWeatherAppId,
      };
  
      const queryParams = new URLSearchParams(params as any).toString();
      
      let cityDataPromise = axios.get(`${weatherApiUrl}/data/2.5/weather?${queryParams}`)
      .then(res => res.data)
      .then((data) => ({
        ...capitalsList[i],
        min: data.main.temp_min,
        max: data.main.temp_max,
      }));

      cityPromises.push(cityDataPromise);
    }

    Promise.all(cityPromises).then(capitalsData => setCapitalsWeatherData(capitalsData));

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
      showSuggestions && setShowSuggestions(false);
      return;
    }

    const delay = setTimeout(() => {
      searchLocationSuggestions().then(() => setShowSuggestions(true));
    }, 250);

    return () => clearTimeout(delay);
  }, [searchInputValue]);

  const handleSuggestionClick = (city: CitySuggestion | CapitalData) => {
    console.log(city);

    const params:WeatherApiParams = {
      lat: city.lat,
      lon: city.lon,
      units: 'metric',
      lang: 'pt_br',
      appid: openWeatherAppId,
    };

    const queryParams = new URLSearchParams(params as any).toString();
    
    const getCurrentWeather = async () => {
      await axios.get(`${weatherApiUrl}/data/2.5/weather?${queryParams}`)
      .then(res => res.data)
      .then(data => setCurrentWeatherData({
        city_name: city.name,
        temp: Math.trunc(data.main.temp),
        current_weather: data.weather[0].description,
        min: Math.trunc(data.main.temp_min),
        max: Math.trunc(data.main.temp_max),
        wind_speed: Math.trunc(data.wind.speed),
        feels_like: Math.trunc(data.main.feels_like),
        air_humidity: data.main.humidity,
      }))
      .then(() => setShowWeatherInfo(true))
      .then(() => setShowSuggestions(false))
      .then(() => setSearchInputValue(''));
    }

    const getNextDaysForecast = async () => {
      const getDayName = (index: number): string => {
        const days = [
          'Domingo',
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
        ];

        return days[index] || '';
      };

      interface ForecastApiResponse {
        dt: number;
        main: {
          temp_min: number;
          temp_max: number;
        }
      }

      let nextDaysData:NextDaysData[] = [];
      let currentIndex = 1;
      const today = new Date().getDay();

      await axios.get(`${weatherApiUrl}/data/2.5/forecast?${queryParams}`)
      .then(res => res.data.list)
      .then((list:ForecastApiResponse[]) => list.forEach(timestamp => {
        const dayNumber = new Date(timestamp.dt * 1000).getDay();

        if (dayNumber === today) {
          return;
        }

        const dayName = getDayName(dayNumber);

        let currentDay = nextDaysData[currentIndex - 1];
        
        if (!currentDay) {
          nextDaysData[currentIndex - 1] = {
            name: dayName,
            min: timestamp.main.temp_min,
            max: timestamp.main.temp_max,
          };
        } else if (currentDay.name !== dayName) {
          nextDaysData[currentIndex] = {
            name: dayName,
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
      .then(() => setShowWeatherInfo(true));
    }

    getCurrentWeather();
    getNextDaysForecast();
  }

  return (
    <div id='container'>
      <header>
        <h1>Previsão do tempo 🌤️</h1>
      </header>

      <main>
        { showWeatherInfo && (
        <div id='weather-info'>
          <button
            id='close-weather-info'
            onClick={() => setShowWeatherInfo(!showWeatherInfo)}
          >
            <i>
              <Icon icon={faXmark} />
            </i>
          </button>
          
          <span id='city-name'>{currentWeatherData?.city_name}</span>

          {currentWeatherData && ( <>
            <span id='temperature'>{currentWeatherData?.temp}º
              <span id="current-weather-description">
                {currentWeatherData?.current_weather}
              </span>
            </span>

            <section id='more-info'>
              <div>
                <div id='limit-temperatures'>
                  <div id='min'>
                    <i>
                      <Icon icon={faArrowDown} />
                    </i>
                    {currentWeatherData?.min}
                  </div>
                  <div id='max'>
                    <i>
                      <Icon icon={faArrowUp} />
                    </i>
                    {currentWeatherData?.max}
                  </div>
                </div>

                <div id='wind-speed'>
                  <span className='light-text'>Vento: </span>{currentWeatherData?.wind_speed}km/h
                </div>
              </div>

              <div>
                <div id='feels-like'>
                  <span className='light-text'>Sensação: </span>{currentWeatherData?.feels_like}º
                </div>

                <div id='air-humidity'>
                  <span className='light-text'>Umidade: </span>{currentWeatherData?.air_humidity}%
                </div>
              </div>
            </section>
          </> )}

          <div className='line-separator' />

          {nextDaysForecastData && (
            <section id='next-days'>
              {nextDaysForecastData.map((day, index) => (
                <div key={index}>
                  <span className='day-name'>{day.name.slice(0, 3)}</span>
                  <div className='temperatures'>
                    <span className='min'>{Math.trunc(day.min)}º</span>
                    <span className='max'>{Math.trunc(day.max)}º</span>
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
            placeholder='Insira aqui o nome da cidade'
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

          {showSuggestions && (
            <SuggestionList
              data={suggestions}
              onClick={(city: CitySuggestion) => handleSuggestionClick(city)}
            />
          )}
        </section>

        <div className='line-separator' />

        <section id='capitals'>
          <h3>Capitais</h3>

          <table>
            <tr>
              <th scope='col'>Min</th>
              <th scope='col'>Max</th>
              <th scope='col'></th>
            </tr>
            {capitalsWeatherData && capitalsWeatherData.map((capital, index) => {
              const lineContent = (
                <tr key={index} onClick={() => handleSuggestionClick(capital)}>
                  <td>{Math.trunc(capital.min)}º</td>
                  <td>{Math.trunc(capital.max)}º</td>
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
