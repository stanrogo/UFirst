export default class GroupDataTransformer {
  constructor(mapFn, groupKeyName) {
    this.mapFn = mapFn;
    this.groupKeyName = groupKeyName;
  }

  transformData(json) {
    const groupedData = json
      .map(this.mapFn)
      .reduce((acc, x) => {
        acc[x] = (acc[x] || 0) + 1
        return acc;
      }, {});
    return Object.entries(groupedData)
      .map(x => ({ [this.groupKeyName]: x[0], 'numEntries': x[1] }));
  }
}
