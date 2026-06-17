const API_BASE_URL = "http://127.0.0.1:3001/api";

export interface ApiPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface NewsCategoryOption {
  key: string;
  label: string;
  id?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  categoryName: string;
  categoryId?: number;
  summary: string;
  content: string[];
  cover?: string;
  listImage?: string;
  headImage?: string;
  author?: string;
  source?: string;
  department?: string;
  isTop?: boolean;
  viewCount?: number;
  linkUrl?: string;
  status?: string;
}

export interface ArticleListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  category?: string;
  status?: string;
  isTop?: boolean;
}

export interface ArticleListResult {
  list: NewsArticle[];
  pagination: ApiPagination;
}

interface RawCategory {
  id?: number;
  name?: string;
  slug?: string;
  parentId?: number | null;
  sort?: number;
  status?: string;
  children?: RawCategory[];
}

interface RawArticle {
  id?: number;
  title?: string;
  summary?: string | null;
  content?: string | null;
  categoryId?: number;
  author?: string | null;
  source?: string | null;
  department?: string | null;
  type?: string;
  status?: string;
  linkUrl?: string | null;
  coverImage?: string | null;
  listImage?: string | null;
  headImage?: string | null;
  isTop?: boolean;
  sort?: number;
  viewCount?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id?: number;
    name?: string;
    slug?: string;
  } | null;
}

function buildUrl(path: string, query: Record<string, any> = {}) {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function unwrapResponse(result: any) {
  if (
    result &&
    typeof result === "object" &&
    "code" in result &&
    "data" in result
  ) {
    if (result.code === 0) {
      return result.data;
    }

    throw new Error(result.message || "接口请求失败");
  }

  return result;
}

async function apiGet(path: string, query: Record<string, any> = {}) {
  const url = buildUrl(path, query);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return unwrapResponse(result);
}

function emptyPagination(page = 1, pageSize = 10): ApiPagination {
  return {
    page,
    pageSize,
    total: 0,
    totalPages: 0,
  };
}

function normalizePagination(
  data: any,
  page = 1,
  pageSize = 10,
  listLength = 0,
): ApiPagination {
  const pagination = data?.pagination || data?.pageInfo || data?.pager || {};

  const total = Number(
    pagination.total ?? data?.total ?? data?.count ?? listLength ?? 0,
  );

  const currentPage = Number(
    pagination.page ?? pagination.current ?? data?.page ?? page,
  );

  const currentPageSize = Number(
    pagination.pageSize ?? pagination.size ?? data?.pageSize ?? pageSize,
  );

  const totalPages = Number(
    pagination.totalPages ??
      pagination.pages ??
      Math.ceil(total / Math.max(currentPageSize, 1)),
  );

  return {
    page: currentPage,
    pageSize: currentPageSize,
    total,
    totalPages,
  };
}

function pickArticleList(data: any) {
  if (Array.isArray(data)) {
    return {
      rawList: data,
      pagination: normalizePagination({}, 1, data.length || 10, data.length),
    };
  }

  const rawList =
    data?.list ||
    data?.items ||
    data?.records ||
    data?.rows ||
    data?.data ||
    [];

  const safeList = Array.isArray(rawList) ? rawList : [];

  return {
    rawList: safeList,
    pagination: normalizePagination(
      data,
      data?.page || 1,
      data?.pageSize || 10,
      safeList.length,
    ),
  };
}

function formatArticleDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function splitContent(content?: string | null) {
  if (!content) {
    return [];
  }

  return String(content)
    .split(/\n{1,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveImageUrl(url?: string | null) {
  if (!url) {
    return "/images/feature-news.svg";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith("/images/")) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return `http://127.0.0.1:3001${url}`;
  }

  if (url.startsWith("/")) {
    return url;
  }

  return `/${url}`;
}

function normalizeArticle(article: RawArticle): NewsArticle {
  const categoryId = article.categoryId || article.category?.id;
  const categorySlug = article.category?.slug || String(categoryId || "");
  const categoryName = article.category?.name || "未分类";

  return {
    id: String(article.id || ""),
    title: article.title || "未命名文章",
    date: formatArticleDate(article.publishedAt || article.createdAt),
    category: categorySlug,
    categoryName,
    categoryId,
    summary: article.summary || "暂无摘要",
    content: splitContent(article.content),
    cover: resolveImageUrl(
      article.coverImage || article.listImage || article.headImage,
    ),
    listImage: resolveImageUrl(article.listImage || article.coverImage),
    headImage: resolveImageUrl(article.headImage || article.coverImage),
    author: article.author || undefined,
    source: article.source || undefined,
    department: article.department || undefined,
    isTop: Boolean(article.isTop),
    viewCount: Number(article.viewCount || 0),
    linkUrl: article.linkUrl || undefined,
    status: article.status,
  };
}

function normalizeCategory(category: RawCategory): NewsCategoryOption {
  return {
    id: category.id,
    key: category.slug || String(category.id || ""),
    label: category.name || "未命名栏目",
  };
}

function filterByCategory(list: NewsArticle[], category?: string) {
  if (!category || category === "all") {
    return list;
  }

  return list.filter((item) => {
    return (
      item.category === category ||
      String(item.categoryId) === category ||
      item.categoryName === category
    );
  });
}

function filterByKeyword(list: NewsArticle[], keyword?: string) {
  const text = String(keyword || "")
    .trim()
    .toLowerCase();

  if (!text) {
    return list;
  }

  return list.filter((item) => {
    return (
      item.title.toLowerCase().includes(text) ||
      item.summary.toLowerCase().includes(text) ||
      item.categoryName.toLowerCase().includes(text) ||
      item.content.join("").toLowerCase().includes(text)
    );
  });
}

function filterByTop(list: NewsArticle[], isTop?: boolean) {
  if (isTop === undefined) {
    return list;
  }

  return list.filter((item) => item.isTop === isTop);
}

export async function fetchCategories() {
  const data = await apiGet("/categories");
  const list = Array.isArray(data)
    ? data
    : data?.list || data?.items || data?.records || [];

  return list.map(normalizeCategory);
}

export async function fetchCategoryTree() {
  const data = await apiGet("/categories/tree");
  return Array.isArray(data) ? data : [];
}

export async function fetchCategoryMap() {
  const categories = await fetchCategories();
  const map = new Map<string, NewsCategoryOption>();

  categories.forEach((item) => {
    map.set(item.key, item);
    if (item.id !== undefined) {
      map.set(String(item.id), item);
    }
  });

  return {
    categories,
    map,
  };
}

export async function fetchArticles(
  query: ArticleListQuery = {},
): Promise<ArticleListResult> {
  const page = query.page || 1;
  const pageSize = query.pageSize || 10;

  const data = await apiGet("/articles", {
    page,
    pageSize,
    keyword: query.keyword,
    categoryId: query.categoryId,
    isTop: query.isTop,
  });

  const { rawList, pagination } = pickArticleList(data);

  let list = rawList.map(normalizeArticle);

  list = filterByCategory(list, query.category);
  list = filterByKeyword(list, query.keyword);
  list = filterByTop(list, query.isTop);

  return {
    list,
    pagination: {
      ...pagination,
      total: list.length || pagination.total,
      totalPages:
        list.length > 0
          ? Math.ceil(
              (list.length || pagination.total) /
                Math.max(pagination.pageSize, 1),
            )
          : pagination.totalPages,
    },
  };
}

export async function fetchArticlesByCategorySlug(
  slug: string,
  pageSize = 5,
  page = 1,
): Promise<ArticleListResult> {
  const { map } = await fetchCategoryMap();
  const category = map.get(slug);

  if (!category?.id) {
    return {
      list: [],
      pagination: emptyPagination(page, pageSize),
    };
  }

  return fetchArticles({
    page,
    pageSize,
    categoryId: category.id,
  });
}

export async function fetchArticleDetail(id: string | number) {
  const data = await apiGet(`/articles/${id}`);
  return normalizeArticle(data);
}

export async function fetchRelatedArticles(article: NewsArticle, pageSize = 4) {
  if (!article.categoryId) {
    return [];
  }

  const result = await fetchArticles({
    page: 1,
    pageSize: pageSize + 5,
    categoryId: article.categoryId,
  });

  return result.list
    .filter((item) => item.id !== article.id)
    .slice(0, pageSize);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
