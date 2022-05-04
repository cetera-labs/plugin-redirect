Ext.define('Plugin.redirect.r_options_props', {

    extend: 'Ext.Window',

    closeAction: 'hide',
    title: '',
    width: 650,
    height: 333,
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
            height: 333,
            defaults: {bodyStyle: 'background:none; padding:5px'},
            items: [{
                title: _('Общие редиректы'),
                layout: 'form',
                defaults: {anchor: '0'},
                defaultType: 'checkboxfield',
                items: [
                    {
                        fieldLabel: _('с www на без'),
                        name: 'ro_www',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
                    {
                        fieldLabel: _('с url без / на /'),
                        name: 'ro_ss',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
                    {
                        fieldLabel: _('с // на /'),
                        name: 'ro_ms',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
					{
                        fieldLabel: _('убрать /index/'),
                        name: 'ro_remin',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
                    {
                        fieldLabel: _('с 404 на главную'),
                        name: 'ro_404',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
                    {
                        fieldLabel: _('ru.ceteralabs.com -> cetera.ru'),
                        name: 'ro_cetera',
                        allowBlank: false,
                        uncheckedValue: 'off'
                    },
                    new Ext.form.ComboBox({
                        fieldLabel: _('с http <-> https'),
                        name: 'ro_pc',
                        store: new Ext.data.SimpleStore({
                            fields: ['ro_pc'],
                            data: [["off"], ["to_http"], ["to_https"]]
                        }),
                        valueField: 'ro_pc',
                        displayField: 'ro_pc',
                        mode: 'local',
                        triggerAction: 'all',
                        editable: false
                    })
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
            url: '/plugins/redirect/r_options_actions.php',
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
        Ext.Ajax.request({
            url: '/plugins/redirect/r_options_actions.php',
            params: {
                action: 'get_r_options',
                id: this.listId
            },
            scope: this,
            success: function (resp) {
                var obj = Ext.decode(resp.responseText);
                this.setTitle(_('Изменить'));
                this.form.getForm().setValues(obj.data);
            }
        });
    },

    submit: function () {

        var params = {
            action: 'save_r_options',
            id: this.listId,
        };
        this.form.getForm().submit({
            params: params,
            scope: this,
            waitMsg: _('Сохранение...'),
            success: function (resp) {
                this.fireEvent('listChanged', this.listId, this.form.getForm().findField('ro_www').getValue());
                this.hide();
            }
        });
    }
});