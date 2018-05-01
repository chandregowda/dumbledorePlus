// let format = 'YYYY-MM-DD HH:mm:ss';
// let utc = moment().utc();
// var india = moment.tz(utc, 'Asia/Calcutta');
// var losAngeles = india.clone().tz('America/Los_Angeles');
// console.log('India:', india.format(format));
// console.log('losAngeles:', losAngeles.format(format));
import moment from 'moment-timezone';

const timerModule = {
  state: {
    india: moment.tz(moment().utc(), 'Asia/Calcutta'),
    losAngeles: moment.tz(moment().utc(), 'Asia/Calcutta').clone().tz('America/Los_Angeles'),
    timeFormat: 'YYYY-MM-DD HH:mm:ss'
  },
  mutations: {
    setIndiaTime(state, time) {
      state.india = time;
    },
    setLosAngelesTime(state, time) {
      state.losAngeles = time;
    },
    updateIndiaTime(state) {
      // console.log('INDIA TIME: ', state.india.format('HH:mm:ss'));
      state.india = moment(state.india).clone().add(1, 's')
    },
    updateLosAngeles(state) {
      // console.log('LosAngeles TIME: ', state.losAngeles.format('HH:mm:ss'));
      state.losAngeles = moment(state.losAngeles).clone().add(1, 's')
    }
  },
  getters: {
    'GET_INDIA_TIME': state => {
      if (state.india) {
        return state.india.format(state.format);
      }
      return moment().format('YYYY-MM-DD HH:mm:ss');
    },
    'GET_LOSANGELES_TIME': state => {
      if (state.losAngeles) {
        return state.losAngeles.format(state.timeFormat);
      }
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }
  },
  actions: {
    'START_TIMEZONE_TIMER': ({
      commit
    }) => {
      // let utc = moment().utc();
      // let indiaTime = moment.tz(utc, 'Asia/Calcutta');
      // let losAngelesTime = indiaTime.clone().tz('America/Los_Angeles');
      // commit('setIndiaTime', indiaTime.unix());
      // commit('setLosAngelesTime', losAngelesTime.unix());
      // console.log('India unix:', indiaTime.unix());
      // console.log('losAngeles unix:', losAngelesTime.unix());

      // console.log('India FORMAT:', indiaTime.format());
      // console.log('losAngeles FORMAT:', losAngelesTime.format());

      // let iUtc = moment(indiaTime).clone().add(10, 'd');
      // let lUtc = moment(losAngelesTime).clone().add(1, 'd');
      // console.log('India UTC:', iUtc.format());
      // console.log('losAngeles UTC:', lUtc.format());

      // console.log('India:', moment.tz(moment().utc(), 'Asia/Calcutta'));
      // console.log('losAngeles:', moment.tz(moment().utc(), 'Asia/Calcutta').clone().tz('America/Los_Angeles'));
      // console.log('India:', this.india.format('YYYY-MM-DD HH:mm:ss'));
      // console.log('losAngeles:', this.losAngeles.format('YYYY-MM-DD HH:mm:ss'));

      setInterval(() => {
        // commit('updateIndiaTime');
        commit('updateLosAngeles');
      }, 1000); // Every second
    }
  }
}

export default timerModule;
