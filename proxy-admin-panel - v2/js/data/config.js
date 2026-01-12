/**
 * 全局配置常量
 */
const CONFIG = {
    // 产品类型
    PRODUCT_TYPES: {
        RESIDENTIAL: 'residential',
        UNLIMITED: 'unlimited'
    },
    
    // 产品类型名称
    PRODUCT_TYPE_NAMES: {
        residential: '动态住宅代理',
        unlimited: '无限量代理'
    },
    
    // 订单状态
    ORDER_STATUS: {
        PAID: 'paid',
        UNPAID: 'unpaid',
        REFUNDED: 'refunded'
    },
    
    // 订单状态名称
    ORDER_STATUS_NAMES: {
        paid: '已支付',
        unpaid: '未支付',
        refunded: '已退款'
    },
    
    // 用户状态
    USER_STATUS: {
        ACTIVE: 'active',
        DISABLED: 'disabled'
    },
    
    // 管理员角色
    ADMIN_ROLES: {
        SUPER: 'super',
        NORMAL: 'normal'
    },
    
    // CPU配置选项
    CPU_OPTIONS: [
        { value: '1', label: '8 vCPU / 16 GiB' },
        { value: '2', label: '16 vCPU / 32 GiB' },
        { value: '3', label: '32 vCPU / 64 GiB' },
        { value: '4', label: '64 vCPU / 128 GiB' }
    ],
    
    // 导出类型名称
    EXPORT_TYPE_NAMES: {
        orders: '订单总表',
        members: '会员管理',
        daily: '每日数据概览'
    },
    
    // 分页配置
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        PAGE_SIZE_OPTIONS: [10, 15, 20, 50, 100]
    }
};