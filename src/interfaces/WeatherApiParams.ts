export default interface WeatherApiParams {
  lat: number;
  lon: number;
  appid?: string;
  units: 'imperial' | 'metric';
  lang: 'en' | 'pt_br';
};