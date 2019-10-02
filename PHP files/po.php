<html>
<head>
<title>Purchase Order Processing Test Page</title>
</head>
<body>
<h3>Purchase Order Processing Test Page via PHP</h3>

<?php
$url = 'http://blitz.cs.niu.edu:3000/purchaseorder/';
$data = array(
	'order' => 'xyz-' . rand(123456,987654) . '-ba', 
	'associate' => 'RE-676732',
	'custid' => '21', 
	'amount' => '7654.32');
		
$options = array(
    'http' => array(
        'header' => array(
					'Content-type: application/json'
				  , 'Accept: application/json'),
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo($result);
?>

</body>
</html>
