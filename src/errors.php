---
# Errors
---
<!DOCTYPE html>
<html>

  {% include head.html %}

<body>

  <?php
  $status = $_SERVER['REDIRECT_STATUS'];
  $codes = array(
    401 => array('401 Unauthorized', 'This request requires user authentication.'),
    403 => array('403 Forbidden', 'The server has refused to fulfill your request.'),
    404 => array('404 Not Found', 'The requested file was not found on this server.'),
    405 => array('405 Method Not Allowed', 'The method specified in the Request-Line is not allowed for the specified resource.'),
    408 => array('408 Request Timeout', 'Your browser failed to send a request in the time allowed by the server.'),
    410 => array('410 Gone', 'This content has been removed, with no suitable replacement. Please remove any inbound links.'),
    500 => array('500 Internal Server Error', 'The request was unsuccessful due to an unexpected condition encountered by the server.'),
    502 => array('502 Bad Gateway', 'The server received an invalid response from the upstream server while trying to fulfill the request.'),
    504 => array('504 Gateway Timeout', 'The upstream server failed to send a request in the time allowed by the server.'),
  );

  $title = $codes[$status][0];
  $message = $codes[$status][1];
  if ($title == false || strlen($status) != 3) {
    $message = 'Please supply a valid status code.';
  } else {
    $code = substr($title, 0, 3);
    $code_desc = substr($title, 3);
  }
  ?>

  <div class="grid">

    <header role="banner">

      <h1><?php echo $code . ' Error'; ?></h1>

    </header>

    <main role="main">

      <article>

        <h2><?php echo $code_desc; ?></h2>

        <p><?php echo $message; ?></p>

        <a class="more" href="/">Return to the home page</a>.

      </article>

    </main>

  {% include footer.html %}

  </div>

</body>

</html>
