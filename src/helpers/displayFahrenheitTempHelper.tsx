import countrySettings from "../settings/countrySettings";

const displayFahrenheitTempHelper = (temp: number, currentCountry: string, showUnit = true): string => {
  // F to C
  temp = currentCountry === 'BR' ? (temp - 32) * (5/9) : temp;
  temp = Math.trunc(temp);

  return showUnit ? `${temp}º${countrySettings[currentCountry].temperature}` : `${temp}`;
}

export default displayFahrenheitTempHelper;