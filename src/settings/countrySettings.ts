import CountrySettings from "../types/CountrySettings";

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
};

export default countrySettings;