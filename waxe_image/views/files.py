from pyramid.view import view_config, view_defaults

from ..models import File, Group, Tag


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
                'path': f.path,
                'webpath': f.webpath,
                'tags': [{'name': t.name, 'id': t.tag_id} for t in f.tags],
            })
        return {
            'files': lis
        }

    @view_config(route_name='files_tags', request_method='POST')
    def tags(self):
        f = self.request.matchdict['file']
        lis = []
        tag_query = self.request.dbsession.query(Tag)
        for t_dict in self.request.json_body['tags']:
            tag = tag_query.filter(Tag.tag_id == t_dict['id']).one()
            lis.append(tag)

        f.tags = lis
        return [{'name': t.name, 'id': t.tag_id} for t in lis]


def load_group(info, request):
    match = info['match']
    group_id = int(match.pop('group_id'))
    query = request.dbsession.query(Group)\
                             .filter_by(group_id=group_id)
    group = query.one_or_none()
    if not group:
        return False
    match['group'] = group
    return True


def load_file(info, request):
    match = info['match']
    file_id = int(match.pop('file_id'))
    query = request.dbsession.query(File)\
                             .filter_by(file_id=file_id)
    file_obj = query.one_or_none()
    if not file_obj:
        return False
    match['file'] = file_obj
    return True


def includeme(config):
    config.add_route('files', '/api/groups/{group_id:\d+}/files',
                     custom_predicates=(load_group,))
    config.add_route('files_tags', '/api/files/{file_id:\d+}/tags',
                     custom_predicates=(load_file,))
    config.add_route('groups', '/api/groups')
    config.scan(__name__)
