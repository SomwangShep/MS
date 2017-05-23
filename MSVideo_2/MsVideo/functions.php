<?php

/*
  This function allows you to write code that does not care if
  you are working with HTTP GET or HTTP POST
  If you pass this function a key it will search for the associated
  value in the GET and POST in that order
	and return the first one it finds. If the key does not exist,
	an empty string is returned.
*/
function getValue($key, $default)
{
	$ret = $default;
	if (isset($_GET[$key]))
		$ret = $_GET[$key];
	else if (isset($_POST[$key]))
		$ret = $_POST[$key];
	return sanitize($ret);
}

function getSessionValue($key, $def)
{
	$ret = $def;
	if (isset($_SESSION[$key]))
		$ret = $_SESSION[$key];
	else
		$_SESSION[$key] = $def;
	return $ret;
}

function setSessionValue($key, $value)
{
	$_SESSION[$key] = $value;
}

function sanitize($t)
{
	global $db_server;
	if (is_array($t))
	{
			foreach($t as $var=>$val)
			{
					$output[$var] = sanitize($val);
			}
	}
	else
	{
		$output = $t;
		$output = strip_tags(trim($t));
		$output = htmlentities($output, ENT_NOQUOTES);
	}
	return $output;
}
?>
