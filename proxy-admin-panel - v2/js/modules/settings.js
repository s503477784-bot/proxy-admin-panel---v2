/**
 * 系统设置模块
 */
const Settings = {
    /**
     * 渲染动态住宅代理套餐表格
     */
    renderResidentialTable: function() {
        const tbody = document.getElementById('residentialTableBody');
        if (!tbody) return;

        let html = '';
        MockData.residentialPackages.forEach(pkg => {
            const isActive = pkg.status === 'active';
            html += `
                <tr id="residential-row-${pkg.id}">
                    <td>${pkg.name}</td>
                    <td class="align-center">${pkg.gb}</td>
                    <td class="align-right">$${pkg.price.toFixed(2)}</td>
                    <td class="align-right">$${pkg.total.toFixed(2)}</td>
                    <td class="align-center">${pkg.days}</td>
                    <td>${pkg.createTime}</td>
                    <td><span class="tag ${isActive ? 'tag-success' : 'tag-disable'}" id="residential-status-${pkg.id}">${isActive ? '<i class="fas fa-check"></i> 启用' : '禁用'}</span></td>
                    <td>
                        <button class="btn btn-text" onclick="Settings.openResidentialEditModal('${pkg.name}', ${pkg.gb}, ${pkg.price}, ${pkg.days})">编辑</button>
                        <button class="btn btn-text danger" onclick="openModal('deleteModal')">删除</button>
                        <button class="btn btn-text" id="residential-toggle-${pkg.id}" onclick="Settings.toggleResidentialStatus(${pkg.id})">${isActive ? '禁用' : '启用'}</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    /**
     * 渲染无限量代理套餐表格
     */
    renderUnlimitedTable: function() {
        const tbody = document.getElementById('unlimitedTableBody');
        if (!tbody) return;

        let html = '';
        MockData.unlimitedPackages.forEach(pkg => {
            const isActive = pkg.status === 'active';
            html += `
                <tr id="unlimited-row-${pkg.id}">
                    <td>${pkg.name}</td>
                    <td class="align-center">${pkg.days}</td>
                    <td class="align-right">$${pkg.basePrice.toLocaleString()}</td>
                    <td style="font-size:12px;">${pkg.baseConfig}</td>
                    <td class="align-right">$${pkg.cpuUpgrade}/级</td>
                    <td class="align-right">$${pkg.bandwidthUpgrade}/100Mbps</td>
                    <td>${pkg.updateTime}</td>
                    <td><span class="tag ${isActive ? 'tag-success' : 'tag-disable'}" id="unlimited-status-${pkg.id}">${isActive ? '启用' : '禁用'}</span></td>
                    <td>
                        <button class="btn btn-text" onclick="Settings.openUnlimitedEditModal('${pkg.name}', ${pkg.basePrice}, ${pkg.cpuUpgrade}, ${pkg.bandwidthUpgrade})">编辑</button>
                        <button class="btn btn-text danger" onclick="openModal('deleteModal')">删除</button>
                        <button class="btn btn-text" id="unlimited-toggle-${pkg.id}" onclick="Settings.toggleUnlimitedStatus(${pkg.id})">${isActive ? '禁用' : '启用'}</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    /**
     * 渲染管理员表格
     */
    renderAdminTable: function() {
        const tbody = document.getElementById('adminTableBody');
        if (!tbody) return;

        let html = '';
        MockData.admins.forEach(admin => {
            const isSuper = admin.role === 'super';
            const isActive = admin.status === 'active';
            const roleTag = isSuper 
                ? '<span class="tag tag-super"><i class="fas fa-star"></i> 超级管理员</span>'
                : '<span class="tag tag-normal">普通管理员</span>';
            
            html += `
                <tr>
                    <td>${admin.username}${admin.isCurrent ? ' <span style="font-size:12px; color:#999;">(我)</span>' : ''}</td>
                    <td>${admin.email}</td>
                    <td>${admin.password}</td>
                    <td>${roleTag}</td>
                    <td>${admin.createTime}</td>
                    <td><span class="tag ${isActive ? 'tag-success' : 'tag-disable'}">${isActive ? '正常' : '禁用'}</span></td>
                    <td>
                        <button class="btn btn-text" onclick="openModal('adminModal', 'edit')">编辑</button>
                        <button class="btn btn-text ${admin.isCurrent ? 'disabled' : 'danger'}" ${admin.isCurrent ? 'title="无法删除当前登录账户"' : 'onclick="openModal(\'deleteAdminModal\')"'}>删除</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    /**
     * 打开动态住宅代理编辑弹窗
     */
    openResidentialEditModal: function(name, gb, price, days) {
        document.getElementById('residentialTitle').innerText = '编辑动态住宅代理套餐';
        document.getElementById('residentialName').value = name;
        document.getElementById('residentialGb').value = gb;
        document.getElementById('residentialPrice').value = price;
        document.getElementById('residentialDays').value = days;
        this.calculateResidentialTotal();
        openModal('residentialModal');
    },

    /**
     * 计算动态住宅代理总价
     */
    calculateResidentialTotal: function() {
        const gb = parseFloat(document.getElementById('residentialGb')?.value) || 0;
        const price = parseFloat(document.getElementById('residentialPrice')?.value) || 0;
        const total = document.getElementById('residentialTotal');
        if (total) total.value = '$' + (gb * price).toFixed(2);
    },

    /**
     * 切换动态住宅代理套餐状态
     */
    toggleResidentialStatus: function(rowId) {
        const statusEl = document.getElementById('residential-status-' + rowId);
        const toggleBtn = document.getElementById('residential-toggle-' + rowId);
        
        if (statusEl.classList.contains('tag-success')) {
            statusEl.classList.remove('tag-success');
            statusEl.classList.add('tag-disable');
            statusEl.innerHTML = '禁用';
            toggleBtn.innerText = '启用';
            alert('套餐已禁用');
        } else {
            statusEl.classList.remove('tag-disable');
            statusEl.classList.add('tag-success');
            statusEl.innerHTML = '<i class="fas fa-check"></i> 启用';
            toggleBtn.innerText = '禁用';
            alert('套餐已启用');
        }
    },

    /**
     * 打开无限量代理编辑弹窗（仅编辑价格）
     */
    openUnlimitedEditModal: function(name, basePrice, cpuPrice, bandwidthPrice) {
        document.getElementById('unlimitedTitle').innerText = '编辑无限量代理套餐';
        document.getElementById('unlimitedName').value = name;
        document.getElementById('unlimitedName').readOnly = true;
        document.getElementById('unlimitedBasePrice').value = basePrice;
        document.getElementById('unlimitedCpuPrice').value = cpuPrice;
        document.getElementById('unlimitedBandwidthPrice').value = bandwidthPrice;
        
        // 编辑模式隐藏天数和基础配置
        document.getElementById('unlimitedDaysGroup').style.display = 'none';
        document.getElementById('unlimitedBaseConfigGroup').style.display = 'none';
        
        document.getElementById('unlimitedModal').style.display = 'flex';
    },

    /**
     * 打开无限量代理新增弹窗
     */
    openUnlimitedAddModal: function() {
        document.getElementById('unlimitedTitle').innerText = '添加无限量代理套餐';
        document.getElementById('unlimitedName').value = '';
        document.getElementById('unlimitedName').readOnly = false;
        document.getElementById('unlimitedDays').value = '';
        document.getElementById('unlimitedBasePrice').value = '';
        document.getElementById('unlimitedBaseBandwidth').value = '200';
        document.getElementById('unlimitedBaseCpu').value = '1';
        document.getElementById('unlimitedCpuPrice').value = '';
        document.getElementById('unlimitedBandwidthPrice').value = '';
        
        document.getElementById('unlimitedDaysGroup').style.display = 'block';
        document.getElementById('unlimitedBaseConfigGroup').style.display = 'block';
        
        document.getElementById('unlimitedModal').style.display = 'flex';
    },

    /**
     * 切换无限量代理套餐状态
     */
    toggleUnlimitedStatus: function(rowId) {
        const statusEl = document.getElementById('unlimited-status-' + rowId);
        const toggleBtn = document.getElementById('unlimited-toggle-' + rowId);
        
        if (statusEl.classList.contains('tag-success')) {
            statusEl.classList.remove('tag-success');
            statusEl.classList.add('tag-disable');
            statusEl.innerHTML = '禁用';
            toggleBtn.innerText = '启用';
            alert('套餐已禁用');
        } else {
            statusEl.classList.remove('tag-disable');
            statusEl.classList.add('tag-success');
            statusEl.innerHTML = '启用';
            toggleBtn.innerText = '禁用';
            alert('套餐已启用');
        }
    },

    /**
     * 初始化
     */
    init: function() {
        this.renderResidentialTable();
        this.renderUnlimitedTable();
        this.renderAdminTable();
    }
};

// 全局函数
function openResidentialEditModal(name, gb, price, days) { Settings.openResidentialEditModal(name, gb, price, days); }
function calculateResidentialTotal() { Settings.calculateResidentialTotal(); }
function toggleResidentialStatus(rowId) { Settings.toggleResidentialStatus(rowId); }
function openUnlimitedEditModal(name, basePrice, cpuPrice, bandwidthPrice) { Settings.openUnlimitedEditModal(name, basePrice, cpuPrice, bandwidthPrice); }
function openUnlimitedAddModal() { Settings.openUnlimitedAddModal(); }
function toggleUnlimitedStatus(rowId) { Settings.toggleUnlimitedStatus(rowId); }