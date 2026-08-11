const keys = Object.keys(process.env).sort();
const ignored = new Set(['PATH', 'HOME', 'HOSTNAME', 'NODE_ENV', 'PORT', 'PWD', 'SHLVL', 'TERM']);
const relevant = keys.filter((k) => !k.startsWith('npm_') && !ignored.has(k));
console.log('[diag] total de env vars:', keys.length);
console.log('[diag] nomes relevantes:', relevant.join(', ') || '(nenhuma)');
