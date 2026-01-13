/**
 * 会员管理模块
 */
const Members = {
    // 当前筛选参数
    currentFilters: {
        page: 1,
        pageSize: 20,
        startDate: '',
        endDate: '',
        username: '',
        email: ''
    },
    
    // 当前数据
    currentData: {
        list: [],
        total: 0
    },

    /**
     * 渲染会员表格
     */
    renderTable: async function() {
        const tbody = document.getElementById('membersTableBody');
        if (!tbody) return;

        // 显示加载状态
        Helpers.showLoading('membersTableBody');
        
        try {
            // 调用API获取数据
            const result = await ApiService.getMembers(this.currentFilters);
            
            if (!result.success) {
                Helpers.showError('membersTableBody', '加载会员数据失败');
                return;
            }
            
            this.currentData = result.data;
            const members = result.data.list || result.data;
            
            if (!members || members.length === 0) {
                Helpers.showEmpty('membersTableBody', '暂无会员数据');
                return;
            }

            let html = '';
            members.forEach(member => {
                const isDisabled = member.status === 'disabled';
                const toggleBtnStyle = isDisabled ? 'style="color:var(--success-color);"' : '';
                const toggleBtnClass = isDisabled ? '' : 'danger';
                const toggleAction = isDisabled ? 'enable' : 'disable';
                const toggleText = isDisabled ? '启用' : '禁用';

                html += `
                    <tr>
                        <td>${member.username}</td>
                        <td>${member.email}</td>
                        <td>${member.password}</td>
                        <td style="text-align:right; font-weight:bold;">${member.residentialBalance}</td>
                        <td style="text-align:right; ${member.unlimitedBalance === '0 天' ? 'color:var(--text-hint);' : 'font-weight:bold;'}">${member.unlimitedBalance}</td>
                        <td style="text-align:right; font-weight:bold;">${Helpers.formatMoney(member.totalSpent)}</td>
                        <td>${member.registerTime}</td>
                        <td>${Helpers.getStatusTag(member.status, 'user')}</td>
                        <td class="action-cell">
                            <button class="btn btn-text" onclick="Members.openChangePwdModal('${member.username}')">改密</button>
                            <button class="btn btn-text" onclick="Members.openDeductModal('${member.username}', '${member.residentialBalance}', '${member.unlimitedBalance}')">扣除</button>
                            <button class="btn btn-text" onclick="Members.openUserOrdersModal('${member.username}')">订单</button>
                            <button class="btn btn-text ${toggleBtnClass}" ${toggleBtnStyle} onclick="Members.toggleUserStatus('${member.username}', '${toggleAction}')">${toggleText}</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
            
            // 更新分页信息
            this.updatePagination();
            
        } catch (error) {
            console.error('渲染会员表格失败:', error);
            Helpers.showError('membersTableBody');
        }
    },
    
    /**
     * 更新分页信息
     */
    updatePagination: function() {
        const pageInfo = document.querySelector('#members-view .page-info');
        if (pageInfo && this.currentData.total !== undefined) {
            pageInfo.textContent = '共 ' + this.currentData.total.toLocaleString() + ' 条';
        }
    },
    
    /**
     * 查询会员
     */
    search: function() {
        this.currentFilters.startDate = document.getElementById('memberStartDate')?.value || '';
        this.currentFilters.endDate = document.getElementById('memberEndDate')?.value || '';
        // 获取用户名和邮箱搜索框的值
        const usernameInput = document.querySelector('#members-view input[placeholder="用户名搜索"]');
        const emailInput = document.querySelector('#members-view input[placeholder="邮箱搜索"]');
        this.currentFilters.username = usernameInput?.value || '';
        this.currentFilters.email = emailInput?.value || '';
        this.currentFilters.page = 1;
        
        this.renderTable();
    },
    
    /**
     * 重置筛选条件
     */
    resetFilters: function() {
        document.getElementById('memberStartDate').value = '';
        document.getElementById('memberEndDate').value = '';
        const usernameInput = document.querySelector('#members-view input[placeholder="用户名搜索"]');
        const emailInput = document.querySelector('#members-view input[placeholder="邮箱搜索"]');
        if (usernameInput) usernameInput.value = '';
        if (emailInput) emailInput.value = '';
        
        this.currentFilters = {
            page: 1,
            pageSize: 20,
            startDate: '',
            endDate: '',
            username: '',
            email: ''
        };
        
        this.renderTable();
    },
    
    /**
     * 导出会员数据
     */
    export: function() {
        Helpers.exportData('members', this.currentFilters);
    },

    /**
     * 打开修改密码弹窗
     */
    openChangePwdModal: function(username) {
        const title = document.getElementById('changePwdTitle');
        if (title) title.innerText = '修改密码 - ' + username;
        
        // 存储当前操作的用户名
        this._currentUsername = username;
        
        openModal('changePwdModal');
    },
    
    /**
     * 提交修改密码
     */
    submitChangePassword: async function() {
        const newPwd = document.getElementById('newPassword')?.value;
        const confirmPwd = document.getElementById('confirmPassword')?.value;
        
        if (!newPwd || !confirmPwd) {
            alert('请填写新密码');
            return;
        }
        
        if (newPwd !== confirmPwd) {
            alert('两次输入的密码不一致');
            return;
        }
        
        try {
            const result = await ApiService.changeMemberPassword(this._currentUsername, newPwd);
            
            if (result.success) {
                alert('密码修改成功');
                closeModal('changePwdModal');
                this.renderTable();
            } else {
                alert('密码修改失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('修改密码失败:', error);
            alert('修改密码失败');
        }
    },

    /**
     * 打开扣除资源弹窗
     */
    openDeductModal: function(username, residential, unlimited) {
        const title = document.getElementById('deductTitle');
        const balanceInfo = document.getElementById('deductBalanceInfo');
        
        if (title) title.innerText = '扣除资源 - ' + username;
        if (balanceInfo) {
            balanceInfo.innerHTML = '<span class="balance-label">当前余额:</span> 动态住宅 ' + residential + ' / 无限量 ' + unlimited;
        }
        
        this._currentUsername = username;
        
        openModal('deductResourceModal');
    },
    
    /**
     * 提交扣除资源
     */
    submitDeductResource: async function() {
        const type = document.querySelector('input[name="deductType"]:checked')?.value;
        const amount = document.getElementById('deductAmount')?.value;
        
        if (!amount || parseFloat(amount) <= 0) {
            alert('请输入有效的扣除数量');
            return;
        }
        
        try {
            const result = await ApiService.deductMemberResource(this._currentUsername, {
                type: type,
                amount: parseFloat(amount)
            });
            
            if (result.success) {
                alert('资源扣除成功');
                closeModal('deductResourceModal');
                this.renderTable();
            } else {
                alert('资源扣除失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('扣除资源失败:', error);
            alert('扣除资源失败');
        }
    },

    /**
     * 切换扣除单位
     */
    updateDeductUnit: function(unit) {
        const unitEl = document.getElementById('deductUnit');
        if (unitEl) unitEl.innerText = unit;
    },

    /**
     * 验证扣除数量
     */
    validateDeductAmount: function(input) {
        const value = parseFloat(input.value);
        const errorEl = document.getElementById('deductAmountError');
        
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
     * 切换用户状态
     */
    toggleUserStatus: async function(username, action) {
        const actionText = action === 'disable' ? '禁用' : '启用';
        if (!confirm('确定要' + actionText + '用户 "' + username + '" 吗？')) {
            return;
        }
        
        try {
            const result = await ApiService.toggleMemberStatus(username, action);
            
            if (result.success) {
                alert('用户已' + actionText);
                this.renderTable();
            } else {
                alert(actionText + '失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('切换用户状态失败:', error);
            alert(actionText + '失败');
        }
    },

    /**
     * 打开用户订单弹窗
     */
    openUserOrdersModal: async function(username) {
        const title = document.getElementById('userOrdersTitle');
        if (title) title.innerText = '用户订单 - ' + username;
        
        const tbody = document.getElementById('userOrdersTableBody');
        const summary = document.getElementById('userOrdersSummary');
        
        // 显示加载状态
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> 加载中...</td></tr>';
        }
        
        openModal('userOrdersModal');
        
        try {
            // 调用API获取用户订单
            const result = await ApiService.getMemberOrders(username);
            const orders = result.success ? result.data : [];
            
            if (!orders || orders.length === 0) {
                if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-hint); padding:40px;">暂无已支付订单</td></tr>';
                if (summary) summary.innerHTML = '';
            } else {
                let html = '';
                let total = 0;
                orders.forEach(order => {
                    const typeClass = order.type === '动态住宅代理' ? 'tag-blue' : 'tag-green';
                    html += `
                        <tr>
                            <td>${order.orderNo}</td>
                            <td><span class="tag ${typeClass}">${order.type}</span></td>
                            <td>${order.resource}</td>
                            <td style="text-align:right; font-weight:bold;">${order.amount}</td>
                            <td>${order.time}</td>
                        </tr>
                    `;
                    total += parseFloat(order.amount.replace('¥', '').replace(',', ''));
                });
                if (tbody) tbody.innerHTML = html;
                if (summary) {
                    summary.innerHTML = '共 ' + orders.length + ' 笔订单，总花费：<span style="color:var(--primary-color);">' + Helpers.formatMoney(total) + '</span>';
                }
            }
        } catch (error) {
            console.error('获取用户订单失败:', error);
            if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#ff4d4f; padding:40px;">加载失败</td></tr>';
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
function openChangePwdModal(username) { Members.openChangePwdModal(username); }
function openDeductModal(username, residential, unlimited) { Members.openDeductModal(username, residential, unlimited); }
function updateDeductUnit(unit) { Members.updateDeductUnit(unit); }
function validateDeductAmount(input) { Members.validateDeductAmount(input); }
function toggleUserStatus(username, action) { Members.toggleUserStatus(username, action); }
function openUserOrdersModal(username) { Members.openUserOrdersModal(username); }
function searchMembers() { Members.search(); }
function resetMemberFilters() { Members.resetFilters(); }
function exportMembers() { Members.export(); }