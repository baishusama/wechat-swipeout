// const prefix = '__wechat-swipeout_'
const MIN_BTN_W = 100 // (rpx)
const WINDOW_W = wx.getSystemInfoSync().windowWidth // (px)

Component({
  // 选项
  options: {
    multipleSlots: true, // 使用多个 slot 时必须
    // addGlobalClass: true
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
  },
  data: {
    totalWidth: WINDOW_W, // (rpx) （包括未显示的按钮的）总宽度，默认全屏宽度
    leftVisibleWidth: 0, // (px) 左侧可视宽度
    rightVisibleWidth: 0, // (px) 右侧可视宽度
    isLeftSticked: false, // (px) 左侧吸边状态
    isRightSticked: false, // (px) 右侧吸边状态
    canBeOut: true, // FIXME: enhance ???
    testX: 45, // TODO:FIXME: 默认偏移位置
  },
  lifetimes: {
    ready() {
      this.initialize()
      this.calculate()
    },
  },
  methods: {
    // 初始化宽度 FIXME: bug ??? 需要一个 setter 监听？再自动调用？
    initialize() {
      // type Direction = 'left' | 'right'
      const _initialize = direction => {
        const widthKey = `${direction}Width`
        const buttonWidthKey = `${direction}ButtonWidth`
        const buttonsKey = `${direction}Buttons`
        const updateButtons = defaultWidth => {
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

          this.setData({
            [buttonsKey]: buttons,
            [widthKey]: sideTotalWidth,
          })
        }

        // 如果未传入按钮数组，那么不需要以下初始化！
        if (!this.data[buttonsKey]) {
          return
        }

        if (this.data[buttonWidthKey]) {
          // case1. 如果传入 (left|right)ButtonWidth 会重新计算 (left|right)Width
          updateButtons(this.data[buttonWidthKey])
        } else if (this.data[widthKey]) {
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
            this.setData({
              [buttonsKey]: widthUnknownButtons,
            })
          } else if (sideTotalWidth !== this.data[widthKey]) {
            // 如果不存在未设置宽度的按钮，且宽度不完全匹配，那么调整宽度到正合适
            this.setData({
              [widthKey]: sideTotalWidth,
            })
          }
        } else {
          // case3. 如果什么都没有设置，根据最小值初始化按钮列表数据
          updateButtons(MIN_BTN_W)
        }
      }

      // 接口方式（非 slot 方式）
      _initialize('left')
      _initialize('right')
    },
    // 计算总宽度
    calculate() {
      const leftW = this.data.leftWidth || 0
      const rightW = this.data.rightWidth || 0
      // TODO: test to del
      console.log(`[test] calculate, totalWidth: ${leftW + this.data.width + rightW} = ${leftW} + ${this.data.width} + ${rightW}`)

      this.setData({
        totalWidth: leftW + this.data.width + rightW,
      })
    },

    onTouchStart(e) {
      console.log('[test] e.changedTouches[0] :', e.changedTouches[0])
    },
    onTouchEnd() { },
    // FIXME: enhance ??? 节流？防抖？
    onChange(e) {
      const originalX = e.detail.x
      const offsetX = this.data.leftWidth ? Math.floor(this.data.leftWidth / 750 * WINDOW_W) : 0
      const x = originalX + offsetX
      // TODO: test to del
      console.log(`[test] onChange, original x is ${originalX} ; x is ${x}`)

      const data = {}

      if (this.data.rightButtons) {
        if (x < 0) {
          const rightWidthInIntPX = Math.floor(this.data.rightWidth / 750 * WINDOW_W)
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

      if (this.data.leftButtons) {
        if (x > 0) {
          const leftWidthInIntPX = Math.floor(this.data.leftWidth / 750 * WINDOW_W)
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

      // 如果有变化才更新
      let hasChanged = false
      Object.keys(data).forEach(key => {
        if (data[key] !== this.data[key]) {
          hasChanged = true
        }
      })
      if (hasChanged) {
        console.log('[test] data :', data) // TODO: test to del
        this.setData(data)
      }
    },
    // 点击按钮时，触发 press 自定义事件
    onButtonPress(e) {
      const hash = e.currentTarget.dataset.hash
      console.log('[test] onPress, hash :', hash)

      const eventDetail = { hash }
      const eventOption = {
        bubbles: true,
      }
      this.triggerEvent('press', eventDetail, eventOption)
    },
    // (点击|释放)按钮的时候，反转背景色
    toggleBackgroundColor(e) {
      // TODO: test to del
      console.log('[test] toggleBackgroundColor, e :', e)

      const key = e.currentTarget.dataset.key // 决定哪侧 (left|right)Buttons
      const hash = e.currentTarget.dataset.hash // 决定哪个按钮
      const buttons = this.data[key].map(button => {
        // 对匹配的按钮做背景色的变化
        if (button.hash === hash) {
          return Object.assign(
            {},
            button,
            // 交换背景色
            {
              backgroundColor: button.underlayColor,
              underlayColor: button.backgroundColor,
            }
          )
        }

        return button
      })

      this.setData({
        [key]: buttons
      })
    },
    // // TODO: test to del
    // test() {
    //   console.log('[test] ///=================')
    //   console.log('[test] totalWidth :', this.data.totalWidth)
    //   console.log('[test] rightButtonWidth :', this.data.rightButtonWidth)
    //   console.log('[test] rightButtons :', this.data.rightButtons)
    //   console.log('[test] rightWidth :', this.data.rightWidth)
    //   console.log('[test] \\\\\\================')
    // },
  },
})
