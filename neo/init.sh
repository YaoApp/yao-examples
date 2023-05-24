#!/bin/bash
echo "  - \"$YAO_HOST\"" >> ./neo/neo.yml  
yao migrate && yao run scripts.setup.Data && /usr/local/bin/yao start