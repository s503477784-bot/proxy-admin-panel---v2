/**
 * 工具函数集合
 */
const Helpers = {
    /**
     * 复制文本到剪贴板
     */
    copyText: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制: ' + text);
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('已复制: ' + text);
        });
    },

    /**
     * 格式化金额
     */
    formatMoney: function(amount, currency = '¥') {
        return currency + parseFloat(amount).toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    /**
     * 格式化日期
     */
    formatDate: function(date, format = 'YYYY-MM-DD HH:mm') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    },

    /**
     * 获取今天日期字符串
     */
    getToday: function() {
        return this.formatDate(new Date(), 'YYYY-MM-DD');
    },

    /**
     * 数据导出（使用SheetJS导出为Excel）
     * @param {string} type - 导出类型: orders/members/daily
     * @param {object} filterParams - 筛选参数（可选）
     */
    exportData: async function(type, filterParams = {}) {
        const typeName = CONFIG.EXPORT_TYPE_NAMES[type] || type;
        const fileName = typeName + '_' + this.getToday() + '.xlsx';
        
        // 显示导出中提示
        const loadingMsg = '正在导出 ' + typeName + '，请稍候...';
        console.log(loadingMsg);
        
        try {
            let data = [];
            let headers = [];
            let columnWidths = [];
            
            // 根据类型获取数据和表头
            switch(type) {
                case 'orders':
                    const ordersResult = await ApiService.exportOrders(filterParams);
                    if (!ordersResult.success) throw new Error('获取订单数据失败');
                    data = this.formatOrdersForExport(ordersResult.data);
                    headers = ['用户名', '邮箱', '订单号', '套餐类型', '服务器配置', '资源量', '订单金额', '支付金额', '状态', '支付时间', '订单来源'];
                    columnWidths = [15, 25, 20, 15, 20, 12, 12, 12, 10, 18, 10];
                    break;
                    
                case 'members':
                    const membersResult = await ApiService.exportMembers(filterParams);
                    if (!membersResult.success) throw new Error('获取会员数据失败');
                    data = this.formatMembersForExport(membersResult.data);
                    headers = ['用户名', '邮箱', '住宅代理余额', '无限量余额', '总花费', '注册时间', '状态'];
                    columnWidths = [15, 25, 15, 12, 15, 18, 10];
                    break;
                    
                case 'daily':
                    const dailyResult = await ApiService.exportDailyData(filterParams);
                    if (!dailyResult.success) throw new Error('获取每日数据失败');
                    data = this.formatDailyDataForExport(dailyResult.data);
                    headers = ['日期', '总订单量', '总销售额', '注册人数', '动态住宅订单', '动态住宅销售额', '无限量订单', '无限量销售额'];
                    columnWidths = [12, 12, 15, 12, 15, 18, 12, 15];
                    break;
                    
                default:
                    alert('未知的导出类型');
                    return;
            }
            
            // 使用SheetJS创建工作簿
            this.createAndDownloadExcel(data, headers, columnWidths, fileName, typeName);
            
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败: ' + error.message);
        }
    },
    
    /**
     * 格式化订单数据用于导出
     */
    formatOrdersForExport: function(orders) {
        return orders.map(order => ({
            '用户名': order.username,
            '邮箱': order.email,
            '订单号': order.orderNo,
            '套餐类型': CONFIG.PRODUCT_TYPE_NAMES[order.type] || order.type,
            '服务器配置': order.serverConfig,
            '资源量': order.resource,
            '订单金额': order.orderAmount,
            '支付金额': order.payAmount,
            '状态': CONFIG.ORDER_STATUS_NAMES[order.status] || order.status,
            '支付时间': order.payTime,
            '订单来源': order.source
        }));
    },
    
    /**
     * 格式化会员数据用于导出
     */
    formatMembersForExport: function(members) {
        return members.map(member => ({
            '用户名': member.username,
            '邮箱': member.email,
            '住宅代理余额': member.residentialBalance,
            '无限量余额': member.unlimitedBalance,
            '总花费': member.totalSpent,
            '注册时间': member.registerTime,
            '状态': member.status === 'active' ? '正常' : '禁用'
        }));
    },
    
    /**
     * 格式化每日数据用于导出
     */
    formatDailyDataForExport: function(dailyData) {
        return dailyData.map(day => ({
            '日期': day.date + (day.isToday ? ' (今日)' : ''),
            '总订单量': day.totalOrders,
            '总销售额': day.totalSales,
            '注册人数': day.newUsers,
            '动态住宅订单': day.residentialOrders,
            '动态住宅销售额': day.residentialSales,
            '无限量订单': day.unlimitedOrders,
            '无限量销售额': day.unlimitedSales
        }));
    },
    
    /**
     * 创建并下载Excel文件
     */
    createAndDownloadExcel: function(data, headers, columnWidths, fileName, sheetName) {
        // 检查SheetJS是否加载
        if (typeof XLSX === 'undefined') {
            alert('Excel导出库未加载，请检查网络连接');
            return;
        }
        
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(data, { header: headers });
        
        // 设置列宽
        ws['!cols'] = columnWidths.map(w => ({ wch: w }));
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        // 下载文件
        XLSX.writeFile(wb, fileName);
        
        console.log('导出成功: ' + fileName);
    },

    /**
     * 验证输入框数值（非负数）
     */
    validateNonNegative: function(input) {
        const value = parseFloat(input.value);
        const errorEl = input.parentElement.querySelector('.error-hint');
        
        if (value < 0) {
            input.classList.add('error');
            if (errorEl) errorEl.style.display = 'inline';
            return false;
        } else {
            input.classList.remove('error');
            if (errorEl) errorEl.style.display = 'none';
            return true;
        }
    },

    /**
     * 防抖函数
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * 获取状态标签HTML
     */
    getStatusTag: function(status, type = 'order') {
        const statusMap = {
            order: {
                paid: '<span class="tag tag-green"><i class="fas fa-check"></i> 已支付</span>',
                unpaid: '<span class="tag tag-orange"><i class="fas fa-clock"></i> 未支付</span>',
                refunded: '<span class="tag tag-gray"><i class="fas fa-undo"></i> 已退款</span>'
            },
            user: {
                active: '<span class="tag tag-green">正常</span>',
                disabled: '<span class="tag tag-red">禁用</span>'
            },
            package: {
                active: '<span class="tag tag-success"><i class="fas fa-check"></i> 启用</span>',
                disabled: '<span class="tag tag-disable">禁用</span>'
            }
        };
        return statusMap[type]?.[status] || '';
    },

    /**
     * 获取产品类型标签HTML
     */
    getProductTag: function(type) {
        const tags = {
            residential: '<span class="tag tag-blue">动态住宅代理</span>',
            unlimited: '<span class="tag tag-green">无限量代理</span>'
        };
        return tags[type] || '';
    },

    /**
     * 获取订单来源标签HTML
     */
    getSourceTag: function(source) {
        const tags = {
            '官网': '<span class="tag tag-purple">官网</span>',
            '后台': '<span class="tag tag-gray">后台</span>'
        };
        return tags[source] || source;
    },
    
    /**
     * 显示加载状态
     * @param {string} elementId - 元素ID
     * @param {boolean} show - 是否显示
     */
    showLoading: function(elementId, show = true) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        if (show) {
            el.innerHTML = '<tr><td colspan="100%" style="text-align:center; padding:40px; color:var(--text-hint);"><i class="fas fa-spinner fa-spin"></i> 加载中...</td></tr>';
        }
    },
    
    /**
     * 显示空数据状态
     * @param {string} elementId - 元素ID
     * @param {string} message - 提示消息
     */
    showEmpty: function(elementId, message = '暂无数据') {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.innerHTML = '<tr><td colspan="100%" style="text-align:center; padding:40px; color:var(--text-hint);">' + message + '</td></tr>';
    },
    
    /**
     * 显示错误状态
     * @param {string} elementId - 元素ID
     * @param {string} message - 错误消息
     */
    showError: function(elementId, message = '加载失败，请重试') {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        el.innerHTML = '<tr><td colspan="100%" style="text-align:center; padding:40px; color:#ff4d4f;"><i class="fas fa-exclamation-circle"></i> ' + message + '</td></tr>';
    }
};

// 全局暴露常用函数
function copyText(text) { Helpers.copyText(text); }
function exportData(type, params) { Helpers.exportData(type, params); }