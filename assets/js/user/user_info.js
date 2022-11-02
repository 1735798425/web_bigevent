$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg('不能超过6位')
            }
        }

    })
    initUserInfo()
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formuserinfo', res.data)
            }
        });
    }
    // 重置表单的内容
    $('#btnreset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })
    // 监听表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父级页面的方法，重新渲染用户的头像和信息
                window.parent.getUesrInfo()
            }
        });
    })


})