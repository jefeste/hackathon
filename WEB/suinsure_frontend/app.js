(function () {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  const coverageCards = Array.from(document.querySelectorAll(".coverage-card"));
  if (coverageCards.length) {
    const clearActive = () => {
      coverageCards.forEach((card) => card.classList.remove("is-active"));
    };

    const setActive = (card) => {
      clearActive();
      card.classList.add("is-active");
    };

    coverageCards.forEach((card) => {
      card.addEventListener("click", () => setActive(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive(card);
        }
      });
    });

    setActive(coverageCards[0]);
  }

  const modal = document.querySelector(".modal[data-modal='compensation']");
  if (modal) {
    const { body } = document;
    const backdrop = modal.querySelector(".modal-backdrop");
    const closeButtons = modal.querySelectorAll(".modal-close, .modal-dismiss");
    const confirmButton = modal.querySelector(".modal-confirm");
    const oracleSpans = modal.ownerDocument.querySelectorAll("[data-status]");

    const showModal = () => {
      modal.removeAttribute("hidden");
      window.requestAnimationFrame(() => {
        modal.classList.add("is-visible");
      });
      body.classList.add("modal-open");
    };

    const hideModal = () => {
      modal.classList.remove("is-visible");
      const onTransitionEnd = (event) => {
        if (event.target === modal) {
          modal.setAttribute("hidden", "");
          modal.removeEventListener("transitionend", onTransitionEnd);
        }
      };
      modal.addEventListener("transitionend", onTransitionEnd);
      body.classList.remove("modal-open");
    };

    const updateOracleStatus = () => {
      oracleSpans.forEach((span) => {
        const base = span.dataset.status === "rainfall" ? 2 : 4;
        const jitter = Math.floor(Math.random() * 4);
        span.textContent = `${base + jitter} sec ago`;
      });
    };

    setTimeout(showModal, 5000);
    updateOracleStatus();
    const statusInterval = window.setInterval(updateOracleStatus, 4000);

    closeButtons.forEach((button) => {
      button.addEventListener("click", hideModal);
    });

    if (backdrop) {
      backdrop.addEventListener("click", hideModal);
    }

    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        confirmButton.textContent = "Compensation released";
        confirmButton.disabled = true;
        confirmButton.classList.add("is-success");
        window.setTimeout(() => {
          hideModal();
          window.clearInterval(statusInterval);
        }, 1800);
      });
    }

    modal.addEventListener("transitionend", (event) => {
      if (event.target === modal && !modal.classList.contains("is-visible")) {
        window.clearInterval(statusInterval);
      }
    });
  }
})();
