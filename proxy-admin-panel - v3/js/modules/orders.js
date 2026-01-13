/**
 * 订单管理模块
 */
const Orders = {
    // 当前筛选参数
    currentFilters: {
        page: 1,
        pageSize: 20,
        startDate: '',
        endDate: '',
        type: '',
        status: '',
        keyword: ''
    },
    
    // 当前数据
    currentData: {
        list: [],
        total: 0
    },

    /**
     * 渲染订单表格
     */
    renderTable: async function() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        // 显示加载状态
        Helpers.showLoading('ordersTableBody');
        
        try {
            // 调用API获取数据
            const result = await ApiService.getOrders(this.currentFilters);
            
            if (!result.success) {
                Helpers.showError('ordersTableBody', '加载订单数据失败');
                return;
            }
            
            this.currentData = result.data;
            const orders = result.data.list || result.data;
            
            if (!orders || orders.length === 0) {
                Helpers.showEmpty('ordersTableBody', '暂无订单数据');
                return;
            }

            let html = '';
            orders.forEach(order => {
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
            
            // 更新分页信息
            this.updatePagination();
            
        } catch (error) {
            console.error('渲染订单表格失败:', error);
            Helpers.showError('ordersTableBody');
        }
    },
    
    /**
     * 更新分页信息
     */
    updatePagination: function() {
        const pageInfo = document.querySelector('#orders-view .page-info');
        if (pageInfo && this.currentData.total !== undefined) {
            pageInfo.textContent = '共 ' + this.currentData.total.toLocaleString() + ' 条';
        }
    },

    /**
     * 查询订单
     */
    search: function() {
        // 收集筛选条件
        this.currentFilters.startDate = document.getElementById('orderStartDate')?.value || '';
        this.currentFilters.endDate = document.getElementById('orderEndDate')?.value || '';
        this.currentFilters.type = document.getElementById('orderPkgType')?.value || '';
        this.currentFilters.status = document.getElementById('orderPayStatus')?.value || '';
        this.currentFilters.keyword = document.getElementById('orderSearchKeyword')?.value || '';
        this.currentFilters.page = 1; // 重置到第一页
        
        // 重新渲染
        this.renderTable();
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
        
        // 重置筛选参数
        this.currentFilters = {
            page: 1,
            pageSize: 20,
            startDate: '',
            endDate: '',
            type: '',
            status: '',
            keyword: ''
        };
        
        // 重新渲染
        this.renderTable();
    },
    
    /**
     * 导出订单数据
     */
    export: function() {
        // 使用当前筛选条件导出
        Helpers.exportData('orders', this.currentFilters);
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
     * 切换订单类型（补充/线下支付）
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
     * 查询用户资源
     */
    lookupUserResource: Helpers.debounce(async function(value) {
        const infoDiv = document.getElementById('userResourceInfo');
        if (!value || value.length < 2) {
            if (infoDiv) infoDiv.style.display = 'none';
            return;
        }

        try {
            // 调用API查询用户资源
            const result = await ApiService.getUserResource(value);
            
            const userData = result.success ? result.data : { residential: '0', unlimited: '0', unlimitedConfig: '无' };
            
            const resBalance = document.getElementById('userResidentialBalance');
            const unlBalance = document.getElementById('userUnlimitedBalance');
            const unlConfig = document.getElementById('userUnlimitedConfig');
            
            if (resBalance) resBalance.innerText = userData.residential;
            if (unlBalance) unlBalance.innerText = userData.unlimited;
            if (unlConfig) unlConfig.innerText = userData.unlimitedConfig;
            if (infoDiv) infoDiv.style.display = 'block';
            
        } catch (error) {
            console.error('查询用户资源失败:', error);
        }
    }, 300),
    
    /**
     * 创建订单
     */
    createOrder: async function() {
        // 收集表单数据
        const orderData = {
            // TODO: 根据实际表单收集数据
        };
        
        try {
            const result = await ApiService.createOrder(orderData);
            
            if (result.success) {
                alert('订单创建成功');
                closeModal('createOrderModal');
                this.renderTable(); // 刷新列表
            } else {
                alert('订单创建失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('创建订单失败:', error);
            alert('创建订单失败');
        }
    },

    /**
     * 初始化
     */
    init: function() {
        this.renderTable();
    }
};

// 全局函数
function resetOrderFilters() { Orders.resetFilters(); }
function searchOrders() { Orders.search(); }
function exportOrders() { Orders.export(); }
function togglePkgConfig() { Orders.togglePkgConfig(); }
function toggleOrderAmountInput() { Orders.toggleOrderAmountInput(); }
function toggleUnlimitedAction() { Orders.toggleUnlimitedAction(); }
function lookupUserResource(value) { Orders.lookupUserResource(value); }