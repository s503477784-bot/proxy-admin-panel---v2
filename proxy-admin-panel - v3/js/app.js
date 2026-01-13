/**
 * 应用主入口
 * 初始化所有模块
 */
(function() {
    'use strict';

    /**
     * DOM加载完成后初始化
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('ProxyAdmin 初始化中...');
        
        // 初始化各模块
        Navigation.init();
        Modal.init();
        Dashboard.init();
        Orders.init();
        Members.init();
        Settings.init();
        Charts.init();
        
        // 渲染每日数据表格
        renderDailyTable();
        
        // 加载弹窗模板
        loadModalTemplates();
        
        console.log('ProxyAdmin 初始化完成');
    });

    /**
     * 渲染每日数据表格
     */
    async function renderDailyTable() {
        var tbody = document.getElementById('dailyTableBody');
        if (!tbody) return;

        // 显示加载状态
        Helpers.showLoading('dailyTableBody');
        
        try {
            // 获取筛选参数
            const params = {
                startDate: document.getElementById('dailyStartDate')?.value || '',
                endDate: document.getElementById('dailyEndDate')?.value || ''
            };
            
            // 调用API获取数据
            const result = await ApiService.getDailyData(params);
            
            if (!result.success) {
                Helpers.showError('dailyTableBody', '加载每日数据失败');
                return;
            }
            
            const dailyData = result.data;
            
            if (!dailyData || dailyData.length === 0) {
                Helpers.showEmpty('dailyTableBody', '暂无数据');
                return;
            }

            // 计算汇总数据
            var summary = {
                totalOrders: 0,
                totalSales: 0,
                newUsers: 0,
                residentialOrders: 0,
                residentialSales: 0,
                unlimitedOrders: 0,
                unlimitedSales: 0
            };
            
            dailyData.forEach(function(day) {
                summary.totalOrders += day.totalOrders;
                summary.totalSales += day.totalSales;
                summary.newUsers += day.newUsers;
                summary.residentialOrders += day.residentialOrders;
                summary.residentialSales += day.residentialSales;
                summary.unlimitedOrders += day.unlimitedOrders;
                summary.unlimitedSales += day.unlimitedSales;
            });

            var html = '';
            
            // 汇总行
            html += '<tr class="summary-row">';
            html += '<td style="text-align:center;">合计</td>';
            html += '<td style="text-align:right;">' + summary.totalOrders.toLocaleString() + '</td>';
            html += '<td style="text-align:right;">' + Helpers.formatMoney(summary.totalSales) + '</td>';
            html += '<td style="text-align:right;">' + summary.newUsers.toLocaleString() + '</td>';
            html += '<td style="text-align:right;">' + summary.residentialOrders.toLocaleString() + '</td>';
            html += '<td style="text-align:right;" class="text-blue">' + Helpers.formatMoney(summary.residentialSales) + '</td>';
            html += '<td style="text-align:right;">' + summary.unlimitedOrders.toLocaleString() + '</td>';
            html += '<td style="text-align:right;" class="text-green">' + Helpers.formatMoney(summary.unlimitedSales) + '</td>';
            html += '</tr>';

            // 每日数据行
            dailyData.forEach(function(day) {
                html += '<tr>';
                html += '<td style="text-align:center;">' + day.date;
                if (day.isToday) {
                    html += ' <span style="font-size:12px; color:#52c41a;">(今日)</span>';
                }
                html += '</td>';
                html += '<td style="text-align:right;">' + day.totalOrders + '</td>';
                html += '<td style="text-align:right; font-weight:bold;">' + Helpers.formatMoney(day.totalSales) + '</td>';
                html += '<td style="text-align:right;">' + day.newUsers + '</td>';
                html += '<td style="text-align:right;">' + day.residentialOrders + '</td>';
                html += '<td style="text-align:right;" class="text-blue">' + Helpers.formatMoney(day.residentialSales) + '</td>';
                html += '<td style="text-align:right;">' + day.unlimitedOrders + '</td>';
                html += '<td style="text-align:right;" class="text-green">' + Helpers.formatMoney(day.unlimitedSales) + '</td>';
                html += '</tr>';
            });

            tbody.innerHTML = html;
            
            // 更新汇总卡片
            updateDailySummaryCards(summary, dailyData.length);
            
        } catch (error) {
            console.error('渲染每日数据失败:', error);
            Helpers.showError('dailyTableBody');
        }
    }
    
    /**
     * 更新每日数据汇总卡片
     */
    function updateDailySummaryCards(summary, days) {
        const summaryCards = document.querySelectorAll('#daily-view .summary-card .summary-value');
        if (summaryCards.length >= 4) {
            summaryCards[0].textContent = summary.totalOrders.toLocaleString() + ' 单';
            summaryCards[1].textContent = Helpers.formatMoney(summary.totalSales);
            summaryCards[2].textContent = summary.newUsers.toLocaleString() + ' 人';
            summaryCards[3].textContent = Helpers.formatMoney(summary.totalSales / days);
        }
    }
    
    /**
     * 查询每日数据
     */
    window.searchDailyData = function() {
        renderDailyTable();
    };
    
    /**
     * 重置每日数据筛选
     */
    window.resetDailyFilters = function() {
        document.getElementById('dailyStartDate').value = '';
        document.getElementById('dailyEndDate').value = '';
        renderDailyTable();
    };
    
    /**
     * 导出每日数据
     */
    window.exportDailyData = function() {
        const params = {
            startDate: document.getElementById('dailyStartDate')?.value || '',
            endDate: document.getElementById('dailyEndDate')?.value || ''
        };
        Helpers.exportData('daily', params);
    };

    /**
     * 加载弹窗模板
     */
    function loadModalTemplates() {
        var container = document.getElementById('modals-container');
        if (!container) return;

        var html = '';
        
        // ==================== 创建订单弹窗 ====================
        html += '<div id="createOrderModal" class="modal-overlay">';
        html += '  <div class="modal modal-lg">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title">创建订单</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'createOrderModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div class="form-group">';
        html += '        <label>用户查询 <span class="required">*</span></label>';
        html += '        <input type="text" class="input-control" style="width:100%;" placeholder="输入用户名或邮箱搜索" oninput="lookupUserResource(this.value)">';
        html += '        <div id="userResourceInfo" style="display:none; margin-top:8px; padding:12px; background:#f6ffed; border:1px solid #b7eb8f; border-radius:4px;">';
        html += '          <div id="residentialResourceDisplay">动态住宅代理余额: <strong id="userResidentialBalance">0</strong> GB</div>';
        html += '          <div id="unlimitedResourceDisplay" style="display:none;">无限量代理余额: <strong id="userUnlimitedBalance">0</strong> 天 | 配置: <span id="userUnlimitedConfig">无</span></div>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>套餐类型 <span class="required">*</span></label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="pkgType" value="residential" checked onchange="togglePkgConfig()"> 动态住宅代理</label>';
        html += '          <label class="radio-label"><input type="radio" name="pkgType" value="unlimited" onchange="togglePkgConfig()"> 无限量代理</label>';
        html += '        </div>';
        html += '        <div id="config-residential" class="resource-config active">';
        html += '          <div class="form-row">';
        html += '            <div style="flex:1;"><label class="sub-label">流量大小 (GB)</label><input type="number" class="input-control" style="width:100%;" placeholder="请输入流量大小" min="1" step="1"></div>';
        html += '            <div style="flex:1;"><label class="sub-label">有效期(天)</label><input type="number" class="input-control" style="width:100%;" value="30"></div>';
        html += '          </div>';
        html += '        </div>';
        html += '        <div id="config-unlimited" class="resource-config">';
        html += '          <div class="form-group" style="margin-bottom:16px;">';
        html += '            <label class="sub-label">操作类型</label>';
        html += '            <div class="radio-group">';
        html += '              <label class="radio-label"><input type="radio" name="unlimitedAction" value="new" checked onchange="toggleUnlimitedAction()"> 新购</label>';
        html += '              <label class="radio-label"><input type="radio" name="unlimitedAction" value="renew" onchange="toggleUnlimitedAction()"> 续费</label>';
        html += '              <label class="radio-label"><input type="radio" name="unlimitedAction" value="upgrade" onchange="toggleUnlimitedAction()"> 升配</label>';
        html += '            </div>';
        html += '          </div>';
        html += '          <div id="unlimited-new" class="unlimited-action-config active">';
        html += '            <div class="form-row">';
        html += '              <div style="flex:1;"><label class="sub-label">套餐时长</label><select class="input-control" style="width:100%;"><option>7 Days</option><option>30 Days</option><option>60 Days</option></select></div>';
        html += '              <div style="flex:1;"><label class="sub-label">带宽 (Mbps)</label><input type="number" class="input-control" style="width:100%;" value="200" min="200" step="100"></div>';
        html += '              <div style="flex:1;"><label class="sub-label">CPU配置</label><select class="input-control" style="width:100%;"><option>8 vCPU / 16 GiB</option><option>16 vCPU / 32 GiB</option></select></div>';
        html += '            </div>';
        html += '          </div>';
        html += '          <div id="unlimited-renew" class="unlimited-action-config">';
        html += '            <div class="form-row">';
        html += '              <div style="flex:1;"><label class="sub-label">续费时长</label><select class="input-control" style="width:100%;"><option>7 Days</option><option>30 Days</option><option>60 Days</option></select></div>';
        html += '            </div>';
        html += '          </div>';
        html += '          <div id="unlimited-upgrade" class="unlimited-action-config">';
        html += '            <div class="form-row">';
        html += '              <div style="flex:1;"><label class="sub-label">目标带宽 (Mbps)</label><input type="number" class="input-control" style="width:100%;" value="400" min="200" step="100"></div>';
        html += '              <div style="flex:1;"><label class="sub-label">目标CPU配置</label><select class="input-control" style="width:100%;"><option>16 vCPU / 32 GiB</option><option>32 vCPU / 64 GiB</option></select></div>';
        html += '            </div>';
        html += '          </div>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>订单类型 <span class="required">*</span></label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="orderType" value="supplement" checked onchange="toggleOrderAmountInput()"> 补充资源（免费）</label>';
        html += '          <label class="radio-label"><input type="radio" name="orderType" value="offline" onchange="toggleOrderAmountInput()"> 线下支付</label>';
        html += '        </div>';
        html += '        <div id="orderAmountInput" class="form-row" style="margin-top:12px;">';
        html += '          <div style="flex:1;"><label class="sub-label">支付金额</label><input type="number" id="orderAmount" class="input-control" style="width:100%;" placeholder="请输入实际支付金额" min="0" step="0.01"></div>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>备注</label>';
        html += '        <textarea class="input-control" style="width:100%; min-height:80px;" placeholder="可选填订单备注"></textarea>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'createOrderModal\')">取消</button>';
        html += '      <button class="btn btn-primary" onclick="Orders.createOrder()">确认创建</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 修改密码弹窗 ====================
        html += '<div id="changePwdModal" class="modal-overlay">';
        html += '  <div class="modal">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="changePwdTitle">修改密码</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'changePwdModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div class="form-group">';
        html += '        <label>新密码 <span class="required">*</span></label>';
        html += '        <input type="password" id="newPassword" class="input-control" style="width:100%;" placeholder="请输入新密码">';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>确认密码 <span class="required">*</span></label>';
        html += '        <input type="password" id="confirmPassword" class="input-control" style="width:100%;" placeholder="请再次输入新密码">';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'changePwdModal\')">取消</button>';
        html += '      <button class="btn btn-primary" onclick="Members.submitChangePassword()">确认修改</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 扣除资源弹窗 ====================
        html += '<div id="deductResourceModal" class="modal-overlay">';
        html += '  <div class="modal">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="deductTitle">扣除资源</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'deductResourceModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div id="deductBalanceInfo" style="background:#f0f5ff; padding:12px; border-radius:4px; margin-bottom:16px;"></div>';
        html += '      <div class="form-group">';
        html += '        <label>资源类型 <span class="required">*</span></label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="deductType" value="residential" checked onchange="updateDeductUnit(\'GB\')"> 动态住宅代理</label>';
        html += '          <label class="radio-label"><input type="radio" name="deductType" value="unlimited" onchange="updateDeductUnit(\'天\')"> 无限量代理</label>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>扣除数量 <span class="required">*</span></label>';
        html += '        <div style="display:flex; align-items:center; gap:8px;">';
        html += '          <input type="number" id="deductAmount" class="input-control" style="flex:1;" placeholder="请输入扣除数量" min="0" oninput="validateDeductAmount(this)">';
        html += '          <span id="deductUnit" style="color:#666;">GB</span>';
        html += '        </div>';
        html += '        <span id="deductAmountError" class="error-hint" style="display:none; color:#ff4d4f; font-size:12px;">数量不能为负数</span>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>扣除原因</label>';
        html += '        <textarea class="input-control" style="width:100%; min-height:60px;" placeholder="请输入扣除原因"></textarea>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'deductResourceModal\')">取消</button>';
        html += '      <button class="btn btn-danger" onclick="Members.submitDeductResource()">确认扣除</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 用户订单弹窗 ====================
        html += '<div id="userOrdersModal" class="modal-overlay">';
        html += '  <div class="modal modal-lg">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="userOrdersTitle">用户订单</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'userOrdersModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body" style="padding:0;">';
        html += '      <table class="data-table" style="margin:0;">';
        html += '        <thead><tr><th>订单号</th><th>套餐类型</th><th>资源量</th><th style="text-align:right;">金额</th><th>支付时间</th></tr></thead>';
        html += '        <tbody id="userOrdersTableBody"></tbody>';
        html += '      </table>';
        html += '    </div>';
        html += '    <div class="modal-footer" style="justify-content:space-between;">';
        html += '      <div id="userOrdersSummary" style="color:#666;"></div>';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'userOrdersModal\')">关闭</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 动态住宅代理套餐弹窗 ====================
        html += '<div id="residentialModal" class="modal-overlay">';
        html += '  <div class="modal">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="residentialTitle">添加动态住宅代理套餐</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'residentialModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div class="form-group">';
        html += '        <label>套餐名称 <span class="required">*</span></label>';
        html += '        <input type="text" id="residentialName" class="input-control" style="width:100%;" placeholder="例如：10GB套餐">';
        html += '      </div>';
        html += '      <div class="form-row">';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>数量 (GB) <span class="required">*</span></label>';
        html += '          <input type="number" id="residentialGb" class="input-control" style="width:100%;" placeholder="GB" min="1" oninput="calculateResidentialTotal()">';
        html += '        </div>';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>单价 ($/GB) <span class="required">*</span></label>';
        html += '          <input type="number" id="residentialPrice" class="input-control" style="width:100%;" placeholder="$ 0.00" step="0.01" min="0" oninput="calculateResidentialTotal()">';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-row">';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>总价</label>';
        html += '          <input type="text" id="residentialTotal" class="input-control" style="width:100%; background:#f5f5f5;" readonly value="$0.00">';
        html += '        </div>';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>有效期(天) <span class="required">*</span></label>';
        html += '          <input type="number" id="residentialDays" class="input-control" style="width:100%;" value="30" min="1">';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>状态</label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="resStatus" checked> 启用</label>';
        html += '          <label class="radio-label"><input type="radio" name="resStatus"> 禁用</label>';
        html += '        </div>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'residentialModal\')">取消</button>';
        html += '      <button class="btn btn-primary" onclick="Settings.saveResidentialPackage()">确认保存</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 无限量代理套餐弹窗 ====================
        html += '<div id="unlimitedModal" class="modal-overlay">';
        html += '  <div class="modal">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="unlimitedTitle">添加无限量代理套餐</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'unlimitedModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div class="form-group">';
        html += '        <label>套餐名称 <span class="required">*</span></label>';
        html += '        <input type="text" id="unlimitedName" class="input-control" style="width:100%;" placeholder="例如：7 Days">';
        html += '      </div>';
        html += '      <div class="form-group" id="unlimitedDaysGroup">';
        html += '        <label>套餐时长 (天) <span class="required">*</span></label>';
        html += '        <input type="number" id="unlimitedDays" class="input-control" style="width:100%;" placeholder="天数" min="1">';
        html += '        <div class="input-hint">套餐包含的天数</div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>基础价格 (USD) <span class="required">*</span></label>';
        html += '        <input type="number" id="unlimitedBasePrice" class="input-control" style="width:100%;" placeholder="$ 0.00" min="0">';
        html += '        <div class="input-hint">该套餐的基础价格（美元）</div>';
        html += '      </div>';
        html += '      <div id="unlimitedBaseConfigGroup">';
        html += '        <div class="form-row">';
        html += '          <div class="form-group" style="flex:1;">';
        html += '            <label>基础带宽 (Mbps) <span class="required">*</span></label>';
        html += '            <input type="number" id="unlimitedBaseBandwidth" class="input-control" style="width:100%;" value="200" min="100" step="100">';
        html += '          </div>';
        html += '          <div class="form-group" style="flex:1;">';
        html += '            <label>基础CPU配置 <span class="required">*</span></label>';
        html += '            <select id="unlimitedBaseCpu" class="input-control" style="width:100%;">';
        html += '              <option value="1">8 vCPU / 16 GiB</option>';
        html += '              <option value="2">16 vCPU / 32 GiB</option>';
        html += '              <option value="3">32 vCPU / 64 GiB</option>';
        html += '              <option value="4">64 vCPU / 128 GiB</option>';
        html += '            </select>';
        html += '          </div>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-row">';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>CPU升级单价 (USD) <span class="required">*</span></label>';
        html += '          <input type="number" id="unlimitedCpuPrice" class="input-control" style="width:100%;" placeholder="$ / 每升一级" min="0">';
        html += '          <div class="input-hint">每升一级CPU的费用</div>';
        html += '        </div>';
        html += '        <div class="form-group" style="flex:1;">';
        html += '          <label>带宽升级单价 (USD) <span class="required">*</span></label>';
        html += '          <input type="number" id="unlimitedBandwidthPrice" class="input-control" style="width:100%;" placeholder="$ / 每100Mbps" min="0">';
        html += '          <div class="input-hint">每增加100Mbps的费用</div>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>状态</label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="unlStatus" checked> 启用</label>';
        html += '          <label class="radio-label"><input type="radio" name="unlStatus"> 禁用</label>';
        html += '        </div>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'unlimitedModal\')">取消</button>';
        html += '      <button class="btn btn-primary" onclick="Settings.saveUnlimitedPackage()">确认保存</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 管理员账户弹窗 ====================
        html += '<div id="adminModal" class="modal-overlay">';
        html += '  <div class="modal">';
        html += '    <div class="modal-header">';
        html += '      <span class="modal-title" id="adminTitle">创建管理员账户</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'adminModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body">';
        html += '      <div class="form-group">';
        html += '        <label>用户名 <span class="required">*</span></label>';
        html += '        <input type="text" id="adminUsername" class="input-control" style="width:100%;" placeholder="4-20位字符">';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>邮箱 <span class="required">*</span></label>';
        html += '        <input type="email" class="input-control" style="width:100%;" placeholder="请输入邮箱地址">';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>密码 <span class="required" id="pwdRequired">*</span></label>';
        html += '        <input type="password" class="input-control" style="width:100%;" placeholder="至少8位，包含字母和数字">';
        html += '        <div class="input-hint" id="pwdHint" style="display:none;">留空则不修改密码</div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>确认密码 <span class="required" id="confirmPwdRequired">*</span></label>';
        html += '        <input type="password" class="input-control" style="width:100%;" placeholder="请再次输入密码">';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>角色 <span class="required">*</span></label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="role" value="super"> 超级管理员</label>';
        html += '          <label class="radio-label"><input type="radio" name="role" value="normal" checked> 普通管理员</label>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="form-group">';
        html += '        <label>状态</label>';
        html += '        <div class="radio-group">';
        html += '          <label class="radio-label"><input type="radio" name="adminStatus" checked> 正常</label>';
        html += '          <label class="radio-label"><input type="radio" name="adminStatus"> 禁用</label>';
        html += '        </div>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="modal-footer">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'adminModal\')">取消</button>';
        html += '      <button class="btn btn-primary" onclick="Settings.saveAdmin()">确认保存</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 删除确认弹窗 ====================
        html += '<div id="deleteModal" class="modal-overlay">';
        html += '  <div class="modal modal-xs">';
        html += '    <div class="modal-header" style="border:none; padding-bottom:0;">';
        html += '      <span class="modal-title">确认删除</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'deleteModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body" style="text-align:center; padding-top:0;">';
        html += '      <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#fa8c16; margin:20px 0;"></i>';
        html += '      <p style="font-size:16px;">确定要删除该套餐吗？</p>';
        html += '      <p style="color:#999; font-size:14px; margin-top:8px;">删除后无法恢复。</p>';
        html += '    </div>';
        html += '    <div class="modal-footer" style="justify-content:center; border:none; padding-bottom:32px;">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'deleteModal\')" style="width:100px;">取消</button>';
        html += '      <button class="btn btn-danger" onclick="alert(\'套餐已删除\'); closeModal(\'deleteModal\')" style="width:120px;">确认删除</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // ==================== 删除管理员确认弹窗 ====================
        html += '<div id="deleteAdminModal" class="modal-overlay">';
        html += '  <div class="modal modal-xs">';
        html += '    <div class="modal-header" style="border:none; padding-bottom:0;">';
        html += '      <span class="modal-title">确认删除管理员</span>';
        html += '      <i class="fas fa-times close-icon" onclick="closeModal(\'deleteAdminModal\')"></i>';
        html += '    </div>';
        html += '    <div class="modal-body" style="text-align:center; padding-top:0;">';
        html += '      <i class="fas fa-exclamation-triangle" style="font-size:48px; color:#fa8c16; margin:20px 0;"></i>';
        html += '      <p style="font-size:16px;">确定要删除该管理员账户吗？</p>';
        html += '      <p style="color:#999; font-size:14px; margin-top:8px;">删除后无法恢复。</p>';
        html += '    </div>';
        html += '    <div class="modal-footer" style="justify-content:center; border:none; padding-bottom:32px;">';
        html += '      <button class="btn btn-secondary" onclick="closeModal(\'deleteAdminModal\')" style="width:100px;">取消</button>';
        html += '      <button class="btn btn-danger" onclick="alert(\'管理员已删除\'); closeModal(\'deleteAdminModal\')" style="width:120px;">确认删除</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        container.innerHTML = html;
    }
})();