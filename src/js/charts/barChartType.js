import BarChart from '../chartlib/barChart';
import ChartType from './chartType';

export default class BarChartType extends ChartType {
  constructor(chartDivID, groupKeyName, groupName) {
    super(chartDivID)
    this.groupKeyName = groupKeyName;
    this.groupName = groupName;
  }

  draw(chartData) {
    return BarChart(chartData, {
      x: d => d[this.groupKeyName],
      y: d => d.numEntries,
      yLabel: "↑ Frequency",
      xLabel: this.groupName,
      width: this.width,
      height: this.height,
      color: "steelblue"
    });
  }
}
