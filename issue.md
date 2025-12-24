A searchParam property was accessed directly with `searchParams.category`. `searchParams` is a Promise and must be unwrapped with `React.use()` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis


`legacyBehavior` is deprecated and will be removed in a future release. A codemod is available to upgrade your components:

npx @next/codemod@latest new-link .

In HTML, <a> cannot be a descendant of <a>.
This will cause a hydration error.

<a> cannot contain a nested <a>.
See this log for the ancestor stack trace.

which I might have fixed?

Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:> 29 | <Box minH="100vh"
