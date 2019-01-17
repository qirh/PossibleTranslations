#!/usr/bin/python
import sys
import os
import logging

PROJECT_DIR = "/var/www/pt/backend"

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0 , PROJECT_DIR)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/var/www/pt/backend/pt/static/json/GoogleService.json"

activate_this = os.path.join(PROJECT_DIR, 'env', 'bin', 'activate_this.py')
exec(open(activate_this, "rb").read(), dict(__file__=activate_this))
sys.path.append(PROJECT_DIR)

from pt import app as application
