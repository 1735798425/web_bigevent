$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    let layer = layui.layer
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChoseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        //   获取用户选择的文件
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        } else {
            // 拿到文件
            // var file = e.target.files[0] 
            // 将文件转为路径
            var newImgURL = URL.createObjectURL(filelist[0])
            // 重新初始化图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    })
    // 确定按钮绑定事件
    $('#btnupload').on('click', function () {
        // 拿到用户裁剪过后的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) { return layer.msg('上传头像失败') }
                layer.msg('上传头像成功')
                window.parent.getUesrInfo()
            }
        });
    })



})