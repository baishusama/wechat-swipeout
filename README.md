# Wechat Swipeout

> 关于小程序自定义组件的基础使用，详见[官方项目 miniprogram-custom-component 的说明](https://github.com/wechat-miniprogram/miniprogram-custom-component)

## 说明

Inspired by [miniprogram-slide-view](https://github.com/wechat-miniprogram/slide-view), [react-native-swipeout](https://github.com/dancormier/react-native-swipeout).

## 特色

* basic:

  - [x] movable

* enhance:

  - [x] style: 按钮为遮盖样式
  - [x] behavior: 可设置自动复位
  - [x] layout: left middle right

## API

- Component props

  - 组件状态：

    - [x] `disabled` 禁止滑动（包括调用 close 等方法）
    - [x] `damping` 阻尼系数，控制动画和过界回弹动画；越大越快
    - [x] `friction` 摩擦系数，控制滑动速度；越大越快
    - ~~`sensitivity`~~
    - ~~`style`~~

  - 行为事件：

    - [x] `autoClose` 是否在按钮点击后自动关闭（复位）
    - [x] `close`,`openLeft`,`openRight`
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

  - Button props

    - [x] `hash`
    - [x] `backgroundColor`
    - [x] `color`
    - [x] `underlayColor`
    - [x] `text`
    - [x] `width`
    - [ ] `disabled`
    - ~~`type`~~
    - ~~`component`~~
