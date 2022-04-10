import Histogram from '../chartlib/histogram';
import ChartType from './chartType';
import RequestSizeTransformer from '../transformers/requestSizeTransformer';

export default class ResponseSizeChart extends ChartType {
  constructor() {
    super('documentSizeChart');
    this.plotValue = 'requestSize';
    this.transformer = new RequestSizeTransformer(this.plotValue);
    this.numBinsInput = document.getElementById('numBins');
    this.numBinsInput.addEventListener('change', () => {
      document.body.dispatchEvent(new Event('redraw'));
    });
  }

  draw(chartData) {
    console.log(this.numBinsInput.value);
    return Histogram(chartData, {
      value: d => d[this.plotValue],
      label: "Document size",
      width: this.width,
      height: this.height,
      color: "steelblue",
      binCount: this.numBinsInput.value,
    });
  }
}
