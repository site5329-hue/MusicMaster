```javascript
"use strict";

/* =====================================================
   MUSIC MASTER
   APP CORE
   Version 1.5
===================================================== */


/* =====================================================
   GLOBAL CONSTANTS
===================================================== */

const MUSIC_MASTER_VERSION = "1.5";

const CLOUD_KEY = "musicMasterCloudV15";
const PROFILE_KEY = "musicMasterProfileV15";
const THEME_KEY = "musicMasterThemeV15";


/* =====================================================
   SHORT DOM HELPER
===================================================== */

function $(id) {
  return document.getElementById(id);
}


/* =====================================================
   TOAST
===================================================== */

let toastTimer = null;

function toast(message) {

  const element = $("toast");

  if (!element) {
    return;
  }

  element.textContent = String(message);

  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {

    element.classList.remove("show");

  }, 2200);
}


/* =====================================================
   DEVICE DETECTION
===================================================== */

function detectDevice() {

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    0;

  let device = "کامپیوتر";

  if (width <= 700) {

    device = "موبایل";

  } else if (width <= 1000) {

    device = "تبلت";

  }


  const element = $("heroDevice");

  if (element) {

    element.textContent = device;

  }

}


/* =====================================================
   CONNECTION STATUS
===================================================== */

function updateConnection() {

  const server = $("liveServer");

  if (!server) {
    return;
  }


  if (navigator.onLine) {

    server.textContent = "متصل";

  } else {

    server.textContent = "آفلاین";

  }

}


/* =====================================================
   VERSION CHECK
===================================================== */

function updateVersionInfo() {

  document
    .querySelectorAll("[data-version]")
    .forEach(function (element) {

      element.textContent =
        MUSIC_MASTER_VERSION;

    });

}


/* =====================================================
   CLOUD HELPERS
===================================================== */

function getCloudData() {

  try {

    const raw =
      localStorage.getItem(CLOUD_KEY);

    if (!raw) {
      return [];
    }


    const data =
      JSON.parse(raw);


    if (!Array.isArray(data)) {
      return [];
    }


    return data;

  } catch (error) {

    return [];

  }

}


/* =====================================================
   SAVE CLOUD ACTIVITY
===================================================== */

function saveCloud(action) {

  try {

    const data =
      getCloudData();


    data.push({

      time:
        new Date().toISOString(),

      action:
        String(action).slice(0, 120)

    });


    while (data.length > 250) {

      data.shift();

    }


    localStorage.setItem(
      CLOUD_KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    console.warn(
      "Music Master local storage unavailable.",
      error
    );

  }

}


/* =====================================================
   UPDATE CLOUD UI
===================================================== */

function estimateCloudBytes(data) {

  try {

    return new Blob([
      JSON.stringify(data)
    ]).size;

  } catch (error) {

    return 0;

  }

}


function formatBytes(bytes) {

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


function updateCloudUI() {

  const data =
    getCloudData();


  const size =
    estimateCloudBytes(data);


  const cloudSize =
    $("cloudSize");

  if (cloudSize) {

    cloudSize.textContent =
      formatBytes(size);

  }


  const cloudDetail =
    $("cloudDetail");

  if (cloudDetail) {

    cloudDetail.textContent =
      data.length +
      " مورد ذخیره شده";

  }

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme(enabled) {

  try {

    localStorage.setItem(
      THEME_KEY,
      enabled
        ? "dark"
        : "soft"
    );

  } catch (error) {

    console.warn(
      "Theme preference could not be saved.",
      error
    );

  }


  document.body.style.filter =
    enabled
      ? "none"
      : "brightness(1.08)";

}


function loadTheme() {

  let value = "dark";


  try {

    value =
      localStorage.getItem(
        THEME_KEY
      ) || "dark";

  } catch (error) {

    value = "dark";

  }


  const enabled =
    value !== "soft";


  document.body.style.filter =
    enabled
      ? "none"
      : "brightness(1.08)";


  const switchElement =
    $("themeSwitch");


  if (switchElement) {

    switchElement.checked =
      enabled;

  }

}


/* =====================================================
   PROFILE
===================================================== */

function getDefaultProfile() {

  return {

    name:
      "Music Master User",

    status:
      "کاربر مهمان"

  };

}


function loadProfile() {

  let profile =
    getDefaultProfile();


  try {

    const raw =
      localStorage.getItem(
        PROFILE_KEY
      );


    if (raw) {

      const parsed =
        JSON.parse(raw);


      if (
        parsed &&
        typeof parsed === "object"
      ) {

        profile = {

          name:
            String(
              parsed.name ||
              profile.name
            ),

          status:
            String(
              parsed.status ||
              profile.status
            )

        };

      }

    }

  } catch (error) {

    profile =
      getDefaultProfile();

  }


  const name =
    $("profileName");


  const status =
    $("profileStatus");


  if (name) {

    name.textContent =
      profile.name;

  }


  if (status) {

    status.textContent =
      profile.status;

  }

}


/* =====================================================
   EDIT PROFILE
===================================================== */

function editProfile() {

  const current =
    $("profileName")
      ? $("profileName").textContent
      : "Music Master User";


  const name =
    window.prompt(
      "نام نمایشی پروفایل را وارد کنید:",
      current
    );


  if (name === null) {

    return;

  }


  const clean =
    name
      .trim()
      .slice(0, 40);


  if (!clean) {

    toast(
      "نام معتبر وارد کنید"
    );

    return;

  }


  const profile = {

    name:
      clean,

    status:
      "پروفایل محلی"

  };


  try {

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );


    saveCloud(
      "ویرایش پروفایل"
    );


    loadProfile();


    toast(
      "پروفایل ذخیره شد ✓"
    );

  } catch (error) {

    toast(
      "ذخیره پروفایل انجام نشد"
    );

  }

}


/* =====================================================
   RESET PROFILE
===================================================== */

function resetProfile() {

  try {

    localStorage.removeItem(
      PROFILE_KEY
    );

  } catch (error) {}


  loadProfile();


  saveCloud(
    "بازنشانی پروفایل"
  );


  toast(
    "پروفایل بازنشانی شد"
  );

}


/* =====================================================
   ONLINE / OFFLINE EVENTS
===================================================== */

window.addEventListener(
  "online",
  function () {

    updateConnection();

    toast(
      "اتصال اینترنت برقرار شد ✓"
    );

  }
);


window.addEventListener(
  "offline",
  function () {

    updateConnection();

    toast(
      "اتصال اینترنت قطع شد"
    );

  }
);


/* =====================================================
   RESIZE
===================================================== */

let resizeTimer = null;


window.addEventListener(
  "resize",
  function () {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        function () {

          detectDevice();

        },
        100
      );

  }
);


/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

window.addEventListener(
  "error",
  function (event) {

    console.warn(
      "Music Master client error:",
      event.message
    );

  }
);


/* =====================================================
   UNHANDLED PROMISE ERRORS
===================================================== */

window.addEventListener(
  "unhandledrejection",
  function (event) {

    console.warn(
      "Music Master promise error:",
      event.reason
    );

  }
);


/* =====================================================
   INITIALIZATION
===================================================== */

function initMusicMaster() {

  detectDevice();

  updateConnection();

  updateVersionInfo();

  loadProfile();

  loadTheme();

  updateCloudUI();


  saveCloud(
    "ورود به Music Master v" +
    MUSIC_MASTER_VERSION
  );

}


/* =====================================================
   DOM READY
===================================================== */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initMusicMaster,
    {
      once: true
    }
  );

} else {

  initMusicMaster();

}


/* =====================================================
   SAFE EXIT
===================================================== */

window.addEventListener(
  "beforeunload",
  function () {

    try {

      saveCloud(
        "خروج از Music Master v" +
        MUSIC_MASTER_VERSION
      );

    } catch (error) {

      // جلوگیری از خراب شدن خروج صفحه

    }

  }
);
```
