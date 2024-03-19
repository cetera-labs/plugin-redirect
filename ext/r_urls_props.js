Ext.define('Plugin.redirect.r_urls_props', {

    extend: 'Ext.Window',

    closeAction: 'hide',
    title: '',
    width: 650,
    height: 223,
    layout: 'vbox',
    modal: true,
    resizable: false,
    border: false,

    listId: 0,

    initComponent: function () {

        this.tabs = new Ext.TabPanel({
            deferredRender: false,
            activeTab: 0,
            plain: true,
            border: false,
            activeTab: 0,
            bodyStyle: 'background: none',
            height: 160,
            defaults: {bodyStyle: 'background:none; padding:5px'},
            items: [{
                title: _('Редирект'),
                layout: 'form',
                defaults: {anchor: '0'},
                defaultType: 'textfield',
                items: [
                    {
                        fieldLabel: _('со страницы'),
                        name: 'url_from',
                        allowBlank: false
                    }, {
                        fieldLabel: _('на страницу'),
                        name: 'url_to',
                        allowBlank: false
                    }, new Ext.form.ComboBox({
                        fieldLabel: _('код статуса'),
                        name: 'r_code',
                        store: new Ext.data.SimpleStore({
                            fields: ['r_code'],
                            data: [["301"], ["302"]]
                        }),
                        valueField: 'r_code',
                        displayField: 'r_code',
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false,
                        allowBlank: false
                    }),
                    {
                        fieldLabel: _('домен'),
                        name: 'r_domain',
                        allowBlank: true
                    }
                ]
            }]
        });

        this.form = new Ext.FormPanel({
            labelWidth: 140,
            border: false,
            width: 638,
            bodyStyle: 'background: none',
            method: 'POST',
            waitMsgTarget: true,
            url: '/plugins/redirect/r_list_actions.php',
            items: this.tabs
        });

        this.items = this.form;

        this.buttons = [{
            text: _('Ок'),
            scope: this,
            handler: this.submit
        }, {
            text: _('Отмена'),
            scope: this,
            handler: function () {
                this.hide();
            }
        }];

        this.callParent();
    },

    show: function (id) {
        this.form.getForm().reset();
        this.tabs.setActiveTab(0);

        this.callParent();

        this.listId = id;
        if (id > 0) {
            Ext.Ajax.request({
                url: '/plugins/redirect/r_list_actions.php',
                params: {
                    action: 'get_r_list',
                    id: this.listId
                },
                scope: this,
                success: function (resp) {
                    var obj = Ext.decode(resp.responseText);
                    this.setTitle(_('Изменить редирект'));
                    this.form.getForm().setValues(obj.data);
                }
            });
        } else {
            this.setTitle(_('Новый редирект'));
        }
    },

    submit: function () {

        var params = {
            action: 'save_redirect',
            id: this.listId,
        };
        this.form.getForm().submit({
            params: params,
            scope: this,
            waitMsg: _('Сохранение...'),
            success: function (resp) {
                this.fireEvent('listChanged', this.listId, this.form.getForm().findField('url_from').getValue());
                this.hide();
            }
        });
    }
});