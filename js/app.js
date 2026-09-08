import { initialMemos } from './data.js';

const memoGrid = document.querySelector('.memo-grid');
const memoAnnouncement = document.querySelector('#memo-announcement');
const memos = initialMemos.map((memo) => ({ ...memo }));

const categoryLabels = {
  daily: 'Daily',
  work: 'Work',
  others: 'Others',
};

function formatDate(date) {
  return date.replaceAll('-', '.');
}

function getSortedMemos() {
  const pinnedMemos = memos.filter((memo) => memo.isPinned);
  const unpinnedMemos = memos.filter((memo) => !memo.isPinned);

  return [...pinnedMemos, ...unpinnedMemos];
}

function createMemoCard(memo) {
  const listItem = document.createElement('li');
  const memoCard = document.createElement('article');
  const memoHeader = document.createElement('header');
  const memoTitle = document.createElement('h3');
  const pinButton = document.createElement('button');
  const memoContent = document.createElement('p');
  const memoFooter = document.createElement('footer');
  const memoCategory = document.createElement('span');
  const memoDate = document.createElement('time');

  memoCard.className = `memo-card memo-card--${memo.category}`;
  memoHeader.className = 'memo-card-header';
  memoTitle.className = 'memo-title';
  pinButton.className = 'pin-button';
  memoContent.className = 'memo-content';
  memoFooter.className = 'memo-card-footer';
  memoCategory.className = 'memo-category';
  memoDate.className = 'memo-date';

  memoTitle.textContent = memo.title;
  memoContent.textContent = memo.content;
  memoCategory.textContent = categoryLabels[memo.category];
  memoDate.dateTime = memo.date;
  memoDate.textContent = formatDate(memo.date);

  pinButton.type = 'button';
  pinButton.dataset.memoId = memo.id;
  pinButton.setAttribute('aria-pressed', String(memo.isPinned));
  pinButton.setAttribute('aria-label', memo.isPinned ? '메모 고정 해제' : '메모 고정');

  memoHeader.append(memoTitle, pinButton);
  memoFooter.append(memoCategory, memoDate);
  memoCard.append(memoHeader, memoContent, memoFooter);
  listItem.append(memoCard);

  return listItem;
}

function renderMemos() {
  const memoFragment = document.createDocumentFragment();

  getSortedMemos().forEach((memo) => {
    memoFragment.append(createMemoCard(memo));
  });

  memoGrid.replaceChildren(memoFragment);
}

function toggleMemoPin(memoId) {
  const targetMemo = memos.find((memo) => memo.id === memoId);

  if (!targetMemo) {
    return;
  }

  targetMemo.isPinned = !targetMemo.isPinned;
  memoAnnouncement.textContent = targetMemo.isPinned
    ? '메모를 고정했습니다.'
    : '메모 고정을 해제했습니다.';
  renderMemos();
}

function handleMemoGridClick(event) {
  const pinButton = event.target.closest('.pin-button');

  if (!pinButton) {
    return;
  }

  toggleMemoPin(pinButton.dataset.memoId);
}

memoGrid.addEventListener('click', handleMemoGridClick);
renderMemos();
