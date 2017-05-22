// Vue Material Design
Vue.use(VueMaterial);

// Define components
Vue.component('city-weather', {
  props: ['city'],
  template: `<div class="city-container">
               <div class="city-name">{{ city.text }}</div>
               <div class="city-weather"><img :src="city.weatherIconUrl" /></div>
               <div class="city-weather">{{ city.temp }}</div>
             </div>`
});

Vue.component('city-forecast', {
  props: ['forecast'],
  template: `<div class="md-subhead">
               <span class="forecast-date"><b>{{ forecast.dt_txt | formatDate }}</b></span>
               <span>{{ forecast.main.temp }}° with {{ forecast.weather[0].description }}</span>
             </div>`
});

// Date filter using moment.js
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('ddd hA')
  }
});

// our Vue
var weatherapp = new Vue({
  el: '#weatherapp',
  data: {
    cities: [
      { id: 0, text: 'Minneapolis', openWeatherId: 5037649, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 1, text: 'Boston', openWeatherId: 4930956, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 2, text: 'Chicago', openWeatherId: 4887398, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 3, text: 'Copenhagen', openWeatherId: 2618425, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 4, text: 'Lisbon', openWeatherId: 2267057, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 5, text: 'Barcelona', openWeatherId: 3128760, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 6, text: 'Madrid', openWeatherId: 3117735, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 7, text: 'Paris', openWeatherId: 2988507, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 8, text: 'London', openWeatherId: 2643743, temp: 0, weatherIconUrl: '', forecasts: {} },
      { id: 9, text: 'Duluth', openWeatherId: 5024719, temp: 0, weatherIconUrl: '', forecasts: {} }
    ],
    orderAscending: true
  },
  created: function() {
    // build string of City Weather IDs to send to OpenWeatherMap
    let cityIds = '';

    this.cities.forEach(function(city, index) {
      cityIds += city.openWeatherId + ',';
    });

    cityIds = cityIds.slice(0, -1);

    // http request to OpenWeatherMap for the 10 city temperatures
    axios.get('http://api.openweathermap.org/data/2.5/group', {
      params: {
        id: cityIds,
        units: 'imperial',
        APPID: 'f333c36f17612d7b693745b00991425a'
      }
    })
    .then(function (response) {
      response.data.list.forEach(function(city, index){
        weatherapp.cities[index].temp = city.main.temp + '°';
        weatherapp.cities[index].weatherIconUrl = 'http://openweathermap.org/img/w/' + city.weather[0].icon + '.png';
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  computed: {
    orderedCities: function () {
      if (this.orderAscending) {
        return this.cities.sort(function(a,b) {
                if (a.temp < b.temp)
                  return -1;
                if (a.temp > b.temp)
                  return 1;
                return 0;
               });
      } else {
        return this.cities.sort(function(a,b) {
                if (a.temp > b.temp)
                  return -1;
                if (a.temp < b.temp)
                  return 1;
                return 0;
               });
      }
    }
  },
  methods: {
    // http request for the city forecasts
    getForecast: function () {
      this.cities.forEach(function(city, index){
        axios.get('http://api.openweathermap.org/data/2.5/forecast', {
          params: {
            id: city.openWeatherId,
            units: 'imperial',
            APPID: 'f333c36f17612d7b693745b00991425a'
          }
        })
        .then(function (response) {
          weatherapp.cities[index].forecasts = response.data.list;
        })
        .catch(function (error) {
          console.log(error);
        });
      });
    },
    changeOrder: function () {
      if (this.orderAscending == true) {
        this.orderAscending = false;
      } else {
        this.orderAscending = true;
      }
    }
  }
});
