import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: {
    appid: '4d1b55062e29a4b921f97d8a9c484973',
  },
});