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
     * 数据导出
     */
    exportData: function(type) {
        const typeName = CONFIG.EXPORT_TYPE_NAMES[type] || type;
        const fileName = typeName + '_' + this.getToday() + '.xlsx';
        alert('正在导出: ' + fileName);
        // 实际项目中这里调用真实的导出API
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
    }
};

// 全局暴露常用函数
function copyText(text) { Helpers.copyText(text); }
function exportData(type) { Helpers.exportData(type); }