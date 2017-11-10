

let baseHref = document.querySelector('base[href]').attributes['href'].value;
if (!baseHref.endsWith('/')) baseHref += '/';


export const API_URLS: any = {
  'groups': {
    'list': `${baseHref}api/groups`,
  },
  'files': {
    'file': {
      'get': `${baseHref}api/files/{file.id}`,
      'tag': `${baseHref}api/files/{file.id}/tags/{tag.id}`,
    },
    'list': `${baseHref}api/groups/{groupId}/files`,
  },
  'tags': {
    'list': `${baseHref}api/tags`,
    'tag': {
      'category': `${baseHref}api/tags/{tag.id}/categories/{category.id}`,
    },
  },
  'categories': {
    'list': `${baseHref}api/categories`,
    'category': {
      'tag': `${baseHref}api/categories/{category.id}/tags/{tag.id}`,
    },
  },
}
