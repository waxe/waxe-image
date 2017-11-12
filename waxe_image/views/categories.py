from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import Category
from .predicates import load_category, load_tag


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
        name = self.request.json_body['name']
        c = self.request.dbsession.query(Category)\
                .filter_by(name=name).one_or_none()
        if c:
            self.request.response.status = 400
            return {
                'errors': {
                    # existName is the same key as angular validator
                    'name': {'existName': {'value': name}}
                }
            }

        c = Category()
        c.name = name
        self.request.dbsession.add(c)
        c = self.request.dbsession.query(Category).filter_by(name=c.name).one()

        return {
            'name': c.name,
            'id': c.category_id,
        }

    @view_config(route_name='category_tag', request_method='PUT')
    def tag(self):
        c = self.request.matchdict['category']
        t = self.request.matchdict['tag']
        if t in c.tags:
            self.request.response.status = 409
        else:
            c.tags.append(t)
        return {'tag': {'name': t.name, 'id': t.tag_id}}

    @view_config(route_name='category_tag', request_method='DELETE')
    def remove_tag(self):
        c = self.request.matchdict['category']
        t = self.request.matchdict['tag']
        if t not in c.tags:
            raise exc.HTTPNotFound()
        c.tags.remove(t)
        return exc.HTTPNoContent()


def includeme(config):
    config.add_route('categories', '/api/categories')
    config.add_route('category_tag',
                     '/api/categories/{category_id:\d+}/tags/{tag_id:\d+}',
                     custom_predicates=(load_category, load_tag))
    config.scan(__name__)
