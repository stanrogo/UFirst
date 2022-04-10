export default class ChartDraw {
  constructor(json) {
    this.json = json;
    this.charts = [];
    window.addEventListener("resize", this.drawAll.bind(this));
    document.body.addEventListener("redraw", this.drawAll.bind(this));
  }

  register(chartType) {
    this.draw(chartType);
    this.charts.push(chartType);
  }

  drawAll() {
    this.charts.forEach((chartType) => {
      chartType.remove();
      this.draw(chartType);
    });
  }

  draw(chartType) {
    const chartData = chartType.transformer.transformData(this.json);
    const chart = chartType.draw(chartData);
    chartType.outputChart(chart);
  }
}
