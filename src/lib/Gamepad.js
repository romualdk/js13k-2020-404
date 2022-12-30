let haveEvents = 'ongamepadconnected' in window
let gamepads = []

const mappings = {
  standard: [
    'A', 'B', 'X', 'Y', 'L1', 'R1', 'L2', 'R2',
    'SELECT', 'START', 'ANALOG1', 'ANALOG2',
    'UP', 'DOWN', 'LEFT', 'RIGHT', 'MODE'
  ]
}

function connect (e) {
  addGamepad(e.gamepad)
  console.log('Gamepad %i connected', e.gamepad.index)
}

function addGamepad (pad) {
  gamepads[pad.index] = {
    device: pad,
    mapping: mappings[pad.mapping] || mappings.standard,
    cache: [],
    status: []
  }
}

function disconnect (e) {
  delete gamepads[e.gamepad.index]
  console.log('Gamepad %i disconnected', e.gamepad.index)
}

export function initGamepads () {
  window.addEventListener('gamepadconnected', connect)
  window.addEventListener('gamepaddisconnected', disconnect)
}

function scangamepads () {
  let p = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
  for (var i = 0; i < p.length; i++) {
    if (p[i]) {
      if (p[i].index in gamepads) {
        gamepads[p[i].index].device = p[i]
      } else {
        addGamepad(p[i])
      }
    }
  }
}

export function updateGamepads () {
  if (!haveEvents) {
    scangamepads()
  }

  for (var i in gamepads) {
    let gp = gamepads[i]

    gp.cache = [...gp.status]
    gp.status = []

    for (var b = 0; b < gp.device.buttons.length; b++) {
      if (gp.device.buttons[b].pressed) {
        gp.status.push(gp.mapping[b])
      }
    }
  }
}

export function buttonPressed (button, hold = false, i = 0) {
  if (!gamepads[i]) {
    return false
  }

  let gp = gamepads[i]
  button = button.toUpperCase()
  let pressed = gp.status.includes(button)

  if (!hold && gp.cache.includes(button)) {
    pressed = false
  }

  return pressed
}

export function onButtonPress (func) {
  for (var i in gamepads) {
    let gp = gamepads[i]

    for (var b in gp.mapping) {
      let button = gp.mapping[b]
      if (buttonPressed(button, false, i)) {
        func({
          index: i,
          button: button
        })
      }
    }
  }
}
