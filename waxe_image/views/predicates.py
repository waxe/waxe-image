from ..models import Category, File, Group, Tag


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
