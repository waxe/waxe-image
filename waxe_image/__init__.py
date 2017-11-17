import datetime

from pyramid.config import Configurator
from pyramid.renderers import JSON

__version__ = '0.0 .1-alpha-1'


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    json_renderer = JSON()

    def datetime_adapter(obj, request):
        return obj.isoformat()
    json_renderer.add_adapter(datetime.datetime, datetime_adapter)
    config.add_renderer('json', json_renderer)
    config.include('.models')
    config.include('.views.files')
    config.include('.views.tags')
    config.include('.views.categories')
    config.scan()
    return config.make_wsgi_app()
