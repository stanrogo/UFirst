import 'mini.css'
import '../css/main.css';

import ChartDraw from './charts/chartDraw';
import RequestMethodChart from './charts/requestMethodChart';
import RequestsPerMinuteChart from './charts/requestsPerMinuteChart';
import ResponseCodeChart from './charts/responseCodeChart';
import ResponseSizeChart from './charts/responseSizeChart';

fetch(API_BASE_URL + '/epa').then((response) => {
  if (response.status == 200) {
    response.json().then((json) => {
      const chartDraw = new ChartDraw(json);
      chartDraw.register(new RequestMethodChart());
      chartDraw.register(new RequestsPerMinuteChart());
      chartDraw.register(new ResponseCodeChart());
      chartDraw.register(new ResponseSizeChart());
    });
  }
});
