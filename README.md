# Wechat Swipeout

Inspired by [miniprogram-slide-view](https://github.com/wechat-miniprogram/slide-view), [react-native-swipeout](https://github.com/dancormier/react-native-swipeout).

## 效果

TODO: 将于本周内（2018.12.09 前）制作上传，敬请期待～

## 使用方法

> 关于小程序自定义组件的使用，详见[官方项目说明](https://github.com/wechat-miniprogram/miniprogram-custom-component)。

1. 安装 wechat-swipeout ：

```
npm i -S wechat-swipeout
```

2. 微信开发者工具 -> 工具 -> 构建 npm => 这步会生成 `miniprogram_npm/wechat-swipeout/index.(js|json|wxml|wxss)`
3. 在需要使用本组件的页面/组件的 `*.json` 文件中，设置组件 alias 和路径：

```json
{
  "usingComponents": {
    "swipeout": "wechat-swipeout"
  }
}
```

4. `*.wxml` 文件中，可以使用 `swipeout`：

```html
<swipeout class="swipeout" height="120" right-buttons="{{rightButtonList}}" auto-close="true" background-color="black" bind:press="onSwipeoutPress">
  <view class="main-content">Swipeout: 右侧按钮 & 自动关闭</view>
</swipeout>
```

更多示例，请参考 [github repo](https://github.com/baishusama/wechat-swipeout) 的 [`tools/demo/pages/index/index.wxml`](https://github.com/baishusama/wechat-swipeout/blob/master/tools/demo/pages/index/index.wxml) 文件内容。

具体接口参见 [API](#api) 小节。

## 概览

主要目标和目前进度：

* basic:

  - [x] movable

* enhance:

  - [x] style: 按钮为遮盖样式
  - [ ] style: 按钮可禁用
  - [x] behavior: 可设置自动复位
  - [x] behavior: 也可手动关闭
  - [x] layout: left middle right

* fix bugs:

  - [ ] `underlayColor` 状态回不到 `backgroundColor`

## API

- Component props

  - 组件状态：

    - [x] `disabled` 禁止滑动（包括调用 close 等方法）
    - [x] `damping` 阻尼系数，控制动画和过界回弹动画；越大越快
    - [x] `friction` 摩擦系数，控制滑动速度；越大越快
    - ~~`sensitivity`~~
    - ~~`style`~~

  - 行为事件：

    - [x] `press` 可绑定的事件：点击按钮时触发，会回传按钮数据中的 hash 字段
    - [x] `autoClose` 表现：是否在按钮点击后自动关闭（复位）
    - [x] `close`,`openLeft`,`openRight` 可调用的事件
    - [ ] `onClose`
    - [ ] `onOpen`
    - ~~`scroll`~~

  - 主区域/组件整体：

    - [x] `width` 组件主区域宽度
    - [x] `height` 组件高度
    - [x] `backgroundColor` 组件背景色

  - 两侧按钮：

    - [x] `(left|right)ButtonWidth` 两侧按钮列表
    - [x] `(left|right)Width` 两侧按钮列表
    - [x] `(left|right)Buttons` 两侧按钮列表
    - [x] `stickTo(Left|Right)Edge` 按钮是否吸附边缘

  - Button props

    - [x] `hash` 必须：点击按钮（`press`）时会回传 hash，以此区分按钮并执行对应事件
    - [x] `className` 可选：类名，可用于微调样式
    - [x] `width` 可选：按钮的宽度，单位 rpx
    - [x] `iconPath` 可选：可以设置 icon 的路径（注意组件构建后位于 `./miniprogram_npm/` 目录下，设置 `iconPath` 时需要考虑进去）
    - [x] `text` 可选：按钮的文字
    - [x] `color` 可选：按钮的字体颜色
    - [x] `backgroundColor` 必须：背景色
    - [x] `underlayColor` 必须：按钮被点击时的背景色
    - [ ] `disabled`
    - ~~`type`~~
    - ~~`component`~~

## License

This project is licensed under the MIT License