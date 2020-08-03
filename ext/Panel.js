Ext.define('Plugin.redirect.Panel', {
    extend: 'Ext.tab.Panel',

    requires: ['Plugin.redirect.r_urls_grid', 'Plugin.redirect.r_options_grid'],

    bodyCls: 'x-window-body-default',
    cls: 'x-window-body-default',
    style: 'border: none',
    border: false,
    layout: 'border',

    items: [
        Ext.create('Plugin.redirect.r_urls_grid', {
            'title': _('Список редиректов'),
        }),
        Ext.create('Plugin.redirect.r_options_grid', {
            'title': _('Настройки'),
        })

    ]

});