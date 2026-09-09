export const categoryLabels = {
  daily: 'Daily',
  work: 'Work',
  others: 'Others',
};

export function formatDate(date) {
  return date.replaceAll('-', '.');
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

export function renderMemoGrid(memoGrid, memoList) {
  const memoFragment = document.createDocumentFragment();

  memoList.forEach((memo) => {
    memoFragment.append(createMemoCard(memo));
  });

  memoGrid.replaceChildren(memoFragment);
}

export function renderTagFilterButton({ button, label, icon, category }) {
  const categoryLabel = categoryLabels[category];

  button.classList.toggle('tag-filter-button--selected', Boolean(categoryLabel));
  button.classList.remove(
    'tag-filter-button--daily',
    'tag-filter-button--work',
    'tag-filter-button--others',
  );
  icon.hidden = Boolean(categoryLabel);
  label.replaceChildren();

  if (!categoryLabel) {
    label.textContent = '태그 선택';
    return;
  }

  const tagFilterDot = document.createElement('span');
  tagFilterDot.className = 'tag-filter-dot';
  tagFilterDot.setAttribute('aria-hidden', 'true');
  button.classList.add(`tag-filter-button--${category}`);
  label.append(tagFilterDot, document.createTextNode(categoryLabel));
}
