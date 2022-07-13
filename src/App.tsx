import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faXmark,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import './assets/css/App.css';

function App() {
  const openWeatherAppId = '4d1b55062e29a4b921f97d8a9c484973';

  const [showWeatherInfo, setShowWeatherInfo] = useState(true);
  const [searchInputValue, setSearchInputValue]= useState('');

  useEffect(() => {
    const searchLocationSuggestions = async () => {
      const geocodingApiUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  
      interface Suggestion {
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
      }
  
      const locations:Suggestion[] = await axios
      .get(`${geocodingApiUrl}?q=${searchInputValue}&appid=${openWeatherAppId}`
        + '&limit=5')
      .then(res => res.data);
      
  
      const suggestions = locations.map(location => ({
        name: `${location.name}, ${location.state ? `${location.state}, ` : ''}`
          + location.country,
        lat: location.lat,
        lon: location.lon,
      })).filter((suggestion, index, self) => ( // Remove duplicates
        index === self.findIndex(item => item.name === suggestion.name))
      );
  
      console.table(suggestions);
    }

    if (searchInputValue.length < 3) {
      return;
    }

    const delay = setTimeout(() => {
      searchLocationSuggestions();
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInputValue]);

  const handleSearch = () => {
    setShowWeatherInfo(!showWeatherInfo);
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
          
          <span id='city-name'>Niterói, RJ - Brasil</span>

          <span id='temperature'>20º Nublado</span>

          <section id='more-info'>
            <div>
              <div id='limit-temperatures'>
                <div id='min'>
                  <i>
                    <Icon icon={faArrowDown} />
                  </i>
                  16º
                </div>
                <div id='max'>
                  <i>
                    <Icon icon={faArrowUp} />
                  </i>
                  25º
                </div>
              </div>

              <div id='wind-speed'>
                <span className='light-text'>Vento: </span>18km/h
              </div>
            </div>

            <div>
              <div id='feels-like'>
                <span className='light-text'>Sensação: </span>19º
              </div>

              <div id='air-humidity'>
                <span className='light-text'>Umidade: </span>89%
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
          
          <button
            id='search-icon'
            onClick={() => handleSearch()}
          >
            <i>
              <Icon icon={faMagnifyingGlass} />
            </i>
          </button>
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
