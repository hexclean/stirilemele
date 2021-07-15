window.onload = function () {
  var acceptCookie = document.getElementById("acceptCookie");
  acceptCookie.onclick = function () {
    Cookies.set("cookie", true, { expires: 365 });
  };
};
