import '../css/normalize.min.css';
import '../css/main.css';

import { Histogram } from './histogram';
import { LineChart } from './lineChart';
import { BarChart } from './barChart';

const width = 800;
const height = 400;

const group = (json, groupFn, groupKeyName) => {
  const groupedData = json
    .map(groupFn)
    .reduce((acc, x) => {
      acc[x] = (acc[x] || 0) + 1
      return acc;
    }, {});
  return Object.entries(groupedData)
    .map(x => ({ [groupKeyName]: x[0], 'numEntries': x[1] }));
}

const renderChart = (elementId, chart) => document.getElementById(elementId).appendChild(chart);

const generateRequestsPerMinute = (json) => {
  const requestsPerMinute = group(json, x => new Date(95, 7, x.datetime.day, x.datetime.hour, x.datetime.minute).getTime(), 'time');
  const requestsPerMinuteChart = LineChart(requestsPerMinute, {
    x: d => d.time,
    y: d => d.numEntries,
    yLabel: 'Number of Requests',
    xLabel: 'Time (dd hh:mm)',
    width,
    height,
    color: "steelblue"
  });
  renderChart('requestsPerMinuteChart', requestsPerMinuteChart);
}

const generateGroupedBarChart = (json, groupFn, groupKeyName, groupName, elementId) => {
  const distribution = group(json, groupFn, groupKeyName);
  const chart = BarChart(distribution, {
    x: d => d[groupKeyName],
    y: d => d.numEntries,
    yLabel: "↑ Frequency",
    xLabel: groupName,
    width,
    height,
    color: "steelblue"
  });
  renderChart(elementId, chart);
}

const generateRequestSizeDistribution = (json) => {
  const requestSizeDistribution = json
    .filter(x => x.response_code == 200 && x.document_size < 1000) // Assumption: code 200 means size cannot be empty
    .reduce((acc, x) => {
      acc.push({ 'requestSize': x.document_size });
      return acc;
    }, []);
  const requestSizeDistributionChart = Histogram(requestSizeDistribution, {
    value: d => d.requestSize,
    label: "Document size",
    width,
    height,
    color: "steelblue"
  });
  renderChart('documentSizeChart', requestSizeDistributionChart);
}

fetch(API_BASE_URL + '/epa').then((response) => {
  if (response.status == 200) {
    response.json().then((json) => {
      generateRequestsPerMinute(json);
      generateGroupedBarChart(json, x => x.request.method, 'method', 'HTTP Method', 'methodChart');
      generateGroupedBarChart(json, x => x.response_code, 'responseCode', 'Answer Code', 'responseCodeChart');
      generateRequestSizeDistribution(json);
    });
  }
});
