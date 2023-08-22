Ext.define('Plugin.redirect.r_urls_grid', {

    extend: 'Ext.grid.GridPanel',

    columns: [
        {header: "ID", width: 50, dataIndex: 'id'},
        {flex: 1, header: _('Редирект со страницы'), width: 450, dataIndex: 'url_from'},
        {flex: 1, header: _('Редирект на страницу'), width: 450, dataIndex: 'url_to'},
        {header: _('Код'), width: 50, dataIndex: 'r_code'},
        {header: _('Домен'), width: 150, dataIndex: 'r_domain'}
    ],

    selModel: {
        mode: 'SINGLE',
        listeners: {
            'selectionchange': {
                fn: function (sm) {
                    var hs = sm.hasSelection();
                    Ext.getCmp('tb_redirect_edit').setDisabled(!hs);
                    Ext.getCmp('tb_redirect_delete').setDisabled(!hs);
                },
                scope: this
            }
        }
    },

    initComponent: function () {

        this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            remoteSort: true,
            fields: ['url_from', 'url_to', 'r_code', 'r_domain'],
            sortInfo: {field: "ID", direction: "ASC"},
            proxy: {
                type: 'ajax',
                url: '/plugins/redirect/r_list_data.php',
                simpleSortMode: true,
                reader: {
                    root: 'rows',
                    idProperty: 'id'
                }
            }
        });

        this.tbar = new Ext.Toolbar({
            items: [
                {
                    id: 'tb_redirect_new',
                    iconCls: 'icon-new',
                    tooltip: _('Создать'),
                    handler: function () {
                        this.edit(0);
                    },
                    scope: this
                }, '-',
                {
                    id: 'tb_redirect_edit',
                    disabled: true,
                    iconCls: 'icon-edit',
                    tooltip: _('Редактировать'),
                    handler: function () {
                        this.edit(this.getSelectionModel().getSelection()[0].getId());
                    },
                    scope: this
                },
                {
                    id: 'tb_redirect_delete',
                    disabled: true,
                    iconCls: 'icon-delete',
                    tooltip: _('Удалить'),
                    handler: function () {
                        this.delete_list();
                    },
                    scope: this
                }, '-',
            ]
        });

        this.on({
            'beforedestroy': function () {
                if (this.propertiesWin) this.propertiesWin.close();
                this.propertiesWin = false;
                if (this.chooseWin) this.chooseWin.close();
                this.chooseWin = false;
            },
            'celldblclick': function () {
                this.edit(this.getSelectionModel().getSelection()[0].getId());
            },
            scope: this
        });

        this.callParent();
        this.reload();
    },

    border: false,
    loadMask: true,
    stripeRows: true,

    edit: function (id) {
        if (!this.propertiesWin) {
            this.propertiesWin = Ext.create('Plugin.redirect.r_urls_props');
            this.propertiesWin.on('listChanged', function (id, name) {
                this.reload();
            }, this);
        }
        this.propertiesWin.show(id);
    },

    delete_list: function () {
        Ext.MessageBox.confirm(_('Удалить редирект'), _('Вы уверены'), function (btn) {
            if (btn == 'yes') this.call('delete_redirect');
        }, this);
    },

    call: function (action) {
        Ext.Ajax.request({
            url: '/plugins/redirect/r_list_actions.php',
            params: {
                action: action,
                id: this.getSelectionModel().getSelection()[0].getId()
            },
            scope: this,
            success: function (resp) {
                this.store.reload();
            }
        });
    },

    reload: function () {
        this.store.load();
    }
});