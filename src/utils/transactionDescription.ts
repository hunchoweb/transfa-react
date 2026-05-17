const USER_REFERENCE_PATTERN = /\b(to|from)\s+(@?[a-z0-9_.-]+(?:\s+@?[a-z0-9_.-]+)?)/gi;

export const formatTransactionDescription = (
  description?: string | null,
  fallback = 'No description'
) => {
  const normalized = description?.trim();
  if (!normalized) {
    return fallback;
  }

  return normalized.replace(USER_REFERENCE_PATTERN, (_match, direction: string, user: string) => {
    return `${direction} ${user.toUpperCase()}`;
  });
};
