registerQmlType({
  module:   'QtQuick.Controls',
  name:     'Action',
  versions: /.*/,
  constructor: function(meta) {
    QMLItem.call(this, meta);
    var self = this;

    createSimpleProperty("bool", this, "checkable");
    createSimpleProperty("bool", this, "checked");
    createSimpleProperty("bool", this, "enabled");
    createSimpleProperty("ExclusiveGroup", this, "exclusiveGroup");
    createSimpleProperty("string", this, "iconName");
    createSimpleProperty("string", this, "iconSource");
    createSimpleProperty("keysequence", this, "shortcut");
    createSimpleProperty("string", this, "text");
    createSimpleProperty("string", this, "tooltip");

    this.toggled = new Signal();
    this.triggered = new Signal();
  }
});
