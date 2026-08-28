"use strict";

/* =====================================================
   MUSIC MASTER
   DYNAMIC ISLAND
   Version 1.5
===================================================== */

(function () {

  let island = null;
  let hideTimer = null;


  /* =====================================================
     FIND ISLAND
  ===================================================== */

  function getIsland() {

    if (!island) {
      island = document.getElementById("dynamicIsland");
    }

    return island;

  }


  /* =====================================================
     SHOW ISLAND
  ===================================================== */

  function show(message, type) {

    const element = getIsland();

    if (!element) {
      return;
    }

    clearTimeout(hideTimer);

    element.classList.remove(
      "success",
      "error",
      "info",
      "warning"
    );

    element.classList.add("active");

    if (type) {
      element.classList.add(String(type));
    }

    const text =
      element.querySelector(
        "[data-island-message]"
      );

    if (text) {

      text.textContent =
        String(message || "Music Master");

    } else {

      element.textContent =
        String(message || "Music Master");

    }

  }


  /* =====================================================
     HIDE ISLAND
  ===================================================== */

  function hide(delay) {

    const element = getIsland();

    if (!element) {
      return;
    }

    clearTimeout(hideTimer);

    const time =
      Number(delay) || 2500;

    hideTimer = setTimeout(
      function () {

        element.classList.remove(
          "active"
        );

      },
      time
    );

  }


  /* =====================================================
     NOTIFICATION
  ===================================================== */

  function notify(message, type, duration) {

    show(
      message,
      type || "info"
    );

    hide(
      duration || 2500
    );

  }


  /* =====================================================
     SUCCESS
  ===================================================== */

  function success(message) {

    notify(
      message || "عملیات با موفقیت انجام شد ✓",
      "success",
      2500
    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  function error(message) {

    notify(
      message || "یک خطا رخ داد",
      "error",
      3000
    );

  }


  /* =====================================================
     WARNING
  ===================================================== */

  function warning(message) {

    notify(
      message || "توجه",
      "warning",
      3000
    );

  }


  /* =====================================================
     INFO
  ===================================================== */

  function info(message) {

    notify(
      message || "اطلاعیه Music Master",
      "info",
      2500
    );

  }


  /* =====================================================
     CONNECTION STATUS
  ===================================================== */

  function connection(status) {

    if (status === "online") {

      success(
        "اتصال اینترنت برقرار شد ✓"
      );

      return;

    }

    if (status === "offline") {

      warning(
        "اتصال اینترنت قطع شد"
      );

      return;

    }

    info(
      "وضعیت اتصال نامشخص است"
    );

  }


  /* =====================================================
     CLICK HANDLER
  ===================================================== */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-island]"
        );

      if (!button) {
        return;
      }

      const message =
        button.getAttribute(
          "data-island"
        );

      if (message) {

        info(message);

      }

    }
  );


  /* =====================================================
     ONLINE / OFFLINE
  ===================================================== */

  window.addEventListener(
    "online",
    function () {

      connection("online");

    }
  );


  window.addEventListener(
    "offline",
    function () {

      connection("offline");

    }
  );


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.MusicMasterIsland = {

    show: show,

    hide: hide,

    notify: notify,

    success: success,

    error: error,

    warning: warning,

    info: info,

    connection: connection

  };


})();