import { initialMemos } from './data.js';

const memoStorageKey = 'vanilla-memo-memos';
const validCategories = ['daily', 'work', 'others'];

function createInitialMemos() {
  return initialMemos.map((memo) => ({ ...memo }));
}

function isStoredMemo(memo) {
  return (
    memo &&
    typeof memo.id === 'string' &&
    typeof memo.title === 'string' &&
    typeof memo.content === 'string' &&
    validCategories.includes(memo.category) &&
    typeof memo.date === 'string' &&
    typeof memo.isPinned === 'boolean'
  );
}

export function loadMemos() {
  try {
    const storedMemos = localStorage.getItem(memoStorageKey);

    if (!storedMemos) {
      return createInitialMemos();
    }

    const parsedMemos = JSON.parse(storedMemos);

    // 브라우저 저장값이 손상되어도 화면이 멈추지 않도록 초기 데이터로 복구한다.
    return Array.isArray(parsedMemos) && parsedMemos.every(isStoredMemo)
      ? parsedMemos
      : createInitialMemos();
  } catch {
    return createInitialMemos();
  }
}

export function saveMemos(memos) {
  try {
    localStorage.setItem(memoStorageKey, JSON.stringify(memos));
  } catch {
    // 브라우저 저장소를 사용할 수 없어도 현재 화면은 계속 사용할 수 있다.
  }
}
