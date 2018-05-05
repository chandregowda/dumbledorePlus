/* UITLITY FUNCTION */
import axios from '../axios-auth';
import moment from 'moment';

export const thousandSeparator = function (x, separator = '.') {
  return x
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    .replace(/\.0*/g, '.');
}

export const saveDownloadDetails = function (options) {
  return new Promise((resolve, reject) => {
    axios.post('/download/create', options).then(r => {
      return resolve(r.data);
    }).catch(e => console.log(e));
  });
}

export const downloadLogFile = function (options) {
  let {
    environment,
    datacenter,
    ip,
    instance,
    component,
    filename,
    // searchCriteria,
    generatedBy
  } = options;

  let logFileDate = options.searchCriteria.logDate;

  // console.log(environment, ip, instance, component, datacenter, filename, searchCriteria, generatedBy, logDate);
  // console.log('Download Options', JSON.stringify(options, undefined, 2))
  return new Promise((resolve, reject) => {
    axios.post('/exception/downloadLogFile', options).then(r => {
      // console.log('Downloading Completed', r);
      let extractedFile = r.data;
      saveDownloadDetails({
        environment,
        datacenter,
        ip,
        instance,
        component,
        filename,
        extractedFile,
        generatedBy,
        logFileDate
      }).then(details => {
        // console.log('Downloaded file entry done', details)
        resolve(details)
      }).catch(e => {
        console.log('Failed to insert into download table', e);
        return reject(e);
      });
    }).catch(e => {
      console.log('Failed to generate Exception Log Summary', e);
      return reject(e);
    });
  })
}

export const getFileDetailsByDownloadedFileName = (sourceFileName, extractedFile) => {
  let splits = extractedFile
    .split('/')
    .pop()
    .split('-');

  let url = extractedFile.replace(
    '/home/logmonitor/tools/node/public/',
    'https://dumbledore.yodlee.com/'
  );

  let fileObj = {
    url,
    filename: sourceFileName,
    type: splits[2],
    ip: splits[3].replace(/_/g, '.'),
    instance: splits[4],
    component: splits[5],
    createdDate: moment.unix(splits[6] / 1000).format('YYYY-MM-DD HH:mm:ss'),
    generatedBy: splits[7].replace(/.log.gz/, '')
  };
  return fileObj
}
