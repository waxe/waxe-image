def errors_to_angular(errors):
    """Make the errors understandable by angular
    """
    dic = {}
    for key, msg in errors.iteritems():
        if msg == 'Required':
            dic.setdefault(key, {})['required'] = True
        else:
            raise NotImplementedError('Unsupport error %s: %s' % (key, msg))

    return dic
