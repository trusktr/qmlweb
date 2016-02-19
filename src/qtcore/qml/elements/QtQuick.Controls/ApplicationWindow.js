registerQmlType({
  module: 'QtQuick.Controls.Styles',
  name: 'ApplicationWindowStyle',
  versions: /.*/,
  constructor: function QMLApplicationWindowStyle(meta) {
    QMLItem.call(this, meta);

    createSimpleProperty("Component", this, "background");
    createSimpleProperty("ApplicationWindow", this, "control");
  }
});

registerQmlType({
  module: 'QtQuick.Controls.Styles',
  name: 'ButtonStyle',
  versions: /.*/,
  constructor: function QMLButtonStyle(meta) {
    QMLItem.call(this, meta);

    createSimpleProperty("Component", this, "background");
    createSimpleProperty("Component", this, "label");
    createSimpleProperty("Button", this, "control");
  }
});

function callOnCompleted(child) {
  child.Component.completed();
  for (var i = 0; i < child.children.length; i++)
    callOnCompleted(child.children[i]);
}

function setBackgroundStyle(qmlobject) {
  var delegate = qmlobject.$style.model.background;

  if (qmlobject.$style.background != null) {
    qmlobject.$style.background.$destroy();
    qmlobject.$style.background.dom.destroy();
  }

  qmlobject.$style.background = delegate.createObject(qmlobject.$style.model);
  qmlobject.$style.background.parent = qmlobject;
  qmlobject.dom.appendChild(qmlobject.$style.background.dom);

  if (engine.operationState !== QMLOperationState.Init) {
    engine.$initializePropertyBindings();
    callOnCompleted(qmlobject.$style.background);
  }
}

function createStyleProperty(qmlobject, delegate) {
  qmlobject.$style = { model: null };

  createSimpleProperty("Component", qmlobject, "style");

  qmlobject.styleChanged.connect(function() {
    if (qmlobject.$style.model != null)
      qmlobject.$style.model.$destroy();
    qmlobject.$style.model = qmlobject.style.createObject(qmlobject);
    qmlobject.$style.model.control = qmlobject;
    delegate();
    if (engine.operationState !== QMLOperationState.Init) {
      engine.$initializePropertyBindings();
      callOnCompleted(qmlobject.$style.model);
    }
  });
}

registerQmlType({
  module: 'QtQuick.Controls',
  name: 'ApplicationWindow',
  versions: /.*/,
  constructor: function QMLApplicationWindow(meta) {
    var self = this;

    QMLItem.call(this, meta);

    createStyleProperty(self, function() {
      setBackgroundStyle(self);
    });
  }
});
