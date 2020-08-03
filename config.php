<?php
$t = $this->getTranslator();
$t->addTranslation(__DIR__.'/lang');

if ( $this->getBo() && $this->getUser() && $this->getUser()->isAdmin() )
{
		
    $this->getBo()->addModule(array(
  	    'id'	   => 'redirect_plugin',
  	    'position' => MENU_SITE,
        'name' 	   => $t->_('Редиректы'),
        'icon'     => '/cms/plugins/redirect/images/icon.gif',
        'class'    => 'Plugin.redirect.Panel'
    ));
  
}

\Redirect\Redirect::Redirect();