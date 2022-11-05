$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) { return layer.msg('获取列表信息失败') }
                let htmlsrt = template('tpl-table', res)
                $('tbody').html(htmlsrt)
            }
        });
    }
    // 为添加类别按钮添加事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理形式为form-add表单绑定提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        });

    })
    // 给编辑添加事件
    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function (e) {
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        // 发起请求获取对于内容信息
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                form.val('form-edit', res.data)
            }
        });
    })

    // 通过代理为修改分类表单绑定提交事件
    $('body').on('click', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据失败')
                layer.close(indexEdit)
                initArtCateList()
            }
        });
    })
    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault()
        let id = $(this).attr('data-id')
        // 提示用户是否删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')
                    layer.close(index);
                    initArtCateList()
                }
            });

        });

    })
})