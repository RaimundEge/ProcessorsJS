<html>
<head>
<title>Credit Card Authorization Test Page</title>
</head>
<body>
<h3>Credit Card Authorization Test Page via PHP</h3>

<?php
$url = 'http://blitz.cs.niu.edu:3000/creditcard/';
$data = array(
	'vendor' => 'VE001-99',
	'trans' => '907-' . rand(123456,987654) . '-296',
	'cc' => '6011 1234 4321 1234',
	'name' => 'John Doe', 
	'exp' => '12/2019', 
	'amount' => '654.32');

$options = array(
    'http' => array(
        'header' => array(
					'Content-type: application/json'
				  , 'Accept: application/json'),
        'method' => 'POST',
        'content'=> json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo($result);
?>

</body>
</html>
