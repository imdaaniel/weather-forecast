type ForecastApiResponse = {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  }
};

export default ForecastApiResponse;