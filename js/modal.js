"use strict";

/* =====================================================
   MUSIC MASTER
   MODAL SYSTEM
   Version 1.5
===================================================== */

(function () {

  let activeModal = null;


  /* =====================================================
     OPEN MODAL
  ===================================================== */

  function openModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
      console.warn("Modal not found:", id);
      return;
    }

    if (activeModal && activeModal !== modal) {
      closeModal(activeModal);
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    activeModal = modal;


    const firstInput =
      modal.querySelector(
        "input, textarea, select, button"
      );

    if (firstInput) {

      setTimeout(function () {
        firstInput.focus();
      }, 50);

    }

  }


  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  function closeModal(modalOrId) {

    let modal = modalOrId;

    if (typeof modalOrId === "string") {
      modal = document.getElementById(modalOrId);
    }

    if (!modal) {
      return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    if (activeModal === modal) {
      activeModal = null;
    }

    if (!document.querySelector(".modal.active")) {
      document.body.classList.remove("modal-open");
    }

  }


  /* =====================================================
     CLOSE ACTIVE MODAL
  ===================================================== */

  function closeActiveModal() {

    if (activeModal) {
      closeModal(activeModal);
    }

  }


  /* =====================================================
     TOGGLE MODAL
  ===================================================== */

  function toggleModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
      return;
    }

    if (modal.classList.contains("active")) {

      closeModal(modal);

    } else {

      openModal(modal);

    }

  }


  /* =====================================================
     ESC KEY
  ===================================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeActiveModal();
      }

    }
  );


  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  document.addEventListener(
    "click",
    function (event) {

      if (!activeModal) {
        return;
      }

      if (
        event.target === activeModal ||
        event.target.classList.contains("modal-overlay")
      ) {

        closeModal(activeModal);

      }

    }
  );


  /* =====================================================
     AUTO CLOSE BUTTONS
  ===================================================== */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-close-modal]"
        );

      if (!button) {
        return;
      }

      const target =
        button.getAttribute(
          "data-close-modal"
        );

      if (target) {

        closeModal(target);

      } else {

        closeActiveModal();

      }

    }
  );


  /* =====================================================
     AUTO OPEN BUTTONS
  ===================================================== */

  document.addEventListener(
    "click",
    function (event) {

      const button =
        event.target.closest(
          "[data-open-modal]"
        );

      if (!button) {
        return;
      }

      const target =
        button.getAttribute(
          "data-open-modal"
        );

      if (target) {
        openModal(target);
      }

    }
  );


  /* =====================================================
     PUBLIC API
  ===================================================== */

  window.MusicMasterModal = {

    open: openModal,

    close: closeModal,

    closeActive: closeActiveModal,

    toggle: toggleModal

  };


  /* =====================================================
     BACKWARD COMPATIBILITY
  ===================================================== */

  window.openModal = openModal;

  window.closeModal = closeModal;

  window.closeActiveModal = closeActiveModal;


})();