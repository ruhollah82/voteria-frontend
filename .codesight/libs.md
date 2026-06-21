# Libraries

- `src\features\feed\hooks\useFeedComposer.js` — function useFeedComposer: (sortBy) => void
- `src\hooks\use-mobile.js` — function useIsMobile: () => void
- `src\lib\error.js` — function getErrorMessage: (err, fallback) => void
- `src\lib\normalise.js`
  - function formatRelativeDate: (value) => void
  - function normalisePost: (post) => void
  - function normaliseComment: (comment) => void
  - function buildCommentTree: (flatComments) => void
- `src\lib\utils.js` — function cn: (...inputs) => void
- `src\services\api.js`
  - function getStoredAccessToken: () => void
  - function storeAuthSession: ({...}, refreshToken, expiresAt, user, }) => void
  - function clearAuthSession: () => void
  - function getResponseData: (payload, fallback) => void
  - const authAPI
  - const spacesAPI
  - _...2 more_
