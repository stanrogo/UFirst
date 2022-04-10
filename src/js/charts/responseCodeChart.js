import BarChartType from './barChartType';
import GroupDataTransformer from '../transformers/groupDataTransformer';

export default class ResponseCodeChart extends BarChartType {
  constructor() {
    const groupKeyName = 'responseCode';
    super('responseCodeChart', groupKeyName, 'Answer Code');
    this.transformer = new GroupDataTransformer(x => x.response_code, groupKeyName);
  }
}
