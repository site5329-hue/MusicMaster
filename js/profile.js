"use strict";

/* =====================================================
   MUSIC MASTER
   PROFILE SYSTEM
   Version 1.5
===================================================== */

(function () {

  const PROFILE_KEY =
    "musicMasterProfileV15";


  /* =====================================================
     DEFAULT PROFILE
  ===================================================== */

  function getDefaultProfile() {

    return {

      name: "Music Master User",

      status: "کاربر مهمان",

      createdAt:
        new Date().toISOString()

    };

  }


  /* =====================================================
     GET PROFILE
  ===================================================== */

  function getProfile() {

    const defaultProfile =
      getDefaultProfile();

    try {

      const raw =
        localStorage.getItem(
          PROFILE_KEY
        );


      if (!raw) {
        return defaultProfile;
      }


      const data =
        JSON.parse(raw);


      if (
        !data ||
        typeof data !== "object"
      ) {

        return defaultProfile;

      }


      return {

        name:
          String(
            data.name ||
            defaultProfile.name
          ).slice(0, 40),

        status:
          String(
            data.status ||
            defaultProfile.status
          ).slice(0, 80),

        createdAt:
          data.createdAt ||
          defaultProfile.createdAt

      };

    } catch (error) {

      return defaultProfile;

    }

  }


  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  function saveProfile(profile) {

    try {

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(profile)
      );

      updateUI();

      return true;

    } catch (error) {

      console.warn(
        "Profile could not be saved.",
        error
      );

      return false;

    }

  }


  /* =====================================================
     UPDATE UI
  ===================================================== */

  function updateUI() {

    const profile =
      getProfile();


    const name =
      document.getElementById(
        "profileName"
      );


    const status =
      document.getElementById(
        "profileStatus"
      );


    if (name) {

      name.textContent =
        profile.name;

    }


    if (status) {

      status.textContent =
        profile.status;

    }


    const avatar =
      document.getElementById(
        "profileAvatar"
      );


    if (avatar) {

      const firstLetter =
        profile.name
          .trim()
          .charAt(0);


      avatar.textContent =
        firstLetter || "M";

    }

  }


  /* =====================================================
     EDIT NAME
  ===================================================== */

  function editName() {

    const profile =
      getProfile();


    const newName =
      window.prompt(
        "نام نمایشی خود را وارد کنید:",
        profile.name
      );


    if (newName === null) {
      return;
    }


    const cleanName =
      newName
        .trim()
        .slice(0, 40);


    if (!cleanName) {

      notify(
        "لطفاً یک نام معتبر وارد کنید",
        "error"
      );

      return;

    }


    profile.name =
      cleanName;

    profile.status =
      "پروفایل محلی";


    if (
      saveProfile(profile)
    ) {

      saveActivity(
        "ویرایش نام پروفایل"
      );


      notify(
        "پروفایل با موفقیت ذخیره شد ✓",
        "success"
      );

    }

  }


  /* =====================================================
     EDIT STATUS
  ===================================================== */

  function editStatus() {

    const profile =
      getProfile();


    const newStatus =
      window.prompt(
        "وضعیت پروفایل را وارد کنید:",
        profile.status
      );


    if (newStatus === null) {
      return;
    }


    const cleanStatus =
      newStatus
        .trim()
        .slice(0, 80);


    if (!cleanStatus) {

      notify(
        "وضعیت نمی‌تواند خالی باشد",
        "error"
      );

      return;

    }


    profile.status =
      cleanStatus;


    if (
      saveProfile(profile)
    ) {

      saveActivity(
        "ویرایش وضعیت پروفایل"
      );


      notify(
        "وضعیت پروفایل ذخیره شد ✓",
        "success"
      );

    }

  }


  /* =====================================================
     RESET PROFILE
  ===================================================== */

  function resetProfile() {

    const confirmed =
      window.confirm(
        "پروفایل به حالت اولیه برگردد؟"
      );


    if (!confirmed) {
      return;
    }


    try {

      localStorage.removeItem(
        PROFILE_KEY
      );

    } catch (error) {

      notify(
        "بازنشانی پروفایل انجام نشد",
        "error"
      );

      return;

    }


    updateUI();

    saveActivity(
      "بازنشانی پروفایل"
    );


    notify(
      "پروفایل بازنشانی شد ✓",
      "success"
    );

  }


  /* =====================================================
     ACTIVITY
  ===================================================== */

  function saveActivity(action) {

    try {

      const key =
        "musicMasterCloudV15";


      const raw =
        localStorage.getItem(
          key
        );


      const data =
        raw
          ? JSON.parse(raw)
          : [];


      if (!Array.isArray(data)) {
        return;
      }


      data.push({

        time:
          new Date().toISOString(),

        action:
          String(action)
            .slice(0, 120)

      });


      while (data.length > 250) {
        data.shift();
      }


      localStorage.setItem(
        key,
        JSON.stringify(data)
      );

    } catch (error) {

      console.warn(
        "Profile activity could not be saved.",
        error
      );

    }

  }


  /* =====================================================
     NOTIFICATION
  ===================================================== */

  function notify(message, type) {

    if (
      window.MusicMasterIsland
    ) {

      if (
        type === "success" &&
        typeof window.MusicMasterIsland.success ===
        "function"
      ) {

        window.MusicMasterIsland.success(
          message
        );

        return;

      }


      if (
        type === "error" &&
        typeof window.MusicMasterIsland.error ===
        "function"
      ) {

        window.MusicMasterIsland.error(
          message
        );

        return;

      }


      if (
        typeof window.MusicMasterIsland.info ===
        "function"
      ) {

        window.MusicMasterIsland.info(
          message
        );

        return;

      }

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
     BUTTON EVENTS
  ===================================================== */

  document.addEventListener(
    "click",
    function (event) {

      const editNameButton =
        event.target.closest(
          "[data-edit-profile]"
        );


      if (editNameButton) {

        editName();

        return;

      }


      const editStatusButton =
        event.target.closest(
          "[data-edit-status]"
        );


      if (editStatusButton) {

        editStatus();

        return;

      }


      const resetButton =
        event.target.closest(
          "[data-reset-profile]"
        );


      if (resetButton) {

        resetProfile();

      }

    }
  );


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.MusicMasterProfile = {

    get: getProfile,

    save: saveProfile,

    updateUI: updateUI,

    editName: editName,

    editStatus: editStatus,

    reset: resetProfile

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