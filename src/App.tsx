import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  return (
    <div id='container'>
      <header>
        <h1>Previsão do tempo 🌤️</h1>
      </header>

      <main>
        <div id='weather-info'>
          <button id='close-weather-info'>
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

        <section id='search'>
          <input
            id='search-input'
            type='text'
            placeholder='Insira aqui o nome da cidade'
          />
          
          <button id='search-icon'>
            <i>
              <Icon icon={faMagnifyingGlass} />
            </i>
          </button>
        </section>
        

        <div className='line-separator' />

        <section id='capitals'>
          <h3>Capitais</h3>

          {/* <ul>
            <li>Min</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
            <li>Sao Paulo</li>
          </ul> */}

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
