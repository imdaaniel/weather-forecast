import countrySettings from "../settings/countrySettings";

const displaySpeedHelper = (
  speed: number | undefined,
  lastRequestedCountry: string,
  currentCountry: string): string => 
{
  if (!speed) return '';

  if (lastRequestedCountry === 'US' && currentCountry === 'BR') {
    // Mph to Km/h
    speed *= 1.609344;
  } else if (lastRequestedCountry === 'BR' && currentCountry === 'US') {
    // Km/h to Mph
    speed /= 1.609344;
  }

  const strSpeed = speed >= 1 ? Math.trunc(speed).toString() : speed.toFixed(2);

  return `${strSpeed}${countrySettings[currentCountry].speed}`;
}

export default displaySpeedHelper;