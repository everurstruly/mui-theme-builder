# Security Policy

## Overview

This document outlines the security measures implemented in the MUI Theme Builder, particularly for the Canvas/Viewport simulation system.

## Threat Model & Mitigations

### XSS (Cross-Site Scripting)

**Status:** ✅ Protected

- Components render through React, which sanitizes JSX by default
- No use of `dangerouslySetInnerHTML` or string-based HTML rendering
- Component IDs are validated against a predefined registry before rendering
- User input is not directly executed as code

### Cookie/Session Theft

**Status:** ✅ Protected

- The viewport iframe is isolated by the browser's Same-Origin Policy
- Each iframe operates in its own security context
- Parent window cookies are not accessible to iframe content
- iframe can only receive data explicitly passed via postMessage

### postMessage Security

**Status:** ✅ Protected

- All postMessage communications validate sender origin
- Messages are restricted to `window.location.origin` (not wildcard `"*"`)
- Parent → iframe: Origin validation before sending
- iframe → parent: Origin validation before processing messages
- Message types are validated before handling

### Code Injection via Props

**Status:** ✅ Protected

- Component props are controlled by the application, not external input
- Registry components are part of the codebase, not dynamically loaded
- No eval() or Function() constructors used
- TypeScript provides compile-time type safety

### Malicious Component Registry

**Status:** ✅ Protected

- Registry is defined locally in the codebase (`src/Editor/Samples/registry.ts`)
- Components must be explicitly imported and registered
- No dynamic imports from untrusted sources
- Registry is not loaded from network or user input

## Security Assumptions

This implementation assumes:

1. **Trusted Component Code:** All components in the registry are written by trusted developers
2. **Trusted Theme Data:** Theme objects passed to the iframe are controlled by the application
3. **Single-Origin Deployment:** Application is deployed on a single origin (not served from multiple domains)
4. **No Sensitive Data in Props:** Component props don't contain secrets or PII
5. **Browser Security Features:** User's browser has standard security features enabled (CSP, SOP, etc.)

## Limitations & Known Issues

### Development Mode

- Error stack traces are displayed in development for debugging
- In production, consider sanitizing error output
- This is acceptable for a dev tool but consider security implications if exposed publicly

### iframe Sandboxing

- The iframe uses default sandboxing (same-origin)
- For additional hardening, consider using `sandbox` attribute with specific permissions
- Current implementation prioritizes functionality over maximum isolation

### Theme Object Serialization

- Theme objects are serialized via `JSON.stringify()`
- This prevents circular references and function injection
- However, deeply nested theme objects could theoretically be exploited
- Current implementation safely handles MUI theme structure

## Best Practices for Users

When extending this tool with new components:

1. **Never use `dangerouslySetInnerHTML`** with user input
2. **Validate all user inputs** before rendering
3. **Use React's built-in sanitization** for dynamic content
4. **Keep dependencies updated** to patch security vulnerabilities
5. **Avoid storing secrets** in component props or registry
6. **Use Content Security Policy** headers in production

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Contact the maintainers privately
3. Provide clear reproduction steps
4. Allow time for a fix before disclosure

## Security Checklist

- [x] Origin validation in postMessage (client → iframe)
- [x] Origin validation in message handlers (iframe ← client)
- [x] No HTML injection vectors
- [x] No eval() or dynamic code execution
- [x] Registry is predefined and typed
- [x] iframe is origin-isolated
- [x] Error boundary for runtime errors
- [x] No sensitive data in logs

## Future Improvements

Potential enhancements (not blocking):

- [ ] Implement iframe `sandbox` attribute for additional isolation
- [ ] Add CSP headers for production deployment
- [ ] Log security events for monitoring
- [ ] Implement component allowlist enforcement
- [ ] Add rate limiting for postMessage handling
- [ ] Sanitize error messages in production builds

## Dependencies

Security relies on:

- **React 18+:** Built-in XSS protection via JSX
- **MUI v5:** Sanitized theme objects
- **Browser APIs:** Same-Origin Policy, postMessage validation
- **TypeScript:** Type safety and compile-time validation

## Conclusion

The Canvas viewport system is designed with security as a priority. By using React's built-in protections, browser APIs correctly, and validating all inter-frame communication, the tool resists common web vulnerabilities.

This is a **developer tool** (not a public-facing app handling user data), which affects the threat model—but security best practices are still applied throughout.

---

**Last Updated:** October 24, 2025  
**Reviewed By:** Security-conscious architecture
