import pyramid.httpexceptions as exc
from pyramid.view import view_config, view_defaults

from ..models import Group
from .predicates import load_tag, load_file, load_group


@view_defaults(renderer='json')
class GroupView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='groups', request_method='GET')
    def get(self):
        query = self.request.dbsession.query(Group)
        groups = query.all()
        lis = []
        for g in groups:
            lis.append({
                'id': g.group_id,
                'name': g.name
            })
        return {
            'groups': lis
        }


@view_defaults(renderer='json')
class FileView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='files', request_method='GET')
    def get(self):
        group = self.request.matchdict['group']
        lis = []
        for f in group.files:
            lis.append({
                'id': f.file_id,
                'rel_path': f.rel_path,
                'thumbnail_path': f.thumbnail_path,
                'web_path': f.web_path,
                'tags': [{'name': t.name, 'id': t.tag_id} for t in f.tags],
            })
        return {
            'files': lis
        }

    @view_config(route_name='file_tag', request_method='PUT')
    def tag(self):
        f = self.request.matchdict['file']
        t = self.request.matchdict['tag']
        if t in f.tags:
            self.request.response.status = 409
        else:
            f.tags.append(t)
        return {'tag': {'name': t.name, 'id': t.tag_id}}

    @view_config(route_name='file_tag', request_method='DELETE')
    def remove_tag(self):
        f = self.request.matchdict['file']
        t = self.request.matchdict['tag']
        if t not in f.tags:
            raise exc.HTTPNotFound()
        f.tags.remove(t)
        return exc.HTTPNoContent()


def includeme(config):
    config.add_route('files', '/api/groups/{group_id:\d+}/files',
                     custom_predicates=(load_group,))
    config.add_route('file_tag', '/api/files/{file_id:\d+}/tags/{tag_id:\d+}',
                     custom_predicates=(load_file, load_tag))
    config.add_route('groups', '/api/groups')
    config.scan(__name__)
