import os
import transaction

from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import Tag

ROOT_PATH = '/home/lereskp/temp/waxe/client1'


@view_defaults(renderer='json')
class TagView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='tags', request_method='GET')
    def get(self):
        query = self.request.dbsession.query(Tag)
        tags = query.all()
        lis = []
        for t in tags:
            lis.append({
                'name': t.name,
                'id': t.tag_id
            })
        return {
            'tags': lis,
        }

    @view_config(route_name='tags', request_method='POST')
    def post(self):
        t = Tag()
        t.name = self.request.json_body['name']
        self.request.dbsession.add(t)
        t = self.request.dbsession.query(Tag).filter_by(name=t.name).one()

        return {
            'name': t.name,
            'id': t.tag_id,
        }


def includeme(config):
    config.add_route('tags', '/api/tags')
    config.scan(__name__)
