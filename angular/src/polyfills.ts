// http://javascript.crockford.com/remedial.html
if (!String.prototype['supplant']) {
  String.prototype['supplant'] = function (o: any) {
    return this.replace(
      /\{([^{}]*)\}/g,
      function (a: any, b: any) {
        var r: any = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };
}
