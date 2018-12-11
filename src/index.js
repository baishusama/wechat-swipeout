const prefix = 'wechat-swipeout__'
const MIN_BTN_W = 100 // (rpx)
const WINDOW_W = wx.getSystemInfoSync().windowWidth // (px)

Component({
  // 选项
  options: {
    multipleSlots: true, // 使用多个 slot 时必须
    addGlobalClass: true
  },
  // 接口 (rpx)
  properties: {
    /* 主要内容 */
    // 组件显示区域的宽度，默认全屏宽度
    width: {
      type: Number,
      value: 750,
    },
    // 组件显示区域的高度
    height: {
      type: Number,
      value: 0,
    },
    /* 按钮相关 */
    // （左侧）按钮总宽度
    leftWidth: {
      type: Number,
      value: 0,
    },
    // （左侧）作为按钮的默认宽度
    leftButtonWidth: {
      type: Number,
      value: 0,
    },
    // （左侧）按钮列表
    leftButtons: {
      type: Array,
      value: null,
    },
    // （右侧）按钮总宽度
    rightWidth: {
      type: Number,
      value: 0,
    },
    // （右侧）作为按钮的默认宽度
    rightButtonWidth: {
      type: Number,
      value: 0,
    },
    // （右侧）按钮列表
    rightButtons: {
      type: Array,
      value: null,
    },
    // 贴边选项
    stickToLeftEdge: {
      type: Boolean,
      value: false
    },
    stickToRightEdge: {
      type: Boolean,
      value: false
    },
    /* 样式/状态 */
    backgroundColor: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: false
    },
    /* 行为表现 */
    autoClose: {
      type: Boolean,
      value: false
    },
    damping: {
      type: Number,
      value: 30
    },
    friction: {
      type: Number,
      value: 10
    },
  },
  data: {
    totalWidth: WINDOW_W, // (rpx) （包括未显示的按钮的）总宽度，默认全屏宽度
    leftVisibleWidth: 0, // (px) 左侧可视宽度
    rightVisibleWidth: 0, // (px) 右侧可视宽度
    isLeftSticked: false, // (px) 左侧吸边状态
    isRightSticked: false, // (px) 右侧吸边状态
    offsetX: 0, // (px) 默认偏移位置
    useAnimation: false,
    canBeOut: false, // 是否允许出界
  },
  lifetimes: {
    attached() {
      this.initializeWidth()
      this.calculateTotal()
      this.prepareThreshold()

      // 初始化 offsetX
      if (this.data.leftWidth) {
        this.setData({
          offsetX: -this.data.leftWidth / 750 * WINDOW_W
        })
      }
    },
    ready() {
      this.setupAnimation()
    }
  },
  methods: {
    // 初始化宽度 FIXME: bug ??? 需要一个 setter 监听？再自动调用？
    initializeWidth() {
      // type Direction = 'left' | 'right'
      const _initialize = direction => {
        const widthKey = `${direction}Width`
        const buttonWidthKey = `${direction}ButtonWidth`
        const buttonsKey = `${direction}Buttons`
        const getInitData = defaultWidth => {
          let sideTotalWidth = 0

          const buttons = this.data[buttonsKey].map(button => {
            // 副作用：计算单边的总宽度
            sideTotalWidth += button.width || defaultWidth

            // 设置未知宽度按钮的宽度
            if (!button.width) {
              return Object.assign(
                {},
                button,
                {
                  width: defaultWidth,
                }
              )
            }

            return button
          })

          return {
            [buttonsKey]: buttons,
            [widthKey]: sideTotalWidth,
          }
        }
        let initData = null

        // 如果未传入按钮数组，那么不需要以下初始化！
        if (!this.data[buttonsKey]) {
          return
        }

        if (!this.data[widthKey]) {
          // case1.1 如果传入 (left|right)ButtonWidth 会重新计算 (left|right)Width
          // case1.2 如果什么都没有设置，根据最小值初始化按钮列表数据
          initData = getInitData(this.data[buttonWidthKey] || MIN_BTN_W)
        } else {
          // case2. 如果传入 (left|right)Width 会平均剩余给未设置宽度的按钮
          let sideTotalWidth = 0
          const widthUnknownButtons = this.data[buttonsKey].filter(button => {
            // 副作用：计算宽度已知的按钮们占用的宽度
            if (button.width) {
              sideTotalWidth += button.width
            }

            return !button.width
          })

          // 如果已设置宽度按钮的总宽度超出可能，那么抛异常
          if (
            sideTotalWidth > this.data[widthKey] ||
            (sideTotalWidth === this.data[widthKey] &&
              widthUnknownButtons.length > 0)
          ) {
            throw new Error(
              `You should set enough "${widthKey}" for <wechat-swipeout> component`
            )
          }

          if (widthUnknownButtons.length > 0) {
            // 如果存在未设置宽度的按钮，那么设置宽度和更新按钮
            const restButtonWidth =
              (this.data[widthKey] - sideTotalWidth) /
              widthUnknownButtons.length
            widthUnknownButtons.forEach(button => {
              button.width = restButtonWidth
            })
            initData = {
              [buttonsKey]: widthUnknownButtons,
            }
          } else if (sideTotalWidth !== this.data[widthKey]) {
            // 如果不存在未设置宽度的按钮，且宽度不完全匹配，那么调整宽度到正合适
            initData = {
              [widthKey]: sideTotalWidth,
            }
          }
        }

        // console.log('attached, setData :', initData) // TODO: test to del
        this.setData(initData)
      }

      // 接口方式（非 slot 方式）
      _initialize('left')
      _initialize('right')
    },
    // 计算总宽度
    calculateTotal() {
      const leftW = this.data.leftWidth || 0
      const rightW = this.data.rightWidth || 0
      const totalWidth = leftW + this.data.width + rightW
      // TODO: test to del
      // console.log(`calculateTotal: ${totalWidth} = ${leftW} + ${this.data.width} + ${rightW}`)

      this.setData({
        totalWidth,
      })
    },
    // 准备阈值 (px)
    prepareThreshold() {
      const leftWidthInIntPX = this.data.leftWidth / 750 * WINDOW_W
      const rightWidthInIntPX = this.data.rightWidth / 750 * WINDOW_W
      this._leftThreshold = leftWidthInIntPX / 2
      this._rightThreshold = rightWidthInIntPX / 2
    },
    // 开启动画效果
    setupAnimation() {
      this.setData({
        useAnimation: true
      })
    },
    // 记录 touch 初始位置
    onTouchStart() { /* this._startX = e.changedTouches[0].pageX */ },
    // touch 结束后滑动到位
    onTouchEnd() {
      // this._endX = e.changedTouches[0].pageX
      const { /* _startX, _endX, */ _leftThreshold, _rightThreshold } = this

      if (this.data.leftVisibleWidth > _leftThreshold) {
        this._openLeft()
      } else if (this.data.rightVisibleWidth > _rightThreshold) {
        this._openRight()
      } else {
        this._close()
      }
    },
    // FIXME: enhance ??? 节流？防抖？
    // 当滑动的时候，修改 按钮的 可视宽度 和 吸附状态
    onChange(e) {
      // (px)
      const originalX = e.detail.x
      const offset = this.data.leftWidth ? this.data.leftWidth / 750 * WINDOW_W : 0
      const x = originalX + offset
      // console.log(`onChange, original x is ${originalX} ; x is ${x}`) // TODO: test to del

      const data = {}

      // 如果右侧按钮存在，那么计算可视宽度和吸附状态
      if (this.data.rightButtons) {
        if (x < 0) {
          const rightWidthInIntPX = this.data.rightWidth / 750 * WINDOW_W
          data.rightVisibleWidth = Math.min(-x, rightWidthInIntPX)

          // 判断贴边状态
          const isRightSticked = -x > rightWidthInIntPX
          if (this.data.stickToRightEdge && this.data.isRightSticked !== isRightSticked) {
            data.isRightSticked = isRightSticked
          }
        } else {
          data.rightVisibleWidth = 0
        }
      }

      // 如果左侧按钮存在，那么计算可视宽度和吸附状态
      if (this.data.leftButtons) {
        if (x > 0) {
          const leftWidthInIntPX = this.data.leftWidth / 750 * WINDOW_W
          data.leftVisibleWidth = Math.min(x, leftWidthInIntPX)

          // 判断贴边状态
          const isLeftSticked = x > leftWidthInIntPX
          if (this.data.stickToLeftEdge && this.data.isLeftSticked !== isLeftSticked) {
            data.isLeftSticked = isLeftSticked
          }
        } else {
          data.leftVisibleWidth = 0
        }
      }

      // 修改允许出界状态
      /**
       * ImoNote:
       * 设置 canBeOut=false 的 case：
       * - case1. 如果 originalX 很小，小到小于 -_leftThreshold 意味着主内容右边快要全部露出来
       * - case2. 如果 originalX 很大，大到大于 -_rightThreshold 意味着主内容左边快要全部露出来
       * 下式 !(case1 || case2) 即为 canBeOut=true 的情况
       */
      data.canBeOut = !((originalX < -this._leftThreshold && !this.data.rightWidth) ||
        (originalX > -this._rightThreshold && !this.data.leftWidth))

      // 删除 data 中没变化的属性，如果有变化才更新
      let hasChanged = false
      Object.keys(data).forEach(key => {
        if (data[key] !== this.data[key]) {
          hasChanged = true
        } else {
          delete data[key]
        }
      })
      if (hasChanged) {
        // console.log('onChange, hasChanged data :', data) // TODO: test to del
        this.setData(data)
      }
    },
    // 点击按钮时，触发 press 自定义事件
    onButtonPress(e) {
      const hash = e.currentTarget.dataset.hash

      // 自动关闭按钮
      if (this.data.autoClose) {
        this._close()
      }

      const eventDetail = { hash }
      const eventOption = {
        bubbles: true,
      }
      this.triggerEvent('press', eventDetail, eventOption)
    },
    // (点击|释放)按钮的时候，反转背景色
    toggleBackgroundColor(e) {
      const getToggledButtons = (key, theHash) => {
        let hasChanged = false

        const buttons = this.data[key].map(button => {
          const { hash, backgroundColor, underlayColor } = button
          // 对匹配的按钮做背景色的变化
          if (hash === theHash && underlayColor !== backgroundColor) {
            hasChanged = true
            // ImoNote: 这里使用 `{ ...button, // 覆盖选项 }` 的写法会编译错误
            return Object.assign(
              {},
              button,
              // 交换背景色
              {
                backgroundColor: underlayColor,
                underlayColor: backgroundColor,
              }
            )
          }

          return button
        })

        return hasChanged ? buttons : null
      }

      const key = e.currentTarget.dataset.key // 决定哪侧 (left|right)Buttons
      const theHash = e.currentTarget.dataset.hash // 决定哪个按钮
      const originalButtons = this.data[key]
      const toggledButtons = getToggledButtons(key, theHash)

      if (toggledButtons) {
        this.setData({
          [key]: toggledButtons
        })

        // 设置一个定时器来判断 .button-hover 何时消失，消失时复原按钮的背景色
        // ImoNote: 使用默认的 .button-hover 无法 select 到元素，只能自定义 hover-class 了（详见 index.wxml）
        const intervalId = setInterval(() => {
          const query = wx.createSelectorQuery().in(this)
          query.select(`.${prefix}button.${prefix}underlay`).fields({
            dataset: true
          })
          // ImoNote: 即使用 `select` 返回的结果也是一个数组
          query.exec(([res]) => {
            // case1. 用户松开了按钮
            // case2. 用户 hover 了别的按钮
            // case1 || case2 都需要复原当前按钮的背景色
            if (res === null || (res && res.dataset.hash !== theHash)) {
              this.setData({
                [key]: originalButtons
              })
              clearInterval(intervalId)
            }
          })
        }, 300)
      }
    },
    /* “私有”方法 */
    _close() {
      const mainAllShownX = -this.data.leftWidth / 750 * WINDOW_W // (px)
      this.setData({
        offsetX: mainAllShownX
      })
    },
    _openLeft() {
      const leftAllShownX = 0
      this.setData({
        offsetX: leftAllShownX
      })
    },
    _openRight() {
      const rightAllShownX = (-this.data.leftWidth - this.data.rightWidth) / 750 * WINDOW_W
      this.setData({
        offsetX: rightAllShownX
      })
    },
    /* 供父组件调用的 */
    close() {
      if (!this.data.disabled) {
        this._close()
      }
    },
    openLeft() {
      if (!this.data.disabled) {
        this._openLeft()
      }
    },
    openRight() {
      if (!this.data.disabled) {
        this._openRight()
      }
    },
  },
})
