//var docsearch = require('docsearch.js/dist/cdn/docsearch.js');
var docsearch = require('./docsearch-module.js');

docsearch({
  //apiKey: '81d28af4fa4dcf8fe9fe05d723126897',
  apiKey: '813d24f4234329f165a773a9fc0e5011',
  appId: 'HAOH56NU0L',
  indexName: 'microcks.io',
  inputSelector: '#search-input',
  debug: false // Set debug to true if you want to inspect the dropdown
});
