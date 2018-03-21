let log = console.log.bind(console)
let vm = new Vue({
	el: '#app',
	data: {
		productList: [
			{
				productName: '苹果',
				productImg: 'images/apple.gif',
				productDescription: '阿克苏红富士',
				productPrice: 12.99,
				productQuantity: 3,
				parts: [
					{
						partsId: 10086,
						partName: '一粒蛋'
					}
				]
			},
			{
				productName: '香蕉',
				productImg: 'images/banana.gif',
				productDescription: '台湾烂香蕉',
				productPrice: 6.99,
				productQuantity: 2,
				parts: [
					{
						partsId: 10087,
						partName: '一颗槟郎'
					}
				]
			},
			{
				productName: '樱桃',
				productImg: 'images/cherry.gif',
				productDescription: '智利大樱桃',
				productPrice: 49.99,
				productQuantity: 1,
				parts: [
					{
						partsId: 10088,
						partName: '一根烟'
					}
				]
			}
		],
		currentProductList: [],
		btnUncheckSrc: 'icons/uncheck_button.png',
		btnCheckedSrc: 'icons/checked_button.png',
		allChecked: false,
		delModalFlag: false,
		itemToDel: null,
		checkoutModalFlag: false
	},
	computed: {
		// 统计已选中商品的总金额
		totalMoney: function() {
			let t = 0
			this.currentProductList.forEach(function(item) {
				if (item.checked) {
					t += item.productPrice * item.productQuantity
				}
			})
			return t
		}
	},
	methods: {
		// 初始化
		// 发起网络请求，将商品列表的数据挂载到vue实例里
		cartView: function() {
			let that = this
			axios.get('data/cartData.json')
				.then(function(response) {
					that.currentProductList = response.data.result.productList
				})
				.catch(function(error) {
					log(error)
				})
		},
		// 选中需要结账的商品
		selectItem: function(item) {
			if (typeof item.checked == 'undefined') {
				this.$set(item, 'checked', true)
			} else {
				item.checked = !item.checked
			}
			log(item.checked)
			// 选中一项后检查商品是否被全选
			this.isAllChecked()
		},
		// 是否商品全部被选中
		isAllChecked: function() {
			let flag = true
			this.currentProductList.forEach(function(item) {
				if (!item.checked) {
					flag = false
				}
			})
			this.allChecked = flag
		},
		// 全选与反选
		checkReverse: function() {
			this.currentProductList.forEach(item => item.checked = !this.allChecked)
			this.allChecked = !this.allChecked
		},
		// 增加当前商品的数量
		increaseQuantity: function(product) {
			if (!product.stock) {
				return
			}
			product.productQuantity++
		},
		// 减少当前商品的数量
		reduceQuantity: function(product) {
			if (!product.stock) {
				return
			}
			product.productQuantity--
			if (product.productQuantity <= 1) {
				product.productQuantity = 1
			}
		},
		// 当前商品的小计金额
		subtotal: function(item) {
			return item.productPrice * item.productQuantity
		},
		// 删除当前的这一项商品
		delItem: function(item) {
			log('delItem')
			this.itemToDel = item
			this.showModal('delete')
		},
		// 确认删除当前商品
		delItemConfirm: function() {
			let i = this.currentProductList.indexOf(this.itemToDel)
			this.currentProductList.splice(i, 1)
			this.hideModal('delete')
		},
		// 取消删除
		cancelDel: function() {
			this.hideModal('delete')
		},
		// 结算
		checkout: function() {
			this.showModal('checkout')
		},
		// 确认结算
		checkoutConfirm: function() {
			this.hideModal('checkout')
			// 转到收获地址页面
			document.location.href = "address.html"
		},
		showModal: function(flag) {
			if (flag == 'delete') {
				this.delModalFlag = true
			} else if (flag == 'checkout'){
				this.checkoutModalFlag = true
			}
		},
		hideModal: function(flag) {
			if (flag == 'delete') {
				this.delModalFlag = false
			} else if (flag == 'checkout') {
				this.checkoutModalFlag = false
			}
		}
	},
	filters: {
		// 将商品价格进行格式化，加上货币符号等
		formatMoney: function(value) {
			// if (typeof value !== Number) return ''
			return '¥' + value.toFixed(2)
		}
	},
	mounted: function() {
		this.$nextTick(() => this.cartView())
	}
})