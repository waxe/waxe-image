from pyramid.config import Configurator


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.include('.views.files')
    config.include('.views.tags')
    config.include('.views.categories')
    config.scan()
    return config.make_wsgi_app()
