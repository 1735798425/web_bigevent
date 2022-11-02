$(function () {
    // 点击跳转"注册页面"
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()

    })

    // 点击跳转“登录页面”
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    // 自定义校验规则
    // 从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 通过form.verify()函数定义校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            let pwd = $('.reg-box [name="password"]').val()
            if (pwd !== value) {
                return '两次输入密码不一致'
            }
        }

    })
    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');
                $('#link_login').click()
            }
        });
    })
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败");
                }
                layer.msg('登录成功');
                // token存储在本地
                localStorage.setItem('token', res.token)
                // 跳转后台页面
                location.href = '/index.html'
            }
        });
    })

})