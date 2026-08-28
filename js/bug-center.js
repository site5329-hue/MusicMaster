"use strict";

/* =====================================================
   MUSIC MASTER
   BUG CENTER
   Version 1.5
===================================================== */

(function () {

  const BUG_KEY = "musicMasterBugCenterV15";

  /* =====================================================
     GET BUGS
  ===================================================== */

  function getBugs() {

    try {

      const raw =
        localStorage.getItem(BUG_KEY);

      if (!raw) {
        return [];
      }

      const data =
        JSON.parse(raw);

      return Array.isArray(data)
        ? data
        : [];

    } catch (error) {

      console.warn(
        "Bug Center data could not be loaded.",
        error
      );

      return [];

    }

  }


  /* =====================================================
     SAVE BUGS
  ===================================================== */

  function saveBugs(data) {

    try {

      localStorage.setItem(
        BUG_KEY,
        JSON.stringify(data)
      );

      return true;

    } catch (error) {

      console.warn(
        "Bug Center data could not be saved.",
        error
      );

      return false;

    }

  }


  /* =====================================================
     REPORT BUG
  ===================================================== */

  function reportBug(title, description) {

    const cleanTitle =
      String(title || "")
        .trim()
        .slice(0, 100);

    const cleanDescription =
      String(description || "")
        .trim()
        .slice(0, 1000);


    if (!cleanTitle) {

      notifyError(
        "عنوان مشکل را وارد کنید"
      );

      return false;

    }


    if (!cleanDescription) {

      notifyError(
        "توضیحات مشکل را وارد کنید"
      );

      return false;

    }


    const bugs =
      getBugs();


    bugs.push({

      id:
        Date.now(),

      title:
        cleanTitle,

      description:
        cleanDescription,

      status:
        "جدید",

      time:
        new Date().toISOString()

    });


    while (bugs.length > 100) {
      bugs.shift();
    }


    const saved =
      saveBugs(bugs);


    updateUI();


    if (saved) {

      notifySuccess(
        "گزارش مشکل ثبت شد ✓"
      );

    }


    return saved;

  }


  /* =====================================================
     DELETE BUG
  ===================================================== */

  function deleteBug(id) {

    const bugs =
      getBugs();


    const filtered =
      bugs.filter(
        function (bug) {

          return String(bug.id) !==
            String(id);

        }
      );


    saveBugs(filtered);

    updateUI();

  }


  /* =====================================================
     CLEAR BUGS
  ===================================================== */

  function clearBugs() {

    try {

      localStorage.removeItem(
        BUG_KEY
      );

      updateUI();

      notifySuccess(
        "گزارش‌ها پاک شدند"
      );

      return true;

    } catch (error) {

      notifyError(
        "پاک کردن گزارش‌ها انجام نشد"
      );

      return false;

    }

  }


  /* =====================================================
     UPDATE UI
  ===================================================== */

  function updateUI() {

    const bugs =
      getBugs();


    const count =
      document.getElementById(
        "bugCount"
      );


    if (count) {

      count.textContent =
        bugs.length;

    }


    const list =
      document.getElementById(
        "bugList"
      );


    if (!list) {
      return;
    }


    list.innerHTML = "";


    if (bugs.length === 0) {

      const empty =
        document.createElement(
          "div"
        );

      empty.className =
        "bug-empty";

      empty.textContent =
        "هنوز گزارشی ثبت نشده است.";

      list.appendChild(
        empty
      );

      return;

    }


    bugs
      .slice()
      .reverse()
      .forEach(
        function (bug) {

          const item =
            document.createElement(
              "div"
            );

          item.className =
            "bug-item";


          const title =
            document.createElement(
              "h4"
            );

          title.textContent =
            bug.title;


          const description =
            document.createElement(
              "p"
            );

          description.textContent =
            bug.description;


          const status =
            document.createElement(
              "span"
            );

          status.className =
            "bug-status";

          status.textContent =
            bug.status;


          const button =
            document.createElement(
              "button"
            );

          button.type =
            "button";

          button.textContent =
            "حذف";


          button.addEventListener(
            "click",
            function () {

              deleteBug(
                bug.id
              );

            }
          );


          item.appendChild(
            title
          );

          item.appendChild(
            description
          );

          item.appendChild(
            status
          );

          item.appendChild(
            button
          );


          list.appendChild(
            item
          );

        }
      );

  }


  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  function notifySuccess(message) {

    if (
      window.MusicMasterIsland &&
      typeof window.MusicMasterIsland.success ===
      "function"
    ) {

      window.MusicMasterIsland.success(
        message
      );

      return;

    }


    if (
      typeof window.toast ===
      "function"
    ) {

      window.toast(
        message
      );

    }

  }


  function notifyError(message) {

    if (
      window.MusicMasterIsland &&
      typeof window.MusicMasterIsland.error ===
      "function"
    ) {

      window.MusicMasterIsland.error(
        message
      );

      return;

    }


    if (
      typeof window.toast ===
      "function"
    ) {

      window.toast(
        message
      );

    }

  }


  /* =====================================================
     AUTO REPORT FORM
  ===================================================== */

  document.addEventListener(
    "submit",
    function (event) {

      const form =
        event.target.closest(
          "#bugForm"
        );


      if (!form) {
        return;
      }


      event.preventDefault();


      const titleInput =
        form.querySelector(
          "[name='bugTitle']"
        );


      const descriptionInput =
        form.querySelector(
          "[name='bugDescription']"
        );


      const success =
        reportBug(

          titleInput
            ? titleInput.value
            : "",

          descriptionInput
            ? descriptionInput.value
            : ""

        );


      if (success) {

        form.reset();

      }

    }
  );


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.MusicMasterBugCenter = {

    get: getBugs,

    save: saveBugs,

    report: reportBug,

    delete: deleteBug,

    clear: clearBugs,

    updateUI: updateUI

  };


  /* =====================================================
     DOM READY
  ===================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      updateUI,
      {
        once: true
      }
    );

  } else {

    updateUI();

  }

})();