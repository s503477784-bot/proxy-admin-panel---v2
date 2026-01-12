/**
 * 会员管理模块
 */
const Members = {
    /**
     * 渲染会员表格
     */
    renderTable: function() {
        const tbody = document.getElementById('membersTableBody');
        if (!tbody) return;

        let html = '';
        MockData.members.forEach(member => {
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
    },

    /**
     * 打开修改密码弹窗
     */
    openChangePwdModal: function(username) {
        const title = document.getElementById('changePwdTitle');
        if (title) title.innerText = '修改密码 - ' + username;
        openModal('changePwdModal');
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
        openModal('deductResourceModal');
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
    toggleUserStatus: function(username, action) {
        const actionText = action === 'disable' ? '禁用' : '启用';
        if (confirm('确定要' + actionText + '用户 "' + username + '" 吗？')) {
            alert('用户已' + actionText);
            // 实际项目中调用API
        }
    },

    /**
     * 打开用户订单弹窗
     */
    openUserOrdersModal: function(username) {
        const title = document.getElementById('userOrdersTitle');
        if (title) title.innerText = '用户订单 - ' + username;
        
        const orders = MockData.userOrders[username] || [];
        const tbody = document.getElementById('userOrdersTableBody');
        const summary = document.getElementById('userOrdersSummary');
        
        if (orders.length === 0) {
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
        
        openModal('userOrdersModal');
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