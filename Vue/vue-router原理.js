/* 路由器插件 */
/* Vue.use(VRouter) */
let Vue

class VRouter {
    constructor(options) {
        this.$options = options

        // 缓存path和route映射关系
        this.routeMap = {}
        this.$options.routes.forEach(
            route => {
                this.routeMap[route.path] = route
            })

        // 响应式数据，响应式数据依赖于vue
        // current保存当前url
        // defineReactive给obj定义一个响应式属性 #/about
        const initial = window.location.hash.slice(1)
        Vue.util.defineReactive(this, 'current', initial) // this指向为router实例

        // 3.监控url变化
        window.addEventListener('hashchange', this.onHashChange.bind(this))
    }

    onHashChange() {
        this.current = window.location.hash.slice(1)
    }

}

// 1.实现install方法，注册$router和两个路由全局组件
VRouter.install = function (_Vue) {
    // 引用构造函数，VRouter中要使用
    Vue = _Vue

    // 挂载router实例，让我们的子组件可以使用它
    // 为了解决install先执行，还要在这里访问router实例(此时还未生成router实例)
    // 做一个全局混入，在beforCreate钩子里面做这件事
    Vue.mixin({
        beforeCreate() {
            // 此时上下文已经是组件实例
            // 如果this是根实例，则它的$options里面会有路由实例
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    // 2.实现两个全局组件： router-link , router-view
    // 输入：<router-link to="/about">xxx</router-link>
    // 输出：<a href="#/about">xxx</a>
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h('a', {
                attrs: {
                    href: '#' + this.to
                }
            },
                [this.$slots.default])
        }
    })

    Vue.component('router-view', {
        render(h) {
            // 找到当前url对应组件
            const { current, routeMap } = this.$router
            const component = routeMap[current] ? routeMap[current].component : null

            // 渲染传入组件
            return h(component)
        }
    })

}

export default VRouter