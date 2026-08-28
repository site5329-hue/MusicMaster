"use strict";

/* =====================================================
   MUSIC MASTER
   CLOUD SYSTEM
   Version 1.5
===================================================== */

(function () {

  const CLOUD_KEY = "musicMasterCloudV15";

  /* =====================================================
     GET DATA
  ===================================================== */

  function getData() {

    try {

      const raw =
        localStorage.getItem(CLOUD_KEY);

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
        "Cloud data could not be loaded.",
        error
      );

      return [];

    }

  }


  /* =====================================================
     SAVE DATA
  ===================================================== */

  function saveData(data) {

    try {

      localStorage.setItem(
        CLOUD_KEY,
        JSON.stringify(data)
      );

      return true;

    } catch (error) {

      console.warn(
        "Cloud data could not be saved.",
        error
      );

      return false;

    }

  }


  /* =====================================================
     ADD ACTIVITY
  ===================================================== */

  function addActivity(action) {

    const data = getData();

    data.push({

      id:
        Date.now(),

      time:
        new Date().toISOString(),

      action:
        String(action || "فعالیت جدید")
          .slice(0, 150)

    });


    while (data.length > 250) {
      data.shift();
    }


    const saved =
      saveData(data);


    updateUI();

    return saved;

  }


  /* =====================================================
     CLEAR CLOUD
  ===================================================== */

  function clearCloud() {

    try {

      localStorage.removeItem(
        CLOUD_KEY
      );

      updateUI();

      return true;

    } catch (error) {

      return false;

    }

  }


  /* =====================================================
     SIZE
  ===================================================== */

  function getSize(data) {

    try {

      return new Blob([
        JSON.stringify(data)
      ]).size;

    } catch (error) {

      return 0;

    }

  }


  /* =====================================================
     FORMAT SIZE
  ===================================================== */

  function formatSize(bytes) {

    const value =
      Number(bytes) || 0;


    if (value < 1024) {
      return value + " B";
    }


    if (value < 1024 * 1024) {

      return (
        value / 1024
      ).toFixed(1) + " KB";

    }


    return (
      value /
      (1024 * 1024)
    ).toFixed(2) + " MB";

  }


  /* =====================================================
     UPDATE UI
  ===================================================== */

  function updateUI() {

    const data =
      getData();

    const size =
      getSize(data);


    const sizeElement =
      document.getElementById(
        "cloudSize"
      );

    if (sizeElement) {

      sizeElement.textContent =
        formatSize(size);

    }


    const detailElement =
      document.getElementById(
        "cloudDetail"
      );

    if (detailElement) {

      detailElement.textContent =
        data.length +
        " مورد ذخیره شده";

    }


    const countElement =
      document.getElementById(
        "cloudCount"
      );

    if (countElement) {

      countElement.textContent =
        data.length;

    }

  }


  /* =====================================================
     EXPORT
  ===================================================== */

  function exportData() {

    const data =
      getData();

    const json =
      JSON.stringify(
        data,
        null,
        2
      );


    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "music-master-cloud.json";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );


    if (
      window.MusicMasterIsland &&
      typeof window.MusicMasterIsland.success ===
      "function"
    ) {

      window.MusicMasterIsland.success(
        "اطلاعات Cloud ذخیره شد ✓"
      );

    }

  }


  /* =====================================================
     IMPORT
  ===================================================== */

  function importData(file) {

    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      function () {

        try {

          const data =
            JSON.parse(
              reader.result
            );


          if (!Array.isArray(data)) {

            throw new Error(
              "Invalid cloud data"
            );

          }


          saveData(data);

          updateUI();


          if (
            window.MusicMasterIsland &&
            typeof window.MusicMasterIsland.success ===
            "function"
          ) {

            window.MusicMasterIsland.success(
              "اطلاعات Cloud وارد شد ✓"
            );

          }

        } catch (error) {

          if (
            window.MusicMasterIsland &&
            typeof window.MusicMasterIsland.error ===
            "function"
          ) {

            window.MusicMasterIsland.error(
              "فایل Cloud معتبر نیست"
            );

          }

        }

      };


    reader.readAsText(file);

  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.MusicMasterCloud = {

    get: getData,

    save: saveData,

    add: addActivity,

    clear: clearCloud,

    updateUI: updateUI,

    export: exportData,

    import: importData,

    formatSize: formatSize

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