#!/bin/bash

init_db() {
  echo "Attempting to start init script..."
  /opt/mssql-tools/bin/sqlcmd -S localhost -l 60 -U SA -P ${MSSQL_SA_PASSWORD} -i init.sql
}

cycle() {
  for i in {1..30}; do init_db && break || sleep 5; done
}

# Run init-script with long timeout - and make it run in the background
envsubst < setup.sql > init.sql &&
cycle &
# Start SQL server
/opt/mssql/bin/sqlservr
