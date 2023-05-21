/* 创建 grid.js 表格 */
const table = new gridjs.Grid({
    columns: [],
    data: [],
    /* 自定义配置 */
    sort: true,/* 排序 */
    search: true,/* 搜索 */
    resizable: true,/* 可调整大小的列 */
    fixedHeader: true,/* 固定标头 */
    pagination: true,/* 分页 */
    height: window.innerHeight - document.getElementById("navbars").clientHeight - 140,
    /* 配置语言 */
    language: {
        'search': {
            'placeholder': '🔍 会用搜索的人不简单...'
        },
        'pagination': {
            'previous': '上一页',
            'next': '下一页',
            'showing': '😃 显示',
            'to': '到',
            'of': '条 共',
            'results': () => '条数据'
        },
        "sort": {
            sortAsc: "按列升序排序",
            ortDesc: "按列降序排序"
        },
        loading: "数据加载中...",
        noRecordsFound: "没有找到匹配的记录",
        error: "获取数据时出错"
    },
    /* 自定义CSS */
    style: {
        th: {
            'background-color': 'rgba(0, 0, 0, 0.1)',
            color: '#000',
            'text-align': 'center'
        },
        td: {
            'text-align': 'center'
        }
    },
    /* 配置分页 */
    pagination: {
        limit: 100
    }
}).render(document.getElementById("table-wrapper"));
