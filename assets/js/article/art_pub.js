$(function () {
    let layer = layui.layer
    let form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                let htmlstr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlstr)
                // 一定要重新渲染表单区域，form.render()
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 为选择封面按钮绑定点击事件处理函数
    $('#btnChoose').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(file[0])
        // 重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 定义文章发布状态
    let art_state = "已发布"
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    $('#sub').on('click', function () {
        art_state = '已发布'
    })
    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建FormData事件
        let fd = new FormData($(this)[0])
        //    将文章发布状态添加进fd中
        fd.append('state', art_state)
        // 将封面裁剪后的图片，输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                //    创建画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续追加操作
                fd.append('cover_img', blob)
                // 发起ajax
                publishArticle(fd)
            })

    })

    // 发起新文章方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            //如果向服务器提交FormData格式数据
            //必须要以下两个配置项：
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '../article/art_list.html'
           
            }
        });
    }
})