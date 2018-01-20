FROM node:7
ENV APPLICATION_HOME /srv/app

# ------------------------
# SSH Server support
# ------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd
COPY ./bin/sshd_config /etc/ssh/
EXPOSE 2222 80

# ------------------------
# Application Installation
# ------------------------
RUN mkdir -p ${APPLICATION_HOME}
WORKDIR ${APPLICATION_HOME}
ADD . ${APPLICATION_HOME}
RUN npm install -g yarn cross-env codecov istanbul rimraf pm2 webpack
RUN yarn
RUN yarn test
RUN yarn build
EXPOSE 8000 8000

COPY ./bin/run.sh /bin/
RUN chmod 755 /bin/run.sh
CMD ["/bin/run.sh"]
