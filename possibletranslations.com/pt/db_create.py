"""
from migrate.versioning import api
from config import Development
from __init__ import db
import os.path

db.create_all()
if not os.path.exists(Development.SQLALCHEMY_MIGRATE_REPO):
    api.create(Development.SQLALCHEMY_MIGRATE_REPO, 'database repository')
    api.version_control(Development.SQLALCHEMY_DATABASE_URI, Development.SQLALCHEMY_MIGRATE_REPO)
else:
    api.version_control(Development.SQLALCHEMY_DATABASE_URI, Development.SQLALCHEMY_MIGRATE_REPO, api.version(Development.SQLALCHEMY_MIGRATE_REPO))
"""