import WeatherApiParams from "./WeatherApiParams";

type CountrySettings = {
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

export default CountrySettings;