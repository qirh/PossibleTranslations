#!/usr/bin/python
import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0 , "/var/www/pt/frontend")

from sala import app as application
application.secret_key = "bL4jhC2rmk67lZmaqmkG8OozJztNbABPZ3zeaVUy2twdSTOsFe6UTKgytF0H5Z5YRAJlaIFw8YdYFg8g"
