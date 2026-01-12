/**
 * 弹窗控制模块
 */
const Modal = {
    /**
     * 打开弹窗
     */
    open: function(modalId, mode) {
        if (event) event.stopPropagation();
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'flex';
        
        // 根据弹窗类型和模式调整内容
        this.setupModal(modalId, mode);
    },

    /**
     * 关闭弹窗
     */
    close: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    /**
     * 根据弹窗类型设置内容
     */
    setupModal: function(modalId, mode) {
        switch (modalId) {
            case 'residentialModal':
                this.setupResidentialModal(mode);
                break;
            case 'unlimitedModal':
                this.setupUnlimitedModal(mode);
                break;
            case 'adminModal':
                this.setupAdminModal(mode);
                break;
        }
    },

    /**
     * 设置动态住宅代理套餐弹窗
     */
    setupResidentialModal: function(mode) {
        const title = document.getElementById('residentialTitle');
        if (title) {
            title.innerText = mode === 'edit' ? '编辑动态住宅代理套餐' : '添加动态住宅代理套餐';
        }
    },

    /**
     * 设置无限量代理套餐弹窗
     */
    setupUnlimitedModal: function(mode) {
        const title = document.getElementById('unlimitedTitle');
        if (title) {
            title.innerText = mode === 'edit' ? '编辑无限量代理套餐' : '添加无限量代理套餐';
        }
    },

    /**
     * 设置管理员弹窗
     */
    setupAdminModal: function(mode) {
        const title = document.getElementById('adminTitle');
        const userField = document.getElementById('adminUsername');
        const pwdHint = document.getElementById('pwdHint');
        const pwdReq = document.getElementById('pwdRequired');
        const confirmReq = document.getElementById('confirmPwdRequired');

        if (mode === 'edit') {
            if (title) title.innerText = '编辑管理员账户';
            if (userField) {
                userField.value = "Support_01";
                userField.readOnly = true;
            }
            if (pwdHint) pwdHint.style.display = 'block';
            if (pwdReq) pwdReq.style.display = 'none';
            if (confirmReq) confirmReq.style.display = 'none';
        } else {
            if (title) title.innerText = '创建管理员账户';
            if (userField) {
                userField.value = "";
                userField.readOnly = false;
            }
            if (pwdHint) pwdHint.style.display = 'none';
            if (pwdReq) pwdReq.style.display = 'inline';
            if (confirmReq) confirmReq.style.display = 'inline';
        }
    },

    /**
     * 初始化弹窗事件
     */
    init: function() {
        // 点击遮罩层关闭弹窗
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
    }
};

// 全局函数
function openModal(modalId, mode) { Modal.open(modalId, mode); }
function closeModal(modalId) { Modal.close(modalId); }