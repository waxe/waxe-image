from pyramid.view import view_config, view_defaults
import pyramid.httpexceptions as exc

from ..models import Tag
from .predicates import load_category, load_tag


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
        name = self.request.json_body['name']
        t = self.request.dbsession.query(Tag)\
                .filter_by(name=name).one_or_none()
        if t:
            self.request.response.status = 400
            return {
                'errors': {
                    # existName is the same key as angular validator
                    'name': {'existName': {'value': name}}
                }
            }

        t = Tag()
        t.name = name
        self.request.dbsession.add(t)
        t = self.request.dbsession.query(Tag).filter_by(name=t.name).one()

        return {
            'name': t.name,
            'id': t.tag_id,
        }

    @view_config(route_name='tag_category', request_method='PUT')
    def category(self):
        t = self.request.matchdict['tag']
        c = self.request.matchdict['category']
        if c in t.categories:
            self.request.response.status = 409
        else:
            t.categories.append(c)
        return {'category': {'name': c.name, 'id': c.category_id}}

    @view_config(route_name='tag_category', request_method='DELETE')
    def remove_category(self):
        t = self.request.matchdict['tag']
        c = self.request.matchdict['category']
        if c not in t.categories:
            raise exc.HTTPNotFound()
        t.categories.remove(c)
        return exc.HTTPNoContent()


def includeme(config):
    config.add_route('tags', '/api/tags')
    config.add_route('tag_category',
                     '/api/tags/{tag_id:\d+}/categories/{category_id:\d+}',
                     custom_predicates=(load_tag, load_category))
    config.scan(__name__)
