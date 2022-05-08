import { codes, dataEng, dataRus } from './keysData.js';

let capsLockIsActive = false;
let shiftIsActive = false;

let cursorStart;
let cursorEnd;
let part1;
let part2;

let hotKeysPress = {
  ControlLeft: false,
  AltLeft: false
};

let currentLang = localStorage.getItem('userLang') || localStorage.setItem('userLang', 'eng') && 'eng';

const keyNode = createKeyNode();

function createKeyNode() {
  let createElem = (tag, className, hidden = true) => {
    let elem = document.createElement(tag);
    elem.classList.add(className);
    hidden && elem.classList.add('hidden');
    return elem;
  }
  let keyNode = createElem('div', 'key', false);
  keyNode.append(createElem('span', 'rus'));
  keyNode.append(createElem('span', 'eng', false));
  let caseUpElem = createElem('span', 'caseUp');
  let capsElem = createElem('span', 'caps');
  let shiftCapsElem = createElem('span', 'shiftCaps');
  keyNode.firstChild.append(createElem('span', 'caseDown'), caseUpElem, capsElem, shiftCapsElem);
  keyNode.lastChild.append(
    createElem('span', 'caseDown', false),
    caseUpElem.cloneNode(),
    capsElem.cloneNode(),
    shiftCapsElem.cloneNode()
  );
  return keyNode;
}

class Key {
  constructor(code, lang, keysEng, keysRus) {
    this.code = code;
    this.lang = lang;
    this.keysEng = keysEng;
    this.keysRus = keysRus;
  }

  getInitialNode(keyNode) {
    keyNode.classList.add(`${this.code}`);
    for (let i = 0; i < keyNode.firstChild.children.length; i++) {
      keyNode.firstChild.children[i].textContent = this.keysRus[i];
    }
    for (let i = 0; i < keyNode.lastChild.children.length; i++) {
      keyNode.lastChild.children[i].textContent = this.keysEng[i];
    }
    this.node = keyNode;
    if (this.lang === 'rus') {
      this.switchLang('rus');
    }
    return this.node;
  }

  switchLang(lang) {
    if (lang === 'rus') {
      this.node.lastChild.classList.add('hidden');
      this.node.lastChild.querySelector('.caseDown').classList.add('hidden');

      this.node.firstChild.classList.remove('hidden');
      this.node.firstChild.querySelector('.caseDown').classList.remove('hidden');
      this.lang = 'rus';
    } else {
      this.node.firstChild.classList.add('hidden');
      this.node.firstChild.querySelector('.caseDown').classList.add('hidden');

      this.node.lastChild.classList.remove('hidden');
      this.node.lastChild.querySelector('.caseDown').classList.remove('hidden');
      this.lang = 'eng';
    }
  }
}

document.querySelector('body').append(createInitialHtml());

function createInitialHtml() {
  let wrapper = document.createElement('dive');
  wrapper.className = 'wrapper';

  let title = document.createElement('p');
  title.className = 'title';
  title.textContent = 'Виртуальная клавиатура';

  let textarea = document.createElement('textarea');
  textarea.className = 'textarea';
  textarea.setAttribute('autofocus', 'true');
  textarea.setAttribute('spellcheck', 'false');
  textarea.cols = 50;
  textarea.rows = 5;
  textarea.addEventListener("blur", () => textarea.focus());

  let keyboardNode = document.createElement('div');
  keyboardNode.className = 'keyboard';
  let row = document.createElement('div');
  row.className = 'row';
  for (let i = 0; i < 5; i++) {
    keyboardNode.append(row.cloneNode());
  }

  for (let i = 0; i < codes.length; i++) {
    for (let j = 0; j < codes[i].length; j++) {
      let key = new Key(
        codes[i][j],
        currentLang,
        dataEng[codes[i][j]],
        dataRus[codes[i][j]]
      ).getInitialNode(keyNode.cloneNode(true));
      keyboardNode.children[i].append(key);
    }
  }

  let description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Клавиатура создана в операционной системе Windows';

  let language = document.createElement('p');
  language.className = 'language';
  language.textContent = 'Для переключения языка комбинация: левыe ctrl + alt';

  wrapper.append(title, textarea, keyboardNode, description, language);

  return wrapper;
}

const keyboard = document.querySelector('.keyboard');
const textarea = document.querySelector('.textarea');

function updateCursorPosition() {
  cursorStart = textarea.selectionStart;
  cursorEnd = textarea.selectionEnd;
  part1 = textarea.textContent.slice(0, cursorStart);
  part2 = textarea.textContent.slice(cursorEnd);
}

function capsLockHandle() {
  keyboard.querySelectorAll(`.key .${currentLang}`).forEach(key => {
    let caseDown = key.querySelector('.caseDown');
    let caps = key.querySelector('.caps');
    let caseUp = key.querySelector('.caseUp');
    let shiftCaps = key.querySelector('.shiftCaps');

    if (!capsLockIsActive && !shiftIsActive) {
      caseDown.classList.add('hidden');
      caps.classList.remove('hidden');
    } else if (capsLockIsActive && !shiftIsActive) {
      caseDown.classList.remove('hidden');
      caps.classList.add('hidden');
    } else if (!capsLockIsActive && shiftIsActive) {
      caseUp.classList.add('hidden');
      shiftCaps.classList.remove('hidden');
    } else if (capsLockIsActive && shiftIsActive) {
      caseUp.classList.remove('hidden');
      shiftCaps.classList.add('hidden');
    }
  });
  let capsLock = keyboard.querySelector('.CapsLock');
  capsLockIsActive ? capsLock.classList.remove('active') : capsLock.classList.add('active');
  capsLockIsActive = !capsLockIsActive;
}

const handleLayoutSwitch = () => {
  keyboard.querySelectorAll(`.key .${currentLang}`).forEach(key => {
    let caseDown = key.querySelector('.caseDown');
    let caps = key.querySelector('.caps');
    let caseUp = key.querySelector('.caseUp');
    let shiftCaps = key.querySelector('.shiftCaps');

    if (!capsLockIsActive && !shiftIsActive) {
      caseDown.classList.add('hidden');
      caseUp.classList.remove('hidden');
    } else if (!capsLockIsActive && shiftIsActive) {
      caseDown.classList.remove('hidden');
      caseUp.classList.add('hidden');
    } else if (capsLockIsActive && !shiftIsActive) {
      caps.classList.add('hidden');
      shiftCaps.classList.remove('hidden');
    } else if (capsLockIsActive && shiftIsActive) {
      caps.classList.remove('hidden');
      shiftCaps.classList.add('hidden');
    }
  });

  shiftIsActive = !shiftIsActive;
}

function shiftHandle(e) {
  if (e.type === 'mousedown') {
    let shift = e.target.closest('.key');
    let otherShift = keyboard.querySelector(`.${shift.classList.contains('ShiftLeft') ? 'ShiftRight' : 'ShiftLeft'}`);

    if (shift.classList.contains('active')) {
      shift.classList.remove('active');
      if (otherShift.classList.contains('active')) return;
    } else {
      shift.classList.add('active');
      if (otherShift.classList.contains('active')) return;
    }
    handleLayoutSwitch();

  } else if (!e.repeat) {
    handleLayoutSwitch(e.code);
    addActiveState(keyboard.querySelector(`.${e.code}`));
  }
}

function enterHandle() {
  textarea.textContent = part1 + '\n' + part2;
  textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  addActiveState(keyboard.querySelector('.Enter'));
}

function tabHandle() {
  textarea.textContent = part1 + '\t' + part2;
  textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  addActiveState(keyboard.querySelector('.Tab'));
}

function backspaceHandle() {
  if (cursorStart === cursorEnd) {
    textarea.textContent = part1.slice(0, -1) + part2;
    textarea.setSelectionRange(cursorStart-1, cursorStart-1);
  } else {
    textarea.textContent = part1 + part2;
    textarea.setSelectionRange(cursorStart, cursorStart);
  }
  addActiveState(keyboard.querySelector('.Backspace'));
}

function deleteHandle()  {
  if (cursorStart === cursorEnd) {
    textarea.textContent = part1 + part2.slice(1);
    textarea.setSelectionRange(cursorStart, cursorStart);
  } else {
    textarea.textContent = part1 + part2;
    textarea.setSelectionRange(cursorStart, cursorStart);
  }
  addActiveState(keyboard.querySelector('.Delete'));
}

function charHandle(key) {
  textarea.textContent = part1 + key.querySelector(`.${currentLang} span:not(.hidden)`).textContent + part2;
  textarea.setSelectionRange(cursorStart+1, cursorStart+1);
  addActiveState(key);
}

function hotKeyHandle(e) {
  hotKeysPress[e.code] = true;
  addActiveState(keyboard.querySelector(`.${e.code}`));
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ControlLeft' || e.code === 'AltLeft') {
      hotKeysPress[e.code] = false;
    }
  });
  if (hotKeysPress.ControlLeft && hotKeysPress.AltLeft) {
    switchLang(currentLang);
  }
}
const funcKeysMap = {
  CapsLock: (e) => !e.repeat && capsLockHandle(),
  ShiftLeft: (e) => shiftHandle(e),
  ShiftRight: (e) => shiftHandle(e),
  Enter: () => enterHandle(),
  Tab: () => tabHandle(),
  Backspace: () => backspaceHandle(),
  Delete: () => deleteHandle(),
  ControlRight: () => addActiveState(keyboard.querySelector('.ControlRight')),
  AltRight: () => addActiveState(keyboard.querySelector('.AltRight')),
  ControlLeft: () => addActiveState(keyboard.querySelector('.ControlLeft')),
  AltLeft: () => addActiveState(keyboard.querySelector('.AltLeft')),
  MetaLeft: () => addActiveState(keyboard.querySelector('.MetaLeft')),
}

keyboard.addEventListener('mousedown', (e) => {
  let clickedKey = e.target.closest('.key');
  if (!clickedKey) return;

  updateCursorPosition();

  if (funcKeysMap[clickedKey.classList[1]]) {
    funcKeysMap[clickedKey.classList[1]](e);
  } else {
    charHandle(clickedKey);
  }
});

function addActiveState(clickedKey) {
  clickedKey.classList.add('active');
  window.addEventListener('mouseup', () => clickedKey.classList.remove('active'));
  textarea.addEventListener('keyup', (e) => {
    if (e.code === clickedKey.classList[1]) {
      clickedKey.classList.remove('active');
    }
  });
}

textarea.addEventListener('keydown', (e) => {
  e.preventDefault();

  updateCursorPosition();

  if (e.code === 'ControlLeft' || e.code === 'AltLeft') {
    hotKeyHandle(e);
  } else if (funcKeysMap[e.code]) {
    funcKeysMap[e.code](e);
  } else {
    charHandle(keyboard.querySelector(`.${e.code}`));
  }
});

function switchLang(lang) {
  let nodes = keyboard.querySelectorAll(`.${lang}`);

  let visibleClass = nodes[0].querySelector('span:not(.hidden)').className;
  nodes.forEach(node => {
    node.classList.add('hidden');
    node.querySelector(`.${visibleClass}`).classList.add('hidden')
  });

  currentLang = lang === 'eng' ? 'rus' : 'eng';

  let visibleNodes = keyboard.querySelectorAll(`.${currentLang}`);

  visibleNodes.forEach(node => {
    node.classList.remove('hidden');
    node.querySelector(`.${visibleClass}`).classList.remove('hidden')
  });

  localStorage.setItem('userLang', currentLang);
}

textarea.addEventListener('keyup', (e) => {
  e.preventDefault();
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    shiftHandle(e);
  }
});