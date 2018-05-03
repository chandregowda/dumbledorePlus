/* UITLITY FUNCTION */
import axios from '../axios-auth';

export const thousandSeparator = function (x, separator = '.') {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    .replace(/\.0*/g, '.');
}

export const downloadLogFile = function (options) {
  // let {
  //   environment,
  //   ip,
  //   instance,
  //   component,
  //   datacenter,
  //   filename,
  //   searchCriteria,
  //   generatedBy,
  // } = options
  // console.log(environment, ip, instance, component, datacenter, filename, searchCriteria, generatedBy, logDate);
  // console.log('Download Options', JSON.stringify(options, undefined, 2))
  return new Promise((resolve, reject) => {
    axios.post('/exception/downloadLogFile', options).then(r => {
      // console.log('Downloading Completed', r);
      resolve(r.data);
    }).catch(e => {
      console.log('Failed to generate Exception Log Summary', e);
      reject(e);
    });
  })
}
