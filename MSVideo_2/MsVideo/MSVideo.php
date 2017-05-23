
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
                
    </pre>            
  ";
}

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
    
    $S = "INSERT INTO Tracking(userid,dates, starts, ends,sourceid,timespend) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($S);
    $stmt->bind_param("isssii", $id,$dates1, $starts1, $ends1,$sourceid1,$timespend1);
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
/*    $s = "SELECT sum( Trk.timespend ) AS TmSp, Trk.dates AS Dts, Src.title AS Ttl
        FROM Tracking Trk
        INNER JOIN Source Src ON Trk.sourceid = Src.id
        WHERE Trk.userid =" .$id. " GROUP BY dates, title";*/
    $s = "SELECT sum( Trk.timespend ) AS TmSp, Trk.dates AS Dts, Src.title AS Ttl
        FROM Tracking Trk
        INNER JOIN Source Src ON Trk.sourceid = Src.id
        WHERE Trk.userid =" .$id. " GROUP BY dates";        
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
?>
