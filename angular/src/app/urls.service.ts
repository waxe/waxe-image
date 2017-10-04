

let baseHref = document.querySelector('base[href]').attributes['href'].value;
if (!baseHref.endsWith('/')) baseHref += '/';


export const API_URLS: any = {
  'files': {
    'file': {
      'get': `${baseHref}api/files/{file.id}`,
      'tags': `${baseHref}api/files/{file.id}/tags`,
    },
    'list': `${baseHref}api/files`,
  },
  'tags': {
    'list': `${baseHref}api/tags`,
  },
  'categories': {
    'list': `${baseHref}api/categories`,
    'category': {
      'tags': `${baseHref}api/categories/{category.id}/tags`,
    },
  },
}
