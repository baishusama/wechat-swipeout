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
  onSwipeoutPress({ detail }) {
    const { hash } = detail

    // 【自定义】根据 hash 执行特定方法
    if (typeof this[hash] === 'function') {
      this[hash]()
    }
  },
})
