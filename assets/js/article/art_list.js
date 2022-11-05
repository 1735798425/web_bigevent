$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;

    // 定义美化事件的过滤器
    template.defaults.imports.time = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padzero(dt.getMonth() + 1)
        let d = padzero(dt.getDay())
        let hh = padzero(dt.getHours())
        let mm = padzero(dt.getMinutes())
        let ss = padzero(dt.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数提交到服务器   
    let q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示几条数据
        cate_id: '',//文章分类的id
        state: '',//文章的发布状态
    }
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败')
                }
                // 使用模板引擎渲染页面
                let htmlstr = template('tpl-table', res)
                $('tbody').html(htmlstr)
                // 调用渲染分页的方法
                renderpage(res.total)
            }
        });
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败！')
                }
                // 调用模板引擎渲染可选项
                let htmlstr = template('tpl-cate', res)
                $('[name = "cate_id"]').html(htmlstr)
                // layui重新渲染
                form.render()
            }
        });
    }

    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的值
        let cate_id = $('[name="cate_id"]').val()
        let state = $('[name="state"]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件赋值
        initTable()
    })

    // 定义渲染分页的方法
    function renderpage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limit: [2, 3, 5, 10],
            // 分页发生切换时，触发jump回调：两种方式
            //1.点击触发 2.调用laypage.render()方法,就会触发jump回调
            jump: function (obj, first) {
                // first可以判断是通过哪种方式触发jump回调
                //如果first为true，则为第二种方式触发
                // console.log(obj.curr);
                // 最新页面赋值给q的查询对象中
                q.pagenum = obj.curr
                // 最新条目数赋值到q的pagesize中
                q.pagesize = obj.limit
                // 利用判断，防止两个方法互相调用，进入死循环
                if (!first) {
                    initTable()
                }

            }
        });
    }
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章id
        let id = $(this).attr('data-id')
        // 获取按钮个数
        let len = $('.btn-delete').length
        //    弹出框询问是否删除
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成后，判断当前页面是否还存在数据
                    //不存在就页面减一
                    //如果len等于1，则证明页面上没有任何数据了
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });

            layer.close(index);
        });
    })

    // 编辑按钮
    $('tbody').on('click', '.btn-bianji', function () {
        location.href = '../article/art_bianji.html' + "?" + $.param({ id: 1 })
    })

})