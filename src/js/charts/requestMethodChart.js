import BarChartType from './barChartType';
import GroupDataTransformer from '../transformers/groupDataTransformer';

export default class RequestMethodChart extends BarChartType {
  constructor() {
    const groupKeyName = 'method';
    super('methodChart', groupKeyName, 'HTTP Method');
    this.transformer = new GroupDataTransformer(x => x.request.method, groupKeyName);
  }
}
