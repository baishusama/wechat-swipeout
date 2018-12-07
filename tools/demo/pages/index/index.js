let _doLoveIt = false // flag
const _loveBtnBase = {
  hash: 'love',
  className: 'love-button',
  width: 300,
  backgroundColor: '#fff',
} // reuse
const _notLovedItBtn = {
  ..._loveBtnBase,
  iconPath: '../assets/heart.png',
  text: 'I love it !',
  color: '#bfbfbf',
  underlayColor: '#ffb6c1',
}
const _lovedItBtn = {
  ..._loveBtnBase,
  iconPath: '../assets/heart-fill.png',
  text: 'I loved it !',
  color: '#ff69b4',
  underlayColor: '#bfbfbf',
}

Page({
  /**
   * ImoNote: 关于 left/right 要传入的 rightButtonList
   * hash 必须唯一，由用户判断决定如何调用对应的函数
   */
  data: {
    leftButtonList: [
      {
        hash: 'share',
        className: 'share-button',
        width: 100,
        iconPath: '../assets/share.png',
        // text: 'share',
        color: '#000',
        backgroundColor: '#87ceeb',
        underlayColor: '#00bfff',
      },
      { ...(_doLoveIt ? _lovedItBtn : _notLovedItBtn) }
    ],
    rightButtonList: [
      {
        hash: 'confirm',
        width: 150,
        text: 'Ok',
        color: '#fff',
        backgroundColor: '#f00',
        underlayColor: '#a52a2a',
      },
      {
        hash: 'cancel',
        // width: 150, // undefined then will use specific or default width
        iconPath: '../assets/close.png',
        // text: 'x',
        color: '#fff',
        backgroundColor: '#ffd700',
        underlayColor: '#ffa500',
      },
    ],
  },
  /**
   * 生命周期
   */
  // onLoad() {},
  // onShow() {},
  // onReady() {},
  /**
   * 自定义的方法
   */
  share() {
    console.log('[test] share, this :', this)
  },
  love(index) {
    console.log('[test] love, this :', this)

    // 反转按钮状态
    this._toggleLoveButton()
    // 延时关闭（需要 index 存在）
    if (typeof index !== 'undefined') {
      setTimeout(() => {
        this.selectAllComponents('.swipeout')[index].close()
      }, 1000)
    }
  },
  confirm() {
    console.log('[test] confirm, this :', this)
  },
  cancel() {
    console.log('[test] cancel, this :', this)
  },
  // 打开所有 swipeout 组件左侧
  openAllSwipeoutLeft() {
    this.selectAllComponents('.swipeout').forEach(comp => comp.openLeft())
  },
  // 打开所有 swipeout 组件右侧
  openAllSwipeoutRight() {
    this.selectAllComponents('.swipeout').forEach(comp => comp.openRight())
  },
  // 关闭（复位）所有 swipeout 组件
  closeAllSwipeout() {
    this.selectAllComponents('.swipeout').forEach(comp => comp.close())
  },
  // 当 <swipeout> 的 press 事件触发时的回调
  onSwipeoutPress(e) {
    const { index } = e.currentTarget.dataset
    const { hash } = e.detail

    // 【自定义】根据 hash 执行特定方法
    if (typeof this[hash] === 'function') {
      this[hash](index)
    }
  },
  _toggleLoveButton() {
    _doLoveIt = !_doLoveIt

    const leftButtonList = [...this.data.leftButtonList]
    leftButtonList[1] = { ...(_doLoveIt ? _lovedItBtn : _notLovedItBtn) }

    this.setData({
      leftButtonList
    })
  }
})
