import React from 'react';
import './App.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

function App() {
  return (
    <div id='container'>
      <header>
        <h1>Previsão do tempo</h1>
      </header>

      <main>
        <div id="weather-info">
          <span id="city-name">Niterói, RJ - Brasil</span>

          <span id="temperature">20ºC Nublado</span>

          <section id="more-info">
            <div>
              <div id='limit-temperatures'>
                <div id="min">
                  <Icon icon='arrow-down' />
                  16ºC
                </div>
                <div id="max">
                  <image />
                  25ºC
                </div>
              </div>

              <div id='wind-speed'>
                Vento: <span>18km/h</span>
              </div>
            </div>

            <div>
              <div id='feels-like'>
                Sensação: <span>19ºC</span>
              </div>

              <div id='air-humidity'>
                Umidade: <span>89%</span>
              </div>
            </div>
          </section>

          <div className='line-separator' />

          <section id="next-days">
            <div>
              Terça
              <span></span>
            </div>
            <div>
              Quarta
              <span>18ºC - 26ºC</span>
            </div>
            <div>
              Quinta
              <span>18ºC - 26ºC</span>
            </div>
            <div>
              Sexta
              <span>18ºC - 26ºC</span>
            </div>
            <div>
              Sábado
              <span>18ºC - 26ºC</span>
            </div>
          </section>
        </div>

        <input
          type='text'
          placeholder='Insira aqui o nome da cidade'
        >

        </input>

        <div className='line-separator' />

        <section id='capitals'>
          <h3>Capitais</h3>

          <table>
            <tr>
              <th>Min</th>
              <th>Max</th>
              <th></th>
            </tr>
            <tr>
              <td>10ºC</td>
              <td>15ºC</td>
              <td>São Paulo</td>
            </tr>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
