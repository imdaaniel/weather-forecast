type WeatherApiParams = {
  lat: number;
  lon: number;
  appid?: string;
  units: 'imperial' | 'metric';
  lang: 'en' | 'pt_br';
};

export default WeatherApiParams;