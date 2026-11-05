(() => {
  const METRIKA_ID = 111886962;

  const reachGoal = (name) => {
    if (typeof ym === "function") {
      ym(METRIKA_ID, "reachGoal", name);
    }
  };

  document.querySelectorAll("[data-goal]").forEach((el) => {
    el.addEventListener("click", () => {
      reachGoal(el.dataset.goal);
    });
  });
})();
