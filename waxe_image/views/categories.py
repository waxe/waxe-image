import os
import transaction

from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import Category, Tag


@view_defaults(renderer='json')
class CategoryView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='categories', request_method='GET')
    def get(self):
        query = self.request.dbsession.query(Category)
        categories = query.all()
        lis = []
        for c in categories:
            lis.append({
                'name': c.name,
                'id': c.category_id,
                'tags': [{'name': t.name, 'id': t.tag_id} for t in c.tags],
            })
        return {
            'categories': lis,
        }

    @view_config(route_name='categories', request_method='POST')
    def post(self):
        c = Category()
        c.name = self.request.json_body['name']
        self.request.dbsession.add(c)
        c = self.request.dbsession.query(Category).filter_by(name=c.name).one()

        return {
            'name': c.name,
            'id': c.category_id,
        }

    @view_config(route_name='categories_tags', request_method='POST')
    def tags(self):
        c = self.request.matchdict['category']
        lis = []
        tag_query = self.request.dbsession.query(Tag)
        for t_dict in self.request.json_body['tags']:
            tag = tag_query.filter(Tag.tag_id == t_dict['id']).one()
            lis.append(tag)

        c.tags = lis
        return [{'name': t.name, 'id': t.tag_id} for t in lis]


def load_category(info, request):
    match = info['match']
    category_id = int(match.pop('category_id'))
    query = request.dbsession.query(Category)\
                             .filter_by(category_id=category_id)
    category = query.one_or_none()
    if not category:
        return False
    match['category'] = category
    return True


def includeme(config):
    config.add_route('categories', '/api/categories')
    config.add_route('categories_tags',
                     '/api/categories/{category_id:\d+}/tags',
                     custom_predicates=(load_category,))
    config.scan(__name__)
