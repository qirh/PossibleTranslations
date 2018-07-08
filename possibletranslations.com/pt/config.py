
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Development:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'words.sqlite')
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class Production:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'words.sqlite')
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
