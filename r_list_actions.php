<?php
include_once('common_bo.php');
if (!$application->getUser()->isAdmin()) die('access denied');

$res = array(
    'success' => false,
    'errors' => array()
);

$action = $_POST['action'];
$id = (int)$_POST['id'];

if ($action == 'delete_redirect') {
	
	$query_del = 'DELETE FROM r_list_plugin WHERE id=?';
	$application->getConn()->executeQuery($query_del, array($id));
	$res['success'] = true;
}

if ($action == 'save_redirect') {

	$query = 'r_list_plugin SET url_from=?, url_to=?, r_code=?';
        
    if ($id) $query = 'UPDATE '.$query.' WHERE id='.$id;
        else $query = 'INSERT INTO '.$query;
    
    $application->getConn()->executeQuery($query, array($_POST['url_from'],$_POST['url_to'],$_POST['r_code']));
    if (!$id) $id = $application->getConn()->lastInsertId();
            
    $res['success'] = true;
}

if ($action == 'get_r_list') {
    
	$query = 'SELECT * FROM r_list_plugin WHERE id=?';
	
	$res['data'] = $application->getConn()->fetchAssoc($query, array((int)$_REQUEST['id']));
	$res['success'] = true;
    
}

echo json_encode($res);