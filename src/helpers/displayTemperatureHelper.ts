import countrySettings from "../settings/countrySettings";
import displayFahrenheitTempHelper from "./displayFahrenheitTempHelper";

const displayTemperatureHelper = (
  temp: number | undefined,
  lastRequestedCountry: string,
  currentCountry: string,
  showUnit = true): string => {
  if (!temp) return '';

  if (lastRequestedCountry === 'US' && currentCountry === 'BR') {
    // F to C
    return displayFahrenheitTempHelper(temp, currentCountry, showUnit);
  } else if (lastRequestedCountry === 'BR' && currentCountry === 'US') {
    // C to F
    temp = temp * (9/5) + 32;
  }
  temp = Math.trunc(temp);

  return showUnit ? `${temp}º${countrySettings[currentCountry].temperature}` : temp.toString();
}

export default displayTemperatureHelper;