document.addEventListener('DOMContentLoaded', () => {
  const typingText = document.querySelector('.typing-text');
  const cursor = document.querySelector('.cursor');
  const text = "Getting Started with Blogging....";
  const words = text.split(' ');
  let index = 0;

  function typeWord() {
    if (index < words.length) {
      typingText.textContent += `${index ? ' ' : ''}${words[index]}`;
      index++;
      setTimeout(typeWord, 300);
    } else {
      cursor.style.animation = 'none';
      cursor.style.opacity = '0';
    }
  }
  
  typeWord();
});