import os.path
import urlparse
import colander
import pyramid.httpexceptions as exc
from pyramid.view import view_config, view_defaults

from ..models import Group
from .predicates import load_tag, load_file, load_group

from .validation import errors_to_angular


def normpath(path):
    url = urlparse.urlparse(path)
    url._replace(path=os.path.normpath(url.path))
    print url.geturl()
    return url.geturl()


class GroupSchema(colander.MappingSchema):
    name = colander.SchemaNode(colander.String())
    abs_path = colander.SchemaNode(colander.String(),
                                   preparer=normpath)
    web_path = colander.SchemaNode(colander.String(),
                                   preparer=normpath)
    thumbnail_path = colander.SchemaNode(colander.String(),
                                         preparer=normpath)


@view_defaults(renderer='json')
class GroupView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='groups', request_method='GET')
    def get(self):
        query = self.request.dbsession.query(Group)
        groups = query.order_by(Group.group_id).all()
        lis = []
        for g in groups:
            lis.append({
                'id': g.group_id,
                'name': g.name,
                'abs_path': g.abs_path,
                'web_path': g.web_path,
                'thumbnail_path': g.thumbnail_path,
            })
        return {
            'groups': lis
        }

    @view_config(route_name='groups', request_method='POST')
    def post(self):
        try:
            data = GroupSchema().deserialize(self.request.json_body)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        name = data['name']
        c = self.request.dbsession.query(Group)\
                .filter_by(name=name).one_or_none()
        if c:
            self.request.response.status = 400
            return {
                'errors': {
                    # existName is the same key as angular validator
                    'name': {'existName': {'value': name}}
                }
            }

        g = Group()
        for k, v in data.items():
            setattr(g, k, v)

        self.request.dbsession.add(g)
        return {
            'id': g.group_id,
            'name': g.name,
            'abs_path': g.abs_path,
            'web_path': g.web_path,
            'thumbnail_path': g.thumbnail_path,
        }

    @view_config(route_name='group', request_method='PUT')
    def put(self):
        group = self.request.matchdict['group']
        try:
            data = GroupSchema().deserialize(self.request.json_body)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        for k, v in data.items():
            setattr(group, k, v)
        return exc.HTTPNoContent()


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
                'creation_date': f.creation_date,
                'creation_author': f.creation_author,
                'modification_date': f.modification_date,
                'modification_author': f.modification_author,
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
    config.add_route('group', '/api/groups/{group_id:\d+}',
                     custom_predicates=(load_group,))
    config.scan(__name__)
