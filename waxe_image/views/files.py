from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import File, Tag


@view_defaults(renderer='json')
class FileView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='files', request_method='GET')
    def get(self):
        query = self.request.dbsession.query(File)
        files = query.all()
        lis = []
        for f in files:
            lis.append({
                'id': f.file_id,
                'path': f.path,
                'webpath': f.webpath,
                'tags': [{'name': t.name, 'id': t.tag_id} for t in f.tags],
            })
        return {
            'files': lis
        }

    # @view_config(route_name='files_tags', request_method='OPTIONS')
    # def tags_options(self):
    #     return True

    @view_config(route_name='files_tags', request_method='POST')
    def tags(self):
        query = self.request.dbsession.query(File)
        f = query.filter(File.file_id == self.request.matchdict['file_id']).one()
        lis = []
        tag_query = self.request.dbsession.query(Tag)
        for t_dict in self.request.json_body['tags']:
            tag = tag_query.filter(Tag.tag_id == t_dict['id']).one()
            lis.append(tag)

        f.tags = lis
        return [{'name': t.name, 'id': t.tag_id} for t in lis]


def includeme(config):
    config.add_route('files', '/api/files')
    config.add_route('files_tags', '/api/files/{file_id}/tags')
    config.scan(__name__)
