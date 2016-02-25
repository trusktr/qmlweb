import QtQuick 2.0
import QtQml.StateMachine 1.0

Rectangle {
  id: main
  property int triggerVariable: 42
  property bool blocked: true

  function enterFinalState() {
    finalState.entered();
  }

  StateMachine {
    id: stateMachine
    initialState: state
    running: true

    State {
      id: state
    }

    FinalState {
      id: finalState
    }
  }
}
