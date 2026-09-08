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
const memoDetailDialog = document.querySelector('#memo-detail-dialog');
const memoDetailTitle = document.querySelector('#memo-detail-title');
const memoDetailCategory = document.querySelector('#memo-detail-category');
const memoDetailDate = document.querySelector('#memo-detail-date');
const memoDetailBody = document.querySelector('#memo-detail-body');
const memoDetailCloseButton = document.querySelector('#memo-detail-close-button');
const memoDetailEditButton = document.querySelector('#memo-detail-edit-button');
const memoDetailDeleteButton = document.querySelector('#memo-detail-delete-button');
const memoDeleteDialog = document.querySelector('#memo-delete-dialog');
const memoDeleteCancelButton = document.querySelector('#memo-delete-cancel-button');
const memoDeleteConfirmButton = document.querySelector('#memo-delete-confirm-button');
const memoDeleteSuccessDialog = document.querySelector('#memo-delete-success-dialog');
const memoDeleteSuccessConfirmButton = document.querySelector('#memo-delete-success-confirm-button');
const memoEditorDialog = document.querySelector('#memo-editor-dialog');
const memoEditorForm = document.querySelector('#memo-editor-form');
const memoEditorCard = document.querySelector('.memo-editor-card');
const memoEditorTitle = document.querySelector('#memo-editor-title');
const memoEditorCategory = document.querySelector('#memo-editor-category');
const memoEditorCategoryLabel = document.querySelector('.memo-editor-category-label');
const memoEditorCategorySelector = document.querySelector('.memo-editor-category-selector');
const memoEditorCategoryMenu = document.querySelector('#memo-editor-category-menu');
const memoEditorDate = document.querySelector('#memo-editor-date');
const memoEditorContent = document.querySelector('#memo-editor-content');
const memoEditorBackButton = document.querySelector('#memo-editor-back-button');
const memoEditorCancelButton = document.querySelector('#memo-editor-cancel-button');
const memoEditorSubmitButton = document.querySelector('#memo-editor-submit-button');
const memos = initialMemos.map((memo) => ({ ...memo }));
let activeMemoId = null;
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
  memoCard.dataset.memoId = memo.id;
  memoCard.tabIndex = 0;
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

function openMemoDetail(memoId) {
  const targetMemo = memos.find((memo) => memo.id === memoId);

  if (!targetMemo) {
    return;
  }

  activeMemoId = memoId;
  memoDetailTitle.textContent = targetMemo.title;
  memoDetailCategory.textContent = categoryLabels[targetMemo.category];
  memoDetailCategory.className = `memo-detail-category memo-detail-category--${targetMemo.category}`;
  memoDetailDate.dateTime = targetMemo.date;
  memoDetailDate.textContent = formatDate(targetMemo.date);
  memoDetailBody.textContent = targetMemo.content;
  memoDetailDialog.className = `memo-detail-dialog memo-detail-dialog--${targetMemo.category}`;
  memoDetailDialog.showModal();
}

function updateMemoEditorSubmitState() {
  const isComplete = memoEditorTitle.value.trim().length > 0 && memoEditorContent.value.trim().length > 0;

  memoEditorSubmitButton.disabled = !isComplete;
}

function renderMemoEditorCategory(category) {
  memoEditorCard.className = `memo-editor-card memo-editor-card--${category}`;
  memoEditorCategory.className = `memo-editor-category memo-editor-category--${category}`;
  memoEditorCategory.dataset.category = category;
  memoEditorCategoryLabel.textContent = categoryLabels[category];
}

function closeMemoEditorCategoryMenu() {
  memoEditorCategoryMenu.hidden = true;
  memoEditorCategory.setAttribute('aria-expanded', 'false');
}

function openMemoEditor() {
  const targetMemo = memos.find((memo) => memo.id === activeMemoId);

  if (!targetMemo) {
    return;
  }

  memoEditorTitle.value = targetMemo.title;
  memoEditorDate.value = targetMemo.date;
  renderMemoEditorCategory(targetMemo.category);
  closeMemoEditorCategoryMenu();
  memoEditorContent.value = targetMemo.content;
  updateMemoEditorSubmitState();
  memoDetailDialog.close();
  memoEditorDialog.showModal();
  memoEditorTitle.focus();
}

function openMemoDeleteDialog() {
  if (!activeMemoId) {
    return;
  }

  memoDeleteDialog.showModal();
}

function closeMemoDeleteDialog() {
  memoDeleteDialog.close();
}

function deleteActiveMemo() {
  const targetIndex = memos.findIndex((memo) => memo.id === activeMemoId);

  if (targetIndex === -1) {
    closeMemoDeleteDialog();
    return;
  }

  memos.splice(targetIndex, 1);
  memoAnnouncement.textContent = '메모를 삭제했습니다.';
  renderMemos();
  closeMemoDeleteDialog();
  memoDetailDialog.close();
  activeMemoId = null;
  memoDeleteSuccessDialog.showModal();
}

function returnToMemoDetail() {
  closeMemoEditorCategoryMenu();
  memoEditorDialog.close();

  if (activeMemoId) {
    openMemoDetail(activeMemoId);
  }
}

function handleMemoEditorSubmit(event) {
  event.preventDefault();

  const title = memoEditorTitle.value.trim();
  const content = memoEditorContent.value.trim();
  if (!title || !content) {
    updateMemoEditorSubmitState();
    return;
  }

  const targetMemo = memos.find((memo) => memo.id === activeMemoId);

  if (!targetMemo) {
    return;
  }

  targetMemo.title = title;
  targetMemo.category = memoEditorCategory.dataset.category;
  targetMemo.date = memoEditorDate.value || targetMemo.date;
  targetMemo.content = content;
  memoAnnouncement.textContent = '메모를 수정했습니다.';
  renderMemos();
  returnToMemoDetail();
}

function handleMemoGridClick(event) {
  const pinButton = event.target.closest('.pin-button');

  if (pinButton) {
    toggleMemoPin(pinButton.dataset.memoId);
    return;
  }

  const memoCard = event.target.closest('.memo-card');

  if (memoCard) {
    openMemoDetail(memoCard.dataset.memoId);
  }
}

function handleMemoGridKeydown(event) {
  const memoCard = event.target.closest('.memo-card');

  if (event.target.closest('.pin-button') || !memoCard || !['Enter', ' '].includes(event.key)) {
    return;
  }

  event.preventDefault();
  openMemoDetail(memoCard.dataset.memoId);
}

function handleMemoDetailClick(event) {
  if (event.target === memoDetailDialog) {
    memoDetailDialog.close();
  }
}

function handleMemoEditorClick(event) {
  if (event.target === memoEditorDialog) {
    returnToMemoDetail();
  }
}

function handleMemoEditorCancel(event) {
  event.preventDefault();
  returnToMemoDetail();
}

function handleMemoEditorInput() {
  updateMemoEditorSubmitState();
}

function handleMemoEditorCategoryChange() {
  const isMenuOpen = !memoEditorCategoryMenu.hidden;
  memoEditorCategoryMenu.hidden = isMenuOpen;
  memoEditorCategory.setAttribute('aria-expanded', String(!isMenuOpen));
}

function handleMemoEditorCategoryMenuClick(event) {
  const categoryButton = event.target.closest('[data-editor-category]');

  if (!categoryButton) {
    return;
  }

  renderMemoEditorCategory(categoryButton.dataset.editorCategory);
  closeMemoEditorCategoryMenu();
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

  if (!memoEditorCategorySelector.contains(event.target)) {
    closeMemoEditorCategoryMenu();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeTagFilterMenu();
    closeMemoEditorCategoryMenu();
  }
}

pinnedMemoGrid.addEventListener('click', handleMemoGridClick);
unpinnedMemoGrid.addEventListener('click', handleMemoGridClick);
pinnedMemoGrid.addEventListener('keydown', handleMemoGridKeydown);
unpinnedMemoGrid.addEventListener('keydown', handleMemoGridKeydown);
searchInput.addEventListener('input', handleSearchInput);
searchForm.addEventListener('submit', handleSearchSubmit);
searchClearButton.addEventListener('click', handleSearchClear);
tagFilterButton.addEventListener('click', handleTagFilterButtonClick);
tagFilterMenu.addEventListener('click', handleTagFilterMenuClick);
document.addEventListener('click', handleDocumentClick);
document.addEventListener('keydown', handleDocumentKeydown);
memoDetailCloseButton.addEventListener('click', () => memoDetailDialog.close());
memoDetailEditButton.addEventListener('click', openMemoEditor);
memoDetailDeleteButton.addEventListener('click', openMemoDeleteDialog);
memoDetailDialog.addEventListener('click', handleMemoDetailClick);
memoDeleteCancelButton.addEventListener('click', closeMemoDeleteDialog);
memoDeleteConfirmButton.addEventListener('click', deleteActiveMemo);
memoDeleteSuccessConfirmButton.addEventListener('click', () => memoDeleteSuccessDialog.close());
memoEditorForm.addEventListener('submit', handleMemoEditorSubmit);
memoEditorBackButton.addEventListener('click', returnToMemoDetail);
memoEditorCancelButton.addEventListener('click', returnToMemoDetail);
memoEditorDialog.addEventListener('click', handleMemoEditorClick);
memoEditorDialog.addEventListener('cancel', handleMemoEditorCancel);
memoEditorTitle.addEventListener('input', handleMemoEditorInput);
memoEditorContent.addEventListener('input', handleMemoEditorInput);
memoEditorCategory.addEventListener('click', handleMemoEditorCategoryChange);
memoEditorCategoryMenu.addEventListener('click', handleMemoEditorCategoryMenuClick);
updateFilterState();
