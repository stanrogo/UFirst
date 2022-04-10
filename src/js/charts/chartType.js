export default class ChartType {
  constructor(chartDivID) {
    this.chartDiv = document.getElementById(chartDivID);
  }

  get width() {
    return this.chartDiv.clientWidth;
  }

  get height() {
    return this.chartDiv.clientHeight;
  }

  outputChart(chart) {
    this.chartDiv.appendChild(chart);
  }

  remove() {
    const svg = this.chartDiv.firstChild;
    if (svg) {
      this.chartDiv.removeChild(svg);
    }
  }
}
