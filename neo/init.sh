#!/bin/bash
echo "  - \"http://$YAO_DOMAIN:5099\"" >> ./neo/neo.yml  
yao migrate && yao run scripts.setup.Data && /usr/local/bin/yao start