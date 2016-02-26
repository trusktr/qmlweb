import QtQuick 2.0
import QtQml.StateMachine 1.0

Rectangle {
  id: main
  property int triggerVariable: 42
  property bool blocked: true

  signal signalTrigger()

  function enterFinalState() {
    finalState.entered();
  }

  StateMachine {
    id: stateMachine
    initialState: firstState
    running: true

    State {
      id: firstState

      SignalTransition {
        targetState: finalState
        signal: main.signalTrigger
        guard: main.blocked
      }
    }

    FinalState {
      id: finalState
    }
  }
}
