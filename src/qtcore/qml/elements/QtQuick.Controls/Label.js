registerQmlType({
  module:   'QtQuick.Controls',
  name:     'Label',
  versions: /.*/,
  constructor: function(meta) {
    var self = this;
    var QMLText = getConstructor('QtQuick', '2.0', 'Text');

    QMLText.call(this, meta);
  }
});
