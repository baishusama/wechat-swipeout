Page({
  /**
   * ImoNote: 关于 left/right 要传入的 rightButtonList
   * hash 必须唯一，由用户判断决定如何调用对应的函数
   */
  data: {
    leftButtonList: [
      {
        hash: 'share',
        backgroundColor: '#fff',
        color: '#000',
        underlayColor: '#ddd',
        text: 'share',
        width: 150,
      },
      {
        hash: 'love',
        backgroundColor: 'pink',
        color: '#fff',
        underlayColor: 'deeppink',
        text: 'love',
        // width: 150,
      },
    ],
    rightButtonList: [
      {
        hash: 'confirm',
        backgroundColor: '#f00',
        color: '#fff',
        underlayColor: 'brown',
        text: 'Ok',
        width: 150,
      },
      {
        hash: 'cancel',
        backgroundColor: 'gold',
        color: '#fff',
        underlayColor: 'orange',
        text: 'x',
        // width: 150, // undefined then will use specific or default width
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
  love() {
    console.log('[test] love, this :', this)
  },
  confirm() {
    console.log('[test] confirm, this :', this)
  },
  cancel() {
    console.log('[test] cancel, this :', this)
  },
  // 打开所有 swipeout 组件左侧
  openAllSwipeoutLeft(){
    const compList = this.selectAllComponents('.swipeout')
    compList.forEach(comp => comp.openLeft())
  },
  // 打开所有 swipeout 组件右侧
  openAllSwipeoutRight(){
    const compList = this.selectAllComponents('.swipeout')
    compList.forEach(comp => comp.openRight())
  },
  // 关闭（复位）所有 swipeout 组件
  closeAllSwipeout(){
    const compList = this.selectAllComponents('.swipeout')
    compList.forEach(comp => comp.close())
  },
  onSwipeoutPress({ detail }) {
    const { hash } = detail

    // 【自定义】根据 hash 执行特定方法
    if (typeof this[hash] === 'function') {
      this[hash]()
    }
  },
})
