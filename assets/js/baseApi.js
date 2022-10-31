$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my') !== -1) {
        // 判断是否是my接口
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete回调函数
    // 无论成功失败都会调用complete函数
    options.complete = function (res) {
        // console.log(res);
        // 在此函数中可以通过使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转登录页
            location.href = './login.html'
        }
    }
})