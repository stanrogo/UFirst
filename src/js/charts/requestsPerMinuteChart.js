import LineChart from '../chartlib/lineChart';
import ChartType from './chartType';
import GroupDataTransformer from '../transformers/groupDataTransformer';

export default class RequestsPerMinuteChart extends ChartType {
  constructor() {
    super('requestsPerMinuteChart');
    this.transformer = new GroupDataTransformer(this.mapFn, 'time')
  }

  mapFn(logEntry) {
    const datetime = logEntry.datetime
    const date = new Date(95, 7, datetime.day, datetime.hour, datetime.minute);
    return date.getTime();
  }

  draw(chartData) {
    return LineChart(chartData, {
      x: d => d[this.transformer.groupKeyName],
      y: d => d.numEntries,
      yLabel: 'Number of Requests',
      xLabel: 'Time (dd hh:mm)',
      width: this.width,
      height: this.height,
      color: "steelblue"
    });
  }
}
