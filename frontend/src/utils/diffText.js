/**
 * Word-level diff between two strings.
 * Returns segments: { type: 'equal' | 'add' | 'remove', value: string }
 */
const tokenize = (text) => {
  if (!text) return [];
  return text.match(/\S+|\s+/g) || [];
};

const buildLcsTable = (a, b) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
};

const coalesceSegments = (parts) => {
  const merged = [];

  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (last && last.type === part.type) {
      last.value += part.value;
    } else {
      merged.push({ type: part.type, value: part.value });
    }
  }

  return merged;
};

const diffTokens = (oldTokens, newTokens) => {
  const dp = buildLcsTable(oldTokens, newTokens);
  const segments = [];
  let i = oldTokens.length;
  let j = newTokens.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      segments.push({ type: 'equal', value: oldTokens[i - 1] });
      i -= 1;
      j -= 1;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      segments.push({ type: 'add', value: newTokens[j - 1] });
      j -= 1;
    } else {
      segments.push({ type: 'remove', value: oldTokens[i - 1] });
      i -= 1;
    }
  }

  return coalesceSegments(segments.reverse());
};

export const diffText = (oldText = '', newText = '') => {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);

  if (oldTokens.length === 0 && newTokens.length === 0) return [];
  if (oldTokens.join('') === newTokens.join('')) {
    return [{ type: 'equal', value: newText || oldText }];
  }

  return diffTokens(oldTokens, newTokens);
};

export const hasDiffChanges = (segments) =>
  segments.some((s) => s.type === 'add' || s.type === 'remove');
