export const initialMemos = [
  {
    id: 'memo-1',
    title: '메모 상세 모달 구현',
    content:
      '카드를 클릭하면 상세 모달이 열리도록 연결했다. 수정과 삭제 버튼 동작은 다음 단계에서 붙이기로 했다.',
    category: 'work',
    date: '2026-09-03',
    isPinned: false,
  },
  {
    id: 'memo-2',
    title: '검색 및 태그 필터 추가',
    content:
      '제목과 본문 기준 검색을 적용했고, 태그 필터와 함께 사용해도 결과가 정상적으로 갱신된다.',
    category: 'work',
    date: '2026-09-04',
    isPinned: false,
  },
  {
    id: 'memo-3',
    title: '삭제 확인 모달 처리',
    content: '삭제 전 확인 모달을 추가했다. 삭제 완료 후에는 빈 목록 상태도 구분해서 보여준다.',
    category: 'daily',
    date: '2026-09-05',
    isPinned: false,
  },
  {
    id: 'memo-4',
    title: '메모 작성 화면 정리',
    content:
      '작성과 수정 화면의 UI 구조를 통일했다. 작성 취소 시 입력 내용을 잃는다는 안내를 띄운다.',
    category: 'work',
    date: '2026-09-06',
    isPinned: false,
  },
  {
    id: 'memo-5',
    title: '반응형 레이아웃 점검',
    content: '카드 크기는 유지하고 화면 너비에 따라 한 줄의 카드 개수만 줄어들도록 정리했다.',
    category: 'others',
    date: '2026-09-07',
    isPinned: false,
  },
  {
    id: 'memo-6',
    title: 'LocalStorage 저장 적용',
    content:
      '새로고침 후에도 메모 작성, 수정, 삭제, 고정 상태가 남도록 브라우저 저장소를 연결했다.',
    category: 'daily',
    date: '2026-09-08',
    isPinned: false,
  },
  {
    id: 'memo-7',
    title: 'CSS 파일 분리',
    content: '레이아웃, 카드, 모달, 반응형 스타일을 역할별 파일로 나눴다.',
    category: 'others',
    date: '2026-09-09',
    isPinned: false,
  },
];
