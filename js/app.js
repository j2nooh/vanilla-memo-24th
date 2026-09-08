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
const memoEmptyState = document.querySelector('#memo-empty-state');
const memoCreateButton = document.querySelector('#memo-create-button');
const memoEmptyCreateButton = document.querySelector('#memo-empty-create-button');
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
const memoCreateSuccessDialog = document.querySelector('#memo-create-success-dialog');
const memoCreateSuccessConfirmButton = document.querySelector('#memo-create-success-confirm-button');
const memoCreateExitDialog = document.querySelector('#memo-create-exit-dialog');
const memoCreateExitTitle = document.querySelector('#memo-create-exit-title');
const memoCreateExitConfirmButton = document.querySelector('#memo-create-exit-confirm-button');
const memoCreateExitCancelButton = document.querySelector('#memo-create-exit-cancel-button');
const memoEditorDialog = document.querySelector('#memo-editor-dialog');
const memoEditorForm = document.querySelector('#memo-editor-form');
const memoEditorCard = document.querySelector('.memo-editor-card');
const memoEditorTitle = document.querySelector('#memo-editor-title');
const memoEditorCategory = document.querySelector('#memo-editor-category');
const memoEditorCategoryLabel = document.querySelector('.memo-editor-category-label');
const memoEditorCategoryDot = document.querySelector('.memo-editor-category-dot');
const memoEditorCategoryArrow = document.querySelector('.memo-editor-category-arrow');
const memoEditorCategorySelector = document.querySelector('.memo-editor-category-selector');
const memoEditorCategoryMenu = document.querySelector('#memo-editor-category-menu');
const memoEditorDate = document.querySelector('#memo-editor-date');
const memoEditorContent = document.querySelector('#memo-editor-content');
const memoEditorBackButton = document.querySelector('#memo-editor-back-button');
const memoEditorCancelButton = document.querySelector('#memo-editor-cancel-button');
const memoEditorSubmitButton = document.querySelector('#memo-editor-submit-button');
const memos = initialMemos.map((memo) => ({ ...memo }));
let activeMemoId = null;
let editorMode = null;
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
  const hasNoMemos = memos.length === 0;
  const hasNoSearchResults = !hasNoMemos && visibleMemos.length === 0;

  renderMemoGrid(pinnedMemoGrid, pinnedMemos);
  renderMemoGrid(unpinnedMemoGrid, unpinnedMemos);
  pinnedMemoGrid.hidden = pinnedMemos.length === 0;
  unpinnedMemoGrid.hidden = unpinnedMemos.length === 0;
  memoEmptyState.hidden = !hasNoMemos;
  searchEmptyState.hidden = !hasNoSearchResults;
  memoApp.classList.toggle('memo-app--search-empty', hasNoSearchResults);
  memoApp.classList.toggle('memo-app--memo-empty', hasNoMemos);
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
  const isComplete = memoEditorTitle.value.trim().length > 0
    && memoEditorContent.value.trim().length > 0
    && (editorMode !== 'create' || Boolean(memoEditorCategory.dataset.category));

  memoEditorSubmitButton.disabled = !isComplete;
}

function renderMemoEditorCategory(category) {
  if (!category) {
    memoEditorCard.className = 'memo-editor-card memo-editor-card--empty';
    memoEditorCategory.className = 'memo-editor-category memo-editor-category--empty';
    delete memoEditorCategory.dataset.category;
    memoEditorCategoryLabel.textContent = '태그 선택';
    memoEditorCategoryDot.hidden = true;
    memoEditorCategoryArrow.hidden = false;
    return;
  }

  memoEditorCard.className = `memo-editor-card memo-editor-card--${category}`;
  memoEditorCategory.className = `memo-editor-category memo-editor-category--${category}`;
  memoEditorCategory.dataset.category = category;
  memoEditorCategoryLabel.textContent = categoryLabels[category];
  memoEditorCategoryDot.hidden = false;
  memoEditorCategoryArrow.hidden = true;
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

  editorMode = 'edit';
  memoEditorDialog.setAttribute('aria-label', '메모 수정');
  memoEditorCancelButton.textContent = '작성 취소';
  memoEditorSubmitButton.textContent = '수정 완료';
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

function openMemoCreate() {
  editorMode = 'create';
  activeMemoId = null;
  memoEditorDialog.setAttribute('aria-label', '메모 작성');
  memoEditorCancelButton.textContent = '작성 취소';
  memoEditorSubmitButton.textContent = '작성 완료';
  memoEditorTitle.value = '';
  memoEditorDate.value = new Date().toISOString().slice(0, 10);
  memoEditorContent.value = '';
  renderMemoEditorCategory();
  closeMemoEditorCategoryMenu();
  updateMemoEditorSubmitState();
  memoEditorDialog.showModal();
  memoEditorTitle.focus();
}

function openMemoDeleteDialog() {
  if (!activeMemoId) {
    return;
  }

  memoDetailDialog.classList.add('memo-detail-dialog--delete-confirmation');
  memoDeleteDialog.showModal();
}

function closeMemoDeleteDialog() {
  memoDeleteDialog.close();
  memoDetailDialog.classList.remove('memo-detail-dialog--delete-confirmation');
}

function restoreMemoDetailBackdrop() {
  memoDetailDialog.classList.remove('memo-detail-dialog--delete-confirmation');
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
  editorMode = null;

  if (activeMemoId) {
    openMemoDetail(activeMemoId);
  }
}

function closeMemoEditorToMain() {
  closeMemoEditorCategoryMenu();
  memoEditorDialog.close();
  activeMemoId = null;
  editorMode = null;
}

function openMemoCreateExitDialog(action) {
  memoCreateExitTitle.textContent = action === 'back'
    ? '이전으로 돌아가시겠습니까?'
    : '메모 작성을 그만 두시겠습니까?';
  memoCreateExitConfirmButton.textContent = action === 'back' ? '돌아가기' : '작성 취소하기';
  memoCreateExitDialog.showModal();
}

function requestMemoEditorExit(action) {
  if (editorMode === 'create') {
    openMemoCreateExitDialog(action);
    return;
  }

  returnToMemoDetail();
}

function handleMemoEditorSubmit(event) {
  event.preventDefault();

  const title = memoEditorTitle.value.trim();
  const content = memoEditorContent.value.trim();
  const category = memoEditorCategory.dataset.category;
  if (!title || !content || (editorMode === 'create' && !category)) {
    updateMemoEditorSubmitState();
    return;
  }

  if (editorMode === 'create') {
    memos.unshift({
      id: `memo-${Date.now()}`,
      title,
      content,
      category,
      date: memoEditorDate.value,
      isPinned: false,
    });
    filterState.keyword = '';
    filterState.category = '';
    searchInput.value = '';
    memoAnnouncement.textContent = '메모를 작성했습니다.';
    updateFilterState();
    memoCreateSuccessDialog.showModal();
    return;
  }

  const targetMemo = memos.find((memo) => memo.id === activeMemoId);

  if (!targetMemo) {
    return;
  }

  targetMemo.title = title;
  targetMemo.category = category;
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
    requestMemoEditorExit('back');
  }
}

function handleMemoEditorCancel(event) {
  event.preventDefault();
  requestMemoEditorExit('back');
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
  updateMemoEditorSubmitState();
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
memoDeleteDialog.addEventListener('close', restoreMemoDetailBackdrop);
memoDeleteSuccessConfirmButton.addEventListener('click', () => memoDeleteSuccessDialog.close());
memoCreateButton.addEventListener('click', openMemoCreate);
memoEmptyCreateButton.addEventListener('click', openMemoCreate);
memoCreateSuccessConfirmButton.addEventListener('click', () => {
  memoCreateSuccessDialog.close();
  closeMemoEditorToMain();
});
memoCreateExitCancelButton.addEventListener('click', () => {
  memoCreateExitDialog.close();
});
memoCreateExitConfirmButton.addEventListener('click', () => {
  memoCreateExitDialog.close();
  closeMemoEditorToMain();
});
memoEditorForm.addEventListener('submit', handleMemoEditorSubmit);
memoEditorBackButton.addEventListener('click', () => requestMemoEditorExit('back'));
memoEditorCancelButton.addEventListener('click', () => requestMemoEditorExit('cancel'));
memoEditorDialog.addEventListener('click', handleMemoEditorClick);
memoEditorDialog.addEventListener('cancel', handleMemoEditorCancel);
memoEditorTitle.addEventListener('input', handleMemoEditorInput);
memoEditorContent.addEventListener('input', handleMemoEditorInput);
memoEditorCategory.addEventListener('click', handleMemoEditorCategoryChange);
memoEditorCategoryMenu.addEventListener('click', handleMemoEditorCategoryMenuClick);
updateFilterState();
