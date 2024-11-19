window.onload = function () {
  const textElements = document.querySelectorAll(".animated-text");
  const buttonElements = document.querySelectorAll(".animated-btn");

  textElements.forEach((text, index) => {
    text.style.animationDelay = `${index * 0.5}s`;
  });

  buttonElements.forEach((button, index) => {
    button.style.animationDelay = `${1.5 + index * 0.5}s`;
  });
};
