/** Giá trị `limit` list admin (topics và API tương tự). */
export const LIST_PAGE_SIZE_OPTIONS = [10, 25, 50] as const

export type ListPageSize = (typeof LIST_PAGE_SIZE_OPTIONS)[number]

export const DEFAULT_LIST_PAGE_SIZE: ListPageSize = 10
