/**
 * 기존 항목(storedItems) 중에서,
 * 1. 서버에서 받아온 문서 목록(fetchedDocuments)에 포함되는 문서에 속하지 않고,
 * 2. 서버에서 받아온 항목들(fetchedItems)의 문서에도 포함되지 않는 항목만 남깁니다.
 *
 * 즉, 삭제된 문서나 덮어쓸 문서에 속한 기존 항목들을 모두 제거합니다.
 *
 * 새로 받아온 항목(fetchedItems)은 이 결과에 push(...)하여 병합하면 됩니다.
 */
export function filterRemainingItems<T>(
  storedItems: T[],
  fetchedItems: T[],
  fetchedDocuments: { id: string }[],
  getDocId: (item: T) => string
): T[] {
  const fetchedDocumentIds = new Set(fetchedDocuments.map(doc => doc.id));
  const fetchedProductDocIds = new Set(fetchedItems.map(item => getDocId(item)));

  return storedItems.filter(item =>
    fetchedDocumentIds.has(getDocId(item)) &&        // 삭제되지 않은 문서에 속해 있고
    !fetchedProductDocIds.has(getDocId(item))        // 새로 받아온 문서에 포함되지 않은 항목만 유지
  );
}
