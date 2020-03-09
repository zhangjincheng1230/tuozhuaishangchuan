const platform = {
  state: {
    platformName: '',
    platformVersion: '1.0',
    maxDialogBodyHeight: getMaxDialogBodyHeight(window.innerHeight),
    skin: 'black'
  },
  mutations: {
    SET_SKIN: (state, skin) => {
      state.skin = skin
    },
    SET_DIALOG_HEIGHT: (state, height) => {
      state.maxDialogBodyHeight = getMaxDialogBodyHeight(height)
    }
  },
  actions: {
    updateDialogHeight ({commit}) {
      commit('SET_DIALOG_HEIGHT', window.innerHeight)
    }
  }
}

function getMaxDialogBodyHeight (windowHeight) {
  if (windowHeight > 750) {
    return Math.max(150, windowHeight - 450)
  } else {
    return Math.max(150, windowHeight - 300)
  }
}

export default platform
