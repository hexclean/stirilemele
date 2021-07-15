window.onload = function () {
  var acceptCookie = document.getElementById("acceptCookie");
  var cookieBox = document.getElementById("cookieBox");
  acceptCookie.onclick = function () {
    console.log("dasd");
    Cookies.set("cookie", true, { expires: 365 });
    cookieBox.style.display = "none";
  };
};
