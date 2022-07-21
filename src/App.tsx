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

function App() {
  const openWeatherAppId = '4d1b55062e29a4b921f97d8a9c484973';
  const weatherApiUrl = 'https://api.openweathermap.org';

  const [showWeatherInfo, setShowWeatherInfo] = useState(false);
  const [searchInputValue, setSearchInputValue]= useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [currentWeatherData, setCurrentWeatherData] = useState<ICurrentWeatherData>();
  const [tempUnit, setTempUnit] = useState('C');

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
    // Atual - /data/2.5/weather
    // 5 dias (intervalo de 3 horas) - /data/2.5/forecast
    console.log(city);
    
    const getCurrentWeather = async () => {
      interface CurrentWeatherParams {
        lat: number;
        lon: number;
        appid: string;
        units?: 'standard' | 'metric' | 'imperial';
        lang?: string;
      };

      const params:CurrentWeatherParams = {
        lat: city.lat,
        lon: city.lon,
        units: 'metric',
        lang: 'pt_br',
        appid: openWeatherAppId,
      };

      const queryParams = new URLSearchParams(params as any).toString();

      await axios.get(`${weatherApiUrl}/data/2.5/weather?${queryParams}`)
      .then(res => res.data)
      .then(data => setCurrentWeatherData({
        city_name: city.name,
        temp: data.main.temp,
        current_weather: data.weather[0].description,
        min: data.main.temp_min,
        max: data.main.temp_max,
        wind_speed: data.wind.speed,
        feels_like: data.main.feels_like,
        air_humidity: data.main.humidity,
      }))
      .then(() => setShowWeatherInfo(true))
      .then(() => setShowSuggestions(false))
      .then(() => setSearchInputValue(''));
    }

    const getNextDaysForecast = async () => {
      const forecastData = await axios
      .get(`${weatherApiUrl}/data/2.5/forecast?q=${searchInputValue}&appid=${openWeatherAppId}`
        + '&limit=5')
      .then(res => res.data);
    }

    getCurrentWeather();
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

          <span id='temperature'>{currentWeatherData?.temp}º {currentWeatherData?.current_weather}</span>

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

          <div className='line-separator' />

          <section id='next-days'>
            <div>
              <span className='day-name'>Ter</span>
              <div className='temperatures'>
                <span className='min'>18º</span>
                <span className='max'>25º</span>
              </div>
            </div>
            <div>
              <span className='day-name'>Qua</span>
              <div className='temperatures'>
                <span className='min'>18º</span>
                <span className='max'>25º</span>
              </div>
            </div>
            <div>
              <span className='day-name'>Qui</span>
              <div className='temperatures'>
                <span className='min'>18º</span>
                <span className='max'>25º</span>
              </div>
            </div>
            <div>
              <span className='day-name'>Sex</span>
              <div className='temperatures'>
                <span className='min'>18º</span>
                <span className='max'>25º</span>
              </div>
            </div>
            <div>
              <span className='day-name'>Sáb</span>
              <div className='temperatures'>
                <span className='min'>18º</span>
                <span className='max'>25º</span>
              </div>
            </div>
          </section>
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

            <tr>
              <td>18º</td>
              <td>27º</td>
              <td>Rio de Janeiro</td>
            </tr>

            <tr>
              <td>14º</td>
              <td>22º</td>
              <td>São Paulo</td>
            </tr>

            <tr>
              <td>21º</td>
              <td>32º</td>
              <td>Belo Horizonte</td>
            </tr>

            <tr>
              <td>24º</td>
              <td>37º</td>
              <td>Brasília</td>
            </tr>

            <tr>
              <td>24º</td>
              <td>37º</td>
              <td>Belém</td>
            </tr>

            <tr id='second-table-title'>
              <th scope='col'>Min</th>
              <th scope='col'>Max</th>
              <th scope='col'></th>
            </tr>

            <tr>
              <td>23º</td>
              <td>37º</td>
              <td>Salvador</td>
            </tr>

            <tr>
              <td>5º</td>
              <td>14º</td>
              <td>Curitiba</td>
            </tr>

            <tr>
              <td>21º</td>
              <td>32º</td>
              <td>Fortaleza</td>
            </tr>

            <tr>
              <td>24º</td>
              <td>37º</td>
              <td>Manaus</td>
            </tr>

            <tr>
              <td>28º</td>
              <td>40º</td>
              <td>João Pessoa</td>
            </tr>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
