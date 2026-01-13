/**
 * 系统设置模块
 */
const Settings = {
    // 当前编辑的数据ID
    _currentEditId: null,

    /**
     * 渲染动态住宅代理套餐表格
     */
    renderResidentialTable: async function() {
        const tbody = document.getElementById('residentialTableBody');
        if (!tbody) return;

        Helpers.showLoading('residentialTableBody');
        
        try {
            const result = await ApiService.getResidentialPackages();
            
            if (!result.success) {
                Helpers.showError('residentialTableBody', '加载套餐数据失败');
                return;
            }
            
            const packages = result.data;
            
            if (!packages || packages.length === 0) {
                Helpers.showEmpty('residentialTableBody', '暂无套餐数据');
                return;
            }

            let html = '';
            packages.forEach(pkg => {
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
                            <button class="btn btn-text" onclick="Settings.openResidentialEditModal(${pkg.id}, '${pkg.name}', ${pkg.gb}, ${pkg.price}, ${pkg.days})">编辑</button>
                            <button class="btn btn-text danger" onclick="Settings.deleteResidentialPackage(${pkg.id})">删除</button>
                            <button class="btn btn-text" id="residential-toggle-${pkg.id}" onclick="Settings.toggleResidentialStatus(${pkg.id})">${isActive ? '禁用' : '启用'}</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('渲染住宅代理套餐失败:', error);
            Helpers.showError('residentialTableBody');
        }
    },

    /**
     * 渲染无限量代理套餐表格
     */
    renderUnlimitedTable: async function() {
        const tbody = document.getElementById('unlimitedTableBody');
        if (!tbody) return;

        Helpers.showLoading('unlimitedTableBody');
        
        try {
            const result = await ApiService.getUnlimitedPackages();
            
            if (!result.success) {
                Helpers.showError('unlimitedTableBody', '加载套餐数据失败');
                return;
            }
            
            const packages = result.data;
            
            if (!packages || packages.length === 0) {
                Helpers.showEmpty('unlimitedTableBody', '暂无套餐数据');
                return;
            }

            let html = '';
            packages.forEach(pkg => {
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
                            <button class="btn btn-text" onclick="Settings.openUnlimitedEditModal(${pkg.id}, '${pkg.name}', ${pkg.basePrice}, ${pkg.cpuUpgrade}, ${pkg.bandwidthUpgrade})">编辑</button>
                            <button class="btn btn-text danger" onclick="Settings.deleteUnlimitedPackage(${pkg.id})">删除</button>
                            <button class="btn btn-text" id="unlimited-toggle-${pkg.id}" onclick="Settings.toggleUnlimitedStatus(${pkg.id})">${isActive ? '禁用' : '启用'}</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('渲染无限量代理套餐失败:', error);
            Helpers.showError('unlimitedTableBody');
        }
    },

    /**
     * 渲染管理员表格
     */
    renderAdminTable: async function() {
        const tbody = document.getElementById('adminTableBody');
        if (!tbody) return;

        Helpers.showLoading('adminTableBody');
        
        try {
            const result = await ApiService.getAdmins();
            
            if (!result.success) {
                Helpers.showError('adminTableBody', '加载管理员数据失败');
                return;
            }
            
            const admins = result.data;
            
            if (!admins || admins.length === 0) {
                Helpers.showEmpty('adminTableBody', '暂无管理员数据');
                return;
            }

            let html = '';
            admins.forEach(admin => {
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
                            <button class="btn btn-text" onclick="Settings.openAdminEditModal(${admin.id})">编辑</button>
                            <button class="btn btn-text ${admin.isCurrent ? 'disabled' : 'danger'}" ${admin.isCurrent ? 'title="无法删除当前登录账户"' : 'onclick="Settings.deleteAdmin(' + admin.id + ')"'}>删除</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        } catch (error) {
            console.error('渲染管理员表格失败:', error);
            Helpers.showError('adminTableBody');
        }
    },

    /**
     * 打开动态住宅代理编辑弹窗
     */
    openResidentialEditModal: function(id, name, gb, price, days) {
        this._currentEditId = id;
        document.getElementById('residentialTitle').innerText = id ? '编辑动态住宅代理套餐' : '添加动态住宅代理套餐';
        document.getElementById('residentialName').value = name || '';
        document.getElementById('residentialGb').value = gb || '';
        document.getElementById('residentialPrice').value = price || '';
        document.getElementById('residentialDays').value = days || 30;
        this.calculateResidentialTotal();
        openModal('residentialModal');
    },
    
    /**
     * 保存动态住宅代理套餐
     */
    saveResidentialPackage: async function() {
        const packageData = {
            name: document.getElementById('residentialName').value,
            gb: parseFloat(document.getElementById('residentialGb').value),
            price: parseFloat(document.getElementById('residentialPrice').value),
            days: parseInt(document.getElementById('residentialDays').value)
        };
        
        if (!packageData.name || !packageData.gb || !packageData.price) {
            alert('请填写完整的套餐信息');
            return;
        }
        
        try {
            let result;
            if (this._currentEditId) {
                result = await ApiService.updateResidentialPackage(this._currentEditId, packageData);
            } else {
                result = await ApiService.createResidentialPackage(packageData);
            }
            
            if (result.success) {
                alert('保存成功');
                closeModal('residentialModal');
                this.renderResidentialTable();
            } else {
                alert('保存失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('保存套餐失败:', error);
            alert('保存失败');
        }
    },
    
    /**
     * 删除动态住宅代理套餐
     */
    deleteResidentialPackage: async function(id) {
        if (!confirm('确定要删除该套餐吗？删除后无法恢复。')) {
            return;
        }
        
        try {
            const result = await ApiService.deleteResidentialPackage(id);
            
            if (result.success) {
                alert('套餐已删除');
                this.renderResidentialTable();
            } else {
                alert('删除失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('删除套餐失败:', error);
            alert('删除失败');
        }
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
    toggleResidentialStatus: async function(id) {
        const statusEl = document.getElementById('residential-status-' + id);
        const isActive = statusEl.classList.contains('tag-success');
        const newStatus = isActive ? 'disabled' : 'active';
        
        try {
            const result = await ApiService.toggleResidentialPackageStatus(id, newStatus);
            
            if (result.success) {
                const toggleBtn = document.getElementById('residential-toggle-' + id);
                
                if (isActive) {
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
            } else {
                alert('操作失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('切换状态失败:', error);
            alert('操作失败');
        }
    },

    /**
     * 打开无限量代理编辑弹窗（仅编辑价格）
     */
    openUnlimitedEditModal: function(id, name, basePrice, cpuPrice, bandwidthPrice) {
        this._currentEditId = id;
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
        this._currentEditId = null;
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
     * 保存无限量代理套餐
     */
    saveUnlimitedPackage: async function() {
        const packageData = {
            name: document.getElementById('unlimitedName').value,
            basePrice: parseFloat(document.getElementById('unlimitedBasePrice').value),
            cpuUpgrade: parseFloat(document.getElementById('unlimitedCpuPrice').value),
            bandwidthUpgrade: parseFloat(document.getElementById('unlimitedBandwidthPrice').value)
        };
        
        if (!this._currentEditId) {
            packageData.days = parseInt(document.getElementById('unlimitedDays').value);
            packageData.baseBandwidth = parseInt(document.getElementById('unlimitedBaseBandwidth').value);
            packageData.baseCpu = document.getElementById('unlimitedBaseCpu').value;
        }
        
        try {
            let result;
            if (this._currentEditId) {
                result = await ApiService.updateUnlimitedPackage(this._currentEditId, packageData);
            } else {
                result = await ApiService.createUnlimitedPackage(packageData);
            }
            
            if (result.success) {
                alert('保存成功');
                closeModal('unlimitedModal');
                this.renderUnlimitedTable();
            } else {
                alert('保存失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('保存套餐失败:', error);
            alert('保存失败');
        }
    },
    
    /**
     * 删除无限量代理套餐
     */
    deleteUnlimitedPackage: async function(id) {
        if (!confirm('确定要删除该套餐吗？删除后无法恢复。')) {
            return;
        }
        
        try {
            const result = await ApiService.deleteUnlimitedPackage(id);
            
            if (result.success) {
                alert('套餐已删除');
                this.renderUnlimitedTable();
            } else {
                alert('删除失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('删除套餐失败:', error);
            alert('删除失败');
        }
    },

    /**
     * 切换无限量代理套餐状态
     */
    toggleUnlimitedStatus: async function(id) {
        const statusEl = document.getElementById('unlimited-status-' + id);
        const isActive = statusEl.classList.contains('tag-success');
        const newStatus = isActive ? 'disabled' : 'active';
        
        try {
            const result = await ApiService.toggleUnlimitedPackageStatus(id, newStatus);
            
            if (result.success) {
                const toggleBtn = document.getElementById('unlimited-toggle-' + id);
                
                if (isActive) {
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
            } else {
                alert('操作失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('切换状态失败:', error);
            alert('操作失败');
        }
    },
    
    /**
     * 打开管理员编辑弹窗
     */
    openAdminEditModal: function(id) {
        this._currentEditId = id;
        openModal('adminModal', 'edit');
    },
    
    /**
     * 保存管理员
     */
    saveAdmin: async function() {
        // TODO: 收集表单数据并调用API
        alert('管理员账户已保存');
        closeModal('adminModal');
        this.renderAdminTable();
    },
    
    /**
     * 删除管理员
     */
    deleteAdmin: async function(id) {
        if (!confirm('确定要删除该管理员账户吗？删除后无法恢复。')) {
            return;
        }
        
        try {
            const result = await ApiService.deleteAdmin(id);
            
            if (result.success) {
                alert('管理员已删除');
                this.renderAdminTable();
            } else {
                alert('删除失败: ' + (result.error || '未知错误'));
            }
        } catch (error) {
            console.error('删除管理员失败:', error);
            alert('删除失败');
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
function openResidentialEditModal(id, name, gb, price, days) { Settings.openResidentialEditModal(id, name, gb, price, days); }
function calculateResidentialTotal() { Settings.calculateResidentialTotal(); }
function toggleResidentialStatus(id) { Settings.toggleResidentialStatus(id); }
function openUnlimitedEditModal(id, name, basePrice, cpuPrice, bandwidthPrice) { Settings.openUnlimitedEditModal(id, name, basePrice, cpuPrice, bandwidthPrice); }
function openUnlimitedAddModal() { Settings.openUnlimitedAddModal(); }
function toggleUnlimitedStatus(id) { Settings.toggleUnlimitedStatus(id); }