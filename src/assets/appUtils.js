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

export const generateExceptionLogFile = function (options) {
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
    axios.post('/exception/generateExceptionLogFile', options).then(r => {
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

export const downloadExcelFile = function (url) {
  // windows
  let indexOfLastSlash = url.lastIndexOf('\\');
  if (indexOfLastSlash === -1) {
    // Unix
    indexOfLastSlash = url.lastIndexOf('/');
  }

  let filename = url.substring(indexOfLastSlash + 1);
  axios
    .get(url, {
      responseType: 'blob' // important
    })
    .then(response => {
      if (!window.navigator.msSaveOrOpenBlob) {
        // BLOB NAVIGATOR
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      } else {
        // BLOB FOR EXPLORER 11
        window.navigator.msSaveOrOpenBlob(new Blob([response.data]), filename);
      }
    });
}
