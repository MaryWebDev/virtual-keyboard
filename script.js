import './bodyMarkup.js';

const keyboard = document.querySelector('.keyboard');
const textarea = document.querySelector('.textarea');

if (!localStorage.getItem('userLang')) {
  localStorage.setItem('userLang', 'eng');
}
let currentLang = localStorage.getItem('userLang');

if (currentLang === 'rus') {
  keyboard.querySelectorAll('.eng').forEach(key => key.classList.add('hidden'));
  keyboard.querySelectorAll('.eng .caseDown').forEach(key => key.classList.add('hidden'));

  keyboard.querySelectorAll('.rus').forEach(key => key.classList.remove('hidden'));
  keyboard.querySelectorAll('.rus .caseDown').forEach(key => key.classList.remove('hidden'));
}

let capsLockIsActive = false;
let shiftIsActive = false;
let shiftLeftIsActive = false;
let shiftRightIsActive = false;

let hotKeysPress = {
  'ControlLeft': false,
  'AltLeft': false
};

textarea.focus();
textarea.addEventListener("blur", () => {
  textarea.focus();
});

function toggleHidden(className, add = true) {
  if (add) {
    keyboard.querySelectorAll(`.key .${currentLang} .${className}`).forEach(key => {
      key.classList.add('hidden');
    });
  } else {
    keyboard.querySelectorAll(`.key .${currentLang} .${className}`).forEach(key => {
      key.classList.remove('hidden');
    });
  }
}

function toggleActive(className, add = true) {
  if (add) {
    keyboard.querySelector(`.${className}`).classList.add('active');
  } else {
    keyboard.querySelector(`.${className}`).classList.remove('active');
  }
}

function capsLockHandle() {
  if (!shiftIsActive) {
    if (!capsLockIsActive) {
      toggleHidden('caseDown');
      toggleHidden('caps', false);
      toggleActive('CapsLock');
      capsLockIsActive = true;
    } else {
      toggleHidden('caps');
      toggleHidden('caseDown', false);
      toggleActive('CapsLock', false);
      capsLockIsActive = false;
    }
  } else {
    if (!capsLockIsActive) {
      toggleHidden('caseUp');
      toggleHidden('shiftCaps', false);
      toggleActive('CapsLock');
      capsLockIsActive = true;
    } else {
      toggleHidden('shiftCaps');
      toggleHidden('caseUp', false);
      toggleActive('CapsLock', false);
      capsLockIsActive = false;
    }
  }
}

function shiftHandle(keyCode) {
  if (keyCode === 'ShiftLeft') {
    if (shiftLeftIsActive) {
      toggleActive('ShiftLeft', false);
      shiftLeftIsActive = false;
    } else {
      toggleActive('ShiftLeft');
      shiftLeftIsActive = true;
      if (shiftRightIsActive) {
        toggleActive('ShiftRight', false);
        shiftRightIsActive = false;
        return;
      }
    }
  } else {
    if (shiftRightIsActive) {
      toggleActive('ShiftRight', false);
      shiftRightIsActive = false;
    } else {
      toggleActive('ShiftRight');
      shiftRightIsActive = true;
      if (shiftLeftIsActive) {
        toggleActive('ShiftLeft', false);
        shiftLeftIsActive = false;
        return;
      }
    }
  }

  if (!capsLockIsActive) {
    if (!shiftIsActive) {
      toggleHidden('caseDown');
      toggleHidden('caseUp', false);
      shiftIsActive = true;
    } else {
      toggleHidden('caseUp');
      toggleHidden('caseDown', false);
      shiftIsActive = false;
    }
  } else {
    if (!shiftIsActive) {
      toggleHidden('caps');
      toggleHidden('shiftCaps', false);
      shiftIsActive = true;
    } else {
      toggleHidden('shiftCaps');
      toggleHidden('caps', false);
      shiftIsActive = false;
    }
  }
}

keyboard.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.key')) return;

  let cursorStart = textarea.selectionStart;
  let cursorEnd = textarea.selectionEnd;

  if (e.target.closest('.CapsLock')) {
    capsLockHandle();
  }

  if (e.target.closest('.ShiftLeft') || e.target.closest('.ShiftRight')) {
    let keyCode = e.target.closest('.ShiftLeft') ? 'ShiftLeft' : 'ShiftRight';
    shiftHandle(keyCode);
  }

  let currentKey = e.target.closest('.key');
  if (!currentKey.classList.contains('CapsLock') && !currentKey.classList.contains('ShiftLeft') && !currentKey.classList.contains('ShiftRight')) {
    addActiveState(currentKey);
  }

  if (e.target.closest('.Enter')) {
    textarea.textContent = textarea.textContent.slice(0, cursorStart) + '\n' + textarea.textContent.slice(cursorEnd);
    textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  }

  if (e.target.closest('.Tab')) {
    textarea.textContent = textarea.textContent.slice(0, cursorStart) + '\t' + textarea.textContent.slice(cursorEnd);
    textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  }

  if (e.target.closest('.Backspace')) {
    if (cursorStart === cursorEnd) {
      textarea.textContent = textarea.textContent.slice(0, cursorStart-1) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart-1, cursorStart-1);
    } else {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart, cursorStart);
    }

  }

  if (e.target.closest('.Delete')) {
    if (cursorStart === cursorEnd) {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd + 1);
      textarea.setSelectionRange(cursorStart, cursorStart);
    } else {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart, cursorStart);
    }
  }

  let key = e.target.closest('.key').querySelector(`.${currentLang} span:not(.hidden)`);
  if (key.textContent.length === 1) {

    textarea.textContent = textarea.textContent.slice(0, cursorStart) + key.textContent + textarea.textContent.slice(cursorEnd);
    textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  }
})

function addActiveState(currentKey) {
  currentKey.classList.add('active');
  window.addEventListener('mouseup', () => {
    currentKey.classList.remove('active');
  });

  textarea.addEventListener('keyup', () => {
    currentKey.classList.remove('active');
  });
}

textarea.addEventListener('keydown', (e) => {
  e.preventDefault();
  let cursorStart = textarea.selectionStart;
  let cursorEnd = textarea.selectionEnd;


  if (e.code === 'Enter') {
    textarea.textContent = textarea.textContent.slice(0, cursorStart) + '\n' + textarea.textContent.slice(cursorEnd);
    textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  }

  if (e.code === 'Tab') {
    console.log(textarea.textContent.slice(0, cursorStart), textarea.textContent.slice(cursorEnd))
    textarea.textContent = textarea.textContent.slice(0, cursorStart) + '\t' + textarea.textContent.slice(cursorEnd);
    textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  }

  if (e.code === 'Backspace') {
    if (cursorStart === cursorEnd) {
      textarea.textContent = textarea.textContent.slice(0, cursorStart-1) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart-1, cursorStart-1);
    } else {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart, cursorStart);
    }

  }

  if (e.code === 'Delete') {
    if (cursorStart === cursorEnd) {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd + 1);
      textarea.setSelectionRange(cursorStart, cursorStart);
    } else {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart, cursorStart);
    }
  }

  if (e.code === 'CapsLock') {
    if (!e.repeat) {
      capsLockHandle();
    }
  } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    if (!e.repeat) {
      shiftHandle(e.code);
    }
  } else {
    let currenKey = keyboard.querySelector(`.${e.code} .${currentLang} span:not(.hidden)`);
    if (currenKey.textContent.length === 1) {
      textarea.textContent = textarea.textContent.slice(0, cursorStart) + currenKey.textContent + textarea.textContent.slice(cursorEnd);
      textarea.setSelectionRange(cursorStart+1, cursorStart+1);
    }
    addActiveState(keyboard.querySelector(`.${e.code}`));
  }

  if (e.code === 'ControlLeft') {
    hotKeysPress['ControlLeft'] = true;
  }
  if (e.code === 'AltLeft') {
    hotKeysPress['AltLeft'] = true;
  }

  window.addEventListener('keyup', e => {
    if (e.code === 'ControlLeft') {
      hotKeysPress['ControlLeft'] = false;
    } else if (e.code === 'AltLeft') {
      hotKeysPress['AltLeft'] = false;
    }
  });

  if (hotKeysPress['ControlLeft'] && hotKeysPress['AltLeft']) {
    switchLang();
  }
})

function switchLang() {
  if (currentLang === 'eng') {
    keyboard.querySelectorAll('.eng').forEach(key => key.classList.add('hidden'));
    keyboard.querySelectorAll('.eng .caseDown').forEach(key => key.classList.add('hidden'));

    keyboard.querySelectorAll('.rus').forEach(key => key.classList.remove('hidden'));
    keyboard.querySelectorAll('.rus .caseDown').forEach(key => key.classList.remove('hidden'));
    currentLang = 'rus';
  } else {
    keyboard.querySelectorAll('.rus').forEach(key => key.classList.add('hidden'));
    keyboard.querySelectorAll('.rus .caseDown').forEach(key => key.classList.add('hidden'));

    keyboard.querySelectorAll('.eng').forEach(key => key.classList.remove('hidden'));
    keyboard.querySelectorAll('.eng .caseDown').forEach(key => key.classList.remove('hidden'));
    currentLang = 'eng';
  }

  localStorage.setItem('userLang', currentLang);
}

textarea.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    shiftHandle(e.code);
  }
});