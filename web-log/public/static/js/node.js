/* 接口请求 */
$(document).ready(function () {
    /* 获取文件列表并将结果显示在选择框中 */
    $('#loading-modal').modal('show');
    $("#loading-text").text('获取文件列表...');
    $.ajax({
        url: API_URL + "/api/list",
        type: "POST",
        success: function (data) {
            if (data.success) {
                var files = data.files;
                var selectBox = $("#select-box");
                for (var i = 0; i < files.length; i++) {
                    selectBox.append($("<option></option>").text(files[i]));
                }
                $('#loading-modal').modal('hide');
            } else {
                modal('访问后端失败', "获取文件列表失败！", false);
            }
        },
        error: function () {
            modal('访问后端失败', "获取文件列表失败！", false);
        }
    });
    /* 加载（处理）按钮点击事件 */
    $("#load-btn").click(function () {
        let filename = $("#select-box").val();
        console.log('选择文件', filename);
        if (!filename) {
            modal('错误', "请选择需要加载的文件！", true);
            return;
        }
        /* 显示 loading 动画 */
        $('#loading-modal').modal('show');
        $("#loading-text").text('等待服务端响应...');
        $.ajax({
            url: API_URL + "/api/load",
            type: "POST",
            data: { filename: filename },
            success: function (data) {
                if (data.success) {
                    $("#loading-text").text('加载数据...');
                    /* 更新表格数据 */
                    table.updateConfig({
                        columns: data.headers.map(header => header.trim()),
                        data: data.rows
                    }).forceRender();
                    /* 关闭 loading 动画 */
                    $('#loading-modal').modal('hide');
                } else {
                    $('#loading-modal').modal('hide');
                    modal('遇到错误', "加载文件失败！", true);
                    table.updateConfig({ placeholder: { loading: false } });
                }
            },
            error: function () {
                $('#loading-modal').modal('hide');
                modal('遇到错误', "加载文件失败！", true);
                table.updateConfig({ placeholder: { loading: false } });
            }
        });
    });
    /* 下载按钮点击事件 */
    $("#download-btn").click(function () {
        let filename = $("#select-box").val();
        if (!filename) {
            modal('遇到错误', "请选择要下载的文件！", true);
            return;
        }
        /* 创建一个隐藏的 iframe，用于下载 CSV 文件 */
        let downloadIframe = $("<iframe/>").appendTo("body").hide();
        downloadIframe.attr("src", API_URL + "/api/download?filename=" + filename);
    });
});



console.log('作者： PPOUI\n', 'https://www.minebbs.com/resources/authors/ppoui.33900/');