
$(function () {
    // 调用用户基本信息函数
    getUesrInfo()
    // 点击按钮实现退出功能
    $('#btnlogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 退出清空本地token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = './login.html'
            // 关闭询问窗
            layer.close(index);
        });
    })

})

function getUesrInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
     
    });

}
function renderAvatar(user) {
    // 获取用户名字
    let name = user.nickname || user.username
    // 欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show
    }
}