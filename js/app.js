import { initialMemos } from './data.js';

const [pinnedMemoGrid, unpinnedMemoGrid] = document.querySelectorAll('.memo-grid');
const memoAnnouncement = document.querySelector('#memo-announcement');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#memo-search');
const searchClearButton = document.querySelector('#search-clear-button');
const tagFilter = document.querySelector('.tag-filter');
const tagFilterButton = document.querySelector('#tag-filter-button');
const tagFilterLabel = document.querySelector('.tag-filter-label');
const tagFilterIcon = document.querySelector('.tag-filter-icon');
const tagFilterMenu = document.querySelector('#tag-filter-menu');
const searchEmptyState = document.querySelector('#search-empty-state');
const memoApp = document.querySelector('.memo-app');
const memos = initialMemos.map((memo) => ({ ...memo }));
const filterState = {
  keyword: '',
  category: '',
};

const categoryLabels = {
  daily: 'Daily',
  work: 'Work',
  others: 'Others',
};

function formatDate(date) {
  return date.replaceAll('-', '.');
}

function getVisibleMemos() {
  const keyword = filterState.keyword.trim().toLowerCase();

  return memos.filter((memo) => {
    const matchesCategory = !filterState.category || memo.category === filterState.category;
    const searchableText = `${memo.title} ${memo.content}`.toLowerCase();
    const matchesKeyword = !keyword || searchableText.includes(keyword);

    return matchesCategory && matchesKeyword;
  });
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

function renderMemoGrid(memoGrid, memoList) {
  const memoFragment = document.createDocumentFragment();

  memoList.forEach((memo) => {
    memoFragment.append(createMemoCard(memo));
  });

  memoGrid.replaceChildren(memoFragment);
}

function renderMemos() {
  const visibleMemos = getVisibleMemos();
  const pinnedMemos = visibleMemos.filter((memo) => memo.isPinned);
  const unpinnedMemos = visibleMemos.filter((memo) => !memo.isPinned);

  renderMemoGrid(pinnedMemoGrid, pinnedMemos);
  renderMemoGrid(unpinnedMemoGrid, unpinnedMemos);
  pinnedMemoGrid.hidden = pinnedMemos.length === 0;
  unpinnedMemoGrid.hidden = unpinnedMemos.length === 0;
  searchEmptyState.hidden = visibleMemos.length !== 0;
  memoApp.classList.toggle('memo-app--search-empty', visibleMemos.length === 0);
}

function renderTagFilterButton() {
  const categoryLabel = categoryLabels[filterState.category];

  tagFilterButton.classList.toggle('tag-filter-button--selected', Boolean(categoryLabel));
  tagFilterButton.classList.remove(
    'tag-filter-button--daily',
    'tag-filter-button--work',
    'tag-filter-button--others',
  );
  tagFilterIcon.hidden = Boolean(categoryLabel);
  tagFilterLabel.replaceChildren();

  if (!categoryLabel) {
    tagFilterLabel.textContent = '태그 선택';
    return;
  }

  const tagFilterDot = document.createElement('span');
  tagFilterDot.className = 'tag-filter-dot';
  tagFilterDot.setAttribute('aria-hidden', 'true');
  tagFilterButton.classList.add(`tag-filter-button--${filterState.category}`);
  tagFilterLabel.append(tagFilterDot, document.createTextNode(categoryLabel));
}

function closeTagFilterMenu() {
  tagFilterMenu.hidden = true;
  tagFilterButton.setAttribute('aria-expanded', 'false');
}

function updateSearchClearButton() {
  searchClearButton.hidden = filterState.keyword.length === 0;
}

function updateFilterState() {
  renderMemos();
  renderTagFilterButton();
  updateSearchClearButton();
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

function handleSearchInput() {
  filterState.keyword = searchInput.value;
  updateFilterState();
}

function handleSearchSubmit(event) {
  event.preventDefault();
  filterState.keyword = searchInput.value;
  updateFilterState();
}

function handleSearchClear() {
  searchInput.value = '';
  filterState.keyword = '';
  updateFilterState();
  searchInput.focus();
}

function handleTagFilterButtonClick() {
  const isMenuOpen = !tagFilterMenu.hidden;
  tagFilterMenu.hidden = isMenuOpen;
  tagFilterButton.setAttribute('aria-expanded', String(!isMenuOpen));
}

function handleTagFilterMenuClick(event) {
  const categoryButton = event.target.closest('[data-category]');

  if (!categoryButton) {
    return;
  }

  filterState.category = categoryButton.dataset.category;
  closeTagFilterMenu();
  updateFilterState();
}

function handleDocumentClick(event) {
  if (!tagFilter.contains(event.target)) {
    closeTagFilterMenu();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeTagFilterMenu();
  }
}

pinnedMemoGrid.addEventListener('click', handleMemoGridClick);
unpinnedMemoGrid.addEventListener('click', handleMemoGridClick);
searchInput.addEventListener('input', handleSearchInput);
searchForm.addEventListener('submit', handleSearchSubmit);
searchClearButton.addEventListener('click', handleSearchClear);
tagFilterButton.addEventListener('click', handleTagFilterButtonClick);
tagFilterMenu.addEventListener('click', handleTagFilterMenuClick);
document.addEventListener('click', handleDocumentClick);
document.addEventListener('keydown', handleDocumentKeydown);
updateFilterState();
