export function formatRelativeDate(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const diff = Math.max(0, Date.now() - date.getTime());
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return value;
  }
}

function normalizeUsername(raw) {
  if (!raw) return null;
  const value = String(raw).trim();
  return value.startsWith("u/") ? value.slice(2) : value;
}

export { normalizeUsername };

export function normalisePost(post) {
  if (!post) return null;

  const community =
    post.space_username && String(post.space_username).trim()
      ? String(post.space_username).trim()
      : "general";

  const username = normalizeUsername(post.author_username ?? post.author);

  return {
    ...post,
    community,
    author: `u/${username ?? "unknown"}`,
    createdAt: formatRelativeDate(post.created_at ?? post.createdAt),
    score: post.score ?? 0,
    votes: post.score ?? 0,
    userVote: post.userVote ?? post._userVote ?? 0,
    _userVote: post._userVote ?? post.userVote ?? 0,
    description: post.content ?? "",
    comments: post.comments ?? post.comments_count ?? 0,
    tags: post.tags ?? [],
    saved: post.saved ?? false,
  };
}

export function normaliseComment(comment) {
  if (!comment) return null;

  const deleted = comment.deleted ?? false;
  const username = normalizeUsername(
    comment.author_username ?? comment.author ?? comment.authorUsername,
  );

  return {
    ...comment,
    parent_id: comment.parent_id ?? comment.parentId ?? 0,
    author: deleted ? "[deleted]" : username ? `u/${username}` : "u/??",
    author_username: deleted ? "[deleted]" : (username ?? undefined),
    body: deleted ? "[deleted]" : (comment.content ?? ""),
    content: deleted ? "[deleted]" : (comment.content ?? ""),
    votes: comment.score ?? 0,
    score: comment.score ?? 0,
    userVote: comment.userVote ?? comment._userVote ?? 0,
    _userVote: comment._userVote ?? comment.userVote ?? 0,
    createdAt: formatRelativeDate(comment.created_at ?? comment.createdAt),
    created_at: comment.created_at ?? comment.createdAt,
    edited: comment.edited ?? false,
    collapsed: comment.collapsed ?? false,
    deleted,
    children: (comment.children ?? []).map(normaliseComment).filter(Boolean),
  };
}

export function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];

  flatComments.map(normaliseComment).forEach((c) => {
    map[c.id] = c;
  });

  Object.values(map).forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}
