export default class RequestSizeTransformer {
  constructor(plotValue) {
    this.plotValue = plotValue
  }

  transformData(json) {
    return json.filter(x => x.response_code == 200 && x.document_size < 1000) // Assumption: code 200 means size cannot be empty
      .reduce((acc, x) => {
        acc.push({ [this.plotValue]: x.document_size });
        return acc;
      }, []);
  }
}
