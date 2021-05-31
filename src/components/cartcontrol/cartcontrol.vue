<template>
  <div class="cartcontrol">
    <div class="cart-decrease"
         @click="decreaseCart($event)"
         v-show="food.count > 0">
      <!--设置一个innerdiv ，负责滚动-->
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart($event)"></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'cartcontrol',
  // 首先这个组件一定是关联商品的count的
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      balls: [
        {show: false},
        {show: false}
      ]
    }
  },
  created () {
    console.log(this.food)
  },
  methods: {
    addCart (ev) {
      if (!ev._constructed) {
        return
      }
      if (!this.food.count) {
        // this.food.count = 1 检测不到
        Vue.$set(this.food, 'count', 1)
      } else {
        // this.food.count++   检测不到，需要用到$set
        Vue.$set(this.food, 'count', this.food.count++)
      }
      // 事件派发 ,在goods组件接收事件
      this.$emit('card.add', event.target)
    },
    decreaseCart (ev) {
      if (!ev._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size 0
  .cart-decrease
    display inline-block
    padding 6px
    transition all 0.4s linear
    &.move-transition
      opacity 1
      transform translate3D(0, 0, 0)
      .inner
        line-height 24px
        font-size 24px
        color: rgb(0,160,200)
        transition all 0.4s linear
        transform rotate(0)
    &.move-enter, &.move-leave
      opacity 0,
      transform translate3D(24px,0,0)
      .inner
        transform rotate(180deg)
  .cart-count
    display inline-block
    vertical-align top
    width 12px
    padding-top 6px
    line-height 24px
    text-align center
    font-size 10px
    color grey
  .cart-add
    display inline-block
    line-height 24px
    font-size 24px
    color: rgb(0,160,200)
</style>
