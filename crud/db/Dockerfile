FROM mcr.microsoft.com/mssql/server:2022-latest


ENV MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD}
ENV ACCEPT_EULA=${ACCEPT_EULA}

ENV DB_NAME=${DB_NAME}

COPY ./setup.sql .
COPY ./entrypoint.sh .

EXPOSE 1433

USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext

CMD /bin/bash ./entrypoint.sh
