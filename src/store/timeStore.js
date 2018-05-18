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
    updateLosAngeles(state) {
      // console.log('LosAngeles TIME: ', state.losAngeles.format('HH:mm:ss'));
      state.losAngeles = moment.tz(moment().utc(), 'Asia/Calcutta').clone().tz('America/Los_Angeles')
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
      setInterval(() => {
        commit('updateLosAngeles');
      }, 1000); // Every second
    }
  }
}

export default timerModule;
