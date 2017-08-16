
<?php
require_once "functions.php";
require_once 'dblogin.php';

session_start();
header("Access-Control-Allow-Origin: *");

// Create connection
$conn = new mysqli($db_hostname, $db_username, $db_password, $db_database);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} 

$cmd = getValue("cmd", "");
if ($cmd == "login")
{
  $response = login($conn);
  header('Content-type: application/json');
  echo json_encode($response);
}
else if ($cmd == "sourceListV")
{
  $response = sourceListV($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "addData")
{
  $response = addData($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "login2")
{
  $response = login2($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getReport")
{
  $response = getReport($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getReportHD")
{
  $response = getReportHD($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "clearSession")
{
  $response = clearSession($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "dailogReport")
{
  $response = dailogReport($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getUserList")
{
  $response = getUserList($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getWeekList")
{
  $response = getWeekList($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getWeekDetail")
{
  $response = getWeekDetail($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getUserDetail")
{
  $response = getUserDetail($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "getAllUser")
{
  $response = getAllUser($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "addUser")
{
  $response = addUser($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "updateUser")
{
  $response = updateUser($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else if ($cmd == "deleteUser")
{
  $response = deleteUser($conn);
  header('Content-type: application/json');
  echo json_encode($response);    
}
else // list all supported commands
{
echo
"
  <pre>
      Command: login
          Description: check if id is in database
          Parameters: log in id
          Example:
              Query string: ?cmd=login&id=sam
              Returns: id from database
              
      Command: sourceListV
          Description: return list of avaiable soure base on user type
          Parameters: types
          Example:
              Query string: ?cmd=sourceListV&sourceListV=video
              Returns: return list
              
      Command: addData
          Description: add data
          Parameters: starts,ends,sourceid,timespend
          Example:
              Query string: ?cmd=addData&starts='2016-05-04 22:10:04'&ends='2017-05-04 22:10:04'&sourceid=5&timespend=45698
              Returns: none  

      Command: dailogReport
          Description: get record by week
          Parameters: weeksNumber
          Example:
              Query string: ?cmd=dailogReport&weekN='Week 3'
              Returns: records               
              
  </pre>            
";
}

/*=================Start function ================*/
function login($conn)
{
  $userId = getValue("userID", "");
 setSessionValue("id",$userId);
  $result = $conn->query("SELECT * FROM User WHERE userid = '" .$userId. "'");
  $rows = array();
  if ($result->num_rows > 0) 
  {
      while($r = mysqli_fetch_assoc($result)) 
      {
          $rows[] = $r;
          
          $types = getSessionValue("types", "");
          setSessionValue("types",$r[sourcetype]);
          
          $id = getSessionValue("id", "");
          setSessionValue("id",$r[id]);
      }
      return $rows;
  }
  else 
  {
      return array("notFound"=>"notFound");   
  }
}

function sourceListV($conn)
{
  $types = getSessionValue("types", "");
  $s = "SELECT * FROM Source WHERE types = '".$types. "'";
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
      $rows[] = $r;
  }
  return $rows;    
}
function addData($conn)
{
  $id = getSessionValue("id", "");
  //if you not set this it will use 5 hours ahead
  date_default_timezone_set('America/New_York');
  $dates1=date("Y-m-d");
  
  $starts1=getValue("starts","");
  $ends1=getValue("ends","");
  $sourceid1=getValue("sourceid","");
  $timespend1=getValue("timespend","");
  $timespend1=ceil($timespend1/1000);
  //$timespend1=round($timespend1/60,2);
  
  //creat weeksNumber
  $startDate = date_create('2017-04-30');//This is start date must be on Sunday
  $interval = date_diff($startDate, new DateTime());
  $d = $interval->format('%a') + 1;
  $weeksNumber1="Week ".(ceil($d/7)<10?"0":"").ceil($d/7);
  
  $S = "INSERT INTO Tracking(userid,dates, starts, ends,sourceid,timespend,weeksNumber) VALUES (?, ?, ?, ?, ?, ?,?)";
  $stmt = $conn->prepare($S);
  $stmt->bind_param("isssiis", $id,$dates1, $starts1, $ends1,$sourceid1,$timespend1,$weeksNumber1);
  //$stmt->bind_param("isssid", $id,$dates1, $starts1, $ends1,$sourceid1,$timespend1);
  $stmt->execute();
}
function login2($conn)
{
  $id = getSessionValue("id", "");
  $s = "SELECT * FROM User WHERE id = " .$id;
  $result = $conn->query($s);
  $rows = array();
  if ($result->num_rows > 0) 
  {
      while($r = mysqli_fetch_assoc($result)) 
      {
          $rows[] = $r;
      }
      return $rows;
  }
  else 
  {
      return array("notFound"=>"notFound");   
  }
}
function getReport($conn)
{
  $id = getSessionValue("id", "");

  $s = "SELECT SUM( Trk.timespend ) AS TmSp, Trk.weeksNumber as Wk
        FROM Tracking Trk
        WHERE Trk.userid =" .$id. "
        GROUP BY weeksNumber";    
  $result = $conn->query($s);
  $rows = array();
  if ($result->num_rows > 0)
  {
      while($r = mysqli_fetch_assoc($result)) 
      {
          $rows[] = $r;
      }
      return $rows;    
  }
  else
  {
      return array("notFound"=>"notFound"); 
  }
}
function getReportHD($conn)
{
  $id = getSessionValue("id", "");
  $s = "SELECT sum( Trk.timespend ) AS TmSp FROM Tracking Trk WHERE userid=" .$id;
  $result = $conn->query($s);
  $rows = array();
  if ($result->num_rows > 0)
  {
      while($r = mysqli_fetch_assoc($result)) 
      {
          $rows[] = $r;
      }
      return $rows;    
  }
  else
  {
      return array("notFound"=>"notFound"); 
  }
}
function clearSession($conn)
{
  // remove all session variables
  session_unset(); 
  
  // destroy the session 
  session_destroy();     
  return array("logOut"=>"logOut Success"); 
}
function dailogReport($conn)
{
  $id = getSessionValue("id", "");
  $wk = getValue("weekN","");

  $s = "SELECT SUM( Trk.timespend ) AS TmSp, Trk.dates AS Dts, Src.title AS Ttl
        FROM Tracking Trk
        INNER JOIN Source Src ON Trk.sourceid = Src.id
        WHERE Trk.userid =" .$id. " and weeksNumber = '" .$wk. "'
        GROUP BY dates,title";
  
  $result = $conn->query($s);
  $rows = array();
  if ($result->num_rows > 0)
  {
      while($r = mysqli_fetch_assoc($result))
      
      {
          $rows[] = $r;
      }
      return $rows;    
  }
  else
  {
      return array("notFound"=>"notFound"); 
  }
}
/*================ Admin section ==================*/
function getAllUser($conn)
{
  $s = "SELECT *
        FROM User 
        WHERE isTest=0
        ORDER BY fname";
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
      $rows[] = $r;
  }
  return $rows;    
}
function addUser($conn)
{
    $loginid = getValue("loginid", "");
    $fname = getValue("fname", "");
    $lname = getValue("lname", "");
    $group = getValue("group", "");
    $t=0;
    
    if ($loginid != "" && $fname != "" && $lname != "" && $group != "")
    {
      $S = "INSERT INTO User(	userid, fname, lname,sourcetype,isTest) VALUES (?, ?, ?,?,?)";
        $stmt = $conn->prepare($S);
        $stmt->bind_param("ssssi", $loginid, $fname, $lname,$group,$t);
        $stmt->execute();
        return getAllUser($conn);
    }
    else 
    {
       return array("error"=>"All fields are required");   
    }
}
function updateUser($conn)
{
    $uid = getValue("uid", "");
    $loginid = getValue("loginid", "");
    $fname = getValue("fname", "");
    $lname = getValue("lname", "");
    $group = getValue("group", "");
    
    if ($loginid != "" && $fname != "" && $lname != "" && $group != "")
    {
      $S = "Update User SET	userid=?, fname=?, lname=?,sourcetype=? WHERE ID = ".$uid;
        $stmt = $conn->prepare($S);
        $stmt->bind_param("ssss", $loginid, $fname, $lname,$group);
        $stmt->execute();
        return getAllUser($conn);
    }
    else 
    {
       return array("error"=>"All fields are required");   
    }
}
function deleteUser($conn)
{
    $uid = getValue("uid", "");
    
    $S="DELETE FROM User WHERE ID = ?";
    $stmt = $conn->prepare($S);
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    return getAllUser($conn);
}
/*======================================================*/
function getUserList($conn)
{
  $s = "SELECT User.id, User.fname, User.lname, User.sourcetype, 
        Sum(Tracking.timespend) AS tot
        FROM User LEFT JOIN Tracking ON User.id = Tracking.userid
        WHERE (((User.isTest)=0))
        GROUP BY User.id, User.fname, User.lname, User.sourcetype
        ORDER BY Sum(Tracking.timespend) DESC";
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
      $rows[] = $r;
  }
  return $rows;    
}
function getWeekList($conn)
{
  $s = "SELECT Tracking.weeksNumber, Sum(Tracking.timespend) AS tot, Count(Tracking.userid) AS usrCt
        FROM Tracking INNER JOIN User ON Tracking.userid = User.id
        WHERE (((User.isTest)=0))
        GROUP BY Tracking.weeksNumber";
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
      $rows[] = $r;
  }
  return $rows;    
}
function getWeekDetail($conn)
{
  $wk = getValue("weekN","");
  $s = "SELECT User.fname, User.lname, User.sourcetype, Source.title, Sum(Tracking.timespend) AS tot
      FROM (Tracking INNER JOIN User ON Tracking.userid = User.id) INNER JOIN Source ON Tracking.sourceid = Source.id
      WHERE (((Tracking.weeksNumber)='" .$wk. "') AND ((User.isTest)=0))
      GROUP BY User.fname, User.lname, User.sourcetype, Source.title
      ORDER BY User.fname, Sum(Tracking.timespend) DESC";
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
    $rows[] = $r;
  }
  return $rows;    
}
function getUserDetail($conn)
{
  $uid = getValue("uid2","");
  
  $s = "SELECT Tracking.weeksNumber, Source.title, Sum(Tracking.timespend) AS tot, User.sourcetype
        FROM (Tracking INNER JOIN User ON Tracking.userid = User.id) INNER JOIN Source ON Tracking.sourceid = Source.id
        WHERE (((Tracking.userid)='" .$uid. "'))
        GROUP BY Tracking.weeksNumber, Source.title, User.sourcetype
        ORDER BY Tracking.weeksNumber, Source.title";
  
  $result = $conn->query($s);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) 
  {
    $rows[] = $r;
  }
  return $rows;    
}
?>
