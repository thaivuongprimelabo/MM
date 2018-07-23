import * as Constants from '../constants/Constants';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

var storage = new Storage({
  // maximum capacity, default 1000 
  size: 1000,

  // Use AsyncStorage for RN, or window.localStorage for web.
  // If not set, data would be lost after reload.
  storageBackend: AsyncStorage,
  
  // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,
  
  // cache data in the memory. default is true.
  enableCache: false,
  
  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return 
  // the latest data.
  sync : {
    // we'll talk about the details later.
  }
});

const Utils = {
  formatDatetime:(year, month, day, format) => {
  	month = month.length == 1 ? '0' + month : month;
    day = day.length == 1 ? '0' + day : day;

    format = format.replace('YYYY', year);
  	format = format.replace('MM', month);
  	format = format.replace('DD', day);

    return format;
  },

  getCurrentDate: (format) => {
  	 var date = new Date();
  	 var month = JSON.stringify(month);

  	 var year = date.getFullYear();
  	 var month = date.getMonth() === 11 ? 12 : date.getMonth() + 1;
  	 month = JSON.stringify(month);
  	 month = month.length == 1 ? '0' + month : month;
  	 var day  = JSON.stringify(date.getDate());
  	 day = day.length == 1 ? '0' + day : day;

  	 var hour = JSON.stringify(date.getHours());
  	 hour = hour.length == 1 ? '0' + hour : hour;
  	 var minute = JSON.stringify(date.getMinutes());
  	 minute = minute.length == 1 ? '0' + minute : minute;
  	 var second = JSON.stringify(date.getSeconds());
  	 second = second.length == 1 ? '0' + second : second;

  	 format = format.replace('YYYY', year);
  	 format = format.replace('MM', month);
  	 format = format.replace('DD', day);
  	 format = format.replace('HH', hour);
  	 format = format.replace('II', minute);
  	 format = format.replace('SS', second); 
  	 return format

  },

  getCurrentYear : () => {
    var date = new Date();
    var year = date.getFullYear();
    return year;
  },

  formatCurrency: (nStr, decSeperate, groupSeperate) => {
  	if(nStr == null) {
  		return '0 ' + Constants.CURRENCY;
  	}
  	nStr += '';
    x = nStr.split(decSeperate);
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }
    return x1 + x2;
  },

  getStartEndDayInMonth : (year, month) => {
    
    month = month - 1;

    var date = new Date(year, month, 0);
    y = date.getFullYear(); 
    m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var start = firstDay.getDate();
    var end = lastDay.getDate();

    return {
      start: start,
      end: end
    }
  },

  getDayOfWeek: (year, month, day) => {

    month = month - 1;

    var d = new Date(year, month, day);

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[d.getDay()];
  },

  cnvNull: (input) => {
    return input == null || input == 'null' ? '' : input;
  },

  replactParamError: (error, params) => {
    var length = params.length;
    if(length > 0) {
      for(var i = 0; i < length; i++) {
        error = error.replace('{' + i + '}', params[i]);
      }
    }
    
    return error;
  },

  doLogin: async (loginInfo) => {
    var response = [];
    var url = Constants.DEFAULT_AUTH_URI;
    await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.code === 200) {
          response = JSON.parse(responseJson.data);
        }
    })
    .catch((error) =>{
        alert(error);
    });

    return response;
  },
  getDataFromStorage: async (key) => {
    
    var output;

    await storage.load({
      key: 'loginState',
      
      // autoSync(default true) means if data not found or expired,
      // then invoke the corresponding sync method
      autoSync: true,
      
      // syncInBackground(default true) means if data expired,
      // return the outdated data first while invoke the sync method.
      // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
      syncInBackground: true,
      
      // you can pass extra params to sync method
      // see sync example below for example
      syncParams: {
        extraFetchOptions: {
          // blahblah
        },
        someFlag: true,
      },
    }).then(ret => {
      // found data go to then()
      //var json = JSON.parse(ret.response);
      output = ret[key];
    }).catch(err => {
      // any exception including data not found 
      // goes to catch()
      switch (err.name) {
          case 'NotFoundError':
              console.log('NotFoundError');
              // TODO;
              break;
            case 'ExpiredError':
                // TODO
                console.log('ExpiredError');
                break;
      }
    });

    return output;
  }
}

export default Utils;