/**
 * API服务层
 * 集中管理所有API调用，方便后续替换为真实API
 * 
 * 使用方法：
 * 1. 将 API_BASE_URL 替换为你的实际API地址
 * 2. 根据实际API响应格式调整各方法的数据处理逻辑
 * 3. 删除 MockData 相关的fallback代码
 */
const ApiService = {
    // ==================== 配置 ====================
    
    /**
     * API基础地址 - 替换为你的实际API地址
     */
    API_BASE_URL: '', // 例如: 'https://api.example.com/v1'
    
    /**
     * 是否使用模拟数据（开发模式）
     * 设置为 false 后将使用真实API
     */
    USE_MOCK_DATA: true,
    
    /**
     * 请求超时时间（毫秒）
     */
    TIMEOUT: 30000,
    
    /**
     * 获取认证Token（根据你的认证方式修改）
     */
    getAuthToken: function() {
        // TODO: 替换为实际的token获取逻辑
        // 例如: return localStorage.getItem('auth_token');
        return '';
    },
    
    // ==================== 基础请求方法 ====================
    
    /**
     * 发送HTTP请求
     * @param {string} endpoint - API端点
     * @param {object} options - 请求选项
     * @returns {Promise}
     */
    request: async function(endpoint, options = {}) {
        const url = this.API_BASE_URL + endpoint;
        const token = this.getAuthToken();
        
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            defaultHeaders['Authorization'] = 'Bearer ' + token;
        }
        
        const config = {
            method: options.method || 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            ...options
        };
        
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            
            const data = await response.json();
            return { success: true, data: data };
            
        } catch (error) {
            console.error('API请求失败:', error);
            return { success: false, error: error.message };
        }
    },
    
    // ==================== 仪表盘相关API ====================
    
    /**
     * 获取仪表盘统计数据
     * @param {string} type - 数据类型: sales/orders/users
     * @param {string} period - 时间周期: week/month/year/all
     */
    getDashboardStats: async function(type, period) {
        if (this.USE_MOCK_DATA) {
            // 使用模拟数据
            return { success: true, data: MockData.cardData[type]?.[period] };
        }
        
        // TODO: 替换为实际API
        // return await this.request('/dashboard/stats', {
        //     method: 'GET',
        //     params: { type, period }
        // });
        return await this.request('/dashboard/stats?type=' + type + '&period=' + period);
    },
    
    /**
     * 获取趋势图数据
     * @param {number} days - 天数: 7/14/30
     */
    getTrendData: async function(days) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: ChartMockData.trend[days] };
        }
        
        // TODO: 替换为实际API
        return await this.request('/dashboard/trend?days=' + days);
    },
    
    /**
     * 获取销售额饼图数据
     * @param {number} days - 天数
     */
    getSalesPieData: async function(days) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: ChartMockData.salesPie[days] };
        }
        
        return await this.request('/dashboard/sales-pie?days=' + days);
    },
    
    /**
     * 获取订单量饼图数据
     * @param {number} days - 天数
     */
    getOrdersPieData: async function(days) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: ChartMockData.ordersPie[days] };
        }
        
        return await this.request('/dashboard/orders-pie?days=' + days);
    },
    
    /**
     * 获取钱包余额
     */
    getWalletBalance: async function() {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: { balance: 987654.32 } };
        }
        
        return await this.request('/wallet/balance');
    },
    
    // ==================== 订单相关API ====================
    
    /**
     * 获取订单列表
     * @param {object} params - 查询参数
     */
    getOrders: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            // 模拟分页和筛选
            let data = [...MockData.orders];
            
            // 筛选逻辑
            if (params.type) {
                data = data.filter(o => o.type === params.type);
            }
            if (params.status) {
                data = data.filter(o => o.status === params.status);
            }
            if (params.keyword) {
                const kw = params.keyword.toLowerCase();
                data = data.filter(o => 
                    o.username.toLowerCase().includes(kw) ||
                    o.email.toLowerCase().includes(kw) ||
                    o.orderNo.toLowerCase().includes(kw)
                );
            }
            if (params.startDate) {
                data = data.filter(o => o.payTime >= params.startDate);
            }
            if (params.endDate) {
                data = data.filter(o => o.payTime <= params.endDate + ' 23:59:59');
            }
            
            const total = data.length;
            const page = params.page || 1;
            const pageSize = params.pageSize || 20;
            const start = (page - 1) * pageSize;
            const list = data.slice(start, start + pageSize);
            
            return { 
                success: true, 
                data: { 
                    list: list, 
                    total: total,
                    page: page,
                    pageSize: pageSize
                } 
            };
        }
        
        // TODO: 替换为实际API
        const queryString = new URLSearchParams(params).toString();
        return await this.request('/orders?' + queryString);
    },
    
    /**
     * 创建订单
     * @param {object} orderData - 订单数据
     */
    createOrder: async function(orderData) {
        if (this.USE_MOCK_DATA) {
            // 模拟创建成功
            console.log('创建订单:', orderData);
            return { success: true, data: { orderId: 'ORD' + Date.now() } };
        }
        
        return await this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    },
    
    /**
     * 导出订单数据
     * @param {object} params - 导出参数
     */
    exportOrders: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            // 返回全部数据用于导出
            return { success: true, data: MockData.orders };
        }
        
        return await this.request('/orders/export?' + new URLSearchParams(params).toString());
    },
    
    // ==================== 会员相关API ====================
    
    /**
     * 获取会员列表
     * @param {object} params - 查询参数
     */
    getMembers: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            let data = [...MockData.members];
            
            // 筛选逻辑
            if (params.username) {
                data = data.filter(m => m.username.toLowerCase().includes(params.username.toLowerCase()));
            }
            if (params.email) {
                data = data.filter(m => m.email.toLowerCase().includes(params.email.toLowerCase()));
            }
            if (params.startDate) {
                data = data.filter(m => m.registerTime >= params.startDate);
            }
            if (params.endDate) {
                data = data.filter(m => m.registerTime <= params.endDate + ' 23:59:59');
            }
            
            const total = data.length;
            const page = params.page || 1;
            const pageSize = params.pageSize || 20;
            const start = (page - 1) * pageSize;
            const list = data.slice(start, start + pageSize);
            
            return { 
                success: true, 
                data: { list, total, page, pageSize } 
            };
        }
        
        const queryString = new URLSearchParams(params).toString();
        return await this.request('/members?' + queryString);
    },
    
    /**
     * 修改会员密码
     * @param {string} username - 用户名
     * @param {string} newPassword - 新密码
     */
    changeMemberPassword: async function(username, newPassword) {
        if (this.USE_MOCK_DATA) {
            console.log('修改密码:', username);
            return { success: true };
        }
        
        return await this.request('/members/' + username + '/password', {
            method: 'PUT',
            body: { password: newPassword }
        });
    },
    
    /**
     * 扣除会员资源
     * @param {string} username - 用户名
     * @param {object} deductData - 扣除数据
     */
    deductMemberResource: async function(username, deductData) {
        if (this.USE_MOCK_DATA) {
            console.log('扣除资源:', username, deductData);
            return { success: true };
        }
        
        return await this.request('/members/' + username + '/deduct', {
            method: 'POST',
            body: deductData
        });
    },
    
    /**
     * 切换会员状态
     * @param {string} username - 用户名
     * @param {string} action - 操作: enable/disable
     */
    toggleMemberStatus: async function(username, action) {
        if (this.USE_MOCK_DATA) {
            console.log('切换状态:', username, action);
            return { success: true };
        }
        
        return await this.request('/members/' + username + '/status', {
            method: 'PUT',
            body: { action: action }
        });
    },
    
    /**
     * 获取会员订单历史
     * @param {string} username - 用户名
     */
    getMemberOrders: async function(username) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.userOrders[username] || [] };
        }
        
        return await this.request('/members/' + username + '/orders');
    },
    
    /**
     * 查询用户资源余额
     * @param {string} query - 用户名或邮箱
     */
    getUserResource: async function(query) {
        if (this.USE_MOCK_DATA) {
            const userData = MockData.userResources[query];
            return { success: !!userData, data: userData };
        }
        
        return await this.request('/members/resource?query=' + encodeURIComponent(query));
    },
    
    /**
     * 导出会员数据
     * @param {object} params - 导出参数
     */
    exportMembers: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.members };
        }
        
        return await this.request('/members/export?' + new URLSearchParams(params).toString());
    },
    
    // ==================== 每日数据相关API ====================
    
    /**
     * 获取每日数据列表
     * @param {object} params - 查询参数
     */
    getDailyData: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            let data = [...MockData.dailyData];
            
            if (params.startDate) {
                data = data.filter(d => d.date >= params.startDate);
            }
            if (params.endDate) {
                data = data.filter(d => d.date <= params.endDate);
            }
            
            return { success: true, data: data };
        }
        
        const queryString = new URLSearchParams(params).toString();
        return await this.request('/daily?' + queryString);
    },
    
    /**
     * 导出每日数据
     * @param {object} params - 导出参数
     */
    exportDailyData: async function(params = {}) {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.dailyData };
        }
        
        return await this.request('/daily/export?' + new URLSearchParams(params).toString());
    },
    
    // ==================== 套餐配置相关API ====================
    
    /**
     * 获取动态住宅代理套餐列表
     */
    getResidentialPackages: async function() {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.residentialPackages };
        }
        
        return await this.request('/packages/residential');
    },
    
    /**
     * 创建动态住宅代理套餐
     * @param {object} packageData - 套餐数据
     */
    createResidentialPackage: async function(packageData) {
        if (this.USE_MOCK_DATA) {
            console.log('创建套餐:', packageData);
            return { success: true, data: { id: Date.now() } };
        }
        
        return await this.request('/packages/residential', {
            method: 'POST',
            body: packageData
        });
    },
    
    /**
     * 更新动态住宅代理套餐
     * @param {number} id - 套餐ID
     * @param {object} packageData - 套餐数据
     */
    updateResidentialPackage: async function(id, packageData) {
        if (this.USE_MOCK_DATA) {
            console.log('更新套餐:', id, packageData);
            return { success: true };
        }
        
        return await this.request('/packages/residential/' + id, {
            method: 'PUT',
            body: packageData
        });
    },
    
    /**
     * 删除动态住宅代理套餐
     * @param {number} id - 套餐ID
     */
    deleteResidentialPackage: async function(id) {
        if (this.USE_MOCK_DATA) {
            console.log('删除套餐:', id);
            return { success: true };
        }
        
        return await this.request('/packages/residential/' + id, {
            method: 'DELETE'
        });
    },
    
    /**
     * 切换动态住宅代理套餐状态
     * @param {number} id - 套餐ID
     * @param {string} status - 状态: active/disabled
     */
    toggleResidentialPackageStatus: async function(id, status) {
        if (this.USE_MOCK_DATA) {
            console.log('切换套餐状态:', id, status);
            return { success: true };
        }
        
        return await this.request('/packages/residential/' + id + '/status', {
            method: 'PUT',
            body: { status: status }
        });
    },
    
    /**
     * 获取无限量代理套餐列表
     */
    getUnlimitedPackages: async function() {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.unlimitedPackages };
        }
        
        return await this.request('/packages/unlimited');
    },
    
    /**
     * 创建无限量代理套餐
     * @param {object} packageData - 套餐数据
     */
    createUnlimitedPackage: async function(packageData) {
        if (this.USE_MOCK_DATA) {
            console.log('创建无限量套餐:', packageData);
            return { success: true, data: { id: Date.now() } };
        }
        
        return await this.request('/packages/unlimited', {
            method: 'POST',
            body: packageData
        });
    },
    
    /**
     * 更新无限量代理套餐
     * @param {number} id - 套餐ID
     * @param {object} packageData - 套餐数据
     */
    updateUnlimitedPackage: async function(id, packageData) {
        if (this.USE_MOCK_DATA) {
            console.log('更新无限量套餐:', id, packageData);
            return { success: true };
        }
        
        return await this.request('/packages/unlimited/' + id, {
            method: 'PUT',
            body: packageData
        });
    },
    
    /**
     * 删除无限量代理套餐
     * @param {number} id - 套餐ID
     */
    deleteUnlimitedPackage: async function(id) {
        if (this.USE_MOCK_DATA) {
            console.log('删除无限量套餐:', id);
            return { success: true };
        }
        
        return await this.request('/packages/unlimited/' + id, {
            method: 'DELETE'
        });
    },
    
    /**
     * 切换无限量代理套餐状态
     * @param {number} id - 套餐ID
     * @param {string} status - 状态
     */
    toggleUnlimitedPackageStatus: async function(id, status) {
        if (this.USE_MOCK_DATA) {
            console.log('切换无限量套餐状态:', id, status);
            return { success: true };
        }
        
        return await this.request('/packages/unlimited/' + id + '/status', {
            method: 'PUT',
            body: { status: status }
        });
    },
    
    // ==================== 管理员相关API ====================
    
    /**
     * 获取管理员列表
     */
    getAdmins: async function() {
        if (this.USE_MOCK_DATA) {
            return { success: true, data: MockData.admins };
        }
        
        return await this.request('/admins');
    },
    
    /**
     * 创建管理员
     * @param {object} adminData - 管理员数据
     */
    createAdmin: async function(adminData) {
        if (this.USE_MOCK_DATA) {
            console.log('创建管理员:', adminData);
            return { success: true, data: { id: Date.now() } };
        }
        
        return await this.request('/admins', {
            method: 'POST',
            body: adminData
        });
    },
    
    /**
     * 更新管理员
     * @param {number} id - 管理员ID
     * @param {object} adminData - 管理员数据
     */
    updateAdmin: async function(id, adminData) {
        if (this.USE_MOCK_DATA) {
            console.log('更新管理员:', id, adminData);
            return { success: true };
        }
        
        return await this.request('/admins/' + id, {
            method: 'PUT',
            body: adminData
        });
    },
    
    /**
     * 删除管理员
     * @param {number} id - 管理员ID
     */
    deleteAdmin: async function(id) {
        if (this.USE_MOCK_DATA) {
            console.log('删除管理员:', id);
            return { success: true };
        }
        
        return await this.request('/admins/' + id, {
            method: 'DELETE'
        });
    },
    
    // ==================== 认证相关API ====================
    
    /**
     * 登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     */
    login: async function(username, password) {
        if (this.USE_MOCK_DATA) {
            // 模拟登录
            if (username === 'admin' && password === 'admin') {
                return { success: true, data: { token: 'mock_token_123' } };
            }
            return { success: false, error: '用户名或密码错误' };
        }
        
        return await this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });
    },
    
    /**
     * 退出登录
     */
    logout: async function() {
        if (this.USE_MOCK_DATA) {
            return { success: true };
        }
        
        return await this.request('/auth/logout', {
            method: 'POST'
        });
    }
};