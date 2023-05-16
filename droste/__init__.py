import importlib.resources


def get_resource_path(*descendants):
    return importlib.resources.files("droste").joinpath(*descendants)


def get_resource_str(*descendants):
    return str(get_resource_path(*descendants))
