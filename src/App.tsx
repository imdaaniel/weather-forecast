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
  const [capitalsWeatherData, setCapitalsWeatherData] = useState<NextDaysData[]>([]);
  
  const [tempUnit, setTempUnit] = useState('C');

  useEffect(() => {
    const capitalsList = [
      {
        name: 'Rio de Janeiro',
        lat: -22.9110137,
        lon: -43.2093727
      },
      {
        name: 'São Paulo',
        lat: -23.5506507,
        lon: -46.6333824
      },
      {
        name: 'Belo Horizonte',
        lat: -19.9227318,
        lon: -43.9450948
      },
      {
        name: 'Brasília',
        lat: -15.7934036,
        lon: -47.8823172
      },
      {
        name: 'Belém',
        lat: -1.45056,
        lon: -48.4682453
      },
      {
        name: 'Salvador',
        lat: -12.9822499,
        lon: -38.4812772
      },
      {
        name: 'Curitiba',
        lat: -25.4295963,
        lon: -49.2712724
      },
      {
        name: 'Fortaleza',
        lat: -3.7304512,
        lon: -38.5217989
      },
      {
        name: 'Manaus',
        lat: -3.1316333,
        lon: -59.9825041
      },
      {
        name: 'João Pessoa',
        lat: -7.1215981,
        lon: -34.882028
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
      .then((data): NextDaysData => ({
        name: data.name,
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

  const handleSuggestionClick = (city: CitySuggestion) => {
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
              return index === 5 ? ( <>
                <tr id='second-table-title' key='second-table-title'>
                  <th scope='col'>Min</th>
                  <th scope='col'>Max</th>
                  <th scope='col'></th>
                </tr>
                <tr key={index}>
                  <td>{Math.trunc(capital.min)}º</td>
                  <td>{Math.trunc(capital.max)}º</td>
                  <td>{capital.name}</td>
                </tr>
              </> ) : (
                <tr key={index}>
                  <td>{Math.trunc(capital.min)}º</td>
                  <td>{Math.trunc(capital.max)}º</td>
                  <td>{capital.name}</td>
                </tr>
              );
            })}
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
