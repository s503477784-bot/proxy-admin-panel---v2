/**
 * 订单管理模块
 */
const Orders = {
    /**
     * 渲染订单表格
     */
    renderTable: function() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        let html = '';
        MockData.orders.forEach(order => {
            html += `
                <tr>
                    <td>${order.username}</td>
                    <td>${order.email}</td>
                    <td>${order.orderNo} <i class="far fa-copy" style="color:var(--primary-color); cursor:pointer;" onclick="event.stopPropagation(); copyText('${order.orderNo}')"></i></td>
                    <td>${Helpers.getProductTag(order.type)}</td>
                    <td style="color:var(--text-hint);">${order.serverConfig}</td>
                    <td>${order.resource}</td>
                    <td style="text-align:right;">${Helpers.formatMoney(order.orderAmount)}</td>
                    <td style="text-align:right; font-weight:bold;">${Helpers.formatMoney(order.payAmount)}</td>
                    <td>${Helpers.getStatusTag(order.status, 'order')}</td>
                    <td>${order.payTime}</td>
                    <td>${Helpers.getSourceTag(order.source)}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    /**
     * 重置订单筛选条件
     */
    resetFilters: function() {
        document.getElementById('orderStartDate').value = '';
        document.getElementById('orderEndDate').value = '';
        document.getElementById('orderPkgType').value = '';
        document.getElementById('orderPayStatus').value = '';
        document.getElementById('orderSearchKeyword').value = '';
    },

    /**
     * 切换套餐类型配置显示
     */
    togglePkgConfig: function() {
        const type = document.querySelector('input[name="pkgType"]:checked')?.value;
        document.querySelectorAll('.resource-config').forEach(el => el.classList.remove('active'));
        
        if (type === 'residential') {
            document.getElementById('config-residential')?.classList.add('active');
        } else {
            document.getElementById('config-unlimited')?.classList.add('active');
        }
    },

    /**
     * 切换订单类型（补偿/线下支付）
     */
    toggleOrderAmountInput: function() {
        const type = document.querySelector('input[name="orderType"]:checked')?.value;
        const amountInput = document.getElementById('orderAmountInput');
        
        if (type === 'offline') {
            amountInput?.classList.add('active');
        } else {
            amountInput?.classList.remove('active');
            const amountField = document.getElementById('orderAmount');
            if (amountField) amountField.value = '';
        }
    },

    /**
     * 切换无限量代理操作类型
     */
    toggleUnlimitedAction: function() {
        const action = document.querySelector('input[name="unlimitedAction"]:checked')?.value;
        document.querySelectorAll('.unlimited-action-config').forEach(el => el.classList.remove('active'));
        
        const targetEl = document.getElementById('unlimited-' + action);
        if (targetEl) targetEl.classList.add('active');
    },

    /**
     * 查询用户资源（模拟）
     */
    lookupUserResource: Helpers.debounce(function(value) {
        const infoDiv = document.getElementById('userResourceInfo');
        if (!value || value.length < 2) {
            if (infoDiv) infoDiv.style.display = 'none';
            return;
        }

        const userData = MockData.userResources[value] || { residential: '0', unlimited: '0', unlimitedConfig: '无' };
        
        const resBalance = document.getElementById('userResidentialBalance');
        const unlBalance = document.getElementById('userUnlimitedBalance');
        const unlConfig = document.getElementById('userUnlimitedConfig');
        
        if (resBalance) resBalance.innerText = userData.residential;
        if (unlBalance) unlBalance.innerText = userData.unlimited;
        if (unlConfig) unlConfig.innerText = userData.unlimitedConfig;
        if (infoDiv) infoDiv.style.display = 'block';
    }, 300),

    /**
     * 初始化
     */
    init: function() {
        this.renderTable();
    }
};

// 全局函数
function resetOrderFilters() { Orders.resetFilters(); }
function togglePkgConfig() { Orders.togglePkgConfig(); }
function toggleOrderAmountInput() { Orders.toggleOrderAmountInput(); }
function toggleUnlimitedAction() { Orders.toggleUnlimitedAction(); }
function lookupUserResource(value) { Orders.lookupUserResource(value); }