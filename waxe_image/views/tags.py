import os
import transaction

from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import Category, Tag

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
                'id': t.tag_id,
                'categories': [{'name': t.name, 'id': t.category_id}
                               for t in t.categories]
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

    @view_config(route_name='tags_categories', request_method='POST')
    def categories(self):
        tag = self.request.matchdict['tag']
        lis = []
        tag_query = self.request.dbsession.query(Category)
        for t_dict in self.request.json_body['categories']:
            tag = tag_query.filter(Category.category_id == t_dict['id']).one()
            lis.append(tag)

        tag.categories = lis
        return [{'name': t.name, 'id': t.category_id} for t in lis]


def load_tag(info, request):
    match = info['match']
    tag_id = int(match.pop('tag_id'))
    query = request.dbsession.query(Tag)\
                             .filter_by(tag_id=tag_id)
    tag = query.one_or_none()
    if not tag:
        return False
    match['tag'] = tag
    return True


def includeme(config):
    config.add_route('tags', '/api/tags')
    config.add_route('tags_categories', '/api/tags/{tag_id:\d+}/categories',
                     custom_predicates=(load_tag,))
    config.scan(__name__)
