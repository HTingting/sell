<template>
  <div class="goods">
    <!--左侧栏布局-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,tIndex) in goods" :key="tIndex"
            class="menu-item"
            :class="{'current': currentIndex === tIndex}"
            @click="selectMenu(tIndex,$event)">
          <span class="text">
            <span v-show="item.type>0" class="icon"
                  :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--商品-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,tIndex) in goods" :key="tIndex" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,fIndex) in item.foods" :key="fIndex"
                class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" alt="">
              </div>
              <div class="content">
                <div class="name">{{food.name}}</div>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!--购物车加减控制-->
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food" @cartAdd="cartAdd"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车,接收选择的food-->
    <shop-cart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice">
    </shop-cart>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopCart from './../../components/shopcart/shopcart'
import cartControl from './../../components/cartcontrol/cartcontrol'

const ERR_OK = 'OK'

export default {
  name: 'goods',
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    shopCart,
    cartControl
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // 如果在当前i所在的区间，返回当前下标
        if (this.scrollY >= height1 && this.scrollY <= height2) {
          return i
        }
      }
      return 0
    },
    // 如果count有值，说明已选
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = []
    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        // dom渲染完才能获取高度
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    // 监听子组件事件
    cartAdd (target) {
      // 调用shopCart组件的drop方法
      // this._drop(target)
      // 优化，使用nextTick todo list
      this.$refs.shopCart.drop(target)
    },
    selectMenu (index, ev) {
      // 移动端
      if (!ev._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      // 根据下标来到指定的dom
      let el = foodList[index]
      this.foodScroll.srollToElement(el, 300)
    },

    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true, // 移动端要默认点击事件，但pc段会触发两次
      })

      this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3 // 可能有变化
      })

      // 监听foodScroll的滚动属性
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },

    _calculateHeight () {
      let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodsList.length; i++) {
        let item = foodsList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position: absolute //注意
    top 174px
    bottom 46px
    width 100%
    overflow hidden

    .menu-wrapper
      flex 0 0 80px //注意
      width 80px
      background #f3f3f7

      .menu-item
        display table //注意，垂直居中最好的布局
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          background #000000
          font-weight 700
          margin-top -1px
          z-index 10
          .text
            border none
        .icon
          display inline-block
          width 12px
          height 12px
          vertical-align top
          margin-right 2px
          background-size 16px 16px
          &.decrease
            bg-image("descrease_3")

          &.discount
            bg-image("discount_3")

          &.guarantee
            bg-image("guarantee_3")

          &.invoice
            bg-image("invoice_3")

          &.special
            bg-image("special_3")

        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, .1))
          font-size 14px

    .foods-wrapper
      flex 1

      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9ddde
        font-size: 12px
        color: rgba(147, 153, 159)
        background #f3f5f7

      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, .1))

        &:last-child
          border-none()
          margin-bottom 0

        .icon
          flex: 0 0 57px
          margin-right: 10px

        .content
          flex 1

          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgba(7, 17, 27)

          .desc
            margin-bottom: 8px
            line-height: 12px
            font-size 10px
            color: rgb(147, 153, 159)

          .extra
            line-height: 10px
            font-size 10px
            color: rgb(147, 153, 159)

            &.count
              margin-right: 12px

          .price
            font-weight: 700
            line-height: 24px

            .now
              margin-right: 8px
              font-size 14px
              color: rgb(240, 20, 20)

            .old
              text-decoration line-through
              font-size 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right 0
            bottom 12px
</style>
